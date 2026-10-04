import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import Game from "./game";

export const metadata: Metadata = {
  title: "Complexweeper",
  description: "复扫雷——雷有 +1、−1、+i、−i 四种，线索是周围雷的复数和的模长 k√n。",
};

const rules: ReactNode[] = [
  <>
    雷有四种复数值：<span style={{ color: "#ff7a7a" }}>+1</span>、
    <span style={{ color: "#8fb8ff" }}>−1</span>、
    <span style={{ color: "#7ad88f" }}>+i</span>、
    <span style={{ color: "#c89bff" }}>−i</span>
    ；顶部四组计数器分别显示四种雷的剩余数量（雷数 − 旗数）
  </>,
  <>
    每格的线索 = 周围 8 格所有雷的<strong>复数之和的模长</strong> |z|，化简为 k√n：如
    1+i → √2、2+2i → 2√2、3+0i → 3
  </>,
  <>周围没有雷 → 格子空白并自动连片展开</>,
  <>
    关键陷阱：周围有雷但复数和抵消为 0（如 +1 与 −1 相邻）→ 显示琥珀色的
    <span style={{ color: "#e2c07f" }}> 0 </span>，不会展开，别当成安全格
  </>,
  <>右键循环插四种旗（+1 → −1 → +i → −i → 取消）；任何旗都阻止翻开</>,
  <>
    点击已翻开的数字：当周围旗的复数和的模长平方 = 该格的 N=k²·n
    时，一次翻开其余相邻格——旗型不必与真实雷型一致，模长对得上即可
  </>,
  <>翻开所有非雷格获胜；第一次点击必安全（3×3 保护区）</>,
];

const diagram: { text: string; color?: string; center?: boolean }[] = [
  { text: "" },
  { text: "+1", color: "#ff7a7a" },
  { text: "" },
  { text: "" },
  { text: "√2", color: "#8fb8ff", center: true },
  { text: "+i", color: "#7ad88f" },
  { text: "" },
  { text: "" },
  { text: "" },
];

const controls: [string, string][] = [
  ["左键", "翻开格子；点击已翻开的数字可按判据快开"],
  ["右键", "循环切换 +1 → −1 → +i → −i 四种旗帜（触屏为长按）"],
  ["计数器", "顶部四组数字 = 四种雷各自的数量 − 对应旗数"],
  ["计时", "从第一次翻开开始，各难度最佳成绩保存在本机浏览器"],
];

export default function ComplexweeperPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="font-(--mono) text-[10px] tracking-[0.35em] text-(--text-faint)">
          [ 复扫雷 · COMPLEXWEEPER ]
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Complexweeper</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--text-muted)">
          复数扫雷：雷分 +1、−1、+i、−i 四种，格子的线索是周围雷的复数和的模长 k√n。
        </p>
      </header>

      <main>
        <Game />
      </main>


      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-(--line) bg-(--panel) p-5">
          <h2 className="font-(--mono) text-[11px] tracking-[0.3em] text-(--green-soft)">
            [ 规则 · RULES ]
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-(--text-muted)">
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-(--line) bg-(--panel) p-5">
          <h2 className="font-(--mono) text-[11px] tracking-[0.3em] text-(--green-soft)">
            [ 例 · EXAMPLE ]
          </h2>
          <div className="mt-4 flex items-center gap-6">
            <div
              className="grid gap-px rounded-md border border-(--line-strong) bg-(--line-strong) p-px"
              style={{ gridTemplateColumns: "repeat(3, 44px)" }}
              aria-hidden
            >
              {diagram.map((cell, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center font-(--mono) text-sm font-bold ${
                    cell.center ? "border border-(--green)" : ""
                  } ${cell.center ? "bg-(--panel2)" : "bg-(--panel)"}`}
                  style={{ width: 44, height: 44, color: cell.color }}
                >
                  {cell.text}
                </div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-(--text-muted)">
              上 +1、右 +i
              <br />→ 复数和 1+i
              <br />→ 模长 √2
              <br />
              <br />
              若上 +1、下 −1 → 和为 0<br />→ 显示{" "}
              <span style={{ color: "#e2c07f" }}>0</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-(--line) bg-(--panel) p-5">
        <h2 className="font-(--mono) text-[11px] tracking-[0.3em] text-(--green-soft)">
          [ 操作 · CONTROLS ]
        </h2>
        <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm text-(--text-muted) sm:grid-cols-2">
          {controls.map(([key, desc]) => (
            <div key={key} className="flex gap-3">
              <dt className="shrink-0 font-(--mono) text-(--text)">{key}</dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-10 text-center">
        <Link
          href="/"
          className="font-(--mono) text-xs tracking-widest text-(--text-faint) transition-colors hover:text-(--green-soft)"
        >
          &lt;- 返回首页
        </Link>
      </footer>
    </div>
  );
}
