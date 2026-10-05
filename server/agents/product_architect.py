from typing import Any, Dict
from server.utils.ai import call_ai, extract_json


SYSTEM_PROMPT = """You are the CTO of a successful YC-backed startup (Series B, $50M raised).
You've shipped products used by millions. You design elegant, scalable MVPs with laser focus on user value.
You know exactly what to build first, what to cut, and which tech stack fits the problem."""

def run_product_architect_agent(
    idea: str, 
    market_research: Dict[str, Any], 
    business_strategy: Dict[str, Any]
) -> Dict[str, Any]:
    segments = ", ".join(business_strategy.get('customerSegments', [])[:2])
    gaps = "; ".join(market_research.get('gaps', []))

    prompt = f"""Design the product architecture for this startup: "{idea}"

Context:
- Value proposition: {business_strategy.get('valueProposition', '')}
- Primary customer segments: {segments}
- Key market gaps to address: {gaps}

Return ONLY a valid JSON object in exactly this structure:
{{
  "mvpFeatures": ["string", "string", "string", "string", "string"],
  "userFlow": ["string", "string", "string", "string", "string"],
  "roadmap": [
    {{ "phase": "Phase 1: MVP",    "duration": "0–3 months",  "goals": ["string", "string", "string"] }},
    {{ "phase": "Phase 2: Growth", "duration": "3–6 months",  "goals": ["string", "string", "string"] }},
    {{ "phase": "Phase 3: Scale",  "duration": "6–12 months", "goals": ["string", "string", "string"] }}
  ],
  "techStack": [
    {{ "category": "Frontend",      "tools": ["string", "string"] }},
    {{ "category": "Backend",       "tools": ["string", "string"] }},
    {{ "category": "AI/ML",         "tools": ["string", "string"] }},
    {{ "category": "Database",      "tools": ["string"] }},
    {{ "category": "Infrastructure","tools": ["string", "string"] }}
  ]
}}

Rules:
- 5 MVP features listed in strict priority order (most critical first)
- User flow as 5 clear steps from onboarding to the core value moment
- Tech stack tailored specifically to this idea's requirements"""

    text = call_ai(prompt, SYSTEM_PROMPT)
    return extract_json(text)
