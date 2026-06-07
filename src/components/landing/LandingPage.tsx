import { useRef, useState } from 'react'
import LandingNavbar  from './LandingNavbar'
import HeroSection    from './HeroSection'
import StatsBand      from './StatsBand'
import FeaturesSection from './FeaturesSection'
import AuthSection    from './AuthSection'
import LandingFooter  from './LandingFooter'

const LandingPage = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const authRef = useRef<HTMLElement>(null)

  const goToAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setTimeout(() => {
      authRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 40)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <LandingNavbar
        onSignIn={() => goToAuth('signin')}
        onGetStarted={() => goToAuth('signup')}
      />
      <HeroSection
        onGetStarted={() => goToAuth('signup')}
        onSeeHow={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <StatsBand />
      <FeaturesSection />
      <section ref={authRef} style={{ scrollMarginTop: '80px' }}>
        <AuthSection mode={authMode} onModeChange={setAuthMode} />
      </section>
      <LandingFooter />
    </div>
  )
}

export default LandingPage
