import { create } from 'zustand'
import type { Lang } from '@/i18n/translations'

interface LangStore {
  lang: Lang
  setLang: (l: Lang) => void
}

export const useLangStore = create<LangStore>((set) => ({
  lang: (localStorage.getItem('lang') as Lang | null) ?? 'it',
  setLang: (lang) => {
    localStorage.setItem('lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    set({ lang })
  },
}))
