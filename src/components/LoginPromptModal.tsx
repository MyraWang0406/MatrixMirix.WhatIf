import type { Lang } from '../i18n'
import { getText } from '../i18n'

interface Props {
  lang: Lang
  onGoProfile: () => void
  onClose: () => void
}

export function LoginPromptModal({ lang, onGoProfile, onClose }: Props) {
  const T = getText(lang)
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: 12,
          padding: '1.5rem',
          maxWidth: 380,
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem' }}>{T.loginPromptTitle}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
          {T.loginPromptDesc}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onGoProfile}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 8,
              background: 'var(--primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {T.loginPromptAction}
          </button>
        </div>
      </div>
    </div>
  )
}
