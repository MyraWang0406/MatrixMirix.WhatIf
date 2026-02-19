export type Dimension = 'profile' | 'day' | 'week' | 'month' | 'year' | 'lifetime'

/** EverMemOS-style: Profile = Who，长期身份与档案 */
export interface Profile {
  id: string
  name?: string
  birthDate: string // YYYY-MM-DD
  birthTime?: string // HH:mm，出生时间
  birthPlace?: string // 地点名称或经纬度，通过经纬度可校准出生时间生辰
  calibrationEvents: CalibrationEvent[]
  createdAt: string
}

/** 校准吉凶：时间可精确到年 / 年月 / 日 */
export interface CalibrationEvent {
  id: string
  timeKey: string // YYYY | YYYY-MM | YYYY-MM-DD
  desc: string
  kind: '吉' | '凶'
}

/** 日记录：与档案绑定，一生维度仍用 lifetime */
export interface DayRecord {
  id: string
  profileId: string
  date: string // YYYY-MM-DD
  moodScore: number | null // 每日一行心情分数 0～10
  timeline: TimelineEntry[]
  whatIfContext?: string // 模拟推演/WhatIf 补充背景
  edits: number
}

/** Memo & WhatIf 标签类型 */
export type MemoTagType = '心情随感' | '职场随记' | '设想推演'

export interface TimelineEntry {
  id: string
  time: string // HH:mm（日精确到小时）
  tagType: MemoTagType
  tags: string[]
  memo: string
  createdAt: string
}

/** 统一 Memo 档案：日周月年一生共用，精度由 timeKey 决定 */
export interface MemoEntry {
  id: string
  profileId: string
  dimension: Dimension
  timeKey: string // 日: YYYY-MM-DDTHH:mm, 周/月: YYYY-MM-DD, 年: YYYY-MM, 一生: YYYY
  tagType: MemoTagType
  content: string
  createdAt: string
}

export interface RegretArchive {
  id: string
  profileId: string
  date: string
  recordId: string
  goal: string
  loss: string
  need: string
  trigger: string
  createdAt: string
}

export interface FortuneItem {
  yi: string[]
  ji: string[]
  constellation: string
  tip: string
}
