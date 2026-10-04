"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  DIFFICULTIES,
  FLAG_LABELS,
  chordCells,
  displayN,
  emptyBoard,
  generateBoard,
  revealCells,
  valueText,
  type Cell,
  type CellValue,
  type Difficulty,
  type MineCounts,
} from "./engine";

type Status = "ready" | "playing" | "won" | "lost";

const BESTS_KEY = "complexweeper:bests-v2";

const FLAG_COLORS: Record<number, string> = {
  1: "#ff7a7a",
  2: "#8fb8ff",
  3: "#7ad88f",
  4: "#c89bff",
};

function valueColor(value: CellValue): string {
  const n = displayN(value);
  if (n === 0) return "#e2c07f";
  if (n <= 2) return "#8fb8ff";
  if (n <= 5) return "#7ad88f";
  if (n <= 10) return "#ff7a7a";
  return "#c89bff";
}

function formatLed(value: number): string {
  const clamped = Math.max(-99, Math.min(999, value));
  const sign = clamped < 0 ? "-" : "";
  return sign + String(Math.abs(clamped)).padStart(clamped < 0 ? 2 : 3, "0");
}

function cellSizeFor(width: number): number {
  if (width >= 24) return 26;
  if (width >= 12) return 30;
  return 34;
}

function bestKeyOf(d: Difficulty): string {
  return d.id === "custom"
    ? `custom-${d.width}x${d.height}-${d.mines.join(".")}`
    : d.id;
}

export default function Game() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const { width, height } = difficulty;
  const totalMines =
    difficulty.mines[0] + difficulty.mines[1] + difficulty.mines[2] + difficulty.mines[3];
  const bestKey = bestKeyOf(difficulty);
  const [cells, setCells] = useState<Cell[]>(() => emptyBoard(width * height));
  const [status, setStatus] = useState<Status>("ready");
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [exploded, setExploded] = useState<number | null>(null);
  const [bests, setBests] = useState<Record<string, number>>({});
  const [showCustom, setShowCustom] = useState(false);
  const [formW, setFormW] = useState("16");
  const [formH, setFormH] = useState("16");
  const [formM, setFormM] = useState<[string, string, string, string]>(["10", "10", "10", "10"]);
  const [formError, setFormError] = useState("");
  const pressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);

  const reset = useCallback((d: Difficulty) => {
    setCells(emptyBoard(d.width * d.height));
    setStatus("ready");
    setStarted(false);
    setTime(0);
    setExploded(null);
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = setInterval(() => setTime((t) => Math.min(t + 1, 999)), 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(BESTS_KEY);
        if (raw !== null) setBests(JSON.parse(raw) as Record<string, number>);
      } catch {
        // localStorage 不可用时忽略
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const applyResult = useCallback(
    (next: Cell[], blewUp: number | null, wasStarted: boolean) => {
      setCells(next);
      if (blewUp !== null) {
        setExploded(blewUp);
        setStatus("lost");
        return;
      }
      const revealedCount = next.reduce((acc, cell) => acc + (cell.revealed ? 1 : 0), 0);
      if (revealedCount === width * height - totalMines) {
        setStatus("won");
        if (!wasStarted) setTime(0);
        setBests((prev) => {
          const best = prev[bestKey];
          if (best !== undefined && time >= best) return prev;
          const updated = { ...prev, [bestKey]: time };
          try {
            window.localStorage.setItem(BESTS_KEY, JSON.stringify(updated));
          } catch {
            // localStorage 不可用时忽略
          }
          return updated;
        });
      }
    },
    [width, height, totalMines, bestKey, time],
  );

  const handleReveal = useCallback(
    (index: number) => {
      if (status === "won" || status === "lost") return;
      const cell = cells[index];
      if (cell.flag !== 0) return;
      if (cell.revealed) {
        if (!started) return;
        const result = chordCells(cells, index, width, height);
        applyResult(result.next, result.exploded, started);
        return;
      }
      if (!started) {
        const generated = generateBoard(width, height, difficulty.mines, index);
        const flagged = generated.map((c, i) =>
          cells[i].flag !== 0 ? { ...c, flag: cells[i].flag } : c,
        );
        setStarted(true);
        setStatus("playing");
        applyResult(revealCells(flagged, index, width, height).next, null, false);
        return;
      }
      const result = revealCells(cells, index, width, height);
      applyResult(result.next, result.exploded, started);
    },
    [applyResult, cells, difficulty, height, started, status, width],
  );

  const handleMark = useCallback(
    (index: number) => {
      if (status === "won" || status === "lost") return;
      const cell = cells[index];
      if (cell.revealed) return;
      setCells((prev) =>
        prev.map((c, i) =>
          i === index ? { ...c, flag: ((c.flag + 1) % 5) as Cell["flag"] } : c,
        ),
      );
    },
    [cells, status],
  );

  const cancelPress = useCallback(() => {
    if (pressTimer.current !== null) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const applyCustom = useCallback(() => {
    const w = Number.parseInt(formW, 10);
    const h = Number.parseInt(formH, 10);
    const m = formM.map((s) => Number.parseInt(s, 10));
    if (Number.isNaN(w) || Number.isNaN(h) || m.some(Number.isNaN)) {
      setFormError("请输入整数");
      return;
    }
    if (w < 1 || h < 1 || w > 64 || h > 64) {
      setFormError("宽和高需在 1–64 之间");
      return;
    }
    if (m.some((v) => v < 0)) {
      setFormError("雷数不能为负");
      return;
    }
    const total = m[0] + m[1] + m[2] + m[3];
    if (total === 0) {
      setFormError("雷数总和不能为 0");
      return;
    }
    if (total > w * h - 9) {
      setFormError("雷太多：总和需 ≤ 宽×高−9");
      return;
    }
    const custom: Difficulty = {
      id: "custom",
      label: "自定义",
      width: w,
      height: h,
      mines: m as MineCounts,
    };
    setFormError("");
    setDifficulty(custom);
    reset(custom);
  }, [formW, formH, formM, reset]);

  const evenOut = useCallback(() => {
    const total = formM.reduce((sum, s) => sum + (Number.parseInt(s, 10) || 0), 0);
    const avg = Math.floor(total / 4);
    const rem = total % 4;
    setFormM([
      String(avg + (rem > 0 ? 1 : 0)),
      String(avg + (rem > 1 ? 1 : 0)),
      String(avg + (rem > 2 ? 1 : 0)),
      String(avg),
    ]);
  }, [formM]);

  const flagCounts = [0, 0, 0, 0];
  for (const cell of cells) {
    if (cell.flag > 0) flagCounts[cell.flag - 1] += 1;
  }

  const face = status === "lost" ? "😵" : status === "won" ? "😎" : "🙂";
  const size = cellSizeFor(width);
  const fontSize = Math.max(9, Math.round(size * 0.34));
  const best = bests[bestKey];



  return (
    <section className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="难度选择">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={difficulty.id === d.id}
            onClick={() => {
              setShowCustom(false);
              setDifficulty(d);
              reset(d);
            }}
            className={`cursor-pointer rounded-full border px-4 py-1.5 font-(--mono) text-xs tracking-wider transition-colors ${
              difficulty.id === d.id
                ? "border-(--green) bg-(--green-glow) text-(--green-soft)"
                : "border-(--line-strong) bg-(--panel) text-(--text-faint) hover:text-(--text-muted)"
            }`}
          >
            {d.label} {d.width}×{d.height}
          </button>
        ))}
        <button
          type="button"
          role="tab"
          aria-selected={difficulty.id === "custom"}
          onClick={() => setShowCustom((v) => !v)}
          className={`cursor-pointer rounded-full border px-4 py-1.5 font-(--mono) text-xs tracking-wider transition-colors ${
            difficulty.id === "custom" || showCustom
              ? "border-(--green) bg-(--green-glow) text-(--green-soft)"
              : "border-(--line-strong) bg-(--panel) text-(--text-faint) hover:text-(--text-muted)"
          }`}
        >
          自定义
        </button>
      </div>

      {showCustom && (
        <div className="w-full max-w-xl rounded-xl border border-(--line) bg-(--panel) p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 font-(--mono) text-[10px] tracking-widest text-(--text-faint)">
              宽
              <input
                value={formW}
                onChange={(e) => setFormW(e.target.value)}
                inputMode="numeric"
                className="rounded border border-(--line-strong) bg-(--bg) px-2 py-1 text-sm text-(--text)"
              />
            </label>
            <label className="flex flex-col gap-1 font-(--mono) text-[10px] tracking-widest text-(--text-faint)">
              高
              <input
                value={formH}
                onChange={(e) => setFormH(e.target.value)}
                inputMode="numeric"
                className="rounded border border-(--line-strong) bg-(--bg) px-2 py-1 text-sm text-(--text)"
              />
            </label>
            {([1, 2, 3, 4] as const).map((f) => (
              <label
                key={f}
                className="flex flex-col gap-1 font-(--mono) text-[10px] tracking-widest"
                style={{ color: FLAG_COLORS[f] }}
              >
                {FLAG_LABELS[f]} 雷
                <input
                  value={formM[f - 1]}
                  onChange={(e) =>
                    setFormM(
                      (prev) =>
                        prev.map((v, i) => (i === f - 1 ? e.target.value : v)) as [
                          string,
                          string,
                          string,
                          string,
                        ],
                    )
                  }
                  inputMode="numeric"
                  className="rounded border border-(--line-strong) bg-(--bg) px-2 py-1 text-sm text-(--text)"
                />
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={evenOut}
              className="cursor-pointer rounded-full border border-(--line-strong) px-3 py-1 font-(--mono) text-xs text-(--text-faint) hover:text-(--text-muted)"
            >
              四种均分
            </button>
            <button
              type="button"
              onClick={applyCustom}
              className="cursor-pointer rounded-full border border-(--green) bg-(--green-glow) px-4 py-1 font-(--mono) text-xs text-(--green-soft)"
            >
              开始游戏
            </button>
            {formError !== "" && (
              <span className="font-(--mono) text-xs text-[#ff7a7a]">{formError}</span>
            )}
          </div>
        </div>
      )}

      <div className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-(--line) bg-(--panel) px-4 py-2">
        <div className="flex items-center gap-3">
          {([1, 2, 3, 4] as const).map((f) => (
            <span
              key={f}
              className="font-(--mono) text-sm tabular-nums"
              aria-label={`${FLAG_LABELS[f]} 雷剩余 ${difficulty.mines[f - 1] - flagCounts[f - 1]}`}
            >
              <span style={{ color: FLAG_COLORS[f] }}>{FLAG_LABELS[f]}</span>{" "}
              <span className="text-(--text)">
                {difficulty.mines[f - 1] - flagCounts[f - 1]}
              </span>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => reset(difficulty)}
          aria-label="重新开始"
          title="重新开始"
          className="cursor-pointer rounded-lg border border-(--line-strong) bg-(--panel2) px-2.5 py-1 text-lg leading-none"
        >
          <span aria-hidden>{face}</span>
        </button>
        <span
          className="font-(--mono) text-lg tracking-[0.2em] text-[#ff6b6b]"
          aria-label={`用时 ${time} 秒`}
        >
          {formatLed(time)}
        </span>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div
          role="grid"
          aria-label={`${difficulty.label}棋盘`}
          className="grid gap-px rounded-lg border border-(--line-strong) bg-(--line-strong) p-px"
          style={{ gridTemplateColumns: `repeat(${width}, ${size}px)` }}
        >
          {cells.map((cell, index) => {
            let content: ReactNode = null;
            let label: string;
            if (cell.revealed) {
              if (cell.mine) {
                content = index === exploded ? "💥" : "💣";
                label = "地雷";
              } else {
                const text = valueText(cell.value);
                label = text === "" ? "空白" : `模长 ${text}`;
                if (text !== "") {
                  content = (
                    <span className="font-bold" style={{ color: valueColor(cell.value) }}>
                      {text}
                    </span>
                  );
                }
              }
            } else if (cell.flag > 0) {
              content = (
                <span className="font-bold" style={{ color: FLAG_COLORS[cell.flag] }}>
                  {FLAG_LABELS[cell.flag]}
                </span>
              );
              label = `旗帜 ${FLAG_LABELS[cell.flag]}`;
            } else {
              label = "未翻开";
            }
            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                aria-label={label}
                onClick={() => handleReveal(index)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleMark(index);
                }}
                onPointerDown={(e) => {
                  if (e.pointerType !== "touch") return;
                  longPressed.current = false;
                  pressTimer.current = window.setTimeout(() => {
                    longPressed.current = true;
                    handleMark(index);
                  }, 400);
                }}
                onPointerUp={() => cancelPress()}
                onPointerLeave={() => cancelPress()}
                onPointerCancel={() => cancelPress()}
                onClickCapture={(e) => {
                  if (longPressed.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    longPressed.current = false;
                  }
                }}
                className={`flex cursor-pointer items-center justify-center font-(--mono) leading-none select-none ${
                  cell.revealed
                    ? "bg-(--panel2)"
                    : "bg-(--panel) hover:bg-(--line) active:bg-(--panel2)"
                }`}
                style={{ width: size, height: size, fontSize }}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      <p className="max-w-xl text-center font-(--mono) text-[10px] leading-relaxed tracking-wider text-(--text-faint)">
        左键翻开 · 右键循环四种旗（+1→−1→+i→−i）· 点击已翻开数字：旗的复数和模长平方匹配时快开 · 触屏长按插旗
        {best !== undefined && <span className="mt-1 block">本难度最佳 {best} 秒</span>}
      </p>
    </section>
  );
}

