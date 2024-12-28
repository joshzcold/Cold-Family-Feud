import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const BuzzerPopup = ({ buzzed }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (buzzed && buzzed.id) {
      var audio = new Audio('buzzer.mp3');
      audio.play();
      setIsVisible(true);
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [buzzed]);

  if (!buzzed || (!buzzed.id && !buzzed.name)) {
    return null;
  }

  return (
    // TODO: Figure out why this isn't getting bigger
    <div className={`fixed inset-0 flex items-center justify-center z-50`}>
      <div
        className={`bg-secondary-500  rounded-lg
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex flex-col items-center p-4">
          <div className="text-3xl font-bold">{t('First Buzzer')}:</div>
          <div className="mt-4 text-xl">
            <span className="font-semibold">{buzzed.name}</span>
            {typeof buzzed.team !== 'undefined' && <span className="ml-2">| {buzzed.team}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuzzerPopup;
