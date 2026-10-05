from typing import Any, Dict
from server.utils.ai import call_ai, extract_json


SYSTEM_PROMPT = """You are a world-renowned startup pitch consultant who has helped companies raise over $2 billion.
You've crafted pitch decks for unicorns. You know exactly what investors want to see, how to frame a narrative,
and how to make every slide land. Your decks are clear, compelling, and visually structured."""

def run_pitch_deck_agent(
    idea: str,
    market_research: Dict[str, Any],
    business_strategy: Dict[str, Any],
    investor: Dict[str, Any]
) -> Dict[str, Any]:
    prompt = f"""Create a compelling 8-slide investor pitch deck for: "{idea}"

Key data to weave in:
- Market: {market_research.get('targetMarketSize', '')}, Opportunity Score: {market_research.get('opportunityScore', '')}/100
- Value proposition: {business_strategy.get('valueProposition', '')}
- Revenue model: {business_strategy.get('revenueModel', '')}
- Funding score: {investor.get('fundingScore', '')}/100
- Recommended stage: {investor.get('recommendedFundingStage', '')}

Return ONLY a valid JSON object in exactly this structure:
{{
  "startupName": "string (creative, memorable name for this startup idea)",
  "tagline": "string (max 10 words — punchy and memorable)",
  "slides": [
    {{ "title": "Problem",           "subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "🎯" }},
    {{ "title": "Solution",          "subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "💡" }},
    {{ "title": "Market Opportunity","subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "📈" }},
    {{ "title": "Business Model",    "subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "💰" }},
    {{ "title": "Competition",       "subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "⚔️" }},
    {{ "title": "Go-to-Market",      "subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "🚀" }},
    {{ "title": "Traction & Roadmap","subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "📊" }},
    {{ "title": "The Ask",           "subtitle": "string", "content": "string", "keyPoints": ["string","string","string"], "icon": "🤝" }}
  ]
}}"""

    text = call_ai(prompt, SYSTEM_PROMPT)
    return extract_json(text)
