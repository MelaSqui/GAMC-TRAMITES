import { useEffect, useState } from 'react'
import { API } from '../lib/api'
import type { Unit } from '../lib/types'
import UnitCard from '../components/UnitCard'

export default function Home() {
  const [units, setUnits] = useState<Unit[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    API.listUnits()
      .then(setUnits)
      .catch(e => setError(e.message))
  }, [])

  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!units) return <div className="text-slate-500">Cargando unidades…</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Unidades</h1>
        <p className="text-slate-500">Elige una unidad para ver sus trámites.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map(u => <UnitCard key={u.id} unit={u} />)}
      </div>
    </div>
  )
}
