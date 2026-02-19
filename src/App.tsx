import { useState, useCallback } from 'react'
import { loadLang, saveLang, getCurrentProfileId, getCurrentProfile } from './store'
import type { Dimension } from './types'
import type { Lang } from './i18n'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LoginPromptModal } from './components/LoginPromptModal'
import { ProfileView } from './components/ProfileView'
import { DayView } from './components/DayView'
import { WeekView } from './components/WeekView'
import { MonthView } from './components/MonthView'
import { QuarterView } from './components/QuarterView'
import { YearView } from './components/YearView'
import { LifetimeView } from './components/LifetimeView'

export default function App() {
  const [dimension, setDimensionState] = useState<Dimension>('day')
  const [date, setDate] = useState(() => new Date())
  const [lang, setLangState] = useState<Lang>(loadLang)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const profileId = getCurrentProfileId()
  const currentProfile = getCurrentProfile()
  const hasProfile = !!profileId

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    saveLang(l)
  }, [])

  const setDimension = useCallback(
    (d: Dimension) => {
      if (d !== 'profile' && d !== 'day' && !hasProfile) {
        setShowLoginPrompt(true)
        return
      }
      setDimensionState(d)
    },
    [hasProfile]
  )

  const goProfile = () => {
    setShowLoginPrompt(false)
    setDimensionState('profile')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-page)',
        paddingBottom: 60,
      }}
    >
      <Header
        dimension={dimension}
        onDimensionChange={setDimension}
        lang={lang}
        onLangChange={setLang}
        date={date}
        onDateChange={setDate}
      />
      <main
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '1rem',
        }}
      >
        {dimension === 'profile' && (
          <ProfileView lang={lang} onDone={() => setDimensionState('day')} />
        )}
        {dimension === 'day' && (
          <DayView
            date={date}
            lang={lang}
            profileId={profileId}
            currentProfile={currentProfile}
            onNeedProfile={() => setShowLoginPrompt(true)}
          />
        )}
        {dimension === 'week' && hasProfile && <WeekView date={date} lang={lang} profileId={profileId!} />}
        {dimension === 'month' && hasProfile && <MonthView date={date} lang={lang} profileId={profileId!} />}
        {dimension === 'quarter' && hasProfile && <QuarterView date={date} lang={lang} profileId={profileId!} />}
        {dimension === 'year' && hasProfile && <YearView date={date} lang={lang} profileId={profileId!} />}
        {dimension === 'lifetime' && hasProfile && <LifetimeView date={date} lang={lang} profileId={profileId!} />}
        {dimension === 'week' && !hasProfile && null}
        {dimension === 'month' && !hasProfile && null}
        {dimension === 'quarter' && !hasProfile && null}
        {dimension === 'year' && !hasProfile && null}
        {dimension === 'lifetime' && !hasProfile && null}
      </main>
      <Footer lang={lang} />
      {showLoginPrompt && (
        <LoginPromptModal
          lang={lang}
          onGoProfile={goProfile}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </div>
  )
}
