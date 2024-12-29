import { useTranslation } from 'react-i18next';

const RoomCode = ({ code }) => {
  if (!code) return null;

  const { i18n, t } = useTranslation();

  return (
    <div className="flex flex-row justify-center items-center text-center">
      <div className="flex flex-col items-center rounded-xl bg-secondary-500 shadow-lg transition-transform xl:p-4 2xl:p-6 h-fit">
        <div className={`${process.env.NEXT_PUBLIC_TITLE_URL ? '' : 'p-8'}`}>
          <p className="text-6xl font-bold  text-foreground ">{code}</p>
          <p className="text-xl font-semibold text-foreground">{t('Room Code')}</p>
        </div>
        {process.env.NEXT_PUBLIC_TITLE_URL && (
          <>
            <hr className="w-full my-2 border-t-2 border-secondary-900" />
            <span className="text-4xl pt-0 p-6 text-foreground rounded-xl bg-secondary-500 transition-transform duration-200">
              {t('Join at')} <span className="font-bold">{process.env.NEXT_PUBLIC_TITLE_URL}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomCode;
