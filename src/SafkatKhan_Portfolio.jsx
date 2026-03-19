import { useState, useEffect, useRef } from "react";
import safkatPhoto from "./assets/safkat.jpg";

const BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root[data-theme="dark"] {
    --gold: #c9a84c; --gold-light: #e8c97a;
    --gold-dim: rgba(201,168,76,.13); --gold-dim2: rgba(201,168,76,.22);
    --bg: #0d0d0d; --bg2: #141414; --bg3: #1a1a1a;
    --bg-glass: rgba(13,13,13,.84); --text: #f0ece4; --muted: #8a8070;
    --border: rgba(201,168,76,.18); --border2: rgba(201,168,76,.06);
    --shadow: rgba(0,0,0,.55); --input-bg: #141414; --ph: #3a3530;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
    --tt: background .35s ease, color .35s ease, border-color .35s ease;
  }

  :root[data-theme="light"] {
    --gold: #a07c28; --gold-light: #c9a44a;
    --gold-dim: rgba(160,124,40,.10); --gold-dim2: rgba(160,124,40,.18);
    --bg: #faf8f4; --bg2: #f2ede4; --bg3: #e8e0d2;
    --bg-glass: rgba(250,248,244,.90); --text: #1a1610; --muted: #7a6e5e;
    --border: rgba(160,124,40,.22); --border2: rgba(160,124,40,.08);
    --shadow: rgba(100,80,30,.12); --input-bg: #f2ede4; --ph: #b0a898;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
    --tt: background .35s ease, color .35s ease, border-color .35s ease;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); overflow-x: hidden; transition: var(--tt); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 4rem; background: var(--bg-glass); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border); transition: padding .3s, background .35s;
  }
  .nav.scrolled { padding: .75rem 4rem; }
  .nav-logo { font-family: var(--serif); font-size: 1.5rem; font-weight: 600; color: var(--gold); letter-spacing: .04em; text-decoration: none; transition: opacity .2s; }
  .nav-logo:hover { opacity: .8; }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a { font-size: .75rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color .2s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: var(--gold); transition: width .3s; }
  .nav-links a:hover { color: var(--gold); }
  .nav-links a:hover::after { width: 100%; }
  .nav-right { display: flex; align-items: center; gap: 1rem; }
  .nav-cta { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--bg); background: var(--gold); border: none; border-radius: 2px; padding: .6rem 1.4rem; cursor: pointer; transition: background .2s, transform .15s; text-decoration: none; }
  .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

  .theme-toggle { width: 44px; height: 24px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg3); cursor: pointer; position: relative; transition: background .3s; flex-shrink: 0; outline: none; }
  .theme-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--gold); transition: transform .3s; }
  [data-theme="light"] .theme-toggle::after { transform: translateX(20px); }

  .hamburger { display: none; background: none; border: none; cursor: pointer; color: var(--text); font-size: 1.4rem; }

  .mobile-menu { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: var(--bg); z-index: 99; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; opacity: 0; pointer-events: none; transition: opacity .3s; }
  .mobile-menu.open { opacity: 1; pointer-events: all; }
  .mobile-menu a { font-family: var(--serif); font-size: 2.5rem; font-weight: 300; font-style: italic; color: var(--text); text-decoration: none; transition: color .2s; }
  .mobile-menu a:hover { color: var(--gold); }
  .mobile-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: var(--muted); font-size: 1.5rem; cursor: pointer; }

  .scroll-top { position: fixed; bottom: 2rem; right: 2rem; z-index: 150; width: 46px; height: 46px; border-radius: 4px; background: var(--gold); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 24px rgba(201,168,76,.35); opacity: 0; transform: translateY(16px) scale(.9); transition: opacity .4s cubic-bezier(.34,1.56,.64,1), transform .4s cubic-bezier(.34,1.56,.64,1), background .2s; pointer-events: none; }
  .scroll-top.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
  .scroll-top:hover { background: var(--gold-light); transform: translateY(-3px) scale(1.06); }
  .scroll-top svg { width: 18px; height: 18px; fill: none; stroke: #0d0d0d; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

  .hero { min-height: 100vh; display: flex; align-items: center; padding: 8rem 4rem 4rem; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 70% 60% at 80% 50%, rgba(201,168,76,.06) 0%, transparent 70%); }
  [data-theme="light"] .hero-bg { background: radial-gradient(ellipse 70% 60% at 80% 50%, rgba(160,124,40,.06) 0%, transparent 70%); }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px); background-size: 80px 80px; opacity: .6; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%); }
  .hero-orb { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, var(--gold-dim) 0%, transparent 70%); will-change: transform; }
  .hero-orb-1 { width: 500px; height: 500px; top: -100px; right: -100px; animation: orb-drift-1 12s ease-in-out infinite; }
  .hero-orb-2 { width: 300px; height: 300px; bottom: 50px; left: 20%; animation: orb-drift-2 9s ease-in-out infinite; }
  @keyframes orb-drift-1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,20px) scale(1.05)} }
  @keyframes orb-drift-2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-25px) scale(.95)} }
  .hero-content { position: relative; z-index: 2; max-width: 820px; }

  @keyframes online-pulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.55)} 60%{box-shadow:0 0 0 10px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }

  .hero-status-badge { display: inline-flex; align-items: center; gap: .55rem; border-radius: 100px; padding: .35rem .9rem .35rem .6rem; margin-left: .4rem; transition: background .5s, border-color .5s; }
  .hero-status-badge.is-online { background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.25); }
  .hero-status-badge.is-offline { background: rgba(138,128,112,.08); border: 1px solid rgba(138,128,112,.22); }
  .hero-status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; transition: background .5s, box-shadow .5s; }
  .hero-status-badge.is-online .hero-status-dot { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.8); animation: status-blink 2.4s ease-in-out infinite; }
  .hero-status-badge.is-offline .hero-status-dot { background: var(--muted); box-shadow: none; }
  @keyframes status-blink { 0%,100%{opacity:1;box-shadow:0 0 6px rgba(34,197,94,.8)} 50%{opacity:.6;box-shadow:0 0 2px rgba(34,197,94,.3)} }
  .hero-status-text { font-size: .62rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; transition: color .5s; }
  .hero-status-badge.is-online .hero-status-text { color: #22c55e; }
  .hero-status-badge.is-offline .hero-status-text { color: var(--muted); }

  .hero-animate { opacity: 0; transform: translateY(30px); animation: hero-in .8s cubic-bezier(.22,1,.36,1) forwards; will-change: transform, opacity; }
  @keyframes hero-in { to { opacity: 1; transform: translateY(0); } }

  .hero-eyebrow { font-size: .68rem; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.5rem; display: flex; align-items: center; gap: .8rem; flex-wrap: wrap; }
  .hero-eyebrow::before { content: ''; width: 40px; height: 1px; background: var(--gold); flex-shrink: 0; }
  .hero-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse-dot 2s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 var(--gold-dim2)} 50%{box-shadow:0 0 0 7px transparent} }
  .hero-name { font-family: var(--serif); font-size: clamp(3.5rem,8vw,7rem); font-weight: 300; line-height: 1.04; color: var(--text); letter-spacing: -.01em; }
  .hero-name em { font-style: italic; color: var(--gold); }
  .hero-tagline { font-family: var(--serif); font-size: clamp(1.1rem,2.5vw,1.6rem); font-weight: 300; font-style: italic; color: var(--muted); margin-top: 1.2rem; line-height: 1.6; }
  .hero-desc { font-size: .92rem; color: var(--muted); line-height: 1.85; max-width: 480px; margin-top: 1.5rem; }
  .hero-actions { display: flex; gap: 1.2rem; margin-top: 2.8rem; flex-wrap: wrap; }

  .btn-primary { font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--bg); background: var(--gold); border: none; border-radius: 2px; padding: .88rem 2rem; cursor: pointer; transition: all .22s; text-decoration: none; display: inline-flex; align-items: center; gap: .5rem; position: relative; overflow: hidden; }
  .btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.18) 50%, transparent 70%); transform: translateX(-100%); transition: transform .5s; }
  .btn-primary:hover::before { transform: translateX(100%); }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,.3); }
  .btn-ghost { font-size: .78rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: none; border: 1px solid var(--border); border-radius: 2px; padding: .88rem 2rem; cursor: pointer; transition: all .22s; text-decoration: none; display: inline-flex; align-items: center; gap: .5rem; }
  .btn-ghost:hover { color: var(--gold); border-color: var(--gold); transform: translateY(-2px); }

  .hero-scroll { position: absolute; bottom: 2.5rem; left: 4rem; font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: .8rem; writing-mode: vertical-lr; animation: float 3s ease-in-out infinite; }
  .hero-scroll::after { content: ''; width: 1px; height: 60px; background: linear-gradient(to bottom, var(--gold), transparent); }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

  .section { padding: 7rem 4rem; position: relative; transition: var(--tt); }
  .section-label { font-size: .63rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; display: flex; align-items: center; gap: .8rem; }
  .section-label::before { content: ''; width: 30px; height: 1px; background: var(--gold); }
  .section-title { font-family: var(--serif); font-size: clamp(2.5rem,5vw,4rem); font-weight: 300; line-height: 1.1; color: var(--text); }
  .section-title em { font-style: italic; color: var(--gold); }
  .divider { width: 60px; height: 1px; background: var(--gold); margin: 2rem 0; }

  .fade-in { opacity: 0; transform: translateY(32px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); will-change: transform, opacity; }
  .fade-in.visible { opacity: 1; transform: translateY(0); will-change: auto; }
  .fade-left { opacity: 0; transform: translateX(-40px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); will-change: transform, opacity; }
  .fade-left.visible { opacity: 1; transform: translateX(0); will-change: auto; }
  .fade-right { opacity: 0; transform: translateX(40px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); will-change: transform, opacity; }
  .fade-right.visible { opacity: 1; transform: translateX(0); will-change: auto; }
  .scale-in { opacity: 0; transform: scale(.92); transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); will-change: transform, opacity; }
  .scale-in.visible { opacity: 1; transform: scale(1); will-change: auto; }

  .about { background: var(--bg2); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; max-width: 1200px; margin: 0 auto; }

  .about-visual { position: relative; display: flex; flex-direction: column; align-items: center; }
  .about-frame-wrap { position: relative; width: 88%; }
  .about-frame-wrap::before { content: ''; position: absolute; inset: -12px -12px 12px 12px; border: 1.5px solid var(--gold-dim2); border-radius: 6px; z-index: 0; transition: border-color .3s; }
  .about-frame-wrap:hover::before { border-color: rgba(201,168,76,.32); }
  .about-frame-wrap::after { content: ''; position: absolute; top: -6px; left: -6px; width: 28px; height: 28px; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); border-radius: 2px 0 0 0; z-index: 3; transition: width .3s, height .3s; }
  .about-frame-wrap:hover::after { width: 38px; height: 38px; }
  .about-corner-br { position: absolute; bottom: -6px; right: -6px; width: 28px; height: 28px; border-bottom: 2px solid var(--gold); border-right: 2px solid var(--gold); border-radius: 0 0 2px 0; z-index: 3; pointer-events: none; transition: width .3s, height .3s; }
  .about-frame-wrap:hover .about-corner-br { width: 38px; height: 38px; }

  .about-frame { width: 100%; aspect-ratio: 3/4; border: 1px solid var(--border); border-radius: 4px; display: flex; align-items: center; justify-content: center; background: var(--bg3); position: relative; overflow: hidden; transition: border-color .35s, box-shadow .35s; z-index: 1; }
  .about-frame-wrap:hover .about-frame { border-color: rgba(201,168,76,.4); box-shadow: 0 24px 64px rgba(0,0,0,.45); }
  .about-frame::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 40% at 20% 10%, var(--gold-dim), transparent 65%); pointer-events: none; z-index: 2; }
  .about-frame::after { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 30%, rgba(201,168,76,.09) 50%, transparent 70%); transform: translateX(-110%); transition: transform .75s ease; pointer-events: none; z-index: 3; }
  .about-frame-wrap:hover .about-frame::after { transform: translateX(110%); }

  .about-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; border-radius: 3px; transition: transform .6s cubic-bezier(.22,1,.36,1); z-index: 1; }
  .about-frame-wrap:hover .about-photo { transform: scale(1.03); }
  .about-photo-vignette { position: absolute; bottom: 0; left: 0; right: 0; height: 35%; background: linear-gradient(to top, rgba(13,13,13,.55) 0%, transparent 100%); z-index: 2; pointer-events: none; border-radius: 0 0 3px 3px; }
  [data-theme="light"] .about-photo-vignette { background: linear-gradient(to top, rgba(26,22,16,.25) 0%, transparent 100%); }

  .about-exp-chip { position: absolute; top: -14px; left: -14px; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 50%; background: var(--gold); border: 3px solid var(--bg2); box-shadow: 0 6px 24px rgba(201,168,76,.35); transition: transform .35s cubic-bezier(.34,1.56,.64,1); }
  .about-frame-wrap:hover .about-exp-chip { transform: scale(1.08) rotate(-4deg); }
  .about-exp-chip-num { font-family: var(--serif); font-size: 1.4rem; font-weight: 700; color: var(--bg); line-height: 1; }
  .about-exp-chip-label { font-size: .44rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--bg); opacity: .8; line-height: 1.2; text-align: center; margin-top: .1rem; }

  .about-online-indicator { position: absolute; bottom: -14px; right: -14px; z-index: 10; display: flex; align-items: center; gap: .5rem; background: var(--bg); border: 1px solid var(--border); border-radius: 100px; padding: .38rem .9rem .38rem .6rem; box-shadow: 0 6px 24px var(--shadow); transition: border-color .4s; }
  .about-online-indicator.is-online { border-color: rgba(34,197,94,.28); }
  .about-online-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; transition: background .5s, box-shadow .5s; }
  .about-online-indicator.is-online .about-online-dot { background: #22c55e; box-shadow: 0 0 8px rgba(34,197,94,.9); animation: online-pulse 2.4s ease-out infinite; }
  .about-online-indicator.is-offline .about-online-dot { background: var(--muted); box-shadow: none; }
  .about-online-text { font-size: .6rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; transition: color .5s; }
  .about-online-indicator.is-online .about-online-text { color: #22c55e; }
  .about-online-indicator.is-offline .about-online-text { color: var(--muted); }

  .about-tag { position: absolute; top: 20%; right: -5%; background: var(--gold); color: var(--bg); font-size: .6rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; padding: .5rem .9rem; border-radius: 2px; writing-mode: vertical-lr; transform: rotate(180deg); white-space: nowrap; z-index: 4; }

  .about-identity { margin-top: 2rem; text-align: center; width: 88%; padding: 1.2rem; border: 1px solid var(--border); border-radius: 4px; background: var(--bg); transition: var(--tt); position: relative; overflow: hidden; }
  .about-identity::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .about-identity-name { font-family: var(--serif); font-size: 1.45rem; font-weight: 600; color: var(--text); letter-spacing: .02em; }
  .about-identity-role { font-size: .68rem; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); margin-top: .45rem; }

  .about-text p { font-size: .93rem; color: var(--muted); line-height: 1.9; margin-bottom: 1.4rem; }
  .about-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-top: 2.5rem; }
  .stat-card { border: 1px solid var(--border); border-radius: 4px; padding: 1.5rem 1rem; text-align: center; background: var(--bg); transition: border-color .22s, transform .22s, box-shadow .22s; }
  .stat-card:hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: 0 12px 30px var(--shadow); }
  .stat-num { font-family: var(--serif); font-size: 2.2rem; font-weight: 600; color: var(--gold); }
  .stat-label { font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-top: .3rem; }

  .skills { background: var(--bg); }
  .skills-inner { max-width: 1100px; margin: 0 auto; }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px,1fr)); gap: 1.5rem; margin-top: 3.5rem; }
  .skill-category { border: 1px solid var(--border); border-radius: 4px; padding: 2rem; background: var(--bg2); transition: border-color .25s, transform .28s, box-shadow .28s; position: relative; overflow: hidden; }
  .skill-category::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 0; background: var(--gold); transition: height .4s; }
  .skill-category:hover { border-color: var(--gold-dim2); transform: translateY(-5px); box-shadow: 0 16px 40px var(--shadow); }
  .skill-category:hover::before { height: 100%; }
  .skill-cat-icon { font-size: 1.8rem; margin-bottom: 1rem; transition: transform .3s; }
  .skill-category:hover .skill-cat-icon { transform: scale(1.15) rotate(-5deg); }
  .skill-cat-title { font-family: var(--serif); font-size: 1.25rem; font-weight: 600; color: var(--text); margin-bottom: 1.2rem; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: .5rem; }
  .skill-tag { font-size: .68rem; font-weight: 500; letter-spacing: .07em; color: var(--muted); background: var(--bg3); border: 1px solid var(--border); border-radius: 2px; padding: .32rem .72rem; transition: all .2s; cursor: default; }
  .skill-tag:hover { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); transform: translateY(-1px); }

  .projects { background: var(--bg2); }
  .projects-inner { max-width: 1200px; margin: 0 auto; }
  .projects-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3.5rem; flex-wrap: wrap; gap: 1.5rem; }
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px,1fr)); gap: 2rem; }
  .project-card { border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: var(--bg); transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .35s; cursor: pointer; display: flex; flex-direction: column; }
  .project-card:hover { transform: translateY(-8px); border-color: rgba(201,168,76,.45); box-shadow: 0 28px 60px var(--shadow), 0 0 0 1px var(--gold-dim); }
  .project-thumb { height: 200px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .project-thumb::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 40%, rgba(201,168,76,.12) 60%, transparent 80%); transform: translateX(-100%) translateY(-100%); transition: transform .6s ease; }
  .project-card:hover .project-thumb::after { transform: translateX(100%) translateY(100%); }
  .project-thumb-emoji { font-size: 3.5rem; position: relative; z-index: 1; transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
  .project-card:hover .project-thumb-emoji { transform: scale(1.18) translateY(-4px); }
  .project-thumb-overlay { position: absolute; inset: 0; opacity: 0; background: var(--gold-dim); transition: opacity .3s; display: flex; align-items: center; justify-content: center; }
  .project-card:hover .project-thumb-overlay { opacity: 1; }
  .project-thumb-bar { position: absolute; bottom: 0; left: 0; height: 2px; background: var(--gold); width: 0; transition: width .5s cubic-bezier(.22,1,.36,1); }
  .project-card:hover .project-thumb-bar { width: 100%; }
  .project-body { padding: 1.8rem; flex: 1; display: flex; flex-direction: column; }
  .project-num { font-size: .62rem; letter-spacing: .22em; color: var(--gold); font-weight: 700; text-transform: uppercase; margin-bottom: .6rem; }
  .project-title { font-family: var(--serif); font-size: 1.35rem; font-weight: 600; color: var(--text); margin-bottom: .8rem; transition: color .2s; }
  .project-card:hover .project-title { color: var(--gold-light); }
  .project-desc { font-size: .84rem; color: var(--muted); line-height: 1.75; margin-bottom: 1.3rem; flex: 1; }
  .project-stack { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1.3rem; }
  .project-tag { font-size: .62rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gold); background: var(--gold-dim); border-radius: 2px; padding: .25rem .6rem; transition: background .2s; }
  .project-tag:hover { background: var(--gold-dim2); }
  .project-link { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); text-decoration: none; display: inline-flex; align-items: center; gap: .4rem; transition: gap .25s; margin-top: auto; }
  .project-link:hover { gap: .85rem; }

  .view-more-btn { display: inline-flex; align-items: center; gap: .7rem; font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--gold); background: none; border: 1px solid var(--gold); border-radius: 2px; padding: .82rem 1.8rem; cursor: pointer; text-decoration: none; transition: all .25s; position: relative; overflow: hidden; }
  .view-more-btn::before { content: ''; position: absolute; inset: 0; background: var(--gold); transform: translateX(-101%); transition: transform .3s ease; }
  .view-more-btn span { position: relative; z-index: 1; }
  .view-more-btn:hover::before { transform: translateX(0); }
  .view-more-btn:hover { color: var(--bg); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,.25); }

  .blog { background: var(--bg); }
  .blog-inner { max-width: 1200px; margin: 0 auto; }
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px,1fr)); gap: 2rem; margin-top: 3.5rem; }
  .blog-card { border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: var(--bg2); transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .35s; display: flex; flex-direction: column; }
  .blog-card:hover { transform: translateY(-6px); border-color: var(--gold-dim2); box-shadow: 0 20px 50px var(--shadow); }
  .blog-card-top { height: 160px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; font-size: 4rem; }
  .blog-card-top-emoji { position: relative; z-index: 1; transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
  .blog-card:hover .blog-card-top-emoji { transform: scale(1.15) translateY(-4px); }
  .blog-card-top::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,.18) 100%); }
  .blog-card-category { position: absolute; top: .9rem; left: .9rem; z-index: 2; font-size: .6rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--bg); background: var(--gold); border-radius: 2px; padding: .28rem .7rem; }
  .blog-body { padding: 1.6rem; flex: 1; display: flex; flex-direction: column; }
  .blog-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: .9rem; font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
  .blog-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--gold); }
  .blog-title { font-family: var(--serif); font-size: 1.3rem; font-weight: 600; color: var(--text); margin-bottom: .75rem; line-height: 1.3; transition: color .2s; }
  .blog-card:hover .blog-title { color: var(--gold-light); }
  .blog-excerpt { font-size: .83rem; color: var(--muted); line-height: 1.75; margin-bottom: 1.3rem; flex: 1; }
  .blog-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .blog-read-time { font-size: .68rem; letter-spacing: .08em; color: var(--muted); }
  .blog-link { font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); text-decoration: none; display: inline-flex; align-items: center; gap: .35rem; transition: gap .25s; }
  .blog-link:hover { gap: .7rem; }

  .experience { background: var(--bg); }
  .experience-inner { max-width: 900px; margin: 0 auto; }
  .exp-timeline { position: relative; margin-top: 4rem; padding-left: 2rem; }
  .exp-timeline::before { content: ''; position: absolute; left: 0; top: 8px; width: 1px; bottom: 8px; background: linear-gradient(to bottom, var(--gold), var(--gold-dim), transparent); }
  .exp-entry { position: relative; padding: 0 0 3.5rem 2.8rem; }
  .exp-entry:last-child { padding-bottom: 0; }
  .exp-dot { position: absolute; left: -8px; top: 6px; width: 16px; height: 16px; border-radius: 50%; background: var(--bg); border: 2px solid var(--gold); transition: background .3s, transform .3s, box-shadow .3s; z-index: 1; }
  .exp-entry:hover .exp-dot { background: var(--gold); transform: scale(1.25); box-shadow: 0 0 0 5px var(--gold-dim); }
  .exp-card { border: 1px solid var(--border); border-radius: 4px; background: var(--bg2); padding: 2rem 2.2rem; transition: border-color .3s, transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s; position: relative; overflow: hidden; }
  .exp-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--gold); transform: scaleY(0); transform-origin: top; transition: transform .4s cubic-bezier(.22,1,.36,1); }
  .exp-entry:hover .exp-card { border-color: var(--gold-dim2); transform: translateX(6px); box-shadow: 0 16px 48px var(--shadow); }
  .exp-entry:hover .exp-card::before { transform: scaleY(1); }
  .exp-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .exp-title-block { flex: 1; min-width: 0; }
  .exp-role { font-family: var(--serif); font-size: 1.3rem; font-weight: 600; color: var(--text); line-height: 1.2; margin-bottom: .35rem; transition: color .2s; }
  .exp-entry:hover .exp-role { color: var(--gold-light); }
  .exp-company { font-size: .78rem; font-weight: 600; letter-spacing: .08em; color: var(--gold); text-transform: uppercase; }
  .exp-meta { display: flex; flex-direction: column; align-items: flex-end; gap: .45rem; flex-shrink: 0; }
  .exp-date { font-size: .7rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
  .exp-type { font-size: .6rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--bg); background: var(--gold); border-radius: 2px; padding: .2rem .65rem; }
  .exp-divider { width: 40px; height: 1px; background: var(--border); margin: 1rem 0; transition: width .4s, background .3s; }
  .exp-entry:hover .exp-divider { width: 70px; background: var(--gold); }
  .exp-desc { font-size: .88rem; color: var(--muted); line-height: 1.85; margin-bottom: 1.3rem; }
  .exp-achievements { display: flex; flex-direction: column; gap: .65rem; }
  .exp-achievement { display: flex; align-items: flex-start; gap: .75rem; font-size: .84rem; color: var(--muted); line-height: 1.65; }
  .exp-achievement-bullet { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0; margin-top: .55rem; transition: transform .2s; }
  .exp-entry:hover .exp-achievement-bullet { transform: scale(1.4); }
  .exp-tags { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: 1.4rem; }
  .exp-tag { font-size: .62rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); background: var(--bg3); border: 1px solid var(--border); border-radius: 2px; padding: .22rem .6rem; transition: color .2s, border-color .2s, background .2s; }
  .exp-entry:hover .exp-tag { color: var(--gold); border-color: var(--gold-dim2); background: var(--gold-dim); }

  .contact { background: var(--bg2); }
  .contact-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start; }
  .contact-info p { font-size: .93rem; color: var(--muted); line-height: 1.9; margin: 1.2rem 0 2.5rem; }
  .contact-details { display: flex; flex-direction: column; gap: 1.2rem; }
  .contact-item { display: flex; align-items: center; gap: 1rem; font-size: .84rem; color: var(--muted); transition: color .22s; cursor: default; }
  .contact-item:hover { color: var(--gold); }
  .contact-icon { width: 38px; height: 38px; border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; transition: border-color .22s, background .22s, transform .22s; }
  .contact-item:hover .contact-icon { border-color: var(--gold); background: var(--gold-dim); transform: scale(1.1); }
  .contact-form { display: flex; flex-direction: column; gap: 1.2rem; }
  .form-group { display: flex; flex-direction: column; gap: .45rem; }
  .form-label { font-size: .67rem; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .form-input, .form-textarea { background: var(--input-bg); border: 1px solid var(--border); border-radius: 2px; color: var(--text); font-family: var(--sans); font-size: .88rem; padding: .82rem 1rem; width: 100%; transition: border-color .22s, box-shadow .22s; outline: none; resize: none; }
  .form-input:focus, .form-textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-dim); }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--ph); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .footer { padding: 2.5rem 4rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg); font-size: .73rem; color: var(--muted); flex-wrap: wrap; gap: 1rem; transition: var(--tt); }
  .footer-logo { font-family: var(--serif); font-size: 1.1rem; color: var(--gold); }
  .footer-links { display: flex; gap: 2rem; }
  .footer-links a { color: var(--muted); text-decoration: none; letter-spacing: .08em; transition: color .2s; }
  .footer-links a:hover { color: var(--gold); }

  .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(80px); z-index: 300; background: var(--bg3); border: 1px solid var(--border); border-radius: 4px; padding: 1rem 1.8rem; display: flex; align-items: center; gap: .75rem; font-size: .85rem; color: var(--text); box-shadow: 0 12px 40px var(--shadow); opacity: 0; transition: transform .4s cubic-bezier(.34,1.56,.64,1), opacity .3s; white-space: nowrap; }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .nav.scrolled { padding: .75rem 1.5rem; }
    .nav-links, .nav-cta { display: none; }
    .hamburger { display: block; }
    .hero { padding: 7rem 1.5rem 6rem; flex-direction: column; align-items: flex-start; }
    .hero-content { max-width: 100%; }
    .hero-scroll { left: 1.5rem; }
    .section { padding: 5rem 1.5rem; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .about-visual { max-width: 340px; margin: 0 auto; }
    .contact-inner { grid-template-columns: 1fr; gap: 3rem; }
    .footer { padding: 2rem 1.5rem; flex-direction: column; align-items: flex-start; }
    .form-row { grid-template-columns: 1fr; }
    .projects-header { flex-direction: column; align-items: flex-start; }
    .scroll-top { bottom: 1.5rem; right: 1.5rem; }
  }
  @media (max-width: 600px) {
    .projects-grid, .blog-grid { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: 1fr; }
    .about-stats { grid-template-columns: repeat(3,1fr); }
    .exp-header { flex-direction: column; gap: .8rem; }
    .exp-meta { align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
    .exp-timeline { padding-left: 1.2rem; }
    .exp-entry { padding-left: 2rem; }
  }
  @media (max-width: 400px) {
    .hero-name { font-size: clamp(2.8rem,12vw,3.5rem); }
    .about-stats { grid-template-columns: 1fr 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    .hero-animate, .fade-in, .fade-left, .fade-right, .scale-in { opacity: 1 !important; transform: none !important; }
  }
`;

const PROJECTS = [
  { id:1, emoji:"🧠", bg:"linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)", title:"NeuroBrief – AI Document Summarizer", desc:"A GPT-4-powered web app that condenses lengthy PDFs, research papers, and articles into structured, actionable briefs in seconds. Reduced average document review time by ~70% in user testing, with a streaming response UI that keeps interactions feeling instant.", stack:["React","OpenAI API","Node.js","Tailwind CSS","Vercel"], link:"https://github.com/safkatkhan" },
  { id:2, emoji:"📊", bg:"linear-gradient(135deg,#1a1a1a 0%,#1e2a1e 100%)", title:"DataPulse – Real-Time Analytics Dashboard", desc:"A full-stack analytics platform with live data ingestion, interactive D3.js charts, CSV import/export, and configurable KPI widgets. Delivered a 3× improvement in reporting speed, enabling data-driven decisions for a fintech client tracking 50,000+ daily events.", stack:["React","D3.js","PostgreSQL","Express","WebSockets"], link:"https://github.com/safkatkhan" },
  { id:3, emoji:"🔐", bg:"linear-gradient(135deg,#1a1a2a 0%,#1e1e2e 100%)", title:"VaultPass – Encrypted Password Manager", desc:"A production-grade, end-to-end encrypted password manager with a companion browser extension, two-factor authentication, and zero-knowledge architecture. Achieved a perfect score in a third-party penetration test and onboarded 300+ beta users within two weeks.", stack:["React","Node.js","AES-256","MongoDB","Chrome Extension API"], link:"https://github.com/safkatkhan" },
  { id:4, emoji:"🛒", bg:"linear-gradient(135deg,#1a1208 0%,#2a1e08 100%)", title:"ShopNest – Multi-Vendor Marketplace", desc:"A scalable multi-vendor e-commerce platform built with Next.js and Stripe Connect, supporting independent seller storefronts and automated payouts. Processed 500+ daily transactions within its first month and achieved a Lighthouse score of 94 across all production pages.", stack:["Next.js","Stripe Connect","MongoDB","Tailwind CSS","Vercel"], link:"https://github.com/safkatkhan" },
  { id:5, emoji:"🩺", bg:"linear-gradient(135deg,#081a12 0%,#0e2a1a 100%)", title:"MediQueue – Healthcare Appointment System", desc:"A HIPAA-conscious appointment booking and queue management system for a network of private clinics, with real-time slot availability and automated SMS reminders. Reduced patient no-show rates by 35% and cut front-desk administrative workload by half.", stack:["React","Node.js","PostgreSQL","Twilio","Docker","AWS"], link:"https://github.com/safkatkhan" },
  { id:6, emoji:"💬", bg:"linear-gradient(135deg,#0d0818 0%,#1a0d2e 100%)", title:"SupportIQ – AI-Powered Help Desk", desc:"An intelligent customer support platform using GPT-4 and LangChain to auto-classify tickets, suggest responses to agents, and resolve routine queries autonomously. Reduced average ticket resolution time by 48% and deflected 30% of queries without human involvement.", stack:["React","LangChain","OpenAI API","Node.js","PostgreSQL","Webhooks"], link:"https://github.com/safkatkhan" },
];

const SKILLS_DATA = [
  { icon:"💻", title:"Frontend Development", desc:"Crafting pixel-perfect, responsive interfaces with React and Next.js. I use TypeScript for type safety and Tailwind CSS for rapid, consistent styling — always prioritising performance and accessibility in every layer of the UI.", tags:["React.js","Next.js","TypeScript","Tailwind CSS","HTML5","CSS3","Framer Motion"] },
  { icon:"⚙️", title:"Backend Development", desc:"Designing robust, scalable server-side systems using Node.js and Express. I architect REST and GraphQL APIs, model complex data in PostgreSQL and MongoDB, and write server logic that's clean, testable, and easy to extend as products grow.", tags:["Node.js","Express","REST APIs","GraphQL","PostgreSQL","MongoDB","Redis"] },
  { icon:"🤖", title:"AI & LLM Integration", desc:"Bridging cutting-edge AI models with real-world products. I integrate OpenAI, LangChain, and custom prompt pipelines into web apps — enabling intelligent search, document analysis, automated workflows, and conversational interfaces.", tags:["OpenAI API","LangChain","Prompt Engineering","RAG","Embeddings","Webhooks","OAuth 2.0"] },
  { icon:"🛠️", title:"DevOps & Tooling", desc:"Shipping confidently with modern DevOps practices baked in from day one. I containerise with Docker, manage deployments on AWS and Vercel, and maintain clean Git workflows that support fast-moving teams.", tags:["Git & GitHub","Docker","Vercel","AWS S3 / EC2","Postman","CI/CD","Agile / Scrum"] },
  { icon:"🔒", title:"Security & Authentication", desc:"Building software users can trust. I implement AES-256 client-side encryption, zero-knowledge architectures, OAuth 2.0 flows, JWT authentication, 2FA, and OWASP-guided input validation across every project.", tags:["AES-256 Encryption","JWT","OAuth 2.0","2FA / TOTP","OWASP","HTTPS / TLS","bcrypt"] },
  { icon:"📈", title:"Performance & SEO", desc:"Making apps fast, discoverable, and competitive on search engines. I audit Core Web Vitals, implement lazy loading, code splitting, and CDN strategies to consistently hit Lighthouse scores above 90.", tags:["Core Web Vitals","Lighthouse Auditing","Lazy Loading","Code Splitting","SSR / SSG","Structured Data","CDN Optimisation"] },
];

const BLOG_POSTS = [
  { id:1, emoji:"🤖", bg:"linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)", category:"AI Development", date:"May 12, 2025", readTime:"7 min read", title:"Building Production-Ready AI Features with the OpenAI API", excerpt:"Integrating GPT-4 into a real app is very different from a quick demo. This guide covers streaming responses, rate limiting, cost control, prompt versioning, and how to handle model errors so your users never see a broken experience." },
  { id:2, emoji:"⚡", bg:"linear-gradient(135deg,#1a1410 0%,#2a1e10 100%)", category:"Performance", date:"Apr 28, 2025", readTime:"5 min read", title:"React Performance: The Optimisations Most Developers Skip", excerpt:"Most React performance guides stop at useMemo. This one goes further — virtualised lists, granular bundle splitting, avoiding layout thrashing, and the exact Lighthouse audit workflow I use to push client sites from the 50s to the 90s." },
  { id:3, emoji:"🔐", bg:"linear-gradient(135deg,#0d1a0d 0%,#0e2a12 100%)", category:"Security", date:"Mar 15, 2025", readTime:"6 min read", title:"Zero-Knowledge Architecture: Build Apps That Can't Leak User Data", excerpt:"If your server can read your users' sensitive data, so can anyone who compromises it. This post walks through client-side AES-256 encryption, key derivation with PBKDF2, and how to implement it in a React + Node.js stack without sacrificing usability." },
];

const EXPERIENCE = [
  {
    id:1, role:"Senior Full-Stack Developer", company:"TechVenture BD", type:"Full-time", date:"Jan 2023 – Present",
    desc:"Lead engineer on a cross-functional team of 8, architecting and delivering SaaS products for fintech, healthtech, and e-commerce clients.",
    achievements:[
      "Redesigned the core API layer with GraphQL and Node.js, cutting response times by 42% and reducing server costs by 30%.",
      "Integrated OpenAI GPT-4 into two client platforms shipped to 10,000+ active users.",
    ],
    tags:["React","Node.js","GraphQL","TypeScript","OpenAI API","PostgreSQL","AWS"],
  },
  {
    id:2, role:"Full-Stack Developer", company:"Nexora Digital", type:"Full-time", date:"Aug 2021 – Dec 2022",
    desc:"End-to-end development of client web applications in an agile digital agency, working across product and client-facing projects.",
    achievements:[
      "Built a multi-vendor marketplace with Next.js and Stripe Connect, handling 500+ daily transactions within the first month.",
      "Improved Lighthouse scores from 58 to 91 across 6 production sites through lazy loading and CDN optimisation.",
    ],
    tags:["Next.js","React","Stripe","MongoDB","D3.js","Docker","Vercel"],
  },
];

function useInjectAssets() {
  useEffect(() => {
    if (!document.getElementById("pk-font-preconnect-1")) {
      const pc1 = document.createElement("link"); pc1.id = "pk-font-preconnect-1"; pc1.rel = "preconnect"; pc1.href = "https://fonts.googleapis.com"; document.head.appendChild(pc1);
      const pc2 = document.createElement("link"); pc2.id = "pk-font-preconnect-2"; pc2.rel = "preconnect"; pc2.href = "https://fonts.gstatic.com"; pc2.crossOrigin = "anonymous"; document.head.appendChild(pc2);
      const fl = document.createElement("link"); fl.id = "pk-fonts"; fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Monsieur+La+Doulaise&display=swap"; document.head.appendChild(fl);
    }
    if (!document.getElementById("pk-base-css")) {
      const s = document.createElement("style"); s.id = "pk-base-css"; s.textContent = BASE_CSS; document.head.appendChild(s);
    }
    if (!document.getElementById("pk-favicon")) {
      const fv = document.createElement("link"); fv.id = "pk-favicon"; fv.rel = "icon"; fv.type = "image/gif"; fv.href = "/FireElmoWhahahahGIF.gif"; document.head.appendChild(fv);
    }
  }, []);
}

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const elements = ref.current.querySelectorAll(".fade-in,.fade-left,.fade-right,.scale-in");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("visible");
      } else {
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, []);
  return ref;
}

const BD_OFFSET_MS = 6 * 60 * 60 * 1000;
const ONLINE_MINS  = 60;
const CYCLE_MINS   = 360;

function getBDTotalMinutes() {
  const d = new Date(Date.now() + BD_OFFSET_MS);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}
function getBDSeconds() {
  return new Date(Date.now() + BD_OFFSET_MS).getUTCSeconds();
}
function formatAgo(m) {
  if (m === 0) return "Online just now";
  if (m < 60) return `Online ${m} min ago`;
  const hh = Math.floor(m / 60), mm = m % 60;
  return mm === 0 ? `Online ${hh}h ago` : `Online ${hh}h ${mm}m ago`;
}
function computeOnlineStatus() {
  const mic = getBDTotalMinutes() % CYCLE_MINS;
  if (mic < ONLINE_MINS) return { isOnline: true, minutesAgo: 0, minsUntilFlip: ONLINE_MINS - mic, label: "Online" };
  const ago = mic - ONLINE_MINS;
  return { isOnline: false, minutesAgo: ago, minsUntilFlip: CYCLE_MINS - mic, label: formatAgo(ago) };
}
function useOnlineStatus() {
  const [status, setStatus] = useState(() => computeOnlineStatus());
  useEffect(() => {
    const tick = () => setStatus(computeOnlineStatus());
    const intervalId = setInterval(tick, 10_000);
    let timeoutId = null;
    function scheduleFlip() {
      const s = computeOnlineStatus();
      timeoutId = setTimeout(() => { tick(); scheduleFlip(); }, (s.minsUntilFlip * 60 - getBDSeconds()) * 1000 + 500);
    }
    scheduleFlip();
    return () => { clearInterval(intervalId); clearTimeout(timeoutId); };
  }, []);
  return status;
}

function Toast({ message, icon, show }) {
  return (
    <div className={`toast${show ? " show" : ""}`}>
      <span style={{ fontSize:"1.1rem" }}>{icon}</span>{message}
    </div>
  );
}

export default function Portfolio() {
  useInjectAssets();
  const onlineStatus = useOnlineStatus();
  const [theme,     setTheme]     = useState("dark");
  const [scrolled,  setScrolled]  = useState(false);
  const [showTop,   setShowTop]   = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData,  setFormData]  = useState({ name:"", email:"", subject:"", message:"" });
  const [toast,     setToast]     = useState({ show:false, message:"", icon:"✅" });

  const aboutRef   = useFadeIn();
  const skillsRef  = useFadeIn();
  const projRef    = useFadeIn();
  const blogRef    = useFadeIn();
  const expRef     = useFadeIn();
  const contactRef = useFadeIn();

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        setShowTop(window.scrollY > 400);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (rafId) cancelAnimationFrame(rafId); };
  }, []);

  const showToast = (msg, icon="✅") => {
    setToast({ show:true, message:msg, icon });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 2600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent! I'll reply within 24 hours.", "✉️");
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name:"", email:"", subject:"", message:"" });
  };

  const navLinks = ["About","Skills","Projects","Experience","Blog","Contact"];
  const GITHUB   = "https://github.com/safkatkhan";

  return (
    <>
      <Toast message={toast.message} icon={toast.icon} show={toast.show} />

      <button className={`scroll-top${showTop ? " visible" : ""}`} onClick={() => window.scrollTo({ top:0, behavior:"smooth" })} aria-label="Scroll to top">
        <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
      </button>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav-logo">SK</a>
        <ul className="nav-links">
          {navLinks.map(l => <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}
        </ul>
        <div className="nav-right">
          <button className="theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} aria-label="Toggle theme" />
          <a href="#contact" className="nav-cta">Hire Me</a>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        <button className="theme-toggle" style={{ marginBottom:".5rem" }} onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} aria-label="Toggle theme" />
        {navLinks.map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>)}
      </div>

      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content">
          <div className="hero-animate hero-eyebrow" style={{ animationDelay:".1s" }}>
            <span className="hero-eyebrow-dot" />
            Open to opportunities
            <span className={`hero-status-badge ${onlineStatus.isOnline ? "is-online" : "is-offline"}`}>
              <span className="hero-status-dot" />
              <span className="hero-status-text">{onlineStatus.label}</span>
            </span>
          </div>
          <div className="hero-animate hero-name" style={{ animationDelay:".25s" }}>
            <h1 style={{ fontFamily:"var(--serif)", fontSize:"inherit", fontWeight:"inherit", lineHeight:"inherit", letterSpacing:"inherit" }}>
              Safkat<br /><em>Khan</em>
            </h1>
          </div>
          <div className="hero-animate hero-tagline" style={{ animationDelay:".4s" }}>
            Full-Stack Developer & AI Integration Specialist
          </div>
          <div className="hero-animate hero-desc" style={{ animationDelay:".55s" }}>
            I build fast, scalable web applications and weave AI into products that feel genuinely intelligent — from architecture to pixel-perfect interfaces.
          </div>
          <div className="hero-animate hero-actions" style={{ animationDelay:".7s" }}>
            <a href="#projects" className="btn-primary">View My Work</a>
            <a href="#contact" className="btn-ghost">Get in Touch</a>
          </div>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      <section className="section about" id="about" ref={aboutRef}>
        <div className="about-grid">
          <div className="about-visual scale-in">
            <div className="about-frame-wrap">

              <div className="about-frame">
                {/*
                  ── PROFILE PHOTO ──────────────────────────────────
                  Place your photo at: public/assets/DP.jpg
                  Then this <img> will display it automatically.
                  Change the src below if your file path is different.
                  ──────────────────────────────────────────────────
                */}
                <img
                  src={safkatPhoto}
                  alt="Safkat Khan"
                  className="about-photo"
                  loading="eager"
                />
                <div className="about-photo-vignette" />
              </div>

              <div className="about-corner-br" />

              <div className="about-exp-chip">
                <span className="about-exp-chip-num">4+</span>
                <span className="about-exp-chip-label">Years<br/>Exp.</span>
              </div>

              <div className={`about-online-indicator ${onlineStatus.isOnline ? "is-online" : "is-offline"}`}>
                <span className="about-online-dot" />
                <span className="about-online-text">{onlineStatus.label}</span>
              </div>

              <div className="about-tag" style={{ fontFamily:"'Monsieur La Doulaise', cursive", fontSize:"1rem", letterSpacing:".05em", textTransform:"none", fontWeight:400 }}>Safkat Khan · 2026</div>
            </div>

            <div className="about-identity">
              <div className="about-identity-name">Safkat Khan</div>
              <div className="about-identity-role">Full-Stack Developer & AI Specialist</div>
            </div>
          </div>

          <div className="about-text fade-right" style={{ transitionDelay:".12s" }}>
            <div className="section-label">About Me</div>
            <h2 className="section-title">Building with<br /><em>Purpose & Precision</em></h2>
            <div className="divider" />
            <p>Hey, I'm Safkat — a full-stack developer with a knack for integrating AI into real-world products. I love turning ambitious ideas into clean, performant software that solves problems people actually care about.</p>
            <p>From multi-vendor marketplaces to AI-powered dashboards, I bring both technical breadth and product thinking to every project. I write code that's meant to be maintained, extended, and proud of.</p>
            <div className="about-stats">
              {[["4+","Years Exp."],["25+","Projects"],["12+","Clients"]].map(([n,l]) => (
                <div className="stat-card fade-in" key={l}>
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"2.5rem" }}>
              <a href="#contact" className="btn-primary">Let's Build Together</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section skills" id="skills" ref={skillsRef}>
        <div className="skills-inner">
          <div className="fade-in">
            <div className="section-label">My Toolkit</div>
            <h2 className="section-title">Skills & <em>Expertise</em></h2>
          </div>
          <div className="skills-grid fade-in">
            {SKILLS_DATA.map((s) => (
              <div className="skill-category" key={s.title}>
                <div className="skill-cat-icon">{s.icon}</div>
                <div className="skill-cat-title">{s.title}</div>
                {s.desc && <p style={{ fontSize:".8rem", color:"var(--muted)", lineHeight:1.75, marginBottom:"1.1rem" }}>{s.desc}</p>}
                <div className="skill-tags">
                  {s.tags.map(t => <span className="skill-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section projects" id="projects" ref={projRef}>
        <div className="projects-inner">
          <div className="projects-header fade-in">
            <div>
              <div className="section-label">Selected Work</div>
              <h2 className="section-title">Recent <em>Projects</em></h2>
            </div>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="view-more-btn">
              <span>View More on GitHub</span><span style={{ fontSize:"1rem" }}>↗</span>
            </a>
          </div>
          <div className="projects-grid fade-in">
            {PROJECTS.map((p, i) => (
              <div className="project-card" key={p.id}>
                <div className="project-thumb" style={{ background:p.bg }}>
                  <span className="project-thumb-emoji">{p.emoji}</span>
                  <div className="project-thumb-overlay">
                    <span style={{ color:"var(--gold)", fontSize:".78rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>View Project ↗</span>
                  </div>
                  <div className="project-thumb-bar" />
                </div>
                <div className="project-body">
                  <div className="project-num">Project {String(i+1).padStart(2,"0")}</div>
                  <div className="project-title">{p.title}</div>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-stack">
                    {p.stack.map(t => <span className="project-tag" key={t}>{t}</span>)}
                  </div>
                  <a href={p.link} className="project-link" target="_blank" rel="noreferrer">View Case Study →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section experience" id="experience" ref={expRef}>
        <div className="experience-inner">
          <div className="fade-in">
            <div className="section-label">Career Journey</div>
            <h2 className="section-title">Work <em>Experience</em></h2>
          </div>
          <div className="exp-timeline">
            {EXPERIENCE.map((job) => (
              <div className="exp-entry fade-in" key={job.id}>
                <div className="exp-dot" />
                <div className="exp-card">
                  <div className="exp-header">
                    <div className="exp-title-block">
                      <div className="exp-role">{job.role}</div>
                      <div className="exp-company">{job.company}</div>
                    </div>
                    <div className="exp-meta">
                      <span className="exp-date">{job.date}</span>
                      <span className="exp-type">{job.type}</span>
                    </div>
                  </div>
                  <div className="exp-divider" />
                  <p className="exp-desc">{job.desc}</p>
                  <div className="exp-achievements">
                    {job.achievements.map((a, j) => (
                      <div className="exp-achievement" key={j}>
                        <span className="exp-achievement-bullet" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                  <div className="exp-tags">
                    {job.tags.map(t => <span className="exp-tag" key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section blog" id="blog" ref={blogRef}>
        <div className="blog-inner">
          <div className="fade-in">
            <div className="section-label">Thoughts & Tutorials</div>
            <h2 className="section-title">From the <em>Blog</em></h2>
          </div>
          <div className="blog-grid fade-in">
            {BLOG_POSTS.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-card-top" style={{ background:post.bg }}>
                  <span className="blog-card-top-emoji">{post.emoji}</span>
                  <span className="blog-card-category">{post.category}</span>
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span>{post.date}</span>
                    <span className="blog-meta-dot" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-footer">
                    <span className="blog-read-time">🕒 {post.readTime}</span>
                    <a href="#blog" className="blog-link">Read More →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact" id="contact" ref={contactRef}>
        <div className="contact-inner">
          <div className="contact-info fade-left">
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title">Let's Build<br /><em>Something Great</em></h2>
            <div className="divider" />
            <p>Have a project in mind or want to collaborate? I'm always excited to talk about ambitious ideas. I'll respond within 24 hours.</p>
            <div className="contact-details">
              {[
                { icon:"📧", label:"safkat.khan@email.com" },
                { icon:"📍", label:"Dhaka, Bangladesh" },
                { icon:"💼", label:"linkedin.com/in/safkatkhan" },
                { icon:"🐙", label:"github.com/safkatkhan" },
              ].map(c => (
                <div className="contact-item" key={c.label}>
                  <div className="contact-icon">{c.icon}</div>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-right" style={{ transitionDelay:".15s" }}>
            {submitted ? (
              <div style={{ border:"1px solid var(--border)", borderRadius:"4px", padding:"3rem 2rem", textAlign:"center", background:"var(--gold-dim)" }}>
                <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>✉️</div>
                <div style={{ fontFamily:"var(--serif)", fontSize:"1.5rem", color:"var(--gold)", marginBottom:".5rem" }}>Message Sent!</div>
                <div style={{ color:"var(--muted)", fontSize:".88rem" }}>Thanks for reaching out — I'll be in touch very soon.</div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input className="form-input" type="text" placeholder="e.g. Safkat Khan" required value={formData.name} onChange={e => setFormData({ ...formData, name:e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" placeholder="safkat.khan@email.com" required value={formData.email} onChange={e => setFormData({ ...formData, email:e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" type="text" placeholder="Project enquiry / Collaboration" required value={formData.subject} onChange={e => setFormData({ ...formData, subject:e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" rows={5} placeholder="Tell me about your project, timeline, and budget..." required value={formData.message} onChange={e => setFormData({ ...formData, message:e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ width:"100%", padding:"1rem", fontSize:".84rem", justifyContent:"center" }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-logo">Safkat Khan</span>
        <span>© {new Date().getFullYear()} · All rights reserved</span>
        <div className="footer-links">
          {[["GitHub",GITHUB],["LinkedIn","#"],["Twitter","#"]].map(([s,h]) => (
            <a href={h} key={s} target="_blank" rel="noreferrer">{s}</a>
          ))}
        </div>
      </footer>
    </>
  );
}