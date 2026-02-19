import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
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

export function MonthView({ date, lang, profileId }: Props) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const monthDays = eachDayOfInterval({ start, end })

  const allRecords = loadDays(profileId)

  const points: KPoint[] = useMemo(() => {
    return monthDays.map((d) => {
      const ds = format(d, 'yyyy-MM-dd')
      const rec = allRecords.find((r) => r.date === ds)
      const score = rec?.moodScore ?? null
      return { date: ds, score, label: format(d, 'd') }
    })
  }, [monthDays, allRecords])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = monthDays.reduce((acc, d) => {
    const ds = format(d, 'yyyy-MM-dd')
    const rec = allRecords.find((r) => r.date === ds)
    if (!rec) return acc
    return acc + (rec.timeline?.length ?? 0) + (rec.edits ?? 0)
  }, 0)

  return (
    <div className="month-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="month" height={180} />
      <GoBoard
        scores={validScores.length ? validScores : [5]}
        moves={totalMoves}
        edits={0}
        lang={lang}
      />
    </div>
  )
}
