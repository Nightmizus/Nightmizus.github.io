/** 雷的四种复数类型：0=+1, 1=−1, 2=+i, 3=−i */
export type MineType = 0 | 1 | 2 | 3;

/** 旗帜：0=无, 1=+1, 2=−1, 3=+i, 4=−i */
export type FlagType = 0 | 1 | 2 | 3 | 4;

export const MINE_VALUES: ReadonlyArray<{ re: number; im: number }> = [
  { re: 1, im: 0 },
  { re: -1, im: 0 },
  { re: 0, im: 1 },
  { re: 0, im: -1 },
];

/** 旗型对应的复数值（0 为无旗） */
export const FLAG_VALUES: ReadonlyArray<{ re: number; im: number } | null> = [
  null,
  MINE_VALUES[0],
  MINE_VALUES[1],
  MINE_VALUES[2],
  MINE_VALUES[3],
];

export const FLAG_LABELS = ["", "+1", "−1", "+i", "−i"] as const;

/** 格子显示值：模长 |z| = k√n（n 无平方因子；k=0 表示抵消为 0），以及周围是否有雷 */
export type CellValue = { k: number; n: number; hasMineAround: boolean };

export type Cell = {
  mine: boolean;
  mineType: MineType | null;
  revealed: boolean;
  flag: FlagType;
  value: CellValue;
};

export type MineCounts = [number, number, number, number];

export type Difficulty = {
  id: string;
  label: string;
  width: number;
  height: number;
  mines: MineCounts;
};

export const DIFFICULTIES: Difficulty[] = [
  { id: "easy", label: "初级", width: 9, height: 9, mines: [5, 5, 5, 5] },
  { id: "medium", label: "中级", width: 16, height: 16, mines: [15, 15, 15, 15] },
  { id: "hard", label: "高级", width: 30, height: 16, mines: [30, 30, 30, 30] },
];

const OFFSETS8: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export function neighbors(index: number, width: number, height: number): number[] {
  const x = index % width;
  const y = Math.floor(index / width);
  const result: number[] = [];
  for (const [dx, dy] of OFFSETS8) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) result.push(ny * width + nx);
  }
  return result;
}

export function emptyBoard(size: number): Cell[] {
  return Array.from({ length: size }, (): Cell => ({
    mine: false,
    mineType: null,
    revealed: false,
    flag: 0,
    value: { k: 0, n: 0, hasMineAround: false },
  }));
}

/** 化简 N = k²·n（n 无平方因子）；N≤0 → k=0, n=0 */
export function simplify(N: number): { k: number; n: number } {
  if (N <= 0) return { k: 0, n: 0 };
  for (let i = Math.floor(Math.sqrt(N)); i >= 2; i -= 1) {
    if (N % (i * i) === 0) return { k: i, n: N / (i * i) };
  }
  return { k: 1, n: N };
}

/** 显示值的模长平方 N = k²·n */
export function displayN(value: CellValue): number {
  return value.k * value.k * value.n;
}

/** 显示文本：周围无雷→空白；抵消为 0→"0"；整数→"k"；k=1→"√n"；否则 "k√n" */
export function valueText(value: CellValue): string {
  if (!value.hasMineAround) return "";
  if (value.k === 0) return "0";
  if (value.n === 1) return String(value.k);
  if (value.k === 1) return `√${value.n}`;
  return `${value.k}√${value.n}`;
}

/** 计算每格的显示值：周围雷的复数和 z = a+bi，模长平方 N=a²+b² 化简为 k√n */
export function computeValues(cells: Cell[], width: number, height: number): Cell[] {
  return cells.map((cell, index) => {
    if (cell.mine) return cell;
    let re = 0;
    let im = 0;
    let hasMineAround = false;
    for (const n of neighbors(index, width, height)) {
      const nb = cells[n];
      if (!nb.mine || nb.mineType === null) continue;
      hasMineAround = true;
      re += MINE_VALUES[nb.mineType].re;
      im += MINE_VALUES[nb.mineType].im;
    }
    const { k, n: sq } = simplify(re * re + im * im);
    return { ...cell, value: { k, n: sq, hasMineAround } };
  });
}


