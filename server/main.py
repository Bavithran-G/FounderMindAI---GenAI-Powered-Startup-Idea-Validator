import json
import time
import asyncio
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uuid 

from server.agents.market_research import run_market_research_agent
from server.agents.business_strategy import run_business_strategy_agent
from server.agents.product_architect import run_product_architect_agent
from server.agents.investor_agent import run_investor_agent
from server.agents.pitch_deck import run_pitch_deck_agent
from server.agents.execution_agent import run_execution_agent


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    idea: str

async def orchestration_stream(idea: str):
    result = {
        "id": str(uuid.uuid4()),
        "idea": idea,
        "timestamp": int(time.time() * 1000),
        "marketResearch": None,
        "businessStrategy": None,
        "productArchitect": None,
        "investor": None,
        "pitchDeck": None,
        "execution": None,
    }

    def yield_event(agent: str, status: str, data=None, error=None):
        payload = {
            "agent": agent,
            "status": status,
        }
        if data is not None:
            payload["data"] = data
        if error is not None:
            payload["error"] = error
            
        return f"data: {json.dumps(payload)}\n\n"

    try:
        # Agent 1: Market Research
        yield yield_event("marketResearch", "running")
        # Run in executor to avoid blocking the event loop since the API call is synchronous
        result["marketResearch"] = await asyncio.to_thread(run_market_research_agent, idea)
        yield yield_event("marketResearch", "complete", result["marketResearch"])
        await asyncio.sleep(2)

        # Agent 2: Business Strategy
        yield yield_event("businessStrategy", "running")
        result["businessStrategy"] = await asyncio.to_thread(run_business_strategy_agent, idea, result["marketResearch"])
        yield yield_event("businessStrategy", "complete", result["businessStrategy"])
        await asyncio.sleep(2)

        # Agent 3: Product Architect
        yield yield_event("productArchitect", "running")
        result["productArchitect"] = await asyncio.to_thread(run_product_architect_agent, idea, result["marketResearch"], result["businessStrategy"])
        yield yield_event("productArchitect", "complete", result["productArchitect"])
        await asyncio.sleep(2)

        # Agent 4: Investor
        yield yield_event("investor", "running")
        result["investor"] = await asyncio.to_thread(run_investor_agent, idea, result["marketResearch"], result["businessStrategy"], result["productArchitect"])
        yield yield_event("investor", "complete", result["investor"])
        await asyncio.sleep(2)

        # Agent 5: Pitch Deck
        yield yield_event("pitchDeck", "running")
        result["pitchDeck"] = await asyncio.to_thread(run_pitch_deck_agent, idea, result["marketResearch"], result["businessStrategy"], result["investor"])
        yield yield_event("pitchDeck", "complete", result["pitchDeck"])
        await asyncio.sleep(2)

        # Agent 6: Execution
        yield yield_event("execution", "running")
        result["execution"] = await asyncio.to_thread(run_execution_agent, idea, result["businessStrategy"], result["productArchitect"])
        yield yield_event("execution", "complete", result["execution"])
        
        # Send a final 'done' event with the complete result object
        yield f"data: {json.dumps({'done': True, 'result': result})}\n\n"

    except Exception as e:
        # If any step fails, we yield an error event
        # Assuming the failing agent is the last one that was "running"
        yield f"data: {json.dumps({'error': str(e)})}\n\n"


@app.post("/api/analyze")
async def analyze_idea(req: AnalyzeRequest):
    return StreamingResponse(
        orchestration_stream(req.idea),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
