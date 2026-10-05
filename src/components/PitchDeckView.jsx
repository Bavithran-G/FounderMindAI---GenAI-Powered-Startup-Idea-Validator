import React, { useState } from 'react';
import { downloadPitchDeckPPT } from '../utils/downloadPPT';

const SLIDE_GRADIENTS = [
  'linear-gradient(135deg, rgba(37,99,235,0.03) 0%, rgba(79,70,229,0.02) 100%)',
  'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(5,150,105,0.02) 100%)',
  'linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(217,119,6,0.02) 100%)',
  'linear-gradient(135deg, rgba(217,119,6,0.03) 0%, rgba(124,58,237,0.02) 100%)',
  'linear-gradient(135deg, rgba(124,58,237,0.03) 0%, rgba(37,99,235,0.02) 100%)',
  'linear-gradient(135deg, rgba(37,99,235,0.03) 0%, rgba(8,145,178,0.02) 100%)',
  'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(5,150,105,0.02) 100%)',
  'linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(37,99,235,0.02) 100%)',
];

export const PitchDeckView = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pptLoading, setPptLoading] = useState(false);
  const total = data.slides.length;

  const goTo = (idx) => { if (idx >= 0 && idx < total) setCurrentSlide(idx); };

  const handleDownloadPPT = async () => {
    setPptLoading(true);
    try {
      await downloadPitchDeckPPT(data);
    } catch (e) {
      console.error('PPT generation failed:', e);
      alert('PPT generation failed. Please try again.');
    } finally {
      setPptLoading(false);
    }
  };

  const slide = data.slides[currentSlide];

  return (
    <div className="fade-in">

      {/* Pitch Header */}
      <div className="pitch-header">
        <div className="pitch-startup-name">{data.startupName}</div>
        <div className="pitch-tagline">"{data.tagline}"</div>
        <button
          id="download-ppt-btn"
          className="action-btn"
          onClick={handleDownloadPPT}
          disabled={pptLoading}
          style={{ display: 'inline-flex', margin: '0 auto' }}
        >
          {pptLoading
            ? <><span className="mini-spinner" />Generating PPTX...</>
            : <>↓ Download Pitch Deck (.pptx)</>
          }
        </button>
      </div>

      <div className="pitch-deck-wrapper">
        {/* Navigation */}
        <div className="pitch-deck-nav">
          <button
            className="deck-nav-btn"
            onClick={() => goTo(currentSlide - 1)}
            disabled={currentSlide === 0}
            id="deck-prev"
          >
            ←
          </button>
          <span className="deck-counter">{currentSlide + 1} / {total}</span>
          <button
            className="deck-nav-btn"
            onClick={() => goTo(currentSlide + 1)}
            disabled={currentSlide === total - 1}
            id="deck-next"
          >
            →
          </button>
        </div>

        {/* Slide */}
        <div
          className="pitch-slide"
          key={currentSlide}
          style={{ '--slide-gradient': SLIDE_GRADIENTS[currentSlide % SLIDE_GRADIENTS.length] }}
        >
          <div className="slide-number">Slide {currentSlide + 1} of {total}</div>
          <span className="slide-icon">{slide.icon}</span>
          <div className="slide-title">{slide.title}</div>
          <div className="slide-subtitle">{slide.subtitle}</div>
          <div className="slide-content">{slide.content}</div>
          <div className="slide-points">
            {slide.keyPoints.map((pt, i) => (
              <div key={i} className="slide-point">
                <div className="slide-point-bullet" />
                {pt}
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="deck-dots">
          {data.slides.map((_, i) => (
            <div
              key={i}
              className={`deck-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
