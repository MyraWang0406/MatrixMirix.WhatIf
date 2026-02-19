import { useMemo } from 'react'
import { format, startOfYear, addMonths } from 'date-fns'
import type { Lang } from '../i18n'
import { loadDays } from '../store'
import { KLineChart } from './KLineChart'
import { GoBoard } from './GoBoard'
import type { KPoint } from './KLineChart'

interface Props {
  date: Date
  lang: Lang
  profileId: string
}

export function YearView({ date, lang, profileId }: Props) {
  const yearStart = startOfYear(date)
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i))
  }, [yearStart])

  const allRecords = loadDays(profileId)

  const points: KPoint[] = useMemo(() => {
    return months.map((m) => {
      const monthStr = format(m, 'yyyy-MM')
      const monthRecs = allRecords.filter((r) => r.date.startsWith(monthStr))
      const scores = monthRecs.map((r) => r.moodScore).filter((s): s is number => s != null && !isNaN(s))
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null
      return { date: format(m, 'yyyy-MM-dd'), score: avg, label: format(m, 'MMM') }
    })
  }, [months, allRecords])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = allRecords.reduce((acc, r) => acc + (r.timeline?.length ?? 0) + (r.edits ?? 0), 0)

  return (
    <div className="year-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="year" height={180} />
      <GoBoard
        scores={validScores.length ? validScores : [5]}
        moves={totalMoves}
        edits={0}
        lang={lang}
      />
    </div>
  )
}
