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
    <section className="mt-12 rounded-xl border border-green-100 bg-green-50/70 shadow-sm">
      <header className={`flex items-center justify-between ${open ? 'mb-5' : ''} px-6 pt-6`}>
        <h2 className="m-0 flex items-center gap-2 text-2xl font-extrabold text-brand-700">
          <span>📋</span> How to Use This Product
        </h2>
        <button
          onClick={() => setOpen(x => !x)}
          aria-expanded={open}
          className="rounded-md bg-brand-700 px-3 py-1 text-sm font-semibold text-white hover:bg-brand-800"
        >{open ? 'Hide' : 'Show'}</button>
      </header>

      {open && (
        <div className="px-6 pb-6">
          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="🥄 Application Rate" text={instructions.applicationRate} />
            <Card title="🧪 Mixing Instructions" text={instructions.mixing} />
            <Card title="⏰ Best Timing" text={instructions.timing} />
            <Card title="🔄 Frequency" text={instructions.frequency} />
            <Card title="🚿 Application Method" text={instructions.method} />
            {instructions.coverage && <Card title="📏 Coverage Area" text={instructions.coverage} />}
          </div>

          {instructions.tips && instructions.tips.length > 0 && (
            <div className="mb-4 rounded-lg border border-green-100 bg-white p-5">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-brand-700">💡 Pro Tips for Best Results</h3>
              <ul className="m-0 list-disc pl-5">
                {instructions.tips.map((tip, idx) => (
                  <li key={idx} className="mb-2 leading-relaxed text-green-800">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {instructions.safety && (
            <div className="rounded-lg border-2 border-green-200 bg-green-100 p-5">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-brand-700">🛡️ Safety Information</h3>
              <p className="m-0 font-medium leading-relaxed text-green-900">{instructions.safety}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-green-100 bg-white p-4">
      <h3 className="m-0 mb-2 text-lg font-bold text-brand-700">{title}</h3>
      <p className="m-0 leading-relaxed text-gray-800">{text}</p>
    </div>
  )
}
