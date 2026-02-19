import { useMemo } from 'react'
import { format, startOfYear, addMonths } from 'date-fns'
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

export function YearView({ date, lang, profileId }: Props) {
  const T = getText(lang)
  const yearStart = startOfYear(date)
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i)), [yearStart])
  const allRecords = profileId ? loadDays(profileId) : []

  const points: KPoint[] = useMemo(() => {
    return months.map((m, i) => {
      if (!profileId) return { date: format(m, 'yyyy-MM-dd'), score: 4 + (i % 5), label: format(m, 'MMM') }
      const monthStr = format(m, 'yyyy-MM')
      const monthRecs = allRecords.filter((r) => r.date.startsWith(monthStr))
      const scores = monthRecs.map((r) => r.moodScore).filter((s): s is number => s != null && !isNaN(s))
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null
      return { date: format(m, 'yyyy-MM-dd'), score: avg, label: format(m, 'MMM') }
    })
  }, [months, allRecords, profileId])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = profileId ? allRecords.reduce((acc, r) => acc + (r.timeline?.length ?? 0) + (r.edits ?? 0), 0) : 24

  return (
    <div className="year-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="year" height={180} />
      {!profileId && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{T.dataRequiresLogin}</p>}
      <GoBoard scores={validScores.length ? validScores : [5]} moves={totalMoves} edits={0} lang={lang} />
    </div>
  )
}
