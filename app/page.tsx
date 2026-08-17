"use client";

import Image from "next/image";
import { useState } from "react";

type Contact = {
  id: string;
  label: string;
  icon: string;
  avatar?: string;
  nickname?: string;
  identifier?: string;
  value?: string;
  note?: string;
  href?: string;
};

const contacts: Contact[] = [
  { id: "01", label: "微信", icon: "微", avatar: "/hyouya-avatar.jpg", nickname: "氷鵺", identifier: "微信号：Mizusumi" },
  { id: "02", label: "BILIBILI", icon: "B", avatar: "/mizu-avatar.jpg", nickname: "水澄Mizu", identifier: "UID：1023885059", href: "https://space.bilibili.com/1023885059" },
  { id: "03", label: "GITHUB", icon: "GH", avatar: "/mizu-avatar.jpg", nickname: "水澄Mizusumi", identifier: "用户名：Nightmizus", href: "https://github.com/Nightmizus" },
  { id: "04", label: "QQ", icon: "Q", avatar: "/hyouya-avatar.jpg", nickname: "氷鵺", identifier: "QQ号：2631522976" },
  { id: "05", label: "TELEGRAM", icon: "TG", avatar: "/hyouya-avatar.jpg", nickname: "水澄Mizu", identifier: "@Mizusumi", href: "https://t.me/Mizusumi" },
  { id: "06", label: "邮箱", icon: "@", value: "Nightmizus@gmail.com", note: "合作与正式联系", href: "mailto:Nightmizus@gmail.com" },
];

type WebsiteOwner = {
  name: string;
  github: string;
  role?: "开发" | "维护";
};

type Website = {
  name: string;
  url: string;
  href: string;
  description: string;
  repository?: {
    label: string;
    href: string;
  };
  owners: WebsiteOwner[];
  status: "在线";
};

const websites: Website[] = [
  {
    name: "水澄Mizu的个人主页",
    url: "mizusumi.com",
    href: "https://mizusumi.com",
    description: "一些有意思的网站及项目的导航，也是Mizusumi大部分创意的集锦",
    repository: { label: "Nightmizus.github.io", href: "https://github.com/Nightmizus/Nightmizus.github.io" },
    owners: [{ name: "水澄Mizu", github: "https://github.com/Nightmizus" }],
    status: "在线",
  },
  {
    name: "Mizusumi的图寻地图",
    url: "map.mizusumi.com",
    href: "https://map.mizusumi.com",
    description: "将区域国家特征粘贴在地图上，帮助你快速学习图寻所用到的知识",
    repository: { label: "geoguessr-map", href: "https://github.com/Nightmizus/geoguessr-map" },
    owners: [{ name: "水澄Mizu", github: "https://github.com/Nightmizus" }],
    status: "在线",
  },
  {
    name: "Music Mizu",
    url: "music.mizusumi.com",
    href: "https://music.mizusumi.com",
    description: "自(pay mizu)由(to upload)上传的音乐社区平台",
    repository: { label: "musicmizu", href: "https://github.com/shizwd/musicmizu" },
    owners: [
      { name: "水澄Mizu", github: "https://github.com/Nightmizus", role: "开发" },
      { name: "shi_zwd", github: "https://github.com/shizwd", role: "维护" },
    ],
    status: "在线",
  },
  {
    name: "Cowtypes",
    url: "cowtypes.mizusumi.com",
    href: "https://cowtypes.mizusumi.com",
    description: "eletypes+，优化WPM计算方式，增加无限模式，支持隐藏中文/拼音",
    repository: { label: "eletypes-frontend", href: "https://github.com/PrintfCow/eletypes-frontend" },
    owners: [{ name: "PrintfCow", github: "https://github.com/PrintfCow" }],
    status: "在线",
  },
];

