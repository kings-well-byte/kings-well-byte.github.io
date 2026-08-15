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
  status: {
    online: 'ONLINE',
    environment: 'Linux',
    researchMode: 'ACTIVE',
    knowledgeBase: 'Growing',
    lastUpdate: '2026-08',
  },
  profile: {
    role: 'Cyber Security Researcher in Training',
    roleCN: '网络安全研究方向学习者',
    focus: ['Web Security', 'AI Security', 'Vulnerability Research'],
    status: 'Learning & Research',
    journey: [
      { label: 'CTF Training', value: 'Active' },
      { label: 'Projects', value: '2 Active' },
      { label: 'Articles', value: 'Continuous Writing' },
    ],
  },
  research: [
    { name: 'Web Security', level: 'Research', tags: ['SQLi', 'XSS', 'RCE', 'SSRF'], accent: '' },
    { name: 'CTF',          level: 'Training', tags: ['Web', 'PHP', 'Misc'], accent: 'blue' },
    { name: 'AI Security',  level: 'Learning', tags: ['LLM', 'Prompt Injection', 'Model Safety'], accent: 'purple' },
    { name: 'Tools',        level: 'Daily Use', tags: ['Burp', 'Linux', 'Python'], accent: 'red' },
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
  ctf: {
    path: [
      { cat: 'Web Security', items: ['HTTP Basics', 'PHP Security', 'SQL Injection', 'XSS', 'RCE', 'Command Injection'] },
      { cat: 'Tools', items: ['Burp Suite', 'Linux', 'Python'] },
    ],
    journey: [
      { year: '2026', title: 'Web Security Start', items: ['Started Web Security learning', 'PHP vulnerability analysis', 'CTFshow practice', 'Competition preparation'] },
    ],
  },
  github: {
    name: 'kings-well-byte',
    desc: 'Web Security · CTF · PHP Audit',
    url: 'https://github.com/kings-well-byte',
    avatar: 'https://github.com/kings-well-byte.png',
  },
  archive: [
    { year: '2026', items: ['Security Learning'] },
    { year: '2027', items: ['Competition'] },
    { year: '2028', items: ['Research'] },
  ],
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
    m.appendChild(moduleTitle('Security Identity'));
    const wrap = el('<div class="lab-profile"></div>');
    const main = el(`<div class="lab-profile-main">
      <div class="lab-profile-row"><span class="k">Role</span><span class="v">${esc(LAB_CONFIG.profile.role)} <span class="lab-profile-cn">(${esc(LAB_CONFIG.profile.roleCN)})</span></span></div>
      <div class="lab-profile-row"><span class="k">Focus</span><span class="v">${LAB_CONFIG.profile.focus.map(esc).join(' · ')}</span></div>
      <div class="lab-profile-row"><span class="k">Status</span><span class="v lab-profile-status"><span class="dot"></span> ${esc(LAB_CONFIG.profile.status)}</span></div>
    </div>`);
    wrap.appendChild(main);
    LAB_CONFIG.profile.journey.forEach(s => {
      wrap.appendChild(el(`<div class="lab-stat"><div class="num" style="font-size:16px">${esc(s.value)}</div><div class="label">${esc(s.label)}</div></div>`));
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
        <div class="card-head"><span class="card-name">${esc(r.name)}</span><span class="card-level">${esc(r.level)}</span></div>
        <div class="card-tags">${r.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
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
    m.appendChild(moduleTitle('Security Learning Path'));
    const wrap = el('<div class="lab-path"></div>');
    LAB_CONFIG.ctf.path.forEach(p => {
      const col = el(`<div class="lab-path-col"><div class="path-cat">${esc(p.cat)}</div><ul>${p.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`);
      wrap.appendChild(col);
    });
    m.appendChild(wrap);
    return m;
  }

  function buildCtfJourney() {
    const m = el('<section class="lab-module"></section>');
    m.appendChild(moduleTitle('CTF Journey'));
    const tl = el('<div class="lab-timeline"></div>');
    LAB_CONFIG.ctf.journey.forEach(j => {
      const node = el(`<div class="tl-node">
        <div class="tl-year">${esc(j.year)}</div>
        <div class="tl-title">${esc(j.title)}</div>
        <ul class="tl-items">${j.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`);
      tl.appendChild(node);
    });
    m.appendChild(tl);
    return m;
  }

  function buildStatusPanel() {
    const s = LAB_CONFIG.status;
    return el(`<aside class="lab-status-panel">
      <div class="sp-head"><span class="sp-dot"></span> SECURITY CORE STATUS</div>
      <div class="sp-row"><span class="k">Status</span><span class="v sp-online">● ${esc(s.online)}</span></div>
      <div class="sp-row"><span class="k">Environment</span><span class="v">${esc(s.environment)}</span></div>
      <div class="sp-row"><span class="k">Research Mode</span><span class="v">${esc(s.researchMode)}</span></div>
      <div class="sp-row"><span class="k">Knowledge Base</span><span class="v">${esc(s.knowledgeBase)}</span></div>
      <div class="sp-row"><span class="k">Last Update</span><span class="v">${esc(s.lastUpdate)}</span></div>
    </aside>`);
  }

  function buildArchive() {
    const m = el('<section class="lab-module"></section>');
    m.appendChild(moduleTitle('Security Archive'));
    const tl = el('<div class="lab-timeline lab-archive"></div>');
    LAB_CONFIG.archive.forEach(a => {
      const node = el(`<div class="tl-node">
        <div class="tl-year">${esc(a.year)}</div>
        <ul class="tl-items">${a.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`);
      tl.appendChild(node);
    });
    m.appendChild(tl);
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

  /* ---------- 文章页：Article JSON-LD + Security Header ---------- */
  function enhancePost() {
    const post = document.querySelector('#post, article');
    if (!post) return;

    // Article JSON-LD
    try {
      const title = document.querySelector('.post-title, #post-info .post-title')?.textContent.trim() || document.title;
      const date = document.querySelector('#post-meta time, .post-meta time')?.getAttribute('datetime') || '';
      const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        url: location.href,
        datePublished: date,
        author: { '@type': 'Person', name: 'kings-well-byte', url: 'https://github.com/kings-well-byte' },
        publisher: { '@type': 'WebSite', name: 'Kings-Well Security Lab', url: 'https://kings-well-byte.github.io' },
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonld);
      document.head.appendChild(script);
    } catch (e) { console.warn('[lab] jsonld:', e); }

    // Security Header 徽章（从文章标签生成）
    try {
      const tagLinks = [...document.querySelectorAll('.post-meta__tag-list a[href*="/tags/"], #post-meta a[href*="/tags/"]')]
        .map(a => a.textContent.trim()).filter(Boolean);
      const catLinks = [...document.querySelectorAll('.tag_share a[href*="/categories/"], #post-meta a[href*="/categories/"]')]
        .map(a => a.textContent.trim()).filter(Boolean);
      if (tagLinks.length || catLinks.length) {
        const badge = el(`<div class="lab-sec-header">
          ${catLinks.map(c => `<span class="sh-cat">${esc(c.toUpperCase())}</span>`).join('')}
          ${tagLinks.map(t => `<span class="sh-tag">${esc(t)}</span>`).join('')}
        </div>`);
        const target = document.querySelector('#post-info') || post.querySelector('.post-meta') || post.firstElementChild;
        if (target) target.after(badge);
      }
    } catch (e) { console.warn('[lab] secheader:', e); }
  }

  /* ---------- 滚动进入动画 ---------- */
  function initReveal() {
    const mods = document.querySelectorAll('.lab-module, .lab-status-panel');
    if (!mods.length || !('IntersectionObserver' in window)) {
      mods.forEach(m => m.classList.add('lab-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('lab-revealed');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    mods.forEach(m => io.observe(m));
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
        const ctfJourney = buildCtfJourney();
        const github = buildGithub();
        const archive = buildArchive();
        // Hero 状态面板（终端右侧）
        const heroWrap = document.querySelector('#page-header');
        if (heroWrap) {
          heroWrap.classList.add('lab-hero-wrap');
          const statusPanel = buildStatusPanel();
          const siteInfo = document.querySelector('#site-info');
          if (siteInfo) {
            const heroInner = el('<div class="lab-hero-inner"></div>');
            const termHost = el('<div class="lab-hero-term-host"></div>');
            // 迁移已注入的终端到左右布局
            const term = document.querySelector('.lab-hero-terminal');
            if (term) { termHost.appendChild(term); } else { termHost.appendChild(el('<div></div>')); }
            heroInner.appendChild(termHost);
            heroInner.appendChild(statusPanel);
            siteInfo.before(heroInner);
            siteInfo.style.display = 'none';
          }
        }
        if (recent) {
          // 模块插入 #recent-posts 内容区内部（.layout 是 main+aside 的 flex 容器，不能横向插入）
          recent.prepend(profile);
          profile.after(research);
          research.after(projects);
          recent.append(ctf);
          recent.append(ctfJourney);
          recent.append(github);
          recent.append(archive);
        } else {
          content.appendChild(profile);
          content.appendChild(research);
          content.appendChild(projects);
          content.appendChild(ctf);
          content.appendChild(ctfJourney);
          content.appendChild(github);
          content.appendChild(archive);
        }
      }
    } catch (e) {
      console.warn('[lab] modules:', e);
    }
    initReveal();
  } else {
    enhancePost();
    initReveal();
  }
})();
