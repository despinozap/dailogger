import type { Entry, CreateEntryPayload } from '~/types'
import { EntryRepository } from '~/repositories'

const VALID_TYPES = ['meds', 'food', 'feeling']

export const EntryService = {
  list(): Entry[] {
    return EntryRepository.findAll()
  },

  create(payload: CreateEntryPayload): { ok: boolean; error?: string } {
    if (!VALID_TYPES.includes(payload.type)) {
      return { ok: false, error: 'Tipo inválido' }
    }
    if (!payload.value || !payload.value.trim()) {
      return { ok: false, error: 'El valor es requerido' }
    }
    if (!payload.datetime) {
      return { ok: false, error: 'La fecha es requerida' }
    }
    if (payload.type === 'feeling') {
      const n = Number(payload.value)
      if (isNaN(n) || n < 1 || n > 5) {
        return { ok: false, error: 'El sentimiento debe ser entre 1 y 5' }
      }
    }

    const entry: Entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type: payload.type,
      datetime: payload.datetime,
      value: payload.value,
      extra: payload.extra || null,
      created_at: new Date().toISOString(),
    }

    EntryRepository.create(entry)
    return { ok: true }
  },

  remove(id: string): { ok: boolean; error?: string } {
    const entry = EntryRepository.findById(id)
    if (!entry) {
      return { ok: false, error: 'Registro no encontrado' }
    }
    EntryRepository.delete(id)
    return { ok: true }
  },
}
