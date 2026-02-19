import type { DayRecord, RegretArchive, Profile, MemoEntry } from './types'

const DAYS_KEY = 'whatif-days'
const REGRETS_KEY = 'whatif-regrets'
const PROFILES_KEY = 'whatif-profiles'
const CURRENT_PROFILE_KEY = 'whatif-current-profile'
const MEMOS_KEY = 'whatif-memos'
const LANG_KEY = 'whatif-lang'
const CONSTELLATION_MODE_KEY = 'whatif-constellation-mode'

export type ConstellationMode = 'profile' | 'date'

// ---------- Profiles (EverMemOS Profile) ----------
export function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

export function getCurrentProfileId(): string | null {
  return localStorage.getItem(CURRENT_PROFILE_KEY)
}

export function setCurrentProfileId(id: string | null) {
  if (id == null) localStorage.removeItem(CURRENT_PROFILE_KEY)
  else localStorage.setItem(CURRENT_PROFILE_KEY, id)
}

export function getCurrentProfile(): Profile | null {
  const id = getCurrentProfileId()
  if (!id) return null
  return loadProfiles().find((p) => p.id === id) ?? null
}

// ---------- Days (by profile) ----------
export function loadDays(profileId?: string | null): DayRecord[] {
  try {
    const raw = localStorage.getItem(DAYS_KEY)
    const all: DayRecord[] = raw ? JSON.parse(raw) : []
    if (profileId) return all.filter((d) => d.profileId === profileId)
    return all
  } catch {
    return []
  }
}

export function saveDays(days: DayRecord[]) {
  localStorage.setItem(DAYS_KEY, JSON.stringify(days))
}

export function getDayRecord(date: string, profileId: string | null): DayRecord | null {
  if (!profileId) return null
  return loadDays(profileId).find((d) => d.date === date) ?? null
}

export function upsertDayRecord(record: DayRecord) {
  const all = loadDays(null)
  const idx = all.findIndex((d) => d.date === record.date && d.profileId === record.profileId)
  if (idx >= 0) all[idx] = record
  else all.push(record)
  all.sort((a, b) => a.date.localeCompare(b.date))
  saveDays(all)
  return record
}

// ---------- Memos (unified archive, by profile + dimension) ----------
function loadAllMemos(): MemoEntry[] {
  try {
    const raw = localStorage.getItem(MEMOS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function loadMemos(profileId: string | null): MemoEntry[] {
  if (!profileId) return []
  return loadAllMemos().filter((m) => m.profileId === profileId)
}

export function upsertMemo(entry: MemoEntry) {
  const global = loadAllMemos()
  const idx = global.findIndex((m) => m.id === entry.id)
  if (idx >= 0) global[idx] = entry
  else global.push(entry)
  localStorage.setItem(MEMOS_KEY, JSON.stringify(global))
}

export function deleteMemo(id: string) {
  const global = loadAllMemos().filter((m) => m.id !== id)
  localStorage.setItem(MEMOS_KEY, JSON.stringify(global))
}

// ---------- Regrets ----------
export function loadRegrets(profileId?: string | null): RegretArchive[] {
  try {
    const raw = localStorage.getItem(REGRETS_KEY)
    const all: RegretArchive[] = raw ? JSON.parse(raw) : []
    if (profileId) return all.filter((r) => r.profileId === profileId)
    return all
  } catch {
    return []
  }
}

export function saveRegrets(regrets: RegretArchive[]) {
  localStorage.setItem(REGRETS_KEY, JSON.stringify(regrets))
}

export function addRegret(archive: RegretArchive) {
  const list = loadRegrets(null)
  list.unshift(archive)
  saveRegrets(list)
}

// ---------- Lang ----------
export function loadLang(): 'zh' | 'en' {
  try {
    const v = localStorage.getItem(LANG_KEY) as 'zh' | 'en' | null
    return v === 'zh' || v === 'en' ? v : 'zh'
  } catch {
    return 'zh'
  }
}

export function saveLang(lang: 'zh' | 'en') {
  localStorage.setItem(LANG_KEY, lang)
}

// ---------- Constellation (今日宜忌 按档案 vs 按自然日) ----------
export function loadConstellationMode(): ConstellationMode {
  try {
    const v = localStorage.getItem(CONSTELLATION_MODE_KEY) as ConstellationMode | null
    return v === 'profile' || v === 'date' ? v : 'date'
  } catch {
    return 'date'
  }
}

export function saveConstellationMode(mode: ConstellationMode) {
  localStorage.setItem(CONSTELLATION_MODE_KEY, mode)
}
