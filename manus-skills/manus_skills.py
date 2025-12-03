"""
HTI Manus Skills - Python utility for triggering Manus tasks

Usage:
    from manus_skills import run_hti_skill
    result = run_hti_skill("lead-researcher")
"""

import os
import requests
from pathlib import Path
from datetime import datetime

MANUS_API_BASE = "https://api.manus.im/v1"
SKILLS_DIR = Path(__file__).parent

SKILLS = {
    "lead-researcher": {
        "file": "hti-lead-researcher.md",
        "name": "HTI Lead Researcher",
        "description": "Find potential donors and corporate sponsors",
    },
    "grant-scanner": {
        "file": "hti-grant-scanner.md",
        "name": "HTI Grant Scanner",
        "description": "Search for matching grant opportunities",
    },
    "equipment-pricer": {
        "file": "hti-equipment-pricer.md",
        "name": "HTI Equipment Pricer",
        "description": "Market analysis for device pricing",
    },
}


def get_api_key() -> str:
    """Get Manus API key from environment."""
    key = os.environ.get("MANUS_API_KEY")
    if not key:
        raise ValueError("MANUS_API_KEY environment variable not set")
    return key


def load_skill_prompt(skill_id: str) -> str:
    """Load the prompt from a skill markdown file."""
    if skill_id not in SKILLS:
        raise ValueError(f"Unknown skill: {skill_id}. Available: {list(SKILLS.keys())}")

    skill_file = SKILLS_DIR / SKILLS[skill_id]["file"]
    content = skill_file.read_text()

    # Extract the main prompt from the markdown (between triple backticks after "Task Prompt")
    lines = content.split("\n")
    in_prompt = False
    prompt_lines = []

    for line in lines:
        if "```" in line and in_prompt:
            break
        if in_prompt:
            prompt_lines.append(line)
        if "### Task Prompt" in line:
            in_prompt = False
        if line.strip() == "```" and "Task Prompt" in "\n".join(lines[:lines.index(line)]):
            in_prompt = True

    # Fallback: use the full content if parsing fails
    if not prompt_lines:
        return content

    return "\n".join(prompt_lines)


def run_hti_skill(skill_id: str, wait: bool = True) -> dict:
    """
    Run an HTI Manus skill.

    Args:
        skill_id: One of 'lead-researcher', 'grant-scanner', 'equipment-pricer'
        wait: If True, wait for task completion and return results

    Returns:
        dict with task_id and optionally results
    """
    api_key = get_api_key()
    prompt = load_skill_prompt(skill_id)
    skill_info = SKILLS[skill_id]

    # Create the task
    response = requests.post(
        f"{MANUS_API_BASE}/tasks",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "prompt": prompt,
            "name": f"{skill_info['name']} - {datetime.now().strftime('%Y-%m-%d')}",
        },
    )
    response.raise_for_status()
    task_data = response.json()
    task_id = task_data.get("task_id") or task_data.get("id")

    result = {"task_id": task_id, "skill": skill_id}

    if wait:
        # Poll for completion
        import time
        max_wait = 600  # 10 minutes
        poll_interval = 10
        elapsed = 0

        while elapsed < max_wait:
            status_response = requests.get(
                f"{MANUS_API_BASE}/tasks/{task_id}",
                headers={"Authorization": f"Bearer {api_key}"},
            )
            status_data = status_response.json()
            status = status_data.get("status", "unknown")

            if status in ["completed", "finished", "done"]:
                result["status"] = "completed"
                result["outputs"] = status_data.get("outputs", [])
                result["result"] = status_data.get("result")
                break
            elif status in ["failed", "error"]:
                result["status"] = "failed"
                result["error"] = status_data.get("error")
                break

            time.sleep(poll_interval)
            elapsed += poll_interval
        else:
            result["status"] = "timeout"

    return result


def list_skills() -> list:
    """List available HTI skills."""
    return [
        {"id": k, **v}
        for k, v in SKILLS.items()
    ]


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Available HTI Manus Skills:")
        for skill in list_skills():
            print(f"  - {skill['id']}: {skill['description']}")
        print("\nUsage: python manus_skills.py <skill-id>")
        sys.exit(0)

    skill_id = sys.argv[1]
    print(f"Running skill: {skill_id}")

    try:
        result = run_hti_skill(skill_id)
        print(f"Task ID: {result['task_id']}")
        print(f"Status: {result.get('status', 'submitted')}")
        if result.get("outputs"):
            print(f"Outputs: {len(result['outputs'])} files")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
