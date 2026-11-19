// Boot: loads the trophy list and the source list, wires the tracker controls
// (search, grade, kind chips, spoiler setting, export/import, reset) and the
// hash routing between Tracker, Roadmap, Missables and Sources.

import { loadProgress, saveProgress, seedDemoIfEmpty, exportProgress, importProgressFile } from './store.js';
import { trophyMatches, isSpoilerHidden } from './filters.js';
import {
  renderKindChips, kindCounts, renderTrophyList, renderProgress,
  renderRoadmap, renderMissables, renderSources,
} from './views.js';

const VIEWS = ['tracker', 'roadmap', 'missables', 'sources'];

const state = {
  trophies: [],
  sources: [],
  sourceMap: {},
  earned: loadProgress(),
  filters: { kind: 'all', grade: 'all', earned: 'all', search: '' },
  spoilerOn: false,
  openGuideId: null,
  view: 'tracker',
};

function $(id) {
  return document.getElementById(id);
}

function applyFilters() {
  const count = renderTrophyList(
    $('trophy-list'),
    state.trophies,
    state.filters,
    state.earned,
    state.spoilerOn,
    state.sourceMap,
    state.openGuideId,
    {
      onToggle: (id, checked) => {
        if (checked) state.earned.add(id);
        else state.earned.delete(id);
        saveProgress(state.earned);
        renderProgress(state.earned, state.trophies.length);
        applyFilters();
      },
      onOpenGuide: (id) => {
        state.openGuideId = state.openGuideId === id ? null : id;
        applyFilters();
        if (state.openGuideId) {
          const card = $(`trophy-${id}`);
          if (card) card.scrollIntoView({ block: 'nearest' });
        }
      },
    },
  );
  const total = state.trophies.length;
  $('showing').textContent = state.filters.kind === 'online'
    ? 'There are no online trophies — all 55 are offline and single-player (PowerPyx).'
    : `Showing ${count} of ${total} trophies · ${state.earned.size} earned`;
  $('empty-state').hidden = count !== 0;
  $('spoiler-hint').hidden = !state.spoilerOn;
}

function showView(view) {
  state.view = VIEWS.includes(view) ? view : 'tracker';
  for (const name of VIEWS) {
    $(`view-${name}`).hidden = name !== state.view;
    document.querySelector(`.tab[data-view="${name}"]`).classList.toggle('active', name === state.view);
  }
}

function routeFromHash() {
  const hash = location.hash.replace(/^#/, '');
  if (hash.startsWith('trophy-')) {
    const id = Number(hash.slice('trophy-'.length));
    if (Number.isInteger(id) && id >= 1 && id <= 55) {
      state.openGuideId = id;
      showView('tracker');
      applyFilters();
      const card = $(`trophy-${id}`);
      if (card) card.scrollIntoView({ block: 'nearest' });
      return;
    }
  }
  showView(hash || 'tracker');
}

async function boot() {
  const [trophyData, sourceData] = await Promise.all([
    fetch('./data/trophies.json').then((r) => r.json()),
    fetch('./data/sources.json').then((r) => r.json()),
  ]);
  state.trophies = trophyData.trophies;
  state.sources = sourceData.sources;
  for (const source of state.sources) state.sourceMap[source.key] = source;
  seedDemoIfEmpty(state.earned);
  // ?spoilers=on starts with story spoilers hidden (shareable link); the
  // checkbox in the tracker still toggles it afterwards.
  if (new URLSearchParams(location.search).get('spoilers') === 'on') {
    state.spoilerOn = true;
    $('spoiler-toggle').checked = true;
  }

  const byId = new Map(state.trophies.map((t) => [t.id, t]));
  renderRoadmap($('roadmap-stages'), $('roadmap-groups'), byId);
  renderMissables($('missable-list'), $('watch-list'), state.trophies, state.sourceMap);
  renderSources($('sources-list'), state.sources);
  const onPickKind = (kind) => {
    state.filters.kind = kind;
    renderKindChips($('kind-chips'), kindCounts(state.trophies), kind, onPickKind);
    applyFilters();
  };
  renderKindChips($('kind-chips'), kindCounts(state.trophies), state.filters.kind, onPickKind);

  $('search').addEventListener('input', (event) => {
    state.filters.search = event.target.value.trim();
    applyFilters();
  });
  $('grade-filter').addEventListener('change', (event) => {
    state.filters.grade = event.target.value;
    applyFilters();
  });
  $('earned-filter').addEventListener('change', (event) => {
    state.filters.earned = event.target.value;
    applyFilters();
  });
  $('spoiler-toggle').addEventListener('change', (event) => {
    state.spoilerOn = event.target.checked;
    applyFilters();
  });
  $('export-btn').addEventListener('click', () => {
    exportProgress(state.earned, state.trophies.length);
  });
  $('import-input').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = await importProgressFile(file);
      state.earned = imported;
      saveProgress(state.earned);
      renderProgress(state.earned, state.trophies.length);
      applyFilters();
    } catch (error) {
      alert(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });
  $('reset-btn').addEventListener('click', () => {
    if (!confirm('Clear all earned ticks in this browser?')) return;
    state.earned = new Set();
    saveProgress(state.earned);
    renderProgress(state.earned, state.trophies.length);
    applyFilters();
  });
  window.addEventListener('hashchange', routeFromHash);

  renderProgress(state.earned, state.trophies.length);
  routeFromHash();
  applyFilters();
}

boot().catch((error) => {
  $('trophy-list').innerHTML = `<li class="trophy-card">Could not load the trophy list: ${error.message}. Open this guide from its own files (app/index.html) with the data folder beside it.</li>`;
});
