from typing import Any, Dict
from server.utils.ai import call_ai, extract_json


SYSTEM_PROMPT = """You are a General Partner at a Tier-1 venture capital firm (Sequoia / a16z / Benchmark level).
You've evaluated 10,000+ pitches. You are known for rigorous, unbiased due diligence.
You invest in only the top 1% of ideas you see — your fund's returns depend on honest, critical assessment.
You do NOT inflate scores to be polite. A bad idea with a high score wastes everyone's time and money.
When you see warning signs (no moat, crowded market, unclear monetization), you say so clearly."""

FUNDING_SCORE_RUBRIC = """
FUNDING SCORE RUBRIC — apply this strictly:
  0–20  : Do not invest. Fundamental flaws — no market, no moat, proven failures, or fraudulent signals.
  21–35 : Pass. Too early, too vague, or the market is too small / too competitive for VC returns.
  36–50 : Weak. Interesting area but the specific idea lacks differentiation, traction signals, or defensibility.
  51–65 : Possible, but needs significant work. Monitor and revisit at a later stage with more traction.
  66–75 : Worth a conversation. Decent opportunity, some differentiation, but still several open questions.
  76–85 : Investable at the right stage. Strong market, clear pain, good team fit, real defensibility.
  86–95 : High conviction. Rare. Large market, strong moat, excellent timing, very high upside potential.
  96–100: Exceptional — generational opportunity. Almost never appropriate.

CALIBRATION:
- Most startup ideas score 30–55. This is the realistic baseline.
- A generic SaaS tool in a crowded market should score 30–45, not 70+.
- A score above 80 requires: (1) $1B+ TAM, (2) clear sustainable moat, (3) strong timing signal, (4) evidence of demand.
- Do NOT score high to encourage the founder. Score what YOU would actually invest in.
- Be specific about WHY you would or would not invest."""

def run_investor_agent(
    idea: str,
    market_research: Dict[str, Any],
    business_strategy: Dict[str, Any],
    product_architect: Dict[str, Any]
) -> Dict[str, Any]:
    competitors = ", ".join(c.get("name", "") for c in market_research.get("competitors", []))
    gaps = "; ".join(market_research.get("gaps", []))
    mvp_features = ", ".join(product_architect.get("mvpFeatures", [])[:3])

    prompt = f"""Evaluate this startup as a VC investor: "{idea}"

{FUNDING_SCORE_RUBRIC}

Due diligence data:
- Market size: {market_research.get('targetMarketSize', '')}
- Opportunity score (from market research): {market_research.get('opportunityScore', '')}/100
- Key competitors: {competitors}
- Competitive gaps: {gaps}
- Revenue model: {business_strategy.get('revenueModel', '')}
- Competitive moat: {business_strategy.get('moat', '')}
- Value proposition: {business_strategy.get('valueProposition', '')}
- MVP top features: {mvp_features}

EVALUATION INSTRUCTIONS:
1. Ask 4 HARD questions that expose the real weaknesses of this idea — not softball questions
2. Give honest answers based on the data provided
3. Identify 3 real, specific risks (not generic ones) with actionable mitigations
4. Assess market size and defensibility honestly. DO THIS BEFORE SCORING.
5. Write your final verdict. DO THIS BEFORE SCORING.
6. Score using the rubric — if the market opportunity score is below 60, your funding score should reflect that.

Return ONLY a valid JSON object in exactly this structure:
{{
  "vcQuestions": [
    {{ "question": "string (hard, specific question)", "answer": "string (honest assessment)" }},
    {{ "question": "string", "answer": "string" }},
    {{ "question": "string", "answer": "string" }},
    {{ "question": "string", "answer": "string" }}
  ],
  "marketSizeAssessment": "string (honest TAM/SAM/SOM with caveats if the market is small or uncertain)",
  "defensibility": "string (honest critique of the moat — is it real or theoretical?)",
  "risks": [
    {{ "risk": "string (specific, not generic)", "mitigation": "string (realistic, not wishful)" }},
    {{ "risk": "string", "mitigation": "string" }},
    {{ "risk": "string", "mitigation": "string" }}
  ],
  "verdict": "string (2-3 sentences — would you invest? Be honest. If not, say exactly why.)",
  "recommendedFundingStage": "string (Pre-seed / Seed / Series A / Too early / Not fundable)",
  "fundingScoreReasoning": "string (Briefly justify the score based on the rubric constraints before giving the number)",
  "fundingScore": <integer 1-100 following the rubric above>
}}"""

    text = call_ai(prompt, SYSTEM_PROMPT)
    return extract_json(text)
