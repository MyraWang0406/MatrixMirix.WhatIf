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
      // 参考流年大运K线：起步约50，青年期低谷(约28)，中晚年升高再略降，分数约 0–100
      const lifeCurveScore = (age: number): number => {
        if (age <= 0) return 48
        if (age <= 20) return 45 + (age / 20) * 12
        if (age <= 29) return 57 - (age - 20) * (22 / 9)
        if (age <= 50) return 35 + (age - 29) * (30 / 21)
        if (age <= 80) return 65 + (age - 50) * (28 / 30)
        return Math.max(72, 93 - (age - 80) * 1.4)
      }
      const currentYear = new Date().getFullYear()
      const baseYear = currentYear - 50
      return Array.from({ length: 90 }, (_, i) => {
        const age = i + 1
        const y = baseYear + age
        return {
          date: `${y}-01-01`,
          score: Math.round(lifeCurveScore(age) * 10) / 10,
          label: String(y),
        }
      })
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
