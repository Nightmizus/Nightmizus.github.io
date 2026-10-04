export type Clue = { re: number; im: number };

export type CellMark = 0 | 1 | 2;

export type Cell = {
  mine: boolean;
  revealed: boolean;
  mark: CellMark;
  clue: Clue;
};

export type Difficulty = {
  id: string;
  label: string;
  width: number;
  height: number;
  mines: number;
};

export const DIFFICULTIES: Difficulty[] = [
  { id: "easy", label: "初级", width: 9, height: 9, mines: 10 },
  { id: "medium", label: "中级", width: 16, height: 16, mines: 40 },
  { id: "hard", label: "高级", width: 30, height: 16, mines: 99 },
];

type Offset = readonly [number, number];

/** 正交四邻：上、下、左、右 —— 计入复数线索的实部 */
export const ORTHO_OFFSETS: readonly Offset[] = [[0, -1], [0, 1], [-1, 0], [1, 0]];

/** 斜角四邻 —— 计入复数线索的虚部 */
export const DIAG_OFFSETS: readonly Offset[] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

export const ALL_OFFSETS: readonly Offset[] = [...ORTHO_OFFSETS, ...DIAG_OFFSETS];

export function neighbors(
  index: number,
  width: number,
  height: number,
  offsets: readonly Offset[] = ALL_OFFSETS,
): number[] {
  const x = index % width;
  const y = Math.floor(index / width);
  const result: number[] = [];
  for (const [dx, dy] of offsets) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      result.push(ny * width + nx);
    }
  }
  return result;
}

export function emptyBoard(size: number): Cell[] {
  return Array.from({ length: size }, (): Cell => ({
    mine: false,
    revealed: false,
    mark: 0,
    clue: { re: 0, im: 0 },
  }));
}

export function computeClues(cells: Cell[], width: number, height: number): Cell[] {
  return cells.map((cell, index) => {
    if (cell.mine) return cell;
    const re = neighbors(index, width, height, ORTHO_OFFSETS)
      .reduce((sum, n) => sum + (cells[n].mine ? 1 : 0), 0);
    const im = neighbors(index, width, height, DIAG_OFFSETS)
      .reduce((sum, n) => sum + (cells[n].mine ? 1 : 0), 0);
    return { ...cell, clue: { re, im } };
  });
}

/**
 * 生成棋盘。首点保护：safeIndex 及其八邻域内不会布雷
 * （棋盘放不下时退化为仅保护 safeIndex）。
 */
export function generateBoard(
  width: number,
  height: number,
  mines: number,
  safeIndex: number,
  rng: () => number = Math.random,
): Cell[] {
  const total = width * height;
  const excluded = new Set<number>([safeIndex, ...neighbors(safeIndex, width, height, ALL_OFFSETS)]);
  let pool: number[] = [];
  for (let i = 0; i < total; i += 1) {
    if (!excluded.has(i)) pool.push(i);
  }
  if (pool.length < mines) {
    pool = [];
    for (let i = 0; i < total; i += 1) {
      if (i !== safeIndex) pool.push(i);
    }
  }
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  const cells = emptyBoard(total);
  for (let k = 0; k < mines; k += 1) {
    cells[pool[k]] = { ...cells[pool[k]], mine: true };
  }
  return computeClues(cells, width, height);
}

/** 复数线索的显示文本：0+0i → 空白；3+0i → "3"；0+2i → "2i"；1+2i → "1+2i" */
export function clueText(clue: Clue): string {
  if (clue.re === 0 && clue.im === 0) return "";
  if (clue.im === 0) return String(clue.re);
  if (clue.re === 0) return `${clue.im}i`;
  return `${clue.re}+${clue.im}i`;
}

/**
 * 翻开格子。0+0i 时向八邻域连片展开（0+0i 当且仅当八邻域无雷，与经典扫雷一致）。
 * 踩雷时翻开所有雷并返回 exploded 索引。
 */
export function revealCells(
  cells: Cell[],
  start: number,
  width: number,
  height: number,
): { next: Cell[]; exploded: number | null } {
  const startCell = cells[start];
  if (startCell.revealed || startCell.mark === 1) return { next: cells, exploded: null };
  if (startCell.mine) {
    const next = cells.map((cell) => (cell.mine ? { ...cell, revealed: true } : cell));
    return { next, exploded: start };
  }
  const next = cells.slice();
  const stack: number[] = [start];
  while (stack.length > 0) {
    const index = stack.pop();
    if (index === undefined) break;
    const cell = next[index];
    if (cell.revealed || cell.mark === 1) continue;
    next[index] = { ...cell, revealed: true };
    if (cell.clue.re === 0 && cell.clue.im === 0) {
      for (const n of neighbors(index, width, height, ALL_OFFSETS)) {
        if (!next[n].revealed && next[n].mark !== 1) stack.push(n);
      }
    }
  }
  return { next, exploded: null };
}

/** 和弦快开：已翻开的数字格周围旗数等于雷数（实部+虚部）时，翻开其余相邻格 */
export function chordCells(
  cells: Cell[],
  start: number,
  width: number,
  height: number,
): { next: Cell[]; exploded: number | null } {
  const cell = cells[start];
  if (!cell.revealed || cell.mine) return { next: cells, exploded: null };
  const total = cell.clue.re + cell.clue.im;
  if (total === 0) return { next: cells, exploded: null };
  const around = neighbors(start, width, height, ALL_OFFSETS);
  const flags = around.reduce((sum, n) => sum + (cells[n].mark === 1 ? 1 : 0), 0);
  if (flags !== total) return { next: cells, exploded: null };
  let next = cells;
  let exploded: number | null = null;
  for (const n of around) {
    if (next[n].revealed || next[n].mark === 1) continue;
    const result = revealCells(next, n, width, height);
    next = result.next;
    if (result.exploded !== null) {
      exploded = result.exploded;
      break;
    }
  }
  return { next, exploded };
}
