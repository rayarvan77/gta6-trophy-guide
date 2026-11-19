// Views: the tracker list (with each trophy's guide and its sources), the
// roadmap, the missables page and the sources page. All rendering is plain
// DOM building — no framework, no network.

import { KIND_LABELS, KIND_ORDER, trophyMatches, isSpoilerHidden } from './filters.js';
import { ROADMAP_STAGES, ROADMAP_GROUPS } from './roadmap.js';

const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function sourceLinks(sources, sourceMap) {
  const span = el('p', 'sources-line');
  span.appendChild(el('strong', null, 'Sources: '));
  sources.forEach((key, index) => {
    const info = sourceMap[key];
    if (!info) return;
    if (index > 0) span.appendChild(document.createTextNode(' · '));
    if (info.url) {
      const a = el('a', null, info.short);
      a.href = info.url;
      a.target = '_blank';
      a.rel = 'noopener';
      span.appendChild(a);
    } else {
      span.appendChild(el('span', null, info.short));
    }
  });
  return span;
}

export function renderKindChips(container, counts, activeKind, onPick) {
  container.replaceChildren();
  for (const kind of KIND_ORDER) {
    const count = kind === 'all' ? counts.total : counts[kind] ?? 0;
    const button = el('button', 'chip' + (kind === activeKind ? ' active' : ''), KIND_LABELS[kind]);
    button.type = 'button';
    button.appendChild(el('span', 'count', `(${count})`));
    button.addEventListener('click', () => onPick(kind));
    container.appendChild(button);
  }
}

export function kindCounts(trophies) {
  const counts = { total: trophies.length, missable: 0, online: 0 };
  for (const trophy of trophies) {
    if (trophy.missable) counts.missable += 1;
    for (const kind of trophy.kinds) counts[kind] = (counts[kind] ?? 0) + 1;
  }
  return counts;
}

export function renderTrophyList(listEl, trophies, filters, earnedIds, spoilerOn, sourceMap, openId, callbacks) {
  const visible = trophies.filter((t) => trophyMatches(t, filters, earnedIds));
  listEl.replaceChildren();
  for (const trophy of visible) {
    const card = el('li', 'trophy-card' + (earnedIds.has(trophy.id) ? ' earned' : '') + (trophy.missable ? ' missable-card' : ''));
    card.id = `trophy-${trophy.id}`;

    const head = el('div', 'trophy-head');
    const check = el('input', 'trophy-check');
    check.type = 'checkbox';
    check.checked = earnedIds.has(trophy.id);
    check.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    check.addEventListener('change', () => callbacks.onToggle(trophy.id, check.checked));
    head.appendChild(check);

    const medal = el('span', `medal ${trophy.grade}`, GRADE_LETTER[trophy.grade]);
    medal.title = `${trophy.grade} trophy`;
    head.appendChild(medal);

    const main = el('div', 'trophy-main');
    const hiddenSpoiler = isSpoilerHidden(trophy, spoilerOn, earnedIds);
    main.appendChild(el('h3', 'trophy-name', hiddenSpoiler ? 'Hidden trophy' : trophy.name));
    main.appendChild(el('p', 'trophy-desc', hiddenSpoiler ? 'A hidden story trophy — its name and description stay hidden until you earn it.' : trophy.description));

    const meta = el('div', 'trophy-meta');
    meta.appendChild(el('span', `grade-word ${trophy.grade}`, trophy.grade));
    if (trophy.hidden) meta.appendChild(el('span', 'tag hidden-tag', 'Hidden on PSN'));
    if (trophy.missable) meta.appendChild(el('span', 'tag missable-tag', '⚠ Missable'));
    if (trophy.watch) meta.appendChild(el('span', 'tag', 'One-time moment'));
    for (const kind of trophy.kinds) meta.appendChild(el('span', 'tag', KIND_LABELS[kind] ?? kind));
    if (trophy.target) meta.appendChild(el('span', 'tag', `PSN target: ${trophy.targetLabel}`));
    main.appendChild(meta);

    const guideBody = el('div', 'guide-body');
    guideBody.hidden = openId !== trophy.id;
    if (trophy.missable) {
      guideBody.appendChild(el('p', 'spoiler-note', 'Missable: this is the only trophy the launch guides flag as potentially missable. See the Missables tab before you play past Chapter 1.'));
    }
    guideBody.appendChild(el('p', 'guide-label', 'Guide — our own words'));
    guideBody.appendChild(el('p', null, trophy.guide));
    guideBody.appendChild(sourceLinks(trophy.sources, sourceMap));
    main.appendChild(guideBody);
    head.appendChild(main);

    const toggle = el('button', 'guide-toggle', guideBody.hidden ? 'Guide ▸' : 'Guide ▾');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', String(!guideBody.hidden));
    toggle.addEventListener('click', () => callbacks.onOpenGuide(trophy.id));
    head.appendChild(toggle);
    card.appendChild(head);
    listEl.appendChild(card);
  }
  return visible.length;
}

