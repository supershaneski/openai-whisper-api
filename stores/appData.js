import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAppData = create(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      add: (newitem) => {

        let _items = get().items
        _items.push(newitem)

        const _count = _items.length

        set({ items: _items, count: _count })
      },
      delete: (key) => {

        let _items = get().items

        _items = _items.filter((item) => item.filename !== key)

        const _count = _items.length

        set({ items: _items, count: _count })

      }
    }),
    {
      name: 'openai-whisper-data-storage',
      version: 0,
      storage: createJSONStorage(() => localStorage),
    }
  )
)