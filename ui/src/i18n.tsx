import { i18n } from '@lingui/core'
import { detect, fromUrl, fromStorage, fromNavigator } from '@lingui/detect-locale'
import type { TransRenderProps } from '@lingui/react'
import { I18nProvider } from '@lingui/react'
import type { ITextProps } from 'native-base'
import { Text } from 'native-base'
import type { ReactElement } from 'react'
import { useEffect } from 'react'

const DEFAULT_LOCALE = 'zh-TW'
const LANGUAGE_KEY = 'lang'

export const AVAILABLE_LOCALES = {
  en: 'English',
  'zh-TW': '繁體中文',
}

export const getLocale = () =>
  detect(fromUrl(LANGUAGE_KEY), fromStorage(LANGUAGE_KEY), fromNavigator(), () => DEFAULT_LOCALE) || DEFAULT_LOCALE

const loadLocaleMessages = async (locale: string) => {
  const { messages } = await import(`./locales/${locale}/messages`)
  i18n.load(locale, messages)
  i18n.activate(locale)
}

const resolveLocale = (locale: string) =>
  Object.keys(AVAILABLE_LOCALES).find((key) => locale.includes(key) || key.includes(locale)) || DEFAULT_LOCALE

type TransProp = {
  isTranslated: boolean
  children: TransRenderProps['children']
} & ITextProps

const Trans = ({ isTranslated, children, ...rest }: TransProp) => (
  <Text bgColor={isTranslated ? undefined : 'red.50'} {...rest}>
    {children}
  </Text>
)

export const I18nApp = ({ children }: { children: ReactElement }) => {
  useEffect(() => {
    const locale = getLocale()
    const resolvedLocale = resolveLocale(locale)
    if (fromUrl(LANGUAGE_KEY)) {
      window.localStorage.setItem(LANGUAGE_KEY, resolvedLocale)
    }
    loadLocaleMessages(resolvedLocale)
  }, [])

  return (
    <I18nProvider defaultComponent={Trans} {...{ i18n }}>
      {children}
    </I18nProvider>
  )
}
