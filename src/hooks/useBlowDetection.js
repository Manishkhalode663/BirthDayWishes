import { useState, useEffect, useCallback } from 'react';

const useBlowDetection = (threshold = 0.2) => {
    const [isBlowing, setIsBlowing] = useState(false);
    const [volume, setVolume] = useState(0);
    const [audioContext, setAudioContext] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [error, setError] = useState(null);

    const startListening = useCallback(async () => {
        // Check if secure context (HTTPS or localhost)
        if (!window.isSecureContext) {
            console.warn("Blow detection requires a secure context (HTTPS)");
            setError("Microphone requires HTTPS");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaStream(stream);

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            setAudioContext(audioCtx);

            const analyser = audioCtx.createAnalyser();
            const microphone = audioCtx.createMediaStreamSource(stream);
            const scriptProcessor = audioCtx.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioCtx.destination);

            scriptProcessor.onaudioprocess = () => {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);

                let values = 0;
                const length = array.length;
                for (let i = 0; i < length; i++) {
                    values += array[i];
                }

                const average = values / length;
                // Normalize: higher sensitivity (divide by smaller number)
                const normalizedVolume = average / 60;

                setVolume(normalizedVolume);

                if (normalizedVolume > threshold) {
                    setIsBlowing(true);
                    setTimeout(() => setIsBlowing(false), 200);
                }
            };
        } catch (err) {
            console.error("Microphone access denied or error:", err);
            setError("Microphone access denied");
        }
    }, [threshold]);

    const stopListening = useCallback(() => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
        if (audioContext && audioContext.state !== 'closed') {
            try {
                audioContext.close();
            } catch (e) { console.error(e); }
        }
        setAudioContext(null);
        setMediaStream(null);
    }, [mediaStream, audioContext]);

    return { isBlowing, volume, startListening, stopListening, error };
};

export default useBlowDetection;
