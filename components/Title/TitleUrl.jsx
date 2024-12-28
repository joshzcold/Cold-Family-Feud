import { useTranslation } from 'react-i18next';

const TitleUrl = () => {
  if (!process.env.NEXT_PUBLIC_TITLE_URL) return null;

  const { i18n, t } = useTranslation();

  return (
    <div className="flex flex-row justify-center text-center mt-4">
      <span className="text-4xl p-6 text-foreground rounded-xl bg-secondary-500 shadow-lg transition-colors duration-200">
        {t('Join at')} <span className="font-bold">{process.env.NEXT_PUBLIC_TITLE_URL}</span>
      </span>
    </div>
  );
};

export default TitleUrl;
