import { useMemo } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
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

const localeMap = { zh: zhCN, en: enUS }

export function WeekView({ date, lang, profileId }: Props) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  }, [weekStart])

  const allRecords = loadDays(profileId)

  const points: KPoint[] = useMemo(() => {
    return days.map((d) => {
      const ds = format(d, 'yyyy-MM-dd')
      const rec = allRecords.find((r) => r.date === ds)
      const score = rec?.moodScore ?? null
      return { date: ds, score, label: format(d, 'M/d', { locale: localeMap[lang] }) }
    })
  }, [days, allRecords, lang])

  const validScores = points.map((p) => p.score).filter((s): s is number => s != null && !isNaN(s))
  const totalMoves = days.reduce((acc, d) => {
    const ds = format(d, 'yyyy-MM-dd')
    const rec = allRecords.find((r) => r.date === ds)
    if (!rec) return acc
    return acc + (rec.timeline?.length ?? 0) + (rec.moodScore != null ? 1 : 0) + (rec.edits ?? 0)
  }, 0)

  return (
    <div className="week-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <KLineChart points={points} lang={lang} granularity="week" />
      <GoBoard
        scores={validScores.length ? validScores : [5]}
        moves={totalMoves}
        edits={0}
        lang={lang}
      />
    </div>
  )
}
