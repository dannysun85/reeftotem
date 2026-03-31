import { useState, useEffect } from 'react';

type OS = 'windows' | 'mac' | 'linux' | 'ios' | 'android' | 'other';

export const useOS = (): OS => {
  const [os, setOS] = useState<OS>('other');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();

    if (userAgent.includes('win')) {
      setOS('windows');
    } else if (userAgent.includes('mac')) {
      if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        setOS('ios');
      } else {
        setOS('mac');
      }
    } else if (userAgent.includes('android')) {
      setOS('android');
    } else if (userAgent.includes('linux')) {
      setOS('linux');
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setOS('ios');
    } else {
      setOS('other');
    }
  }, []);

  return os;
};
