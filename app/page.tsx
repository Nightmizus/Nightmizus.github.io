"use client";

const contacts = [
  { id: "01", label: "微信", value: "微信号待补充", note: "添加时请备注来意" },
  { id: "02", label: "BILIBILI", value: "UID 1023885059", note: "水澄Mizu", href: "https://space.bilibili.com/1023885059" },
  { id: "03", label: "GITHUB", value: "@Nightmizus", note: "代码与开源项目", href: "https://github.com/Nightmizus" },
  { id: "04", label: "QQ", value: "QQ 号码待补充", note: "添加时请备注来意" },
  { id: "05", label: "邮箱", value: "Nightmizus@gmail.com", note: "合作与正式联系", href: "mailto:Nightmizus@gmail.com" },
];

const websites = [
  {
    name: "水澄Mizu的个人主页",
    url: "nightmizus.github.io",
    href: "https://nightmizus.github.io",
    owner: "独立开发与维护",
    status: "迭代中",
  },
];

const projects = [
  { id: "P.01", name: "MizuLauncherAura", type: "C# / DESKTOP", text: "MizuLauncher 的 Aura 版本，探索更现代的 Minecraft 启动器体验。", href: "https://github.com/Nightmizus/MizuLauncherAura" },
  { id: "P.02", name: "mio-core", type: "PYTHON / SERVICE", text: "音乐目录代理、私聊与受控发布服务，让内容整理与分发更顺手。", href: "https://github.com/Nightmizus/mio-core" },
  { id: "P.03", name: "geoguessr-map", type: "HTML / EXPERIMENT", text: "围绕地图与地理探索制作的网页实验。", href: "https://github.com/Nightmizus/geoguessr-map" },
];

function FrameHandles() {
  return <><i className="handle tl" /><i className="handle tr" /><i className="handle bl" /><i className="handle br" /><i className="handle tm" /><i className="handle bm" /></>;
}

export default function Home() {
  return (
    <main>
      <header className="nav-shell">
        <a className="wordmark" href="#top" aria-label="返回顶部">
          <span className="mark-grid" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <strong>mizusumi</strong>
        </a>
        <nav aria-label="主导航">
          <a href="#websites">网站</a>
          <a href="#projects">项目</a>
          <a href="#contact">联系</a>
        </nav>
        <div className="nav-actions">
          <span className="lang">CN</span>
          <a className="console-button" href="#contact">找到我 <span>→</span></a>
        </div>
      </header>

      <section className="hero technical-grid" id="top" aria-labelledby="hero-title">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="terminal-label">[ 创作 · 开发 · 折腾 ]</p>
            <h1 id="hero-title"><span>水澄Mizu的</span><span>个人主页</span></h1>
            <p className="hero-accent">将 <span>创意</span> 落地。</p>
            <p className="hero-description">做有趣的产品，写可靠的代码，也把每一个尚未成形的想法，慢慢变成可以被看见的东西。</p>
            <div className="hero-buttons">
              <a className="button primary" href="#websites">浏览作品 <span>→</span></a>
              <a className="button ghost" href="https://github.com/Nightmizus" target="_blank" rel="noreferrer">查看 GitHub</a>
            </div>
            <a className="scroll-note" href="#websites"><span>↙</span> 向下滚动 · 查看全部内容</a>
          </div>

          <div className="contact-frame">
            <FrameHandles />
            <div className="frame-toolbar">
              <span>CONTACT_CHANNELS</span>
              <span>05 ITEMS</span>
            </div>
            <div className="contact-stack">
              {contacts.map((item) => (
                <details className="contact-row" key={item.label}>
                  <summary>
                    <span className="row-id">{item.id}</span>
                    <strong>{item.label}</strong>
                    <span className="row-plus">+</span>
                  </summary>
                  <div className="row-detail">
                    {item.href ? <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{item.value} <span>↗</span></a> : <span>{item.value}</span>}
                    <small>{item.note}</small>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="request-bar" aria-label="当前页面请求状态">
          <span className="method">GET</span>
          <code>nightmizus.github.io/index</code>
          <span className="request-separator" />
          <span className="latency">ϟ ONLINE</span>
          <span className="copy-icon" aria-hidden="true">◎</span>
        </div>
      </section>

      <section className="metrics" aria-label="个人数据概览">
        <div><strong>06</strong><span>公开仓库</span></div>
        <div><strong>05</strong><span>技术方向</span></div>
        <div><strong>03+</strong><span>活跃项目</span></div>
        <div><strong>24/7</strong><span>创意在线</span></div>
        <div><strong>∞</strong><span>想法库存</span></div>
      </section>

      <section className="websites technical-grid" id="websites" aria-labelledby="websites-title">
        <div className="section-heading">
          <p className="terminal-label">[ S1 · 网站导航 ]</p>
          <h2 id="websites-title">正在运行的<br /><span>数字空间。</span></h2>
          <p>独立构建、持续维护。这里收录我的网站，以及它们此刻的运行状态。</p>
        </div>

        <div className="site-table" role="table" aria-label="水澄Mizu的网站">
          <div className="table-row table-head" role="row">
            <span role="columnheader">名称</span>
            <span role="columnheader">网址</span>
            <span role="columnheader">开发与维护</span>
            <span role="columnheader">状态</span>
          </div>
          {websites.map((site, index) => (
            <a className="table-row site-row" role="row" href={site.href} target="_blank" rel="noreferrer" key={site.name}>
              <span role="cell" data-label="名称"><i>{String(index + 1).padStart(2, "0")}</i><strong>{site.name}</strong></span>
              <span role="cell" data-label="网址"><code>{site.url}</code><b>↗</b></span>
              <span role="cell" data-label="开发与维护">{site.owner}</span>
              <span role="cell" data-label="状态"><em><i />{site.status}</em></span>
            </a>
          ))}
          <div className="table-row table-pending" role="row">
            <span role="cell">更多站点正在整理</span><span role="cell">—</span><span role="cell">水澄Mizu</span><span role="cell">待公开</span>
          </div>
        </div>
      </section>

      <section className="projects technical-grid" id="projects" aria-labelledby="projects-title">
        <div className="section-heading compact">
          <p className="terminal-label">[ S2 · 项目与实验 ]</p>
          <h2 id="projects-title">把想法，<br /><span>变成可以运行的东西。</span></h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a className="project-card" href={project.href} target="_blank" rel="noreferrer" key={project.name}>
              <FrameHandles />
              <span className="project-id">{project.id}</span>
              <div className="project-visual" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
              <p>{project.type}</p>
              <h3>{project.name}</h3>
              <small>{project.text}</small>
              <b>查看项目 <span>↗</span></b>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer technical-grid" id="contact">
        <p className="terminal-label">[ READY_FOR_NEXT_IDEA ]</p>
        <h2>有新的想法？<br /><span>一起把它做出来。</span></h2>
        <a className="footer-mail" href="mailto:Nightmizus@gmail.com">Nightmizus@gmail.com <span>↗</span></a>
        <div className="footer-bottom"><span>© 2026 水澄Mizu</span><span>DESIGNED & BUILT WITH CURIOSITY</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
