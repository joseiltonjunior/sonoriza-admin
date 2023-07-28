import { Progress } from '@/components/Progress/Index'
import { Steps } from '@/components/Steps'
import { Total } from '@/components/Total'
import { useTranslation } from 'react-i18next'

export function Home() {
  const { t } = useTranslation()

  return (
    <div className="max-w-3xl">
      <h1 className="font-bold text-blue-600 leading-6">{t('titleHome')}</h1>

      <h3 className="font-bold text-green-400 leading-8 text-xl">
        {t('captionHome')}
      </h3>

      <Progress />

      <Total value={114.75} />

      <Steps />
    </div>
  )
}
