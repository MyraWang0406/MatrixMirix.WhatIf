import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from 'date-fns'
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

function startOfQuarter(d: Date): Date {
  const month = d.getMonth()
  const startMonth = Math.floor(month / 3) * 3
  return startOfMonth(new Date(d.getFullYear(), startMonth, 1))
}

export function QuarterView({ date, lang, profileId }: Props) {
  const T = getText(lang)
  const start = useMemo(() => startOfQuarter(date), [date])
  const end = useMemo(() => endOfMonth(addMonths(start, 2)), [start])
  const quarterDays = useMemo(() => eachDayOfInterval({ start, end }), [start, end])
  const allRecords = profileId ? loadDays(profileId) : []

  const points: KPoint[] = useMemo(() => {
    return quarterDays.map((d, i) => {
      const ds = format(d, 'yyyy-MM-dd')
      const rec = allRecords.find((r) => r.date === ds)
      const score = rec?.moodScore ?? (profileId ? null : 4 + (i % 7) % 5)
      return { date: ds, score: profileId ? (rec?.moodScore ?? null) : score, label: format(d, 'd') }
    })
  }, [quarterDays, allRecords, profileId])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = profileId ? quarterDays.reduce((acc, d) => {
    const ds = format(d, 'yyyy-MM-dd')
    const rec = allRecords.find((r) => r.date === ds)
    if (!rec) return acc
    return acc + (rec.timeline?.length ?? 0) + (rec.edits ?? 0)
  }, 0) : 18

  return (
    <div className="quarter-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="month" height={180} />
      {!profileId && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{T.dataRequiresLogin}</p>}
      <GoBoard scores={validScores.length ? validScores : [5]} moves={totalMoves} edits={0} lang={lang} />
    </div>
  )
}
