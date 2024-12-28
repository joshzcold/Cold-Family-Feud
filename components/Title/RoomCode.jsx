import { useTranslation } from 'react-i18next';

const RoomCode = ({ code }) => {
  if (!code) return null;

  const { i18n, t } = useTranslation();

  return (
    <div className="flex flex-row justify-center text-center">
      <div className="flex flex-col items-center">
        <div className="text-xl font-semibold text-foreground p-1 px-4 pb-0 rounded-t-xl bg-secondary-500 shadow-lg">
          {t('Room Code')}
        </div>
        <p className="text-6xl font-bold p-6 text-foreground rounded-xl bg-secondary-500 shadow-lg">{code}</p>
      </div>
    </div>
  );
};

export default RoomCode;
