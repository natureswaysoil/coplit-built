import React, { useState } from 'react'

export interface UsageInstructionsData {
  applicationRate: string
  mixing: string
  timing: string
  frequency: string
  method: string
  coverage?: string
  safety?: string
  tips?: string[]
}

export default function UsageInstructionsSection({ instructions }: { instructions: UsageInstructionsData }) {
  const [open, setOpen] = useState(true)
  return (
    <section className="card" style={{marginTop: 'var(--space-xl)', backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)'}}>
      <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: open ? 'var(--space-lg)' : '0'}}>
        <h2 style={{margin: '0', color: 'var(--primary)'}}>
          How to Use This Product
        </h2>
        <button
          onClick={() => setOpen(x => !x)}
          aria-expanded={open}
          className="btn btn-primary btn-sm"
        >{open ? 'Hide' : 'Show'}</button>
      </header>

      {open && (
        <div>
          <div className="grid grid-3" style={{marginBottom: 'var(--space-lg)'}}>
            <Card title="Application Rate" text={instructions.applicationRate} />
            <Card title="Mixing Instructions" text={instructions.mixing} />
            <Card title="Best Timing" text={instructions.timing} />
            <Card title="Frequency" text={instructions.frequency} />
            <Card title="Application Method" text={instructions.method} />
            {instructions.coverage && <Card title="Coverage Area" text={instructions.coverage} />}
          </div>

          {instructions.tips && instructions.tips.length > 0 && (
            <div className="card" style={{marginBottom: 'var(--space-md)', backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)'}}>
              <h3 style={{marginBottom: 'var(--space-md)', color: 'var(--primary)'}}>Pro Tips for Best Results</h3>
              <ul style={{margin: '0', paddingLeft: 'var(--space-lg)', lineHeight: '1.6'}}>
                {instructions.tips.map((tip, idx) => (
                  <li key={idx} style={{marginBottom: 'var(--space-sm)', color: 'var(--primary)'}}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {instructions.safety && (
            <div className="card" style={{backgroundColor: 'var(--success-100)', border: '2px solid var(--success-200)'}}>
              <h3 style={{marginBottom: 'var(--space-sm)', color: 'var(--primary)'}}>Safety Information</h3>
              <p style={{margin: '0', fontWeight: '500', lineHeight: '1.6', color: 'var(--success-900)'}}>{instructions.safety}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="card" style={{backgroundColor: 'var(--neutral-50)', border: '1px solid var(--success-200)'}}>
      <h3 style={{margin: '0', marginBottom: 'var(--space-sm)', color: 'var(--primary)'}}>{title}</h3>
      <p style={{margin: '0', lineHeight: '1.6', color: 'var(--neutral-800)'}}>{text}</p>
    </div>
  )
}
