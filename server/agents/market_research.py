from typing import Any, Dict
from server.utils.ai import call_ai, extract_json


SYSTEM_PROMPT = """You are a world-class market research analyst at a top-tier consulting firm (McKinsey / BCG level).
You have deep expertise in startup ecosystems, competitive intelligence, and market opportunity assessment.
You are known for brutal honesty — you do NOT inflate scores to make founders feel good.
Your credibility depends on being accurate, not optimistic. Most startup ideas are mediocre; reflect that in your scoring."""

OPPORTUNITY_SCORE_RUBRIC = """
OPPORTUNITY SCORE RUBRIC — be honest and strict:
  0–20  : Fundamentally flawed. No real market, idea has been tried and failed repeatedly, illegal/impossible, or completely vague.
  21–35 : Very weak. Tiny addressable market (<$100M), no differentiation from existing players, no clear pain point solved.
  36–50 : Below average. Market exists but is crowded, value prop is unclear, no defensible moat, many strong incumbents.
  51–65 : Average. Some market opportunity, moderate competition, an OK but not compelling differentiation. Needs a lot of work.
  66–75 : Above average. Decent market ($500M+), real pain point, some differentiation, but moat is thin or timing is uncertain.
  76–85 : Strong. Large market ($1B+), clear pain point, genuine differentiation, good timing, achievable moat.
  86–95 : Exceptional. Rare. Huge market, proven demand signals, strong moat, perfect timing, outstanding team fit.
  96–100: Reserved for once-in-a-decade ideas. Almost never appropriate.

IMPORTANT CALIBRATION:
- The average startup idea scores 35–50. Score honestly against this baseline.
- If you score above 75, you MUST explicitly justify it with concrete evidence in the analysis.
- A score of 80+ for a generic or copycat idea is WRONG. Penalize ideas that are not differentiated.
- Do NOT give inflated scores to seem encouraging. Founders deserve honest feedback."""

def run_market_research_agent(idea: str) -> Dict[str, Any]:
    prompt = f"""Analyze this startup idea for market research: "{idea}"

{OPPORTUNITY_SCORE_RUBRIC}

ANALYSIS INSTRUCTIONS:
1. Identify 4–6 REAL, named competitors — include both direct and indirect ones
2. Note each competitor's specific weakness this idea could exploit
3. List 5 current market trends (positive or negative) that affect this space
4. Identify 3 genuine gaps — only gaps that are not already being addressed well
5. Write a harsh, balanced analysis that highlights BOTH opportunity AND real risks. DO THIS BEFORE SCORING.
6. Score the opportunity using the rubric above — be critical and honest based on your analysis.

Return ONLY a valid JSON object — no markdown, no explanation:
{{
  "targetMarketSize": "string (e.g. '$4.2B TAM by 2027, $800M SAM')",
  "competitors": [
    {{ "name": "string", "description": "string", "weakness": "string" }}
  ],
  "trends": ["string", "string", "string", "string", "string"],
  "gaps": ["string", "string", "string"],
  "analysis": "string (3-4 sentences: what makes this interesting AND what the real challenges are)",
  "opportunityScoreReasoning": "string (Briefly justify the score based on the rubric constraints before giving the number)",
  "opportunityScore": <integer 1-100 following the rubric above>
}}"""

    text = call_ai(prompt, SYSTEM_PROMPT)
    return extract_json(text)
