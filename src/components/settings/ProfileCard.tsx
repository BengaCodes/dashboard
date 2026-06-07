import { useState } from 'react'
import Button from '../common/Button'
import { card, sectionLabel, fieldLabel, inputStyle, focusIn, focusOut } from './settingsShared'

const ProfileCard = ({ email }: { email: string }) => {
  const [name, setName] = useState(() => {
    const local = email.split('@')[0]
    return local.split(/[._-]/).filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
  })

  return (
    <div style={card}>
      <p style={sectionLabel}>Profile</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <p style={fieldLabel}>Display name</p>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} onFocus={focusIn} onBlur={focusOut} />
        </div>
        <div>
          <p style={fieldLabel}>Email address</p>
          <input style={{ ...inputStyle, color: 'var(--color-text-muted)', cursor: 'not-allowed' }} value={email} readOnly />
        </div>
        <div>
          <p style={fieldLabel}>Currency</p>
          <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focusIn} onBlur={focusOut}>
            <option value='GBP'>GBP — British Pound (£)</option>
            <option value='USD'>USD — US Dollar ($)</option>
            <option value='EUR'>EUR — Euro (€)</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Button variant='primary' onClick={() => {}}>Save changes</Button>
      </div>
    </div>
  )
}

export default ProfileCard
