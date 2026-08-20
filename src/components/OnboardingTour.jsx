import { useState, useEffect } from 'react';
import { ChevronRight, X, Sparkles } from 'lucide-react';

export default function OnboardingTour({ role = 'viewer' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`pitchbid_tour_${role}`);
    if (!hasSeenTour) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [role]);

  const handleSkip = () => {
    localStorage.setItem(`pitchbid_tour_${role}`, 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleSkip();
    }
  };

  const ownerSteps = [
    {
      title: "Welcome to PitchBid 2.0",
      content: "You are now an Owner in a trillion-dollar E-Sports franchise auction. Let's show you around the dashboard."
    },
    {
      title: "The Draft Pool",
      content: "On the left (or under the 'Draft' tab on mobile), you will see all pending players. Keep an eye on who is coming up next."
    },
    {
      title: "Bidding & Wallets",
      content: "On the right (or 'Bids' tab), you can place your bids and track how much budget your rival franchises have left."
    },
    {
      title: "Squad Tactics",
      content: "Once you buy players, click the 'Tactics' button in the top header to build your formation on the live 2D pitch and receive scouting reports!"
    }
  ];

  const viewerSteps = [
    {
      title: "Welcome to PitchBid 2.0",
      content: "You are tuned into the live broadcast! Experience the tension of the franchise auction in real time."
    },
    {
      title: "Live Chat",
      content: "On the left (or 'Chat' tab), hype up your favorite players and react to massive bids with the rest of the fans."
    },
    {
      title: "Track Squads",
      content: "Click 'View Squads' at the top to see exactly who each franchise has purchased and what their remaining budgets are."
    },
    {
      title: "React!",
      content: "Use the floating emoji reactions at the bottom right to spam 🔥, ❤️, or 👎 onto the main stage!"
    }
  ];

  const steps = role === 'owner' || role === 'host' ? ownerSteps : viewerSteps;

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '400px', padding: '2rem',
        background: 'linear-gradient(180deg, rgba(30,30,35,0.95) 0%, rgba(20,20,24,0.98) 100%)',
        border: '1px solid var(--primary)', position: 'relative'
      }}>
        
        <button 
          onClick={handleSkip}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: '15px', borderRadius: '50%' }}>
            <Sparkles size={32} color="var(--primary)" />
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', color: 'var(--text-main)' }}>
          {steps[step].title}
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', marginBottom: '2rem', minHeight: '60px' }}>
          {steps[step].content}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {steps.map((_, idx) => (
              <div key={idx} style={{ 
                width: '8px', height: '8px', borderRadius: '50%', 
                background: idx === step ? 'var(--primary)' : 'rgba(255,255,255,0.2)' 
              }} />
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleSkip}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Skip All
            </button>
            <button 
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {step === steps.length - 1 ? "Let's Go!" : "Next"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
