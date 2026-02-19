import { useMemo } from 'react'
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

export function LifetimeView({ date: _date, lang, profileId }: Props) {
  const T = getText(lang)
  const allRecords = profileId ? loadDays(profileId) : []
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
    if (!profileId) {
      const y = new Date().getFullYear()
      return Array.from({ length: 5 }, (_, i) => ({ date: `${y - 4 + i}-01-01`, score: 4 + (i % 4), label: String(y - 4 + i) }))
    }
    const years = Array.from(byYear.keys()).sort()
    return years.map((y) => {
      const scores = byYear.get(y)!
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      return { date: `${y}-01-01`, score: avg, label: y }
    })
  }, [byYear, profileId])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = profileId ? allRecords.reduce((acc, r) => acc + (r.timeline?.length ?? 0) + (r.edits ?? 0), 0) : 30

  return (
    <div className="lifetime-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="lifetime" height={180} />
      {!profileId && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{T.dataRequiresLogin}</p>}
      <GoBoard scores={validScores.length ? validScores : [5]} moves={totalMoves} edits={0} lang={lang} />
    </div>
  )
}