/**
 * 布雷：首点 (safeIndex) 的 3×3 邻域保护（保证首点空白且能连片展开）；
 * 雷型按四种雷剩余数量轮盘随机分配。
 */
export function generateBoard(
  width: number,
  height: number,
  mineCounts: MineCounts,
  safeIndex: number,
  rng: () => number = Math.random,
): Cell[] {
  const total = width * height;
  const remaining: MineCounts = [...mineCounts];
  const totalMines = remaining[0] + remaining[1] + remaining[2] + remaining[3];
  const cells = emptyBoard(total);
  const protect = new Set<number>([safeIndex, ...neighbors(safeIndex, width, height)]);

  let placed = 0;
  let guard = 0;
  while (placed < totalMines && guard < 1000000) {
    guard += 1;
    const r = Math.floor(rng() * total);
    if (protect.has(r) || cells[r].mine) continue;
    const roll = Math.floor(rng() * (totalMines - placed));
    let type = -1;
    let acc = 0;
    for (let t = 0; t < 4; t += 1) {
      acc += remaining[t];
      if (roll < acc) {
        type = t;
        break;
      }
    }
    if (type < 0) type = 0;
    cells[r] = { ...cells[r], mine: true, mineType: type as MineType };
    remaining[type as MineType] -= 1;
    placed += 1;
  }
  return computeValues(cells, width, height);
}

/**
 * 翻开格子。周围无雷（hasMineAround=false）时向八邻域连片展开；
 * 踩雷时只翻开踩中的那颗雷并返回 exploded 索引。
 */
export function revealCells(
  cells: Cell[],
  start: number,
  width: number,
  height: number,
): { next: Cell[]; exploded: number | null } {
  const startCell = cells[start];
  if (startCell.revealed || startCell.flag !== 0) return { next: cells, exploded: null };
  if (startCell.mine) {
    const next = cells.map((cell, i) => (i === start ? { ...cell, revealed: true } : cell));
    return { next, exploded: start };
  }
  const next = cells.slice();
  const stack: number[] = [start];
  while (stack.length > 0) {
    const index = stack.pop();
    if (index === undefined) break;
    const cell = next[index];
    if (cell.revealed || cell.flag !== 0) continue;
    next[index] = { ...cell, revealed: true };
    if (!cell.value.hasMineAround) {
      for (const n of neighbors(index, width, height)) {
        if (!next[n].revealed && next[n].flag === 0) stack.push(n);
      }
    }
  }
  return { next, exploded: null };
}

/** 和弦判据：周围 8 格旗帜的复数和的模长平方 == 该格显示的 N（k²·n） */
export function matchCriterion(cells: Cell[], start: number, width: number, height: number): boolean {
  const cell = cells[start];
  if (!cell.revealed || cell.mine) return false;
  let sr = 0;
  let si = 0;
  for (const n of neighbors(start, width, height)) {
    const value = FLAG_VALUES[cells[n].flag];
    if (value === null || value === undefined) continue;
    sr += value.re;
    si += value.im;
  }
  return sr * sr + si * si === displayN(cell.value);
}

/** 判据满足时翻开周围所有未插旗的格子（含连片展开） */
export function chordCells(
  cells: Cell[],
  start: number,
  width: number,
  height: number,
): { next: Cell[]; exploded: number | null } {
  if (!matchCriterion(cells, start, width, height)) return { next: cells, exploded: null };
  let next = cells;
  let exploded: number | null = null;
  for (const n of neighbors(start, width, height)) {
    if (next[n].revealed || next[n].flag !== 0) continue;
    const result = revealCells(next, n, width, height);
    next = result.next;
    if (result.exploded !== null) {
      exploded = result.exploded;
      break;
    }
  }
  return { next, exploded };
}
