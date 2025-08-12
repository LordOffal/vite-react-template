# Open, Device-Friendly Character Sheet (ODCS)
# React + Vite + TypeScript + Tailwind + PWA
# Cloudflare Pages ready

# ---------------------------
# File: package.json
# ---------------------------
{
  "name": "odcs-react-starter",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "idb-keyval": "^6.2.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4",
    "vite": "^5.4.2",
    "@vitejs/plugin-react": "^4.3.1",
    "vite-plugin-pwa": "^0.20.5"
  }
}

# ---------------------------
# File: tsconfig.json
# ---------------------------
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}

# ---------------------------
# File: vite.config.ts
# ---------------------------
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ODCS – Character Sheet',
        short_name: 'ODCS',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b0f1a',
        theme_color: '#0ea5e9',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] }
    })
  ],
  server: { port: 5173 },
  build: { outDir: 'dist' }
})

# ---------------------------
# File: index.html
# ---------------------------
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ODCS – Character Sheet</title>
  <link rel="icon" href="/favicon.svg" />
</head>
<body class="bg-slate-950 text-slate-100">
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>

# ---------------------------
# File: postcss.config.js
# ---------------------------
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

# ---------------------------
# File: tailwind.config.js
# ---------------------------
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

# ---------------------------
# File: src/styles.css
# ---------------------------
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }

# ---------------------------
# File: src/types.ts
# ---------------------------
import { z } from 'zod'

export const AbilityScore = z.number().int().min(1).max(30)

export const CharacterSchema = z.object({
  meta: z.object({ format: z.literal('odcs-1'), created: z.string(), updated: z.string() }),
  identity: z.object({
    name: z.string(), species: z.string().optional().default(''),
    class: z.string().optional().default(''), level: z.number().int().default(1),
    background: z.string().optional().default(''), alignment: z.string().optional().default('')
  }),
  abilities: z.object({
    str: AbilityScore.default(10), dex: AbilityScore.default(10), con: AbilityScore.default(10),
    int: AbilityScore.default(10), wis: AbilityScore.default(10), cha: AbilityScore.default(10)
  }),
  proficiency: z.object({ bonus: z.number().default(2), skills: z.array(z.string()).default([]), saves: z.array(z.string()).default([]) }),
  combat: z.object({
    ac: z.number().default(10),
    hp: z.object({ max: z.number().default(10), current: z.number().default(10), temp: z.number().default(0) }),
    speed: z.number().default(30), initiative: z.number().default(0)
  }),
  features: z.array(z.object({ name: z.string(), level: z.number().int().default(1), source: z.string().default('custom'), text: z.string().default('') })).default([]),
  spells: z.object({ casting: z.object({ ability: z.string().default('int'), prepared_max: z.number().default(0) }), known: z.array(z.string()).default([]), prepared: z.array(z.string()).default([]) }),
  inventory: z.array(z.object({ name: z.string(), qty: z.number().default(1), weight: z.number().default(0), notes: z.string().default('') })).default([]),
  notes: z.object({ bio: z.string().default(''), dm: z.string().default('') }),
  extensions: z.record(z.any()).default({})
})

export type Character = z.infer<typeof CharacterSchema>

export function newCharacter(name = 'New Character'): Character {
  const now = new Date().toISOString()
  return {
    meta: { format: 'odcs-1', created: now, updated: now },
    identity: { name, species: '', class: '', level: 1, background: '', alignment: '' },
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    proficiency: { bonus: 2, skills: [], saves: [] },
    combat: { ac: 10, hp: { max: 10, current: 10, temp: 0 }, speed: 30, initiative: 0 },
    features: [],
    spells: { casting: { ability: 'int', prepared_max: 0 }, known: [], prepared: [] },
    inventory: [],
    notes: { bio: '', dm: '' },
    extensions: {}
  }
}

# ---------------------------
# File: src/lib/idb.ts
# ---------------------------
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval'

export const idb = {
  get: <T = unknown>(key: string) => idbGet<T>(key),
  set: (key: string, value: unknown) => idbSet(key, value),
  del: (key: string) => idbDel(key)
}

# ---------------------------
# File: src/lib/spells.ts
# ---------------------------
import { idb } from './idb'

const OPEN5E = 'https://api.open5e.com/spells/'
const DND5E = 'https://www.dnd5eapi.co/api/spells'

