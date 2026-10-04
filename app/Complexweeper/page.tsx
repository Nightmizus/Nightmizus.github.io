import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Complexweeper · 水澄Mizu",
  description: "复数扫雷——构思中的扫雷变体，敬请期待。",
};

export default function ComplexweeperPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex h-[76px] items-center justify-between border-b border-(--line) px-[clamp(20px,3.2vw,52px)]">
        <span className="font-(--mono) text-xs text-(--muted)">[ 实验 · 构思中 ]</span>
        <Link className="text-sm text-(--muted) transition-colors hover:text-(--green)" href="/">← 返回主页</Link>
      </header>

      <section className="grid flex-1 place-items-center px-6 py-24 text-center">
        <div>
          <p className="mb-6 font-(--mono) text-xs text-(--green)">COMPLEX + MINESWEEPER</p>
          <h1 className="text-[clamp(42px,6vw,84px)] leading-none font-semibold tracking-[-0.06em]">Complexweeper</h1>
          <p className="mt-6 text-base text-(--muted)">复数扫雷 · 构思中的扫雷变体，敬请期待</p>
        </div>
      </section>

      <footer className="flex h-14 items-center justify-center border-t border-(--line) font-(--mono) text-[10px] text-(--muted)">
        © 2026 水澄Mizu
      </footer>
    </main>
  );
}
