from typing import Any, Dict
from server.utils.ai import call_ai, extract_json


SYSTEM_PROMPT = """You are a seasoned startup COO who has taken 5 companies from zero to Series A.
You create ruthlessly practical execution plans — specific, measurable, and achievable.
You know the difference between a good idea and a successful startup is relentless, focused execution."""

def run_execution_agent(
    idea: str,
    business_strategy: Dict[str, Any],
    product_architect: Dict[str, Any]
) -> Dict[str, Any]:
    mvp_features = ", ".join(product_architect.get('mvpFeatures', []))
    phase1_goals = ", ".join(product_architect.get('roadmap', [{}])[0].get('goals', []))
    
    tech_stack_strs = []
    for t in product_architect.get('techStack', []):
        tools = ", ".join(t.get('tools', []))
        tech_stack_strs.append(tools)
    tech_stack = " | ".join(tech_stack_strs)

    prompt = f"""Create a 90-day execution plan for this startup: "{idea}"

Context:
- Revenue model: {business_strategy.get('revenueModel', '')}
- MVP features (in priority order): {mvp_features}
- Phase 1 goals: {phase1_goals}
- Tech stack: {tech_stack}

Return ONLY a valid JSON object in exactly this structure:
{{
  "day30": [
    {{ "task": "string", "priority": "High",   "owner": "string (role e.g. Founder / CTO / Designer)" }},
    {{ "task": "string", "priority": "High",   "owner": "string" }},
    {{ "task": "string", "priority": "Medium", "owner": "string" }},
    {{ "task": "string", "priority": "Medium", "owner": "string" }},
    {{ "task": "string", "priority": "High",   "owner": "string" }}
  ],
  "day60": [
    {{ "task": "string", "priority": "High",   "owner": "string" }},
    {{ "task": "string", "priority": "High",   "owner": "string" }},
    {{ "task": "string", "priority": "Medium", "owner": "string" }},
    {{ "task": "string", "priority": "Medium", "owner": "string" }},
    {{ "task": "string", "priority": "Low",    "owner": "string" }}
  ],
  "day90": [
    {{ "task": "string", "priority": "High",   "owner": "string" }},
    {{ "task": "string", "priority": "High",   "owner": "string" }},
    {{ "task": "string", "priority": "High",   "owner": "string" }},
    {{ "task": "string", "priority": "Medium", "owner": "string" }},
    {{ "task": "string", "priority": "Medium", "owner": "string" }}
  ],
  "milestones": ["Day 30: string", "Day 60: string", "Day 90: string"],
  "kpis": ["string", "string", "string", "string"]
}}

Rules:
- Tasks must be specific, actionable, and realistic
- Mix technical, marketing, and business tasks across all phases
- priority must be exactly "High", "Medium", or "Low" """

    text = call_ai(prompt, SYSTEM_PROMPT)
    return extract_json(text)
