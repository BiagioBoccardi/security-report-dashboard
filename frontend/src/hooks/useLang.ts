import { useLangStore } from '@/store/langStore'
import { translations, LANGUAGES, type Lang, type T } from '@/i18n/translations'

export function useLang(): { lang: Lang; setLang: (l: Lang) => void; t: T } {
  const { lang, setLang } = useLangStore()
  return { lang, setLang, t: translations[lang] }
}

export { LANGUAGES }
