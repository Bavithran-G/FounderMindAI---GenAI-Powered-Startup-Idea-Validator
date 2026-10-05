import React, { useState } from 'react';
import { AgentCard, AGENT_CONFIGS } from './AgentCard';
import { MarketReport } from './MarketReport';
import { BusinessReport } from './BusinessReport';
import { ProductReport } from './ProductReport';
import { InvestorReport } from './InvestorReport';
import { PitchDeckView } from './PitchDeckView';
import { ExecutionReport } from './ExecutionReport';
import { downloadReportPDF } from '../utils/downloadPDF';

const TABS = [
  { key: 'marketResearch',   label: 'Market',    agent: 'marketResearch' },
  { key: 'businessStrategy', label: 'Strategy',  agent: 'businessStrategy' },
  { key: 'productArchitect', label: 'Product',   agent: 'productArchitect' },
  { key: 'investor',         label: 'Investor',  agent: 'investor' },
  { key: 'pitchDeck',        label: 'Pitch Deck',agent: 'pitchDeck' },
  { key: 'execution',        label: 'Execution', agent: 'execution' },
];

export const AgentPipeline = ({ idea, result, agentStatuses, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState('marketResearch');
  const [pdfLoading, setPdfLoading] = useState(false);

  const completedCount = Object.values(agentStatuses).filter(s => s === 'complete').length;
  const totalAgents = 6;
  const progressPercent = (completedCount / totalAgents) * 100;
  const allDone = completedCount === totalAgents;

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      await downloadReportPDF(result);
    } catch (e) {
      console.error('PDF generation failed:', e);
      alert('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // Auto-switch to first completed tab
  React.useEffect(() => {
    const firstComplete = TABS.find(t => agentStatuses[t.agent] === 'complete');
    if (firstComplete && agentStatuses[activeTab] !== 'complete') {
      setActiveTab(firstComplete.key);
    }
  }, [agentStatuses]);

  return (
    <div className="pipeline-view">

      {/* Header */}
      <div className="pipeline-header">
        <div className="pipeline-header-top">
          <div>
            <div className="pipeline-idea-label">Startup Intelligence Report</div>
            <div className="pipeline-idea-text">"{idea}"</div>
          </div>

          <div className="pipeline-actions">
            {allDone && (
              <button
                id="download-pdf-btn"
                className="action-btn"
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
              >
                {pdfLoading
                  ? <><span className="mini-spinner" />Generating...</>
                  : <>↓ Download PDF</>
                }
              </button>
            )}
            <button
              className="action-btn"
              onClick={onNewAnalysis}
              id="back-to-home"
            >
              ← New Idea
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="pipeline-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={`progress-label ${allDone ? 'done' : ''}`}>
            {allDone
              ? '✓ All 6 agents complete'
              : `${completedCount} / ${totalAgents} agents`}
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="agents-grid">
        {AGENT_CONFIGS.map(config => (
          <AgentCard
            key={config.key}
            config={config}
            status={agentStatuses[config.key]}
          />
        ))}
      </div>

      {/* Result Tabs */}
      {completedCount > 0 && (
        <div className="report-section">
          <div className="report-tabs-wrapper">
            {TABS.map(tab => {
              const isComplete = agentStatuses[tab.agent] === 'complete';
              return (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  className={`report-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => isComplete && setActiveTab(tab.key)}
                  disabled={!isComplete}
                >
                  {isComplete && <span className="tab-indicator" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div key={activeTab} className="fade-in">
            {activeTab === 'marketResearch'   && result.marketResearch   && <MarketReport   data={result.marketResearch} />}
            {activeTab === 'businessStrategy' && result.businessStrategy && <BusinessReport  data={result.businessStrategy} />}
            {activeTab === 'productArchitect' && result.productArchitect && <ProductReport   data={result.productArchitect} />}
            {activeTab === 'investor'         && result.investor         && <InvestorReport  data={result.investor} />}
            {activeTab === 'pitchDeck'        && result.pitchDeck        && <PitchDeckView   data={result.pitchDeck} />}
            {activeTab === 'execution'        && result.execution        && <ExecutionReport data={result.execution} />}
          </div>
        </div>
      )}
    </div>
  );
};