const repositories = [
  { id: "R.01", name: "NeuroMex", type: "PYTHON / AI VIDEO", text: "AI 辅助视频剪辑项目，包含 NeuroMex 核心流程、PySide6 桌面 UI 与 NeuroPR 前端原型。", href: "https://github.com/Nightmizus/NeuroMex" },
  { id: "R.02", name: "AnimeFaceCrop", type: "PYTHON / COMPUTER VISION", text: "从长视频中提取动漫或真人角色的正面与侧面头像裁剪。", href: "https://github.com/Nightmizus/AnimeFaceCrop" },
  { id: "R.03", name: "mio-core", type: "PYTHON / SERVICE", text: "Mio 音乐目录代理、私聊与受控 Faircamp 发布服务。", href: "https://github.com/Nightmizus/mio-core" },
  { id: "R.04", name: "twinject-rev", type: "C++ / WINDOWS", text: "面向 Windows 东方 Project 的自动游玩注入器续作，补齐多作支持并加入一键启动界面。", href: "https://github.com/Nightmizus/twinject-rev" },
  { id: "R.05", name: "geoguessr-map", type: "HTML / WEB", text: "按国家与地理线索整理 GeoGuessr 学习资料的交互式世界地图，支持纯静态部署。", href: "https://github.com/Nightmizus/geoguessr-map" },
  { id: "R.06", name: "MizuLauncherAura", type: "C# / DESKTOP", text: "MizuLauncher 的 Aura 版本，探索 AI 驱动的 Minecraft 启动器体验。", href: "https://github.com/Nightmizus/MizuLauncherAura" },
  { id: "R.07", name: "MizuLauncher", type: "C# / DESKTOP", text: "采用现代界面设计的 Minecraft 启动器，也是 MizuLauncher 系列的基础版本。", href: "https://github.com/Nightmizus/MizuLauncher" },
  { id: "R.08", name: "musicmizu", type: "WEB / MUSIC", text: "Music Mizu 的社区平台仓库，让用户可以自由上传、浏览与分享音乐。", href: "https://github.com/shizwd/musicmizu" },
];

const friendLinks = [
  { name: "Groovin", url: "groovin.cn", href: "https://groovin.cn" },
  { name: "映界Echomirix", url: "echomirix.top", href: "https://echomirix.top" },
];

function FrameHandles() {
  return <><i className="handle tl" /><i className="handle tr" /><i className="handle bl" /><i className="handle br" /><i className="handle tm" /><i className="handle bm" /></>;
}

export default function Home() {
  const [openContact, setOpenContact] = useState<string | null>(null);

  return (
    <main>
      <header className="nav-shell">
        <a className="wordmark" href="#top" aria-label="返回顶部">
          <Image className="brand-avatar" src="/mizu-avatar.jpg" alt="水澄Mizu" width={34} height={34} priority />
          <strong>水澄Mizu的个人主页</strong>
        </a>
        <nav aria-label="主导航">
          <a href="#websites">网站</a>
          <a href="#repositories">GitHub</a>
        </nav>
        <div className="nav-actions">
          <span className="lang">CN</span>
          <a className="console-button" href="https://github.com/Nightmizus/Nightmizus.github.io" target="_blank" rel="noreferrer">本站仓库 <span>↗</span></a>
        </div>
      </header>

      <section className="hero technical-grid" id="top" aria-labelledby="hero-title">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="terminal-label">[ 创作 · 开发 ]</p>
            <h1 id="hero-title"><span>水澄Mizu的</span><span>个人主页</span></h1>
            <div className="hero-transform" aria-label="将想法变为网页，将创意变为视频，将工具变为APP，将灵感变为现实">
              <div className="transform-sentence" aria-hidden="true">
                <span className="transform-connector">将</span>
                <span className="transform-slot left">
                  <strong className="transform-word">想法</strong>
                  <strong className="transform-word">创意</strong>
                  <strong className="transform-word">工具</strong>
                  <strong className="transform-word">灵感</strong>
                </span>
                <span className="transform-connector">变为</span>
                <span className="transform-slot right">
                  <strong className="transform-word">网页</strong>
                  <strong className="transform-word">视频</strong>
                  <strong className="transform-word">APP</strong>
                  <strong className="transform-word">现实</strong>
                </span>
              </div>
            </div>
            <p className="hero-description">一些有意思的网站及项目的导航，也是Mizusumi大部分创意的集锦</p>
            <div className="hero-buttons">
              <a className="button primary" href="#websites">浏览作品 <span>→</span></a>
            </div>
          </div>

          <div className="contact-frame">
            <FrameHandles />
            <div className="frame-toolbar">
              <div className="contact-owner">
                <Image src="/mizu-avatar.jpg" alt="水澄Mizu的头像" width={68} height={68} priority />
                <strong>水澄Mizu</strong>
              </div>
              <span>CONTACT_CHANNELS</span>
            </div>
            <div className="contact-stack">
              {contacts.map((item) => {
                const isOpen = openContact === item.label;

                return (
                  <div className={`contact-row${isOpen ? " is-open" : ""}`} key={item.label}>
                    <button
                      className="contact-summary"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`contact-panel-${item.id}`}
                      id={`contact-trigger-${item.id}`}
                      onClick={() => setOpenContact(isOpen ? null : item.label)}
                    >
                      <span className="row-id">{item.id}</span>
                      <span className="contact-label"><i className="platform-icon" aria-hidden="true">{item.icon}</i><strong>{item.label}</strong></span>
                      <span className="row-plus" aria-hidden="true">+</span>
                    </button>
                    <div
                      className="contact-panel"
                      id={`contact-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`contact-trigger-${item.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="row-detail">
                        {item.avatar && item.nickname && item.identifier ? (
                          item.href ? (
                            <a className="contact-profile" href={item.href} target="_blank" rel="noreferrer">
                              <Image src={item.avatar} alt={`${item.nickname}的头像`} width={48} height={48} />
                              <span><strong>{item.nickname}</strong><small>{item.identifier}</small></span>
                              <b aria-hidden="true">↗</b>
                            </a>
                          ) : (
                            <div className="contact-profile">
                              <Image src={item.avatar} alt={`${item.nickname}的头像`} width={48} height={48} />
                              <span><strong>{item.nickname}</strong><small>{item.identifier}</small></span>
                            </div>
                          )
                        ) : (
                          <div className="email-detail">
                            <a href={item.href}>{item.value} <span>↗</span></a>
                            <small>{item.note}</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </section>

      <section className="websites technical-grid" id="websites" aria-labelledby="websites-title">
        <div className="section-heading">
          <p className="terminal-label">[ S1 · 网站导航 ]</p>
          <h2 id="websites-title">正在运行的<br /><span>数字空间。</span></h2>
        </div>

        <div className="site-table" role="table" aria-label="水澄Mizu的网站">
          <div className="table-row table-head" role="row">
            <span role="columnheader">名称</span>
            <span role="columnheader">网址</span>
            <span role="columnheader">简介</span>
            <span role="columnheader">GitHub仓库</span>
            <span role="columnheader">开发与维护</span>
            <span role="columnheader">状态</span>
          </div>
          {websites.map((site, index) => (
            <div className="table-row site-row" role="row" key={site.name}>
              <span role="cell" data-label="名称"><i>{String(index + 1).padStart(2, "0")}</i><a className="site-name" href={site.href} target="_blank" rel="noreferrer"><strong>{site.name}</strong></a></span>
              <span role="cell" data-label="网址"><a className="site-url" href={site.href} target="_blank" rel="noreferrer"><code>{site.url}</code><b>↗</b></a></span>
              <span role="cell" data-label="简介"><small className="site-description">{site.description}</small></span>
              <span role="cell" data-label="GitHub仓库">
                {site.repository ? <a className="repo-link" href={site.repository.href} target="_blank" rel="noreferrer">{site.repository.label}<b>↗</b></a> : <small className="repo-unavailable">未公开</small>}
              </span>
              <span role="cell" data-label="开发与维护">
                <span className="owner-list">
                  {site.owners.map((owner) => (
                    <a className="owner-link" href={owner.github} target="_blank" rel="noreferrer" key={owner.name}>
                      <span>{owner.name}</span>
                      {owner.role ? <small className="owner-tag">{owner.role}</small> : null}
                    </a>
                  ))}
                </span>
              </span>
              <span role="cell" data-label="状态"><em><i />{site.status}</em></span>
            </div>
          ))}
        </div>
      </section>

      <section className="projects technical-grid" id="repositories" aria-labelledby="repositories-title">
        <div className="section-heading compact">
          <p className="terminal-label">[ S2 · GITHUB 仓库 ]</p>
          <h2 id="repositories-title">公开代码与<br /><span>持续实验。</span></h2>
        </div>
        <div className="project-grid">
          {repositories.map((project) => (
            <a className="project-card" href={project.href} target="_blank" rel="noreferrer" key={project.name}>
              <FrameHandles />
              <span className="project-id">{project.id}</span>
              <div className="project-visual" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
              <p>{project.type}</p>
              <h3>{project.name}</h3>
              <small>{project.text}</small>
              <b>查看仓库 <span>↗</span></b>
            </a>
          ))}
        </div>
      </section>

      <section className="friends technical-grid" id="friends" aria-labelledby="friends-title">
        <div className="friends-heading">
          <p className="terminal-label">[ S3 · 友链 ]</p>
          <h2 id="friends-title">友链</h2>
        </div>
        <div className="friends-table" role="table" aria-label="友情链接">
          {friendLinks.map((friend) => (
            <a className="friend-row" href={friend.href} target="_blank" rel="noreferrer" role="row" key={friend.name}>
              <strong role="cell">{friend.name}</strong>
              <code role="cell">{friend.url}</code>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <div className="site-end"><span>© 2026 水澄Mizu</span><a href="#top">返回顶部 ↑</a></div>
    </main>
  );
}
