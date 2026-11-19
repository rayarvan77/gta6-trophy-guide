// Progress store: earned trophies live in localStorage under one key, so the
// checklist survives reloads. Export writes a JSON file; import reads one back.

const STORAGE_KEY = 'leonida-ledger-progress-v1';

// The demo seed used by ?seed=13 (a fixed, documented set of 13 trophies) so
// screenshots can show a tracker part-way through. Only applies when the
// browser holds no saved progress yet.
const DEMO_EARNED_IDS = [2, 3, 8, 15, 16, 20, 21, 35, 42, 52, 53, 55, 19];

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earnedIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earnedIds].sort((a, b) => a - b)));
  } catch {
    // Storage full or unavailable: the checklist still works for this visit.
  }
}

export function seedDemoIfEmpty(earnedIds) {
  if (earnedIds.size > 0) return false;
  const params = new URLSearchParams(location.search);
  if (params.get('seed') !== '13') return false;
  for (const id of DEMO_EARNED_IDS) earnedIds.add(id);
  saveProgress(earnedIds);
  return true;
}

export function exportProgress(earnedIds, total) {
  const payload = {
    app: 'Leonida Ledger',
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earnedIds].sort((a, b) => a - b),
    total,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Reads a progress file the user picked and returns the earned id set, or
// throws an Error naming what was wrong with it.
export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const earned = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(earned)) {
    throw new Error('That file has no earned list in it.');
  }
  const ids = earned.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55);
  if (ids.length === 0 && earned.length > 0) {
    throw new Error('That file has no trophy ids between 1 and 55 in it.');
  }
  return new Set(ids);
}
