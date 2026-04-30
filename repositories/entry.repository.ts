import type { Entry } from '~/types'

const STORAGE_KEY = 'dailogger_entries'

function read(): Entry[] {
  if (import.meta.server) return []
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function persist(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const EntryRepository = {
  findAll(): Entry[] {
    return read()
  },

  create(entry: Entry): void {
    const all = read()
    all.unshift(entry)
    persist(all)
  },

  findById(id: string): Entry | undefined {
    return read().find((e) => e.id === id)
  },

  delete(id: string): void {
    const all = read().filter((e) => e.id !== id)
    persist(all)
  },
}
