<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center px-4 py-6">
    <h1 class="text-2xl font-bold text-emerald-400 mb-6">Dailogger</h1>

    <!-- Action buttons -->
    <div class="w-full max-w-md flex gap-3 mb-6">
      <button
        @click="openModal('meds')"
        class="flex-1 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-emerald-500 transition-colors text-center"
      >
        <span class="text-xl">💊</span>
        <p class="text-xs text-gray-400 mt-1">Medicamento</p>
      </button>
      <button
        @click="openModal('food')"
        class="flex-1 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-emerald-500 transition-colors text-center"
      >
        <span class="text-xl">🍽️</span>
        <p class="text-xs text-gray-400 mt-1">Comida</p>
      </button>
      <button
        @click="openModal('feeling')"
        class="flex-1 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-emerald-500 transition-colors text-center"
      >
        <span class="text-xl">😊</span>
        <p class="text-xs text-gray-400 mt-1">Sentimiento</p>
      </button>
    </div>

    <!-- Entries list -->
    <div class="w-full max-w-md space-y-3">
      <p v-if="loading" class="text-gray-500 text-center text-sm">Cargando...</p>
      <p v-else-if="entries.length === 0" class="text-gray-500 text-center text-sm">No hay registros aún</p>
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700"
      >
        <span class="text-xl">{{ typeIcon(entry.type) }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-100 truncate">
            <span v-if="entry.type === 'feeling'">{{ feelingEmojis[Number(entry.value) - 1] }}</span>
            <span v-else>{{ entry.value }}</span>
            <span v-if="entry.extra" class="text-gray-400"> · {{ entry.extra }}</span>
          </p>
          <p class="text-xs text-gray-500">{{ formatDate(entry.datetime) }}</p>
        </div>
        <button @click="confirmRemove(entry.id)" class="text-gray-600 hover:text-red-400 transition-colors text-sm">✕</button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="modal"
      class="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
      @click.self="modal = null"
    >
      <div class="w-full max-w-md bg-gray-800 rounded-t-2xl p-6 space-y-4">
        <h2 class="text-lg font-semibold text-emerald-400">{{ modalTitle }}</h2>

        <div>
          <label class="block text-xs text-gray-400 mb-1">Fecha y hora</label>
          <input
            v-model="form.datetime"
            type="datetime-local"
            class="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <template v-if="modal === 'meds'">
          <input
            v-model="form.value"
            type="text"
            placeholder="Nombre del medicamento"
            class="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </template>

        <template v-if="modal === 'food'">
          <input
            v-model="form.value"
            type="text"
            placeholder="¿Qué comiste?"
            class="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            v-model="form.extra"
            type="text"
            placeholder="Cantidad"
            class="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </template>

        <template v-if="modal === 'feeling'">
          <div class="flex justify-between gap-2">
            <button
              v-for="(emoji, idx) in feelingEmojis"
              :key="idx"
              type="button"
              :class="[
                'flex-1 py-3 rounded-lg text-2xl transition-all',
                form.value === String(idx + 1)
                  ? 'bg-emerald-500/20 ring-2 ring-emerald-500'
                  : 'bg-gray-900 border border-gray-700 hover:border-emerald-500',
              ]"
              @click="form.value = String(idx + 1)"
            >
              {{ emoji }}
            </button>
          </div>
        </template>

        <div class="flex gap-3 pt-2">
          <button
            @click="modal = null"
            class="flex-1 py-2 rounded-lg border border-gray-600 text-gray-400 text-sm hover:border-gray-500"
          >
            Cancelar
          </button>
          <button
            @click="handleSave"
            :disabled="saving"
            class="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EntryType } from '~/composables/useEntries'

const { entries, loading, fetchAll, create, remove } = useEntries()

const feelingEmojis = ['😞', '😕', '😐', '🙂', '😁']
const modal = ref<EntryType | null>(null)
const saving = ref(false)

const form = reactive({
  datetime: '',
  value: '',
  extra: '',
})

const modalTitle = computed(() => {
  const titles: Record<EntryType, string> = {
    meds: 'Registrar medicamento',
    food: 'Registrar comida',
    feeling: '¿Cómo te sientes?',
  }
  return modal.value ? titles[modal.value] : ''
})

function openModal(type: EntryType) {
  modal.value = type
  form.datetime = new Date().toISOString().slice(0, 16)
  form.value = type === 'feeling' ? '3' : ''
  form.extra = ''
}

function typeIcon(type: string) {
  return { meds: '💊', food: '🍽️', feeling: '😊' }[type] || '📝'
}

function formatDate(dt: string) {
  const d = new Date(dt)
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function handleSave() {
  if (!form.value) return
  saving.value = true
  create({
    type: modal.value!,
    datetime: form.datetime,
    value: form.value,
    extra: form.extra || null,
  })
  modal.value = null
  saving.value = false
}

function confirmRemove(id: string) {
  if (window.confirm('¿Eliminar este registro?')) {
    remove(id)
  }
}

onMounted(fetchAll)
</script>
