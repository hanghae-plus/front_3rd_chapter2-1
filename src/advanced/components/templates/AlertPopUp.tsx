import { useSuggestionDiscount } from '@advanced/hooks/interval/useSuggestionInterval';
import { useLightningDiscount } from '@advanced/hooks/interval/useLightningInterval';
import intervalManager from '@advanced/utils/intervalManager';
import React, { useEffect } from 'react';

const AlertPopUp: React.FC = () => {
  const { clearAllIntervals } = intervalManager;
  const { lightningInterval } = useLightningDiscount();
  const { suggestionInterval } = useSuggestionDiscount();

  useEffect(() => {
    // 번개 할인 interval
    const lightningTimeoutId = lightningInterval();

    // 추천 할인 interval
    const suggetionTimeoutId = suggestionInterval();

    return () => {
      clearTimeout(lightningTimeoutId);
      clearTimeout(suggetionTimeoutId);
      clearAllIntervals();
    };
  }, []);

  return <div className="fixed"></div>;
};

export default AlertPopUp;
