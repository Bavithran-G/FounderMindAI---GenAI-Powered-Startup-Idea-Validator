from typing import Any, Dict
from server.utils.ai import call_ai, extract_json


SYSTEM_PROMPT = """You are a McKinsey Senior Partner and former Y Combinator partner with 20+ years of experience
building and advising billion-dollar startups. You craft bulletproof business strategies with clear, monetizable
revenue models. You think in terms of unit economics, defensible moats, and scalable customer acquisition."""

def run_business_strategy_agent(idea: str, market_research: Dict[str, Any]) -> Dict[str, Any]:
    competitors = ", ".join(c.get("name", "") for c in market_research.get("competitors", []))
    gaps = "; ".join(market_research.get("gaps", []))
    
    prompt = f"""Develop a comprehensive business strategy for this startup: "{idea}"

Market context:
- Market size: {market_research.get('targetMarketSize', '')}
- Key competitors: {competitors}
- Market gaps: {gaps}
- Opportunity score: {market_research.get('opportunityScore', '')}/100

Return ONLY a valid JSON object in exactly this structure:
{{
  "revenueModel": "string (detailed description of how the business makes money)",
  "pricingTiers": [
    {{ "name": "string", "price": "string", "features": ["string", "string", "string"] }}
  ],
  "customerSegments": ["string", "string", "string"],
  "valueProposition": "string (one powerful sentence)",
  "moat": "string (the defensible competitive advantage)",
  "usp": "string (unique selling point in one line)"
}}

Rules:
- 3 pricing tiers (Free / Pro / Enterprise or equivalent) with realistic prices
- 3-4 specific customer segments with descriptive names
- A clear, defensible moat (network effects, data moat, switching costs, brand, etc.)"""

    text = call_ai(prompt, SYSTEM_PROMPT)
    return extract_json(text)
