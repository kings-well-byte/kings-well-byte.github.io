/* ============================================================
   Kings-Well Cyber Security Lab — 首页模块引擎
   Hero 终端动画 + Security Profile + Research Dashboard
   + Featured Projects + CTF 面板 + GitHub 区
   数据集中在 LAB_CONFIG，按需修改即可
   ============================================================ */

const LAB_CONFIG = {
  hero: {
    lines: [
      { text: 'initializing security environment...', type: 'cmd' },
      { text: 'loading research modules...', type: 'cmd' },
      { text: '[██████████] 100%', type: 'ok' },
      { text: '', type: 'blank' },
      { text: 'WELCOME TO KINGS-WELL CYBER SECURITY LAB', type: 'title' },
    ],
    prompt: 'root@kings-security:~$',
    speed: 38,          // 每字符毫秒
    lineDelay: 380,     // 行间停顿
  },
  profile: {
    role: 'Security Researcher',
    focus: ['Web Security', 'AI Security', 'CTF', 'Vulnerability Research'],
    status: 'Learning',
    stats: [
      { num: '120+', label: 'CTF Solved' },
      { num: '05', label: 'Projects' },
      { num: '100+', label: 'Articles' },
    ],
  },
  research: [
    { name: 'Web Security',   pct: 90, tags: ['SQLi', 'XSS', 'RCE', 'SSRF'], accent: '' },
    { name: 'CTF',            pct: 80, tags: ['Web', 'Crypto', 'Misc'], accent: 'blue' },
    { name: 'AI Security',    pct: 70, tags: ['LLM', 'Prompt Injection', 'Model Safety'], accent: 'purple' },
    { name: 'Tools',          pct: 85, tags: ['Burp', 'Nmap', 'Python', 'Linux'], accent: 'red' },
  ],
  projects: [
    {
      title: 'Dunhuang AI Restoration',
      desc: 'AI Computer Vision System for Dunhuang mural digital restoration research.',
      tech: ['AI Computer Vision', 'Deep Learning', 'PyTorch'],
      status: 'Research',
      href: '#',
      linkText: 'View Details →',
    },
    {
      title: 'Cyber Security Lab',
      desc: 'Personal security platform: CTF writeups, vulnerability research, security tools.',
      tech: ['CTF', 'Security Tools', 'Python'],
      status: 'Active',
      href: 'https://github.com/kings-well-byte',
      linkText: 'GitHub →',
    },
  ],
  ctf: [
    { name: 'Solved', num: '120+' },
    { name: 'Web', num: '85' },
    { name: 'Crypto', num: '20' },
    { name: 'Misc', num: '15' },
  ],
  github: {
    name: 'kings-well-byte',
    desc: 'Web Security · CTF · PHP Audit',
    url: 'https://github.com/kings-well-byte',
    avatar: 'https://github.com/kings-well-byte.png',
  },
};

