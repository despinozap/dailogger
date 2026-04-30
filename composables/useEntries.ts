import { EntryService } from '~/services'
import type { Entry, CreateEntryPayload } from '~/types'

export type { Entry, EntryType, CreateEntryPayload } from '~/types'

export function useEntries() {
  const entries = useState<Entry[]>('entries', () => [])
  const loading = ref(false)

  function fetchAll() {
    entries.value = EntryService.list()
  }

  function create(payload: CreateEntryPayload): { ok: boolean; error?: string } {
    const result = EntryService.create(payload)
    if (result.ok) {
      entries.value = EntryService.list()
    }
    return result
  }

  function remove(id: string): { ok: boolean; error?: string } {
    const result = EntryService.remove(id)
    if (result.ok) {
      entries.value = EntryService.list()
    }
    return result
  }

  return { entries, loading, fetchAll, create, remove }
}
