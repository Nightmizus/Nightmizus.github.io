"use client";

const contacts = [
  {
    label: "微信",
    index: "01",
    value: "微信号待补充",
    hint: "点击展开 · 添加时请备注来意",
  },
  {
    label: "BILIBILI",
    index: "02",
    value: "水澄Mizu",
    hint: "UID 1023885059",
    href: "https://space.bilibili.com/1023885059",
  },
  {
    label: "GITHUB",
    index: "03",
    value: "@Nightmizus",
    hint: "代码、实验与正在发生的项目",
    href: "https://github.com/Nightmizus",
  },
  {
    label: "QQ",
    index: "04",
    value: "QQ 号码待补充",
    hint: "点击展开 · 添加时请备注来意",
  },
  {
    label: "邮箱",
    index: "05",
    value: "Nightmizus@gmail.com",
    hint: "合作与其他正式联系",
    href: "mailto:Nightmizus@gmail.com",
  },
];

const websites = [
  {
    name: "水澄Mizu的个人主页",
    url: "mizusumi.com",
    href: "https://mizusumi.com",
    owner: "独立开发与维护",
    status: "重构中",
    tone: "building",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="返回首页顶部">
            <span className="brand-mark">水</span>
            <span>MIZUSUMI / PORTFOLIO</span>
          </a>
          <div className="header-meta">
            <span>SHANGHAI · UTC+8</span>
            <span className="available"><i /> OPEN TO IDEAS</span>
          </div>
        </header>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span>PORTFOLIO</span><span>2026</span></p>
            <h1 id="hero-title">
              <span>水澄Mizu的</span>
              <span>个人主页</span>
            </h1>
            <div className="hero-statement">
              <span className="statement-index">/ 01</span>
              <p>将创意落地<span className="accent">。</span></p>
            </div>
          </div>

          <aside className="contact-panel" aria-label="联系方式">
            <div className="panel-heading">
              <span>联系方式</span>
              <span>CONTACT</span>
            </div>
            <div className="contact-list">
              {contacts.map((contact) => (
                <details className="contact-item" key={contact.label}>
                  <summary>
                    <span className="contact-index">{contact.index}</span>
                    <span className="contact-label">{contact.label}</span>
                    <span className="contact-action" aria-hidden="true">+</span>
                  </summary>
                  <div className="contact-detail">
                    <div>
                      {contact.href ? (
                        <a href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                          {contact.value}<span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span>{contact.value}</span>
                      )}
                      <small>{contact.hint}</small>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </aside>
        </div>

        <a className="scroll-cue" href="#work">
          <span>向下滚动</span>
          <span className="scroll-line" aria-hidden="true"><i /></span>
          <span>SCROLL TO EXPLORE</span>
        </a>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">SELECTED INDEX / 01</p>
            <h2 id="work-title">网站</h2>
          </div>
          <p className="section-note">独立构建、长期维护，<br />也记录每一次新的尝试。</p>
        </div>

        <div className="site-table" role="table" aria-label="水澄Mizu的网站列表">
          <div className="table-row table-head" role="row">
            <span role="columnheader">名称</span>
            <span role="columnheader">网址</span>
            <span role="columnheader">开发与维护</span>
            <span role="columnheader">状态</span>
          </div>
          {websites.map((site, index) => (
            <a className="table-row site-row" href={site.href} target="_blank" rel="noreferrer" role="row" key={site.name}>
              <span role="cell" data-label="名称"><i>{String(index + 1).padStart(2, "0")}</i>{site.name}</span>
              <span role="cell" data-label="网址">{site.url}<b aria-hidden="true">↗</b></span>
              <span role="cell" data-label="开发与维护">{site.owner}</span>
              <span role="cell" data-label="状态"><em className={site.tone}><i />{site.status}</em></span>
            </a>
          ))}
          <div className="table-row table-placeholder" role="row">
            <span role="cell">下一站正在整理</span>
            <span role="cell">—</span>
            <span role="cell">水澄Mizu</span>
            <span role="cell">待公开</span>
          </div>
        </div>

        <div className="next-section" aria-label="项目区预告">
          <span>UP NEXT / 02</span>
          <strong>项目</strong>
          <span>PROJECTS · COMING NEXT</span>
        </div>
      </section>
    </main>
  );
}
