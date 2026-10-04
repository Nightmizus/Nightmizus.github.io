import type { Metadata } from "next";
import Link from "next/link";
import Game from "./game";

export const metadata: Metadata = {
  title: "Complexweeper · 水澄Mizu",
  description: "复数扫雷——经典扫雷的复数变体：实部是正交方向的雷数，虚部是斜角方向的雷数。",
};

const diagram: Array<{ mine: boolean; clue: boolean }> = [
  { mine: true, clue: false },
  { mine: true, clue: false },
  { mine: false, clue: false },
  { mine: false, clue: false },
  { mine: false, clue: true },
  { mine: true, clue: false },
  { mine: false, clue: false },
  { mine: false, clue: false },
  { mine: true, clue: false },
];

export default function ComplexweeperPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex h-[76px] items-center justify-between border-b border-(--line) px-[clamp(20px,3.2vw,52px)]">
        <span className="font-(--mono) text-xs text-(--muted)">[ 实验 · 复数扫雷 ]</span>
        <Link className="text-sm text-(--muted) transition-colors hover:text-(--green)" href="/">← 返回主页</Link>
      </header>

      <section className="border-b border-(--line) px-6 py-14 text-center">
        <p className="mb-6 font-(--mono) text-xs text-(--green)">COMPLEX + MINESWEEPER</p>
        <h1 className="text-[clamp(42px,6vw,84px)] leading-none font-semibold tracking-[-0.06em]">Complexweeper</h1>
        <p className="mt-6 text-base text-(--muted)">
          复数扫雷 · 实部 a 是上、下、左、右的雷数，虚部 b 是四个斜角的雷数
        </p>
      </section>

      <section className="border-b border-(--line) px-4 py-12 sm:px-6">
        <Game />
      </section>

      <section className="grid gap-10 border-b border-(--line) px-6 py-14 md:grid-cols-2 md:px-[clamp(20px,3.2vw,52px)]">
        <div>
          <p className="mb-4 font-(--mono) text-xs text-(--green)">[ 规则 · RULES ]</p>
          <h2 className="mb-6 text-2xl font-semibold tracking-[-0.03em]">线索是复数 a+bi</h2>
          <ul className="space-y-3 text-sm leading-7 text-(--muted)">
            <li><strong className="font-medium text-(--text)">实部 a</strong> — 上、下、左、右 4 个正交相邻格中的地雷数（0–4）。</li>
            <li><strong className="font-medium text-(--text)">虚部 b</strong> — 四个斜角相邻格中的地雷数（0–4）。</li>
            <li>
              例如{" "}
              <code className="font-(--mono)">
                <span style={{ color: "#8fb8ff" }}>1</span>
                <span className="opacity-50">+</span>
                <span className="italic" style={{ color: "#7ad88f" }}>2i</span>
              </code>{" "}
              表示正交方向 1 颗雷、斜角方向 2 颗雷，周围共 3 颗。
            </li>
            <li>其余规则与经典扫雷完全一致：0+0i 会自动连片展开，第一次点击必定安全。</li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="grid w-max" style={{ gridTemplateColumns: "repeat(3, 44px)" }}>
            {diagram.map((cell, index) => (
              <span
                key={index}
                className={`grid size-11 place-items-center border font-(--mono) text-sm ${
                  cell.clue ? "border-(--green) bg-[#0a0e0c]" : "border-[#27322d] bg-[#141b18]"
                }`}
              >
                {cell.mine ? "💣" : cell.clue ? (
                  <>
                    <span style={{ color: "#7ad88f" }}>2</span>
                    <span className="opacity-50">+</span>
                    <span className="italic" style={{ color: "#7ad88f" }}>2i</span>
                  </>
                ) : null}
              </span>
            ))}
          </div>
          <p className="text-center font-(--mono) text-[11px] leading-5 text-(--muted)">
            上、右两颗是正交雷（实部 2）<br />左上、右下两颗是斜角雷（虚部 2）
          </p>
        </div>
      </section>

      <section className="px-6 py-14 md:px-[clamp(20px,3.2vw,52px)]">
        <p className="mb-6 font-(--mono) text-xs text-(--green)">[ 操作 · CONTROLS ]</p>
        <div className="grid gap-4 text-sm leading-7 text-(--muted) sm:grid-cols-2">
          <p><strong className="font-medium text-(--text)">左键</strong> 翻开格子；点击已翻开的数字，当周围旗数等于雷数时，一次翻开其余相邻格。</p>
          <p><strong className="font-medium text-(--text)">右键</strong> 依次切换 旗帜 → 问号 → 空白；触屏设备长按即可插旗。</p>
          <p><strong className="font-medium text-(--text)">胜利</strong> 翻开所有非雷格即获胜；踩到雷则游戏结束。</p>
          <p><strong className="font-medium text-(--text)">计时</strong> 从第一次翻开开始计时，各难度最佳成绩保存在本机浏览器。</p>
        </div>
      </section>

      <footer className="mt-auto flex h-14 items-center justify-center border-t border-(--line) font-(--mono) text-[10px] text-(--muted)">
        © 2026 水澄Mizu
      </footer>
    </main>
  );
}
