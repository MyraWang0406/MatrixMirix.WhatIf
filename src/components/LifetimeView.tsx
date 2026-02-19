import { useMemo } from 'react'
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

export function LifetimeView({ date: _date, lang, profileId }: Props) {
  const allRecords = loadDays(profileId)
  const sorted = useMemo(() => [...allRecords].sort((a, b) => a.date.localeCompare(b.date)), [allRecords])

  const byYear = useMemo(() => {
    const map = new Map<string, number[]>()
    for (const r of sorted) {
      const y = r.date.slice(0, 4)
      if (r.moodScore != null && !isNaN(r.moodScore)) {
        if (!map.has(y)) map.set(y, [])
        map.get(y)!.push(r.moodScore)
      }
    }
    return map
  }, [sorted])

  const points: KPoint[] = useMemo(() => {
    const years = Array.from(byYear.keys()).sort()
    return years.map((y) => {
      const scores = byYear.get(y)!
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      return { date: `${y}-01-01`, score: avg, label: y }
    })
  }, [byYear])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = allRecords.reduce((acc, r) => acc + (r.timeline?.length ?? 0) + (r.edits ?? 0), 0)

  return (
    <div className="lifetime-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="lifetime" height={180} />
      <GoBoard
        scores={validScores.length ? validScores : [5]}
        moves={totalMoves}
        edits={0}
        lang={lang}
      />
    </div>
  )
}
