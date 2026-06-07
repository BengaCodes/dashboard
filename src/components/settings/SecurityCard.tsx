import { useState } from 'react'
import Button from '../common/Button'
import { card, sectionLabel, fieldLabel, inputStyle, focusIn, focusOut } from './settingsShared'

const SecurityCard = () => {
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')

  return (
    <div style={card}>
      <p style={sectionLabel}>Security</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {([
          { label: 'Current password', value: current, set: setCurrent },
          { label: 'New password',     value: next,    set: setNext    },
          { label: 'Confirm password', value: confirm, set: setConfirm },
        ] as const).map(({ label, value, set }) => (
          <div key={label}>
            <p style={fieldLabel}>{label}</p>
            <input
              type='password'
              style={inputStyle}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder='••••••••'
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <Button variant='primary' onClick={() => {}}>Save changes</Button>
      </div>
    </div>
  )
}

export default SecurityCard
