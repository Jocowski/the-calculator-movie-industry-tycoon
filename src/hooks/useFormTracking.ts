import { useEffect } from 'react';

type UseFormTrackingParams = {
  filledFields: Set<string>;
  formName: string;
  delay?: number;
};

const useFormTracking = ({
  filledFields,
  formName,
  delay = 10000
}: UseFormTrackingParams) => {
  useEffect(() => {
    if (filledFields.size === 0) return;

    const timer = setTimeout(() => {
      window.gtag('event', 'form_engagement', {
        form_name: formName,
        filled_fields: Array.from(filledFields).join(','),
        filled_count: filledFields.size
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [filledFields, formName, delay]);
};

export default useFormTracking;