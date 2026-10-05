import os
import re
import json
import time
from typing import Any
from openai import OpenAI

# Groq-hosted models (fast, free tier available)
MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']
MAX_RETRIES = 2
RATE_LIMIT_WAIT_S = 20

def get_api_key() -> str:
    # Reads VITE_GROQ_API_KEY from environment variables (Render/hosting env)
    return os.environ.get('VITE_GROQ_API_KEY', '')


def create_client(api_key: str) -> OpenAI:
    # Groq is OpenAI-compatible, just different base_url
    return OpenAI(
        api_key=api_key,
        base_url='https://api.groq.com/openai/v1'
    )

def call_ai(prompt: str, system_instruction: str) -> str:
    api_key = get_api_key()
    if not api_key:
        raise Exception('NO_API_KEY: No Groq API key found. Set VITE_GROQ_API_KEY in your .env file.')

    client = create_client(api_key)
    last_error = None

    for model in MODELS:
        for attempt in range(MAX_RETRIES + 1):
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                )
                content = response.choices[0].message.content
                if not content:
                    raise Exception('Empty response from Groq API.')
                return content

            except Exception as err:
                last_error = err
                msg = str(err).lower()

                # Auth error — fail immediately, no retry
                if '401' in msg or '403' in msg or 'unauthorized' in msg or 'invalid api key' in msg:
                    raise Exception('AUTH_ERROR: Invalid Groq API key.')

                # Rate limit — wait then retry
                if '429' in msg or 'rate limit' in msg or 'too many requests' in msg:
                    if attempt < MAX_RETRIES:
                        print(f"[Groq] Rate limited on {model}. Waiting {RATE_LIMIT_WAIT_S}s... (retry {attempt + 1}/{MAX_RETRIES})")
                        time.sleep(RATE_LIMIT_WAIT_S)
                        continue
                    print(f"[Groq] Exhausted retries on {model}. Trying next model...")
                    break

                print(f"[Groq] Error on {model}: {str(err)[:200]}")
                break

    raise last_error or Exception('All Groq models failed. Please check your API key and try again.')

def extract_json(text: str) -> dict[str, Any]:
    # 1. Strip markdown code fences if present
    fenced_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    candidate = fenced_match.group(1).strip() if fenced_match else text.strip()

    # 2. Try direct parse
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        pass

    # 3. Extract the outermost { ... } block and parse that
    brace_match = re.search(r'\{[\s\S]*\}', candidate)
    if brace_match:
        try:
            return json.loads(brace_match.group(0))
        except json.JSONDecodeError:
            pass

    raise Exception('PARSE_ERROR: Could not extract valid JSON from AI response.\n' + text[:300])
