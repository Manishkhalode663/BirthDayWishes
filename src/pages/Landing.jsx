import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Sparkles, User, Heart } from 'lucide-react';

const Landing = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(''); // 'male' | 'female'
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Intro Animation
    const tl = gsap.timeline();
    
    tl.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(titleRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, 
      "-=0.5"
    )
    .fromTo(formRef.current.children, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 
      "-=0.3"
    );

    // Background floating elements animation
    // (We could add some floating shapes here using GSAP if we had elements)
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !gender) return;

    // Exit Animation
    gsap.to(containerRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        navigate(`/birthday?name=${encodeURIComponent(name)}&gender=${gender}`);
      }
    });
  };

  return (
    <div className="landing-page">
      <div className="background-gradient"></div>
      
      <div className="glass-container" ref={containerRef}>
        <div className="header" ref={titleRef}>
          <Sparkles className="icon-gold" size={32} />
          <h1>Make a Wish</h1>
          <p>Create a magical birthday experience</p>
        </div>

        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="input-group">
            <label>Birthday Person's Name</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="Enter name..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Select Theme</label>
            <div className="gender-options">
              <button 
                type="button" 
                className={`gender-btn male ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                <span className="emoji">🎩</span> Gentleman
              </button>
              <button 
                type="button" 
                className={`gender-btn female ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                <span className="emoji">👑</span> Lady
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!name.trim() || !gender}>
            Start Celebration <Heart size={18} fill="currentColor" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;