export type Spell = { name: string; desc?: string; level?: number; school?: string; url?: string }

export async function fetchSpells(query?: string): Promise<Spell[]> {
  const cacheKey = query ? `spells:${query.toLowerCase()}` : 'spells:all'
  const cached = await idb.get<Spell[]>(cacheKey)
  if (cached) return cached

  try {
    const url = query ? `${OPEN5E}?search=${encodeURIComponent(query)}` : OPEN5E
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) throw new Error('Open5e down')
    const data = await res.json()
    const results: Spell[] = (data?.results || []).map((s: any) => ({ name: s.name, desc: s.desc, level: s.level, school: s.school, url: s.slug }))
    await idb.set(cacheKey, results)
    return results
  } catch {
    const url = query ? `${DND5E}?name=${encodeURIComponent(query)}` : DND5E
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) throw new Error('Spell APIs unavailable')
    const data = await res.json()
    const results: Spell[] = (data?.results || data || []).map((s: any) => ({ name: s.name, url: s.url }))
    await idb.set(cacheKey, results)
    return results
  }
}

# ---------------------------
# File: src/lib/file.ts
# ---------------------------
import { Character, CharacterSchema } from '@/types'

export async function importCharacterFile(file: File): Promise<Character> {
  const text = await file.text()
  const isXML = file.name.endsWith('.xml') || text.trim().startsWith('<')
  if (isXML) return importFromXML(text)
  const json = JSON.parse(text)
  return normalize(json)
}

function normalize(input: any): Character {
  // If already ODCS format, validate and return
  if (input?.meta?.format === 'odcs-1') return CharacterSchema.parse(input)
  // Minimal best‑effort mapper for unknown JSON (extend adapters as needed)
  const name = input?.identity?.name || input?.name || 'Imported Character'
  return CharacterSchema.parse({
    meta: { format: 'odcs-1', created: new Date().toISOString(), updated: new Date().toISOString() },
    identity: { name, species: input?.identity?.species || input?.race || '', class: input?.class || '', level: input?.level || 1, background: input?.background || '', alignment: input?.alignment || '' },
    abilities: input?.abilities || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    proficiency: input?.proficiency || { bonus: 2, skills: [], saves: [] },
    combat: input?.combat || { ac: 10, hp: { max: 10, current: 10, temp: 0 }, speed: 30, initiative: 0 },
    features: input?.features || [],
    spells: input?.spells || { casting: { ability: 'int', prepared_max: 0 }, known: [], prepared: [] },
    inventory: input?.inventory || [],
    notes: input?.notes || { bio: '', dm: '' },
    extensions: input?.extensions || {}
  })
}

function importFromXML(xmlString: string): Character {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml')
  const get = (sel: string) => doc.querySelector(sel)?.textContent ?? ''
  const asInt = (v: string, d = 0) => Number.parseInt(v || '', 10) || d
  // Very light FC5e‑style mapping; extend to support more formats
  const name = get('character > name') || get('name') || 'Imported Character'
  return normalize({
    identity: { name, species: get('race'), class: get('class'), level: asInt(get('level'), 1), background: get('background'), alignment: get('alignment') },
    abilities: {
      str: asInt(get('abilities > strength > score'), 10),
      dex: asInt(get('abilities > dexterity > score'), 10),
      con: asInt(get('abilities > constitution > score'), 10),
      int: asInt(get('abilities > intelligence > score'), 10),
      wis: asInt(get('abilities > wisdom > score'), 10),
      cha: asInt(get('abilities > charisma > score'), 10)
    },
    combat: {
      ac: asInt(get('ac'), 10),
      hp: { max: asInt(get('hp > max'), 10), current: asInt(get('hp > current'), 10), temp: 0 },
      speed: asInt(get('speed'), 30), initiative: asInt(get('initiative'), 0)
    },
    spells: { casting: { ability: 'int', prepared_max: 0 }, known: [], prepared: [] },
    inventory: []
  })
}

export async function exportCharacterJSON(char: Character) {
  const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' })
  const fileName = `${char.identity.name || 'character'}.odcs.json`

  if ('showSaveFilePicker' in window) {
    // @ts-ignore
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [{ description: 'Character JSON', accept: { 'application/json': ['.json'] } }]
    })
    const writable = await handle.createWritable()
    await writable.write(blob)
    await writable.close()
    return
  }

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName
  a.click()
  URL.revokeObjectURL(a.href)
}

# ---------------------------
# File: src/state/useCharacterStore.ts
# ---------------------------
import { create } from 'zustand'
import { Character, newCharacter } from '@/types'
import { idb } from '@/lib/idb'

interface State {
  character: Character
  setCharacter: (c: Character) => void
  loadFromIDB: () => Promise<void>
}

export const useCharacterStore = create<State>((set, get) => ({
  character: newCharacter(),
  setCharacter: (c) => { set({ character: { ...c, meta: { ...c.meta, updated: new Date().toISOString() } } }); idb.set('odcs:character', c) },
  loadFromIDB: async () => {
    const saved = await idb.get<Character>('odcs:character')
    if (saved) set({ character: saved })
  }
}))

# ---------------------------
# File: src/components/EditableField.tsx
# ---------------------------
import { useState } from 'react'

type Props = { label: string; value: string | number; onChange: (v: string) => void; type?: 'text' | 'number' }
export default function EditableField({ label, value, onChange, type = 'text' }: Props) {
  const [editing, setEditing] = useState(false)
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="w-28 text-slate-300 text-sm">{label}</span>
      {editing ? (
        <input
          autoFocus
          type={type}
          className="flex-1 rounded bg-slate-800 px-2 py-1 outline-none ring-1 ring-slate-700"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
        />
      ) : (
        <button className="flex-1 text-left rounded px-2 py-1 hover:bg-slate-800" onClick={() => setEditing(true)}>
          {String(value)}
        </button>
      )}
    </div>
  )
}

# ---------------------------
# File: src/components/SpellsSearch.tsx
# ---------------------------
import { useEffect, useState } from 'react'
import { fetchSpells, Spell } from '@/lib/spells'

export default function SpellsSearch() {
  const [q, setQ] = useState('')
  const [spells, setSpells] = useState<Spell[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    setLoading(true); setError(null)
    try {
      const data = await fetchSpells(q)
      setSpells(data)
    } catch (e: any) { setError(e?.message || 'Failed to load spells') }
    finally { setLoading(false) }
  }

  useEffect(() => { run() }, [])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="flex-1 rounded bg-slate-800 px-2 py-2 ring-1 ring-slate-700" placeholder="Search spells…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="rounded bg-sky-500 px-3 py-2 text-slate-900 font-semibold" onClick={run}>Search</button>
      </div>
      {loading && <div className="text-slate-400">Loading…</div>}
      {error && <div className="text-red-400">{error}</div>}
      <ul className="divide-y divide-slate-800 rounded overflow-hidden ring-1 ring-slate-800">
        {spells.map((s) => (
          <li key={s.name} className="p-3">
            <div className="font-semibold">{s.name}</div>
            {s.desc && <p className="text-sm text-slate-300 mt-1 line-clamp-3">{s.desc}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

# ---------------------------
# File: src/components/ImportExport.tsx
# ---------------------------
import { importCharacterFile, exportCharacterJSON } from '@/lib/file'
import { useCharacterStore } from '@/state/useCharacterStore'

export default function ImportExport() {
  const { character, setCharacter } = useCharacterStore()

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const c = await importCharacterFile(file)
    setCharacter(c)
    e.currentTarget.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="rounded bg-slate-800 px-4 py-3 ring-1 ring-slate-700 cursor-pointer hover:bg-slate-700">
        <input type="file" accept=".json,.xml" className="hidden" onChange={onImport} />
        Import character (.json / .xml)
      </label>
      <button className="rounded bg-emerald-500 px-4 py-3 text-slate-900 font-semibold" onClick={() => exportCharacterJSON(character)}>
        Export character (JSON)
      </button>
    </div>
  )
}

# ---------------------------
# File: src/App.tsx
# ---------------------------
import { useEffect, useState } from 'react'
import './styles.css'
import { useCharacterStore } from '@/state/useCharacterStore'
import EditableField from '@/components/EditableField'
import SpellsSearch from '@/components/SpellsSearch'
import ImportExport from '@/components/ImportExport'

export default function App() {
  const { character, setCharacter, loadFromIDB } = useCharacterStore()
  const [tab, setTab] = useState<'overview' | 'abilities' | 'spells' | 'io'>('overview')

  useEffect(() => { loadFromIDB() }, [loadFromIDB])

  function set(field: string, value: any) {
    setCharacter({ ...character, [field]: { ...(character as any)[field], ...value } })
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">ODCS – Character Sheet</h1>
          <nav className="flex gap-2">
            {(['overview','abilities','spells','io'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded ${tab===t ? 'bg-sky-600 text-slate-900 font-semibold' : 'bg-slate-800 ring-1 ring-slate-700'}`}>{t}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {tab === 'overview' && (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 p-4">
              <h2 className="mb-2 text-lg font-semibold">Identity</h2>
              <EditableField label="Name" value={character.identity.name} onChange={(v) => set('identity', { name: v })} />
              <EditableField label="Species" value={character.identity.species || ''} onChange={(v) => set('identity', { species: v })} />
              <EditableField label="Class" value={character.identity.class || ''} onChange={(v) => set('identity', { class: v })} />
              <EditableField label="Level" type="number" value={character.identity.level} onChange={(v) => set('identity', { level: Number(v)||1 })} />
              <EditableField label="Background" value={character.identity.background || ''} onChange={(v) => set('identity', { background: v })} />
              <EditableField label="Alignment" value={character.identity.alignment || ''} onChange={(v) => set('identity', { alignment: v })} />
            </div>

            <div className="rounded-xl border border-slate-800 p-4">
              <h2 className="mb-2 text-lg font-semibold">Combat</h2>
              <EditableField label="Armor Class" type="number" value={character.combat.ac} onChange={(v) => set('combat', { ac: Number(v)||10 })} />
              <div className="grid grid-cols-3 gap-2">
                <EditableField label="HP Max" type="number" value={character.combat.hp.max} onChange={(v) => set('combat', { hp: { ...character.combat.hp, max: Number(v)||0 } })} />
                <EditableField label="HP Current" type="number" value={character.combat.hp.current} onChange={(v) => set('combat', { hp: { ...character.combat.hp, current: Number(v)||0 } })} />
                <EditableField label="Temp HP" type="number" value={character.combat.hp.temp} onChange={(v) => set('combat', { hp: { ...character.combat.hp, temp: Number(v)||0 } })} />
              </div>
              <EditableField label="Speed" type="number" value={character.combat.speed} onChange={(v) => set('combat', { speed: Number(v)||30 })} />
              <EditableField label="Initiative" type="number" value={character.combat.initiative} onChange={(v) => set('combat', { initiative: Number(v)||0 })} />
            </div>
          </section>
        )}

        {tab === 'abilities' && (
          <section className="rounded-xl border border-slate-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">Ability Scores</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(['str','dex','con','int','wis','cha'] as const).map((k) => (
                <EditableField key={k} label={k.toUpperCase()} type="number" value={(character.abilities as any)[k]} onChange={(v) => set('abilities', { [k]: Number(v)||10 })} />
              ))}
            </div>
          </section>
        )}

        {tab === 'spells' && (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 p-4">
              <h2 className="mb-2 text-lg font-semibold">Search Spells (Open5e / DND5e)</h2>
              <SpellsSearch />
            </div>
            <div className="rounded-xl border border-slate-800 p-4">
              <h2 className="mb-2 text-lg font-semibold">Known / Prepared</h2>
              <p className="text-sm text-slate-300">(Wire up add/remove from the search panel in a follow‑up pass.)</p>
            </div>
          </section>
        )}

        {tab === 'io' && (
          <section className="rounded-xl border border-slate-800 p-4">
            <h2 className="mb-3 text-lg font-semibold">Import / Export</h2>
            <ImportExport />
            <div className="mt-4 text-sm text-slate-300">
              <p>• Import supports ODCS JSON and basic XML (Fight Club 5e‑style). Extend <code>src/lib/file.ts</code> for more adapters.</p>
              <p>• Export creates a portable <code>.odcs.json</code> file. iPad: you can save to Files or share via the Share Sheet.</p>
            </div>
          </section>
        )}
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-slate-400">
        <p>Installable PWA • Offline capable • Cloudflare Pages ready</p>
      </footer>
    </div>
  )
}

# ---------------------------
# File: src/main.tsx
# ---------------------------
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
