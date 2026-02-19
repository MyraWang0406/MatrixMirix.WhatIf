import { useMemo } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import type { Lang } from '../i18n'
import { getText } from '../i18n'
import { loadDays } from '../store'
import { KLineChart } from './KLineChart'
import { GoBoard } from './GoBoard'
import type { KPoint } from './KLineChart'

interface Props {
  date: Date
  lang: Lang
  profileId: string | null
}

const localeMap = { zh: zhCN, en: enUS }

export function WeekView({ date, lang, profileId }: Props) {
  const T = getText(lang)
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])
  const allRecords = profileId ? loadDays(profileId) : []

  const points: KPoint[] = useMemo(() => {
    return days.map((d) => {
      const ds = format(d, 'yyyy-MM-dd')
      const rec = allRecords.find((r) => r.date === ds)
      const score = rec?.moodScore ?? (profileId ? null : 4 + (d.getDay() % 3))
      return { date: ds, score: profileId ? (rec?.moodScore ?? null) : score, label: format(d, 'M/d', { locale: localeMap[lang] }) }
    })
  }, [days, allRecords, lang, profileId])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = profileId ? days.reduce((acc, d) => {
    const ds = format(d, 'yyyy-MM-dd')
    const rec = allRecords.find((r) => r.date === ds)
    if (!rec) return acc
    return acc + (rec.timeline?.length ?? 0) + (rec.moodScore != null ? 1 : 0) + (rec.edits ?? 0)
  }, 0) : 6

  return (
    <div className="week-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="week" />
      {!profileId && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{T.dataRequiresLogin}</p>}
      <GoBoard scores={validScores.length ? validScores : [5]} moves={totalMoves} edits={0} lang={lang} />
    </div>
  )
}
