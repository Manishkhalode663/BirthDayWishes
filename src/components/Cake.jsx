import React, { useState, useEffect } from 'react';
import useBlowDetection from '../hooks/useBlowDetection';
import useVibration from '../hooks/useVibration';
import { gsap } from 'gsap';
import { Mic } from 'lucide-react';

const Cake = ({ onCandlesBlown }) => {
    const [candlesLit, setCandlesLit] = useState(true);
    const { isBlowing, startListening, error } = useBlowDetection(0.2); // Lower threshold
    const { success } = useVibration(); // Import vibration
    const [displayFallback, setDisplayFallback] = useState(false);

    useEffect(() => {
        startListening();
        const timer = setTimeout(() => setDisplayFallback(true), 3000);
        return () => clearTimeout(timer);
    }, [startListening]);

    useEffect(() => {
        if (error) setDisplayFallback(true);
    }, [error]);

    useEffect(() => {
        if (isBlowing && candlesLit) {
            blowOutCandles();
        }
    }, [isBlowing, candlesLit]);

    const blowOutCandles = (fromTap = false) => {
        if (!candlesLit) return;

        if (fromTap === true) {
            success(); // Vibrate immediately on tap
        }

        setCandlesLit(false);

        // Animate candles out
        gsap.to(".flame", { opacity: 0, scale: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(".candle-smoke", { opacity: 1, y: -20, duration: 1, delay: 0.2 });

        setTimeout(() => {
            if (onCandlesBlown) onCandlesBlown();
        }, 1000);
    };

    return (
        <div className="cake-container">
            <div className="cake">
                <div className="plate"></div>
                <div className="layer layer-bottom"></div>
                <div className="layer layer-middle"></div>
                <div className="layer layer-top"></div>
                <div className="icing"></div>

                {/* Candles */}
                <div className="candles">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="candle">
                            <div className={`flame ${candlesLit ? 'lit' : ''}`}></div>
                            <div className="wick"></div>
                            <div className="wax"></div>
                            <div className="candle-smoke"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="instruction-text">
                {candlesLit ? (
                    <div className="blow-hint">
                        <div className="animate-pulse">
                            <Mic size={32} />
                        </div>
                        <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                            {error ? "Microphone unavailable" : "Blow nicely into the mic!"}
                        </p>

                        <button
                            className="tap-fallback-btn"
                            onClick={() => blowOutCandles(true)}
                            style={{ animation: 'bounce 2s infinite' }}
                        >
                            Make a Wish (Tap) 👆
                        </button>
                    </div>
                ) : (
                    <p className="text-gold" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Yay! Wish granted! ✨</p>
                )}
            </div>

            <style>{`
        .tap-fallback-btn {
            background: linear-gradient(90deg, #f59e0b, #d97706);
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            color: white;
            font-weight: bold;
            font-size: 1.1rem;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
            cursor: pointer;
            z-index: 50;
        }
        .cake-container {
            position: relative;
            margin: 2rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .cake {
            position: relative;
            width: 250px;
            height: 200px;
            transform: scale(0.8);
        }
        .plate {
            width: 270px;
            height: 110px;
            bottom: -10px;
            left: -10px;
            background-color: #ccc;
            border-radius: 50%;
            box-shadow: 0 10px 0 #999, 0 10px 40px rgba(0,0,0,0.5);
            position: absolute;
        }
        .layer {
            position: absolute;
            background-color: var(--female-accent);
            width: 250px;
            height: 100px;
            border-radius: 50%;
        }
        .birthday-page.theme-male .layer { background-color: var(--male-accent); }
        .birthday-page.theme-male .icing { background-color: #93c5fd; }
        
        .layer-bottom { bottom: 0; box-shadow: 0 2px 0px #6d0b3d, 0 4px 0px #6d0b3d, 0 6px 0px #6d0b3d, 0 8px 0px #6d0b3d, 0 10px 0px #6d0b3d, 0 12px 0px #6d0b3d, 0 14px 0px #6d0b3d, 0 16px 0px #6d0b3d, 0 18px 0px #6d0b3d, 0 20px 0px #6d0b3d, 0 22px 0px #6d0b3d, 0 24px 0px #6d0b3d, 0 26px 0px #6d0b3d, 0 28px 0px #6d0b3d, 0 30px 0px #6d0b3d; }
        .layer-middle { bottom: 35px; box-shadow: 0 2px 0px #831843, 0 4px 0px #831843, 0 6px 0px #831843, 0 8px 0px #831843, 0 10px 0px #831843, 0 12px 0px #831843, 0 14px 0px #831843, 0 16px 0px #831843, 0 18px 0px #831843, 0 20px 0px #831843, 0 22px 0px #831843, 0 24px 0px #831843, 0 26px 0px #831843, 0 28px 0px #831843, 0 30px 0px #831843; }
        .layer-top { bottom: 70px; box-shadow: 0 2px 0px #be185d, 0 4px 0px #be185d, 0 6px 0px #be185d, 0 8px 0px #be185d, 0 10px 0px #be185d, 0 12px 0px #be185d, 0 14px 0px #be185d, 0 16px 0px #be185d, 0 18px 0px #be185d, 0 20px 0px #be185d, 0 22px 0px #be185d, 0 24px 0px #be185d, 0 26px 0px #be185d, 0 28px 0px #be185d, 0 30px 0px #be185d; }
        
        .icing {
            position: absolute;
            top: 70px;
            left: 5px;
            background-color: #fbcfe8;
            width: 240px;
            height: 90px;
            border-radius: 50%;
            z-index: 1;
        }
        
        .candles {
            position: absolute;
            top: 80px;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 30px;
            z-index: 2;
        }
        .candle {
            position: relative;
            width: 15px;
            height: 50px;
        }
        .wax {
            background-color: #fff;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background: repeating-linear-gradient(45deg, #fff, #fff 5px, var(--primary-gold) 5px, var(--primary-gold) 10px);
        }
        .wick {
            width: 2px;
            height: 10px;
            background: #666;
            margin: 0 auto;
        }
        .flame {
            width: 15px;
            height: 30px;
            background: orange;
            border-radius: 50% 50% 20% 20%;
            position: absolute;
            top: -30px;
            left: 0;
            box-shadow: 0 0 10px orange, 0 0 20px yellow, 0 0 60px gold;
            transform-origin: bottom center;
            animation: flicker 1s infinite;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .flame.lit {
            opacity: 1;
        }
        /* Mobile adjustment for layer shadows in Male theme if needed */
        .birthday-page.theme-male .layer-bottom { box-shadow: 0 2px 0px #1e3a8a, 0 4px 0px #1e3a8a, 0 6px 0px #1e3a8a; } /* simplified for brevity */

        .candle-smoke {
            position: absolute;
            top: -20px;
            left: 50%;
            width: 2px;
            height: 20px;
            background: rgba(255,255,255,0.5);
            opacity: 0;
        }
        
        @keyframes flicker {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1) rotate(2deg); }
            25% { transform: scale(0.9) rotate(-1deg); }
            75% { transform: scale(1.05) rotate(1deg); }
        }
        
        .instruction-text {
            margin-top: 100px;
            color: white;
            text-align: center;
            font-size: 1.2rem;
            min-height: 3rem;
            z-index: 60;
            position: relative;
        }
        .blow-hint {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
      `}</style>
        </div>
    );
};

export default Cake;
