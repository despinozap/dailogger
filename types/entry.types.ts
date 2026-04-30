export type EntryType = 'meds' | 'food' | 'feeling'

export interface Entry {
  id: string
  type: EntryType
  datetime: string
  value: string
  extra: string | null
  created_at: string
}

export interface CreateEntryPayload {
  type: EntryType
  datetime: string
  value: string
  extra?: string | null
}