export function renderProgress(earnedIds, total) {
  const count = document.getElementById('earned-count');
  const fill = document.getElementById('progress-fill');
  const bar = document.getElementById('progress-bar');
  count.textContent = String(earnedIds.size);
  fill.style.width = `${Math.round((earnedIds.size / total) * 100)}%`;
  bar.setAttribute('aria-valuenow', String(earnedIds.size));
}

export function renderRoadmap(stagesEl, groupsEl, trophiesById) {
  stagesEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const card = el('article', 'stage');
    const heading = el('h3', null, stage.title + ' ');
    heading.appendChild(el('span', 'stage-time', `— ${stage.time}`));
    card.appendChild(heading);
    const list = el('ul');
    for (const point of stage.points) list.appendChild(el('li', null, point));
    card.appendChild(list);
    card.appendChild(el('p', 'lede', `${stage.trophyIds.length} trophies in this stage (the platinum itself is earned by finishing all three).`));
    stagesEl.appendChild(card);
  }
  groupsEl.replaceChildren();
  for (const group of ROADMAP_GROUPS) {
    const row = el('div', 'group-row');
    row.appendChild(el('span', 'group-count', `${group.count}×`));
    const text = el('p');
    text.appendChild(el('strong', null, `${group.title} — `));
    text.appendChild(document.createTextNode(group.text));
    row.appendChild(text);
    groupsEl.appendChild(row);
  }
}

export function renderMissables(missableEl, watchEl, trophies, sourceMap) {
  missableEl.replaceChildren();
  for (const trophy of trophies.filter((t) => t.missable)) {
    const card = el('article', 'flag-card');
    card.appendChild(el('h3', null, `⚠ ${trophy.name} — ${trophy.grade}`));
    card.appendChild(el('p', null, trophy.description));
    const why = el('p');
    why.appendChild(el('strong', null, 'Why it can be missed: '));
    why.appendChild(document.createTextNode(trophy.guide));
    card.appendChild(why);
    card.appendChild(sourceLinks(trophy.sources, sourceMap));
    missableEl.appendChild(card);
  }
  watchEl.replaceChildren();
  for (const trophy of trophies.filter((t) => t.watch)) {
    const card = el('article', 'flag-card');
    card.style.borderLeftColor = 'var(--gold)';
    card.appendChild(el('h3', null, `${trophy.name} — ${trophy.grade}`));
    card.appendChild(el('p', null, trophy.description));
    const why = el('p');
    why.appendChild(el('strong', null, 'When to do it: '));
    why.appendChild(document.createTextNode(trophy.guide));
    card.appendChild(why);
    watchEl.appendChild(card);
  }
}

export function renderSources(listEl, sources) {
  listEl.replaceChildren();
  for (const source of sources) {
    const card = el('article', 'source-card');
    const heading = el('h3');
    if (source.url) {
      const a = el('a', null, source.name);
      a.href = source.url;
      a.target = '_blank';
      a.rel = 'noopener';
      heading.appendChild(a);
    } else {
      heading.textContent = source.name;
    }
    card.appendChild(heading);
    card.appendChild(el('p', null, source.note));
    listEl.appendChild(card);
  }
}
