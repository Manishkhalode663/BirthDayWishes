import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { Gift, Music, Star, Volume2, VolumeX, Mic } from 'lucide-react';
import Cake from '../components/Cake';

// Placeholder audio - using a reliable source or local if available
const HAPPY_BIRTHDAY_AUDIO = "https://actions.google.com/sounds/v1/celebrations/party_horn.ogg";

const Birthday = () => {
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name') || "Friend";
    const gender = searchParams.get('gender') || "male";

    const [phase, setPhase] = useState('intro'); // intro -> cake -> celebration
    const [muted, setMuted] = useState(false);
    const audioRef = useRef(new Audio(HAPPY_BIRTHDAY_AUDIO));

    const containerRef = useRef(null);
    const textRef = useRef(null);

    // --- BALLOON STATE ---
    const [balloons, setBalloons] = useState([]);

    // --- SETUP AUDIO ---
    useEffect(() => {
        audioRef.current.loop = true;
        return () => audioRef.current.pause();
    }, []);

    useEffect(() => {
        if (muted) audioRef.current.pause();
        else if (phase === 'celebration') {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio play prevented", e));
        }
    }, [muted, phase]);

    // --- ACTIONS ---
    const handleStart = () => {
        setPhase('cake');
    };

    const handleCandlesBlown = () => {
        // Vibrate on success
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        setPhase('celebration');

        // Allow state update then trigger animation
        setTimeout(() => {
            startCelebrationSequence();
        }, 100);
    };

    const startCelebrationSequence = () => {
        // 1. Fire Confetti
        triggerConfettiCannon();

        // 2. Animate Text
        if (textRef.current) {
            const tl = gsap.timeline();
            const chars = textRef.current.querySelectorAll('.char');

            tl.fromTo(chars,
                { y: 100, opacity: 0, rotate: 10 },
                {
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            )
                .fromTo(".message-box",
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
                    "-=0.5"
                );
        }

        // 3. Spawn Interactive Balloons (Reference Inspiration Logic)
        spawnBalloons(20);
    };

    const triggerConfettiCannon = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: gender === 'female' ? ['#ff007f', '#ffcc00', '#ffffff'] : ['#00ccff', '#ffcc00', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: gender === 'female' ? ['#ff007f', '#ffcc00', '#ffffff'] : ['#00ccff', '#ffcc00', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const spawnBalloons = (count) => {
        const newBalloons = Array.from({ length: count }).map((_, i) => ({
            id: Date.now() + i,
            color: getRandomColor(gender),
            left: Math.random() * 90 + 5,
            delay: Math.random() * 5,
            popped: false,
            emoji: ['🎈', '✨', '🎁', '🎉'][Math.floor(Math.random() * 4)]
        }));
        setBalloons(newBalloons);
    };

    const getRandomColor = (g) => {
        const femaleColors = ['#ff4081', '#f50057', '#ea80fc', '#b388ff'];
        const maleColors = ['#448aff', '#2979ff', '#00e5ff', '#1de9b6'];
        const palette = g === 'female' ? femaleColors : maleColors;
        return palette[Math.floor(Math.random() * palette.length)];
    };

    const popBalloon = (id, e) => {
        e.stopPropagation(); // Stop propagation

        // 1. Direct Vibration Call (Crucial for mobile)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // 2. Mini Confetti Explosion at click coordinates
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        confetti({
            particleCount: 20,
            spread: 60,
            origin: { x, y }
        });

        // 3. Remove balloon from state
        setBalloons(prev => prev.filter(b => b.id !== id));
    };

    // GSAP Animation for Balloons (Declarative via useEffect on balloons change)
    useEffect(() => {
        balloons.forEach(b => {
            const el = document.getElementById(`balloon-${b.id}`);
            if (el) {
                gsap.fromTo(el,
                    { y: '110vh' },
                    {
                        y: '-120vh',
                        duration: gsap.utils.random(10, 20),
                        delay: b.delay,
                        ease: "none",
                        repeat: -1,
                        overwrite: true // Ensure we don't stack animations
                    }
                );
                gsap.to(el, {
                    x: "random(-50, 50)",
                    rotation: "random(-45, 45)",
                    duration: gsap.utils.random(3, 5),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        });
    }, [balloons]);


    return (
        <div className={`birthday-page theme-${gender}`} ref={containerRef}>

            {/* PHASE 1: INTRO */}
            {phase === 'intro' && (
                <div className="intro-overlay" onClick={handleStart}>
                    <div className="gift-box animate-bounce">
                        <Gift size={64} color="#fff" />
                    </div>
                    <p>Tap to Open!</p>
                </div>
            )}

            {/* PHASE 2: CAKE */}
            {phase === 'cake' && (
                <div className="cake-overlay">
                    <Cake onCandlesBlown={handleCandlesBlown} />
                </div>
            )}

            {/* PHASE 3: CELEBRATION */}
            <div className={`celebration-layer ${phase === 'celebration' ? 'visible' : 'hidden'}`}>

                {/* Text Content */}
                <div className="content-wrapper glass-container">
                    <div ref={textRef} className="birthday-title">
                        {`Happy Birthday ${name}!`.split('').map((char, i) => (
                            <span key={i} className="char" style={{ display: 'inline-block', minWidth: char === ' ' ? '0.5em' : '0' }}>
                                {char}
                            </span>
                        ))}
                    </div>

                    <div className="message-box">
                        <p>{gender === 'female' ? "Shine bright like the Queen you are! 👑" : "Here's to a legendary year, King! 👑"}</p>
                        <div className="icon-row">
                            <button onClick={() => setMuted(!muted)} className="mute-btn">
                                {muted ? <VolumeX size={32} /> : <Volume2 size={32} className="animate-pulse" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Balloons Layer */}
                <div className="balloons-container">
                    {balloons.map((b) => (
                        <div
                            key={b.id}
                            id={`balloon-${b.id}`}
                            className="balloon-interactive"
                            style={{
                                backgroundColor: b.color,
                                left: `${b.left}%`,
                            }}
                            onClick={(e) => popBalloon(b.id, e)}
                        >
                            {b.emoji}
                        </div>
                    ))}
                </div>

            </div>

            <style>{`
                .birthday-page {
                    height: 100dvh;
                    overflow: hidden;
                    position: relative;
                    /* Default Dark Background */
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                }
                .birthday-page.theme-female {
                    background: linear-gradient(135deg, #2b0a1a, #4a192c, #801336);
                }
                .birthday-page.theme-male {
                     background: linear-gradient(135deg, #000000, #0f2027, #203a43);
                }

                .intro-overlay, .cake-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    z-index: 100;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    color: white; backdrop-filter: blur(8px);
                }
                .intro-overlay { background: rgba(0,0,0,0.85); cursor: pointer; }
                .cake-overlay { background: rgba(0,0,0,0.9); }

                .celebration-layer {
                    opacity: 0; transition: opacity 1s;
                    width: 100%; height: 100%;
                    position: absolute; top: 0; left: 0;
                    display: flex; justify-content: center; align-items: center;
                }
                .celebration-layer.visible { opacity: 1; z-index: 50; }
                .celebration-layer.hidden { pointer-events: none; z-index: -1; }

                .content-wrapper {
                    z-index: 60;
                    text-align: center;
                    width: 90%;
                    max-width: 500px;
                }
                
                .birthday-title {
                    font-family: var(--font-display);
                    font-size: 3rem;
                    color: #ffffff; /* Solid White */
                    font-weight: 800;
                    line-height: 1.2;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); /* Glow effect */
                }
                
                .message-box p {
                    font-size: 1.2rem;
                    color: #fff;
                    margin-bottom: 2rem;
                }

                .balloons-container {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    z-index: 55;
                    pointer-events: none; /* Let clicks pass through empty space */
                }

                .balloon-interactive {
                    position: absolute;
                    width: 60px; height: 70px;
                    border-radius: 50%;
                    display: flex; justify-content: center; align-items: center;
                    font-size: 1.5rem;
                    cursor: pointer;
                    pointer-events: auto; /* Catch clicks */
                    box-shadow: inset -5px -5px 10px rgba(0,0,0,0.2);
                    user-select: none;
                }
                .balloon-interactive::after {
                    content: ''; position: absolute; bottom: -15px;
                    width: 2px; height: 40px;
                    background: rgba(255,255,255,0.5);
                }

                .gift-box {
                    background: var(--primary-gold);
                    padding: 2rem; border-radius: 50%;
                    margin-bottom: 1.5rem;
                    animation: bounce 2s infinite;
                }
                
                @media (max-width: 600px) {
                    .birthday-title { font-size: 2.5rem; }
                }

                .mute-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 50%;
                    padding: 10px;
                    color: white;
                    cursor: pointer;
                    backdrop-filter: blur(4px);
                }
            `}</style>
        </div>
    );
};

export default Birthday;
