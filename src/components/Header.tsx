import { format, addDays, subDays } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import type { Dimension } from '../types'
import type { Lang } from '../i18n'
import { getText } from '../i18n'

const localeMap = { zh: zhCN, en: enUS }

interface Props {
  dimension: Dimension
  onDimensionChange: (d: Dimension) => void
  lang: Lang
  onLangChange: (l: Lang) => void
  date: Date
  onDateChange?: (d: Date) => void
}

export function Header({ dimension, onDimensionChange, lang, onLangChange, date, onDateChange }: Props) {
  const T = getText(lang)
  const dims: Dimension[] = ['profile', 'day', 'week', 'month', 'quarter', 'year', 'lifetime']
  const dimLabels: Record<Dimension, string> = {
    profile: T.dimProfile,
    day: T.dimDay,
    week: T.dimWeek,
    month: T.dimMonth,
    quarter: T.dimQuarter,
    year: T.dimYear,
    lifetime: T.dimLifetime,
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-page)',
        borderBottom: '1px solid #e5e7eb',
        padding: '0.75rem 1rem',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h1
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--primary-dark)',
          }}
        >
          {T.appTitle}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {dims.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDimensionChange(d)}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.9rem',
                border: 'none',
                borderRadius: 8,
                background: dimension === d ? 'var(--primary)' : 'transparent',
                color: dimension === d ? 'white' : 'var(--text)',
                cursor: 'pointer',
              }}
            >
              {dimLabels[d]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onLangChange(lang === 'zh' ? 'en' : 'zh')}
            style={{
              padding: '0.4rem 0.6rem',
              fontSize: '0.8rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: 'transparent',
              color: 'var(--text)',
              cursor: 'pointer',
              marginLeft: '0.5rem',
            }}
          >
            {lang === 'zh' ? T.langEn : T.langZh}
          </button>
        </div>
      </div>
      <div
        style={{
          maxWidth: 900,
          margin: '0.25rem auto 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {T.slogan} {T.sloganSub}
        </span>
        {(dimension === 'day' || dimension === 'quarter') && onDateChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => onDateChange(subDays(date, 1))}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              ←
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 500, minWidth: 100, textAlign: 'center' }}>
              {format(date, 'yyyy-MM-dd', { locale: localeMap[lang] })}
            </span>
            <button
              type="button"
              onClick={() => onDateChange(addDays(date, 1))}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
