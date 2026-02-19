import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
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

export function MonthView({ date, lang, profileId }: Props) {
  const T = getText(lang)
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const monthDays = eachDayOfInterval({ start, end })
  const allRecords = profileId ? loadDays(profileId) : []

  const points: KPoint[] = useMemo(() => {
    return monthDays.map((d, i) => {
      const ds = format(d, 'yyyy-MM-dd')
      const rec = allRecords.find((r) => r.date === ds)
      const score = rec?.moodScore ?? (profileId ? null : 4 + (i % 5))
      return { date: ds, score: profileId ? (rec?.moodScore ?? null) : score, label: format(d, 'd') }
    })
  }, [monthDays, allRecords, profileId])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = profileId ? monthDays.reduce((acc, d) => {
    const ds = format(d, 'yyyy-MM-dd')
    const rec = allRecords.find((r) => r.date === ds)
    if (!rec) return acc
    return acc + (rec.timeline?.length ?? 0) + (rec.edits ?? 0)
  }, 0) : 12

  return (
    <div className="month-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="month" height={180} />
      {!profileId && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{T.dataRequiresLogin}</p>}
      <GoBoard scores={validScores.length ? validScores : [5]} moves={totalMoves} edits={0} lang={lang} />
    </div>
  )
}
