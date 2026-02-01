import { useCallback } from 'react';

const useVibration = () => {
    const vibrate = useCallback((pattern) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                const success = navigator.vibrate(pattern);
                if (!success) {
                    console.log("Vibrate call returned false (possibly blocked or not supported pattern)");
                }
            } catch (e) {
                console.warn('Vibration failed', e);
            }
        } else {
            console.log("Vibration API not supported on this device/browser.");
        }
    }, []);

    const bursts = useCallback(() => {
        // Fast vibrations: [vibrate, pause, vibrate, pause...]
        vibrate([50, 50, 50, 50, 50, 50, 50]);
    }, [vibrate]);

    const success = useCallback(() => {
        vibrate([200]);
    }, [vibrate]);

    return { vibrate, bursts, success };
};

export default useVibration;