(function () {
  'use strict';

  const isHome = document.querySelector('#recent-posts') && document.querySelector('#site-info');

  /* ---------- 工具 ---------- */
  const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* ---------- 逐字打字机 ---------- */
  function typeInto(node, text, speed, cb) {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 't-cursor';
    node.appendChild(cursor);
    (function tick() {
      if (i < text.length) {
        node.insertBefore(document.createTextNode(text[i++]), cursor);
        setTimeout(tick, speed);
      } else {
        cursor.remove();
        cb && cb();
      }
    })();
  }

  /* ---------- 终端 Hero ---------- */
  function buildHeroTerminal() {
    const term = el(
      `<div class="lab-hero-terminal">
        <div class="t-line"><span class="t-dot">┌──</span> <span class="t-prompt">kings-security</span> <span class="t-dot">(Kings-Well Security Lab)</span></div>
        <div class="t-line" id="lab-term-body"></div>
        <div class="t-line"><span class="t-prompt">${esc(LAB_CONFIG.hero.prompt)}</span> <span id="lab-term-cmd"></span></div>
        <div class="lab-hero-cta" id="lab-hero-cta" style="display:none">
          <a class="lab-btn lab-btn-primary" href="/research/">> Explore Research</a>
          <a class="lab-btn lab-btn-ghost" href="${LAB_CONFIG.github.url}" target="_blank" rel="noopener">GitHub →</a>
        </div>
      </div>`
    );
    document.querySelector('#site-info').before(term);

    const body = term.querySelector('#lab-term-body');
    const cmdLine = term.querySelector('#lab-term-cmd');
    const cta = term.querySelector('#lab-hero-cta');
    const { lines, speed, lineDelay } = LAB_CONFIG.hero;

    const runLine = (idx) => {
      if (idx >= lines.length) {
        cta.style.display = 'flex';
        return;
      }
      const ln = lines[idx];
      if (ln.text === '') {
        body.appendChild(el('<div class="t-line"><br></div>'));
        setTimeout(() => runLine(idx + 1), lineDelay / 2);
        return;
      }
      const line = el(`<div class="t-line ${ln.type === 'ok' ? 't-ok' : ln.type === 'title' ? 't-ok' : ''}"></div>`);
      if (ln.type === 'title') {
        line.style.fontWeight = '700';
        line.style.letterSpacing = '2px';
      }
      body.appendChild(line);
      typeInto(line, ln.text, speed, () => setTimeout(() => runLine(idx + 1), lineDelay));
    };
    // 提示符行：先显示光标，随后逐字输出命令
    setTimeout(() => runLine(0), 300);
    typeInto(cmdLine, 'bootstrap --lab --theme=cyber', speed);
  }

  /* ---------- 模块注入 ---------- */
  function moduleTitle(t) { return el(`<h2 class="lab-module-title">${esc(t)}</h2>`); }

  function buildProfile() {
    const m = el('<section class="lab-module lab-profile-wrap"></section>');
    m.appendChild(moduleTitle('Security Profile'));
    const wrap = el('<div class="lab-profile"></div>');
    const main = el(`<div class="lab-profile-main">
      <div class="lab-profile-row"><span class="k">Role</span><span class="v">${esc(LAB_CONFIG.profile.role)}</span></div>
      <div class="lab-profile-row"><span class="k">Focus</span><span class="v">${LAB_CONFIG.profile.focus.map(esc).join(' · ')}</span></div>
      <div class="lab-profile-row"><span class="k">Status</span><span class="v lab-profile-status"><span class="dot"></span> ${esc(LAB_CONFIG.profile.status)}</span></div>
    </div>`);
    wrap.appendChild(main);
    LAB_CONFIG.profile.stats.forEach(s => {
      wrap.appendChild(el(`<div class="lab-stat"><div class="num">${esc(s.num)}</div><div class="label">${esc(s.label)}</div></div>`));
    });
    m.appendChild(wrap);
    return m;
  }

  function buildResearch() {
    const m = el('<section class="lab-module"></section>');
    m.appendChild(moduleTitle('Research Intelligence'));
    const grid = el('<div class="lab-grid"></div>');
    LAB_CONFIG.research.forEach(r => {
      const card = el(`<div class="lab-card" data-accent="${r.accent}">
        <div class="card-head"><span class="card-name">${esc(r.name)}</span><span class="card-pct" data-pct="${r.pct}">0%</span></div>
        <div class="card-tags">${r.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="lab-bar"><div class="fill" data-w="${r.pct}"></div></div>
      </div>`);
      grid.appendChild(card);
    });
    m.appendChild(grid);
    return m;
  }

  function buildProjects() {
    const m = el('<section class="lab-module"></section>');
    m.appendChild(moduleTitle('Featured Research'));
    const grid = el('<div class="lab-grid"></div>');
    LAB_CONFIG.projects.forEach(p => {
      grid.appendChild(el(`<div class="lab-card lab-project">
        <span class="proj-status">${esc(p.status)}</span>
        <h3>${esc(p.title)}</h3>
        <div class="proj-desc">${esc(p.desc)}</div>
        <div class="proj-tech">${p.tech.map((t, i) => `<span class="${i % 2 ? 'alt' : ''}">${esc(t)}</span>`).join('')}</div>
        <a class="proj-link" href="${p.href}" target="_blank" rel="noopener">${esc(p.linkText)}</a>
      </div>`));
    });
    m.appendChild(grid);
    return m;
  }

  function buildCtf() {
    const m = el('<section class="lab-module"></section>');
    m.appendChild(moduleTitle('CTF Arena'));
    const main = el('<div class="lab-ctf-main"></div>');
    LAB_CONFIG.ctf.forEach(c => {
      main.appendChild(el(`<div class="lab-ctf-cat"><div class="cat-name">${esc(c.name)}</div><div class="cat-num">${esc(c.num)}</div></div>`));
    });
    m.appendChild(main);
    return m;
  }

  function buildGithub() {
    const m = el('<section class="lab-module"></section>');
    m.appendChild(moduleTitle('GitHub Activity'));
    m.appendChild(el(`<div class="lab-gh">
      <img class="lab-gh-avatar" src="${LAB_CONFIG.github.avatar}" alt="GitHub avatar" loading="lazy">
      <div>
        <div class="gh-name"><a href="${LAB_CONFIG.github.url}" target="_blank" rel="noopener">@${esc(LAB_CONFIG.github.name)}</a></div>
        <div class="gh-desc">${esc(LAB_CONFIG.github.desc)}</div>
      </div>
      <a class="gh-btn" href="${LAB_CONFIG.github.url}" target="_blank" rel="noopener">Visit GitHub</a>
    </div>`));
    return m;
  }

  /* ---------- 进度条动画 ---------- */
  function animateBars() {
    const cards = document.querySelectorAll('.lab-card .fill');
    if (!cards.length || !('IntersectionObserver' in window)) {
      cards.forEach(f => { f.style.width = f.dataset.w + '%'; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const fill = e.target;
        const pctEl = fill.closest('.lab-card').querySelector('.card-pct');
        const target = parseInt(fill.dataset.w, 10);
        fill.style.width = target + '%';
        let cur = 0;
        const step = () => {
          cur += Math.max(1, Math.round(target / 40));
          if (cur >= target) { pctEl.textContent = target + '%'; return; }
          pctEl.textContent = cur + '%';
          setTimeout(step, 24);
        };
        step();
        io.unobserve(fill);
      });
    }, { threshold: 0.4 });
    cards.forEach(f => io.observe(f));
  }

  /* ---------- 组装 ---------- */
  if (isHome) {
    try { buildHeroTerminal(); } catch (e) { console.warn('[lab] hero:', e); }
    try {
      const content = document.querySelector('#content-inner');
      if (content) {
        const recent = document.querySelector('#recent-posts');
        const aside = document.querySelector('#aside');
        const profile = buildProfile();
        const research = buildResearch();
        const projects = buildProjects();
        const ctf = buildCtf();
        const github = buildGithub();
        if (recent) {
          recent.before(profile);
          profile.after(research);
          research.after(projects);
          recent.after(ctf);
          ctf.after(github);
        } else if (aside) {
          aside.before(profile);
          profile.after(research);
          research.after(projects);
          research.after(projects);
          projects.after(ctf);
          ctf.after(github);
        } else {
          content.appendChild(profile);
          content.appendChild(research);
          content.appendChild(projects);
          content.appendChild(ctf);
          content.appendChild(github);
        }
      }
    } catch (e) {
      console.warn('[lab] modules:', e);
    }
    animateBars();
  }
})();
