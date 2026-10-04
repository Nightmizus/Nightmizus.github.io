"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  DIFFICULTIES,
  chordCells,
  clueText,
  emptyBoard,
  generateBoard,
  revealCells,
  type Cell,
  type Difficulty,
} from "./engine";

type Status = "ready" | "playing" | "won" | "lost";

const BESTS_KEY = "complexweeper:bests";

const VALUE_COLORS: Record<number, string> = {
  1: "#8fb8ff",
  2: "#7ad88f",
  3: "#ff7a7a",
  4: "#c89bff",
};

function formatLed(value: number): string {
  const clamped = Math.max(-99, Math.min(999, value));
  return clamped < 0 ? `-${String(-clamped).padStart(2, "0")}` : String(clamped).padStart(3, "0");
}

function cellSize(difficulty: Difficulty): number {
  if (difficulty.id === "easy") return 34;
  if (difficulty.id === "hard") return 26;
  return 30;
}

export default function Game() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const { width, height, mines } = difficulty;
  const [cells, setCells] = useState<Cell[]>(() => emptyBoard(width * height));
  const [status, setStatus] = useState<Status>("ready");
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [exploded, setExploded] = useState<number | null>(null);
  const [bests, setBests] = useState<Record<string, number>>({});
  const pressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => setTime((value) => Math.min(value + 1, 999)), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const loader = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(BESTS_KEY);
        if (raw) setBests(JSON.parse(raw) as Record<string, number>);
      } catch {
        // 本地存储不可用时忽略
      }
    }, 0);
    return () => window.clearTimeout(loader);
  }, []);

  const reset = useCallback((next: Difficulty) => {
    setDifficulty(next);
    setCells(emptyBoard(next.width * next.height));
    setStatus("ready");
    setStarted(false);
    setTime(0);
    setExploded(null);
  }, []);

  const applyResult = useCallback((next: Cell[], boom: number | null) => {
    if (boom !== null) {
      setCells(next);
      setExploded(boom);
      setStatus("lost");
      return;
    }
    const revealedCount = next.reduce((sum, cell) => sum + (cell.revealed ? 1 : 0), 0);
    if (revealedCount === width * height - mines) {
      setCells(next.map((cell) => (cell.mine && cell.mark !== 1 ? { ...cell, mark: 1 as const } : cell)));
      setStatus("won");
      setBests((prev) => {
        const best = prev[difficulty.id];
        if (best === undefined || time < best) {
          const updated = { ...prev, [difficulty.id]: time };
          try {
            window.localStorage.setItem(BESTS_KEY, JSON.stringify(updated));
          } catch {
            // 本地存储不可用时忽略
          }
          return updated;
        }
        return prev;
      });
      return;
    }
    setCells(next);
  }, [width, height, mines, difficulty.id, time]);

  const handleReveal = useCallback((index: number) => {
    if (status === "lost" || status === "won") return;
    const cell = cells[index];
    if (cell.revealed) {
      const result = chordCells(cells, index, width, height);
      if (result.next !== cells) applyResult(result.next, result.exploded);
      return;
    }
    if (cell.mark === 1) return;
    let base = cells;
    if (!started) {
      const generated = generateBoard(width, height, mines, index);
      // 保留开局前已插的旗 / 问号
      base = generated.map((generatedCell, i) => (
        cells[i].mark !== 0 ? { ...generatedCell, mark: cells[i].mark } : generatedCell
      ));
      setStarted(true);
      setStatus("playing");
      setTime(0);
    }
    const result = revealCells(base, index, width, height);
    applyResult(result.next, result.exploded);
  }, [status, cells, started, width, height, mines, applyResult]);

  const handleMark = useCallback((index: number) => {
    if (status === "lost" || status === "won") return;
    setCells((prev) => {
      if (prev[index].revealed) return prev;
      return prev.map((cell, i) => (
        i === index ? { ...cell, mark: ((cell.mark + 1) % 3) as Cell["mark"] } : cell
      ));
    });
  }, [status]);

  const cancelPress = useCallback(() => {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const flags = cells.reduce((sum, cell) => sum + (cell.mark === 1 ? 1 : 0), 0);
  const size = cellSize(difficulty);
  const best = bests[difficulty.id];
  const face = status === "won" ? "😎" : status === "lost" ? "😵" : "🙂";

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="难度选择">
        {DIFFICULTIES.map((item) => {
          const active = item.id === difficulty.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => reset(item)}
              className={`rounded-full border px-4 py-2 font-(--mono) text-xs transition-colors ${
                active
                  ? "border-transparent bg-(--green) font-bold text-[#06110c]"
                  : "border-(--line-strong) text-(--muted) hover:border-(--green) hover:text-(--text)"
              }`}
            >
              {item.label} {item.width}×{item.height} · {item.mines}雷
            </button>
          );
        })}
      </div>

      <div className="w-max max-w-full">
        <div className="flex items-center justify-between border border-(--line-strong) bg-(--panel-2) px-4 py-3">
          <span
            className="rounded bg-[#140606] px-2 py-1 font-(--mono) text-lg tracking-[0.2em] text-[#ff5f5f] tabular-nums"
            aria-label={`剩余雷数 ${mines - flags}`}
          >
            {formatLed(mines - flags)}
          </span>
          <button
            type="button"
            onClick={() => reset(difficulty)}
            aria-label="重新开始"
            className="grid size-10 cursor-pointer place-items-center rounded-lg border border-(--line-strong) bg-(--panel) text-xl leading-none transition-transform hover:scale-105 active:scale-95"
          >
            {face}
          </button>
          <span
            className="rounded bg-[#140606] px-2 py-1 font-(--mono) text-lg tracking-[0.2em] text-[#ff5f5f] tabular-nums"
            aria-label={`用时 ${time} 秒`}
          >
            {formatLed(time)}
          </span>
        </div>

        <div className="overflow-x-auto border-x border-b border-(--line-strong)">
          <div
            className="grid w-max select-none"
            role="group"
            aria-label="Complexweeper 棋盘"
            style={{ gridTemplateColumns: `repeat(${width}, ${size}px)` }}
            onContextMenu={(event) => event.preventDefault()}
          >
            {cells.map((cell, index) => {
              const isExploded = exploded === index;
              const visuallyRevealed = cell.revealed || (status === "lost" && cell.mine);
              let content: ReactNode = null;
              let aria: string;
              if (status === "lost") {
                if (cell.mine && cell.mark === 1) {
                  content = "🚩";
                  aria = "已插旗的地雷";
                } else if (cell.mine) {
                  content = isExploded ? "💥" : "💣";
                  aria = "地雷";
                } else if (cell.mark === 1) {
                  content = <span className="text-[#ff7a7a]">✕</span>;
                  aria = "插错的旗";
                } else {
                  aria = "未翻开";
                }
              } else if (!cell.revealed) {
                if (cell.mark === 1) {
                  content = "🚩";
                  aria = "已插旗";
                } else if (cell.mark === 2) {
                  content = <span className="text-(--muted)">?</span>;
                  aria = "标记问号";
                } else {
                  aria = "未翻开";
                }
              } else if (cell.mine) {
                content = "💣";
                aria = "地雷";
              } else {
                const text = clueText(cell.clue);
                aria = text === "" ? "空白" : `线索 ${text}`;
                if (cell.clue.re > 0 || cell.clue.im > 0) {
                  content = (
                    <>
                      {cell.clue.re > 0 && (
                        <span style={{ color: VALUE_COLORS[cell.clue.re] }}>{cell.clue.re}</span>
                      )}
                      {cell.clue.re > 0 && cell.clue.im > 0 && (
                        <span className="opacity-50">+</span>
                      )}
                      {cell.clue.im > 0 && (
                        <span className="italic" style={{ color: VALUE_COLORS[cell.clue.im] }}>
                          {cell.clue.im}i
                        </span>
                      )}
                    </>
                  );
                }
              }
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`第 ${Math.floor(index / width) + 1} 行第 ${(index % width) + 1} 列，${aria}`}
                  className={`grid place-items-center border font-(--mono) leading-none ${
                    visuallyRevealed
                      ? "border-[#1b2320] bg-[#0a0e0c]"
                      : "cursor-pointer border-[#27322d] bg-[#141b18] hover:bg-[#1b2320] active:bg-[#101714]"
                  }`}
                  style={{
                    width: size,
                    height: size,
                    fontSize: Math.round(size * 0.4),
                    background: isExploded ? "#5b1a1a" : undefined,
                  }}
                  onClick={() => {
                    if (longPressed.current) {
                      longPressed.current = false;
                      return;
                    }
                    handleReveal(index);
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    handleMark(index);
                  }}
                  onTouchStart={() => {
                    cancelPress();
                    longPressed.current = false;
                    pressTimer.current = window.setTimeout(() => {
                      longPressed.current = true;
                      handleMark(index);
                    }, 400);
                  }}
                  onTouchEnd={cancelPress}
                  onTouchMove={cancelPress}
                  onTouchCancel={cancelPress}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-center font-(--mono) text-[11px] leading-5 text-(--muted)">
        最佳成绩：{best === undefined ? "暂无" : `${best} 秒`} · 左键翻开 · 右键插旗 · 点击数字快速开格 · 触屏长按插旗
      </p>
    </div>
  );
}

