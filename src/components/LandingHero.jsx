import React, { useState } from 'react';

const EXAMPLES = [
  'AI tutor for students',
  'Sustainable fashion marketplace',
  'AI fitness coach',
];

export const LandingHero = ({ onAnalyze, isAnalyzing }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = () => {
    if (idea.trim() && !isAnalyzing) onAnalyze(idea.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <section className="hero">

      {/* Brand */}
      <div className="hero-brand">
        <div className="hero-brand-icon">✦</div>
        <span className="hero-brand-name">FounderMindAI</span>
      </div>

      {/* Headline */}
      <h1 className="hero-title">Turn an idea into intelligence.</h1>

      <p className="hero-subtitle">
        Analyze your startup idea across market, product, competition,
        technology, and investment potential.
      </p>

      {/* Input Command Interface */}
      <div className="input-command">
        <div className="input-wrapper">
          <textarea
            id="idea-input"
            className="idea-input"
            placeholder="Describe your startup idea..."
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isAnalyzing}
          />
          <button
            id="analyze-btn"
            className="analyze-btn"
            onClick={handleSubmit}
            disabled={!idea.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <><span className="mini-spinner" style={{ borderTopColor: 'white' }} />Analyzing</>
            ) : (
              <><span className="analyze-btn-spark">✦</span>Analyze</>
            )}
          </button>
        </div>

        {/* Agent Indicator */}
        <div className="input-agents-hint">
          <div className="agents-dots">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="agents-dot" />
            ))}
          </div>
          <span className="agents-hint-text">6 AI agents ready</span>
        </div>

        {/* Example suggestions */}
        <div className="input-examples">
          <span className="input-examples-label">Try:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              className="example-chip"
              onClick={() => setIdea(ex)}
              disabled={isAnalyzing}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
