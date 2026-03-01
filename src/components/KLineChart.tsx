import { useEffect, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import type { Lang } from '../i18n'
import { getText } from '../i18n'

export interface KPoint {
  date: string
  score: number | null
  label?: string
  memo?: string
}

interface Props {
  points: KPoint[]
  lang: Lang
  granularity: 'day' | 'week' | 'month' | 'year' | 'lifetime'
  height?: number
}

const localeMap = { zh: zhCN, en: enUS }

// Build OHLC candle data from sequential scores
// Each bar: open=prev score, close=cur score, high=max(open,close)+tiny shadow, low=min(open,close)-tiny shadow
function buildCandles(points: KPoint[]): [number, number, number, number][] {
  const valid = points.filter((p) => p.score != null && !isNaN(p.score!))
  if (valid.length < 2) return []

  return valid.slice(1).map((p, i) => {
    const prev = valid[i]
    const open = prev.score!
    const close = p.score!
    const bodyRange = Math.abs(close - open)
    const shadowExtra = Math.max(bodyRange * 0.3, 0.5)
    const high = Math.max(open, close) + shadowExtra
    const low = Math.min(open, close) - shadowExtra
    return [open, close, low, high] as [number, number, number, number]
  })
}

export function KLineChart({ points, lang, granularity, height = 220 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<unknown>(null)
  const locale = localeMap[lang]
  const T = getText(lang)

  const valid = points.filter((p) => p.score != null && !isNaN(p.score!))

  const formatDate = (d: string) => {
    const parsed = parseISO(d)
    if (granularity === 'day') return format(parsed, 'HH:mm', { locale })
    if (granularity === 'week') return format(parsed, 'MM/dd', { locale })
    if (granularity === 'month') return format(parsed, 'dd', { locale })
    if (granularity === 'year') return format(parsed, 'MMM', { locale })
    return format(parsed, 'yyyy', { locale })
  }

  useEffect(() => {
    if (!containerRef.current || valid.length < 2) return

    // Dynamically import ECharts to avoid SSR issues
    import('echarts').then((echarts) => {
      if (!containerRef.current) return

      // Dispose old chart if exists
      if (chartRef.current) {
        ;(chartRef.current as { dispose(): void }).dispose()
      }

      const chart = echarts.init(containerRef.current)
      chartRef.current = chart

      const dates = valid.slice(1).map((p) => formatDate(p.date))
      const candles = buildCandles(points) // [open, close, low, high]

      // Color palette inspired by lifekline.ai
      const UP_COLOR = '#ef4444'   // red = rising fortune (Chinese stock convention)
      const DOWN_COLOR = '#22c55e' // green = falling fortune

      const scores = valid.map((p) => p.score!)
      const scoreMin = Math.min(...scores)
      const scoreMax = Math.max(...scores)
      const yPad = (scoreMax - scoreMin) * 0.15 || 5

      const isLifetime = granularity === 'lifetime'

      const option = {
        backgroundColor: 'transparent',
        animation: true,
        animationDuration: 600,
        grid: {
          top: 16,
          bottom: isLifetime ? 48 : 36,
          left: 52,
          right: 20,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: (params: unknown[]) => {
            const p = (params as { name: string; data: number[] }[])[0]
            if (!p?.data) return ''
            const [open, close] = p.data
            const dir = close >= open ? '↑' : '↓'
            const color = close >= open ? UP_COLOR : DOWN_COLOR
            return `<div style="font-size:12px">
              <div style="font-weight:600;margin-bottom:4px">${p.name}</div>
              <div style="color:${color}">${dir} ${lang === 'zh' ? '运势' : 'Fortune'}: ${close.toFixed(1)}</div>
              <div style="color:#9ca3af;font-size:11px">${lang === 'zh' ? '前值' : 'Prev'}: ${open.toFixed(1)}</div>
            </div>`
          },
        },
        xAxis: {
          type: 'category',
          data: dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisLabel: {
            color: '#6b7280',
            fontSize: isLifetime ? 9 : 10,
            interval: isLifetime && dates.length > 20
              ? Math.floor(dates.length / 10)
              : 'auto',
            rotate: isLifetime ? 45 : 0,
          },
          axisTick: { show: false },
          splitLine: { show: false },
        },
        yAxis: {
          type: 'value',
          min: Math.max(0, scoreMin - yPad),
          max: scoreMax + yPad,
          splitNumber: isLifetime ? 4 : 4,
          axisLabel: {
            color: '#6b7280',
            fontSize: 10,
            formatter: (v: number) => v.toFixed(0),
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        },
        series: [
          {
            type: 'candlestick',
            data: candles,
            itemStyle: {
              color: UP_COLOR,         // bullish body fill
              color0: DOWN_COLOR,      // bearish body fill
              borderColor: UP_COLOR,   // bullish border
              borderColor0: DOWN_COLOR,// bearish border
              borderWidth: 1.5,
            },
            barMaxWidth: isLifetime ? 6 : 14,
          },
          // Overlay a subtle area line for trend context
          {
            type: 'line',
            data: valid.slice(1).map((p) => p.score),
            smooth: 0.4,
            symbol: 'none',
            lineStyle: {
              color: 'rgba(99,102,241,0.25)',
              width: 1.5,
              type: 'dashed',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(99,102,241,0.10)' },
                  { offset: 1, color: 'rgba(99,102,241,0.00)' },
                ],
              },
            },
            z: 1,
          },
        ],
      }

      chart.setOption(option)

      const handleResize = () => chart.resize()
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        chart.dispose()
      }
    })

    return () => {
      if (chartRef.current) {
        ;(chartRef.current as { dispose(): void }).dispose()
        chartRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, lang, granularity])

  return (
    <section
      className="kline-chart"
      style={{
        background: 'var(--card-bg)',
        borderRadius: 12,
        padding: '1rem 1.25rem',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
      }}
    >
      {granularity === 'lifetime' && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>{T.scoreAxis} 0–100 · {T.yearAxis}</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#ef4444', borderRadius: 2 }} />
            <span>{lang === 'zh' ? '运势上行' : 'Rising'}</span>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#22c55e', borderRadius: 2, marginLeft: 4 }} />
            <span>{lang === 'zh' ? '运势下行' : 'Falling'}</span>
          </span>
        </div>
      )}

      {valid.length < 2 ? (
        <div
          style={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
          }}
        >
          {lang === 'zh' ? '数据不足，请记录更多日记' : 'Not enough data yet'}
        </div>
      ) : (
        <div ref={containerRef} style={{ width: '100%', height }} />
      )}

      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f3f4f6',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          whiteSpace: 'pre-line',
        }}
      >
        {T.footnote}
      </div>
    </section>
  )
}
