#!/usr/bin/env python3
"""
Post Task - Record decisions and sync memory after task completion.
Usage: python post_task.py --task "task description" --decision "decision made" [--outcome success|partial|fail]
       python post_task.py --stats
"""
import os
import re
import json
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict

SCRIPT_DIR = Path(__file__).parent
SKILL_DIR = SCRIPT_DIR.parent
MEMORY_DIR = SKILL_DIR / "memory"
DECISIONS_LOG = MEMORY_DIR / "decisions.log"


def record_decision(task: str, decision: str, outcome: str = "success", module: str = "manual", reason: str = ""):
    """Record a decision to the decisions log."""
    entry = {
        "ts": datetime.now().isoformat(),
        "task": task,
        "decision": decision,
        "reason": reason,
        "outcome": outcome,
        "module": module
    }
    
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(DECISIONS_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    
    print(f"Decision recorded: {task}")
    return entry


def get_decision_stats() -> dict:
    """Get statistics from decisions log."""
    if not DECISIONS_LOG.exists():
        return {"total": 0, "by_type": {}, "by_outcome": {}}
    
    decisions = []
    with open(DECISIONS_LOG, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("{"):
                try:
                    decisions.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    
    by_type = defaultdict(int)
    by_outcome = defaultdict(int)
    
    for d in decisions:
        task_type = d.get("type", d.get("task", "").split(":")[0] if ":" in d.get("task", "") else "unknown")
        by_type[task_type] += 1
        by_outcome[d.get("outcome", "unknown")] += 1
    
    return {
        "total": len(decisions),
        "by_type": dict(by_type),
        "by_outcome": dict(by_outcome)
    }


def main():
    parser = argparse.ArgumentParser(description="Record task decisions")
    parser.add_argument("--task", help="Task description")
    parser.add_argument("--decision", help="Decision made")
    parser.add_argument("--outcome", choices=["success", "partial", "fail"], default="success", help="Outcome")
    parser.add_argument("--module", default="manual", help="Module involved")
    parser.add_argument("--reason", default="", help="Reason for decision")
    parser.add_argument("--stats", action="store_true", help="Show decision statistics")
    
    args = parser.parse_args()
    
    if args.stats:
        stats = get_decision_stats()
        print(f"Total decisions: {stats['total']}")
        print(f"By type: {stats['by_type']}")
        print(f"By outcome: {stats['by_outcome']}")
        return
    
    if not args.task or not args.decision:
        parser.error("--task and --decision are required (unless using --stats)")
    
    entry = record_decision(args.task, args.decision, args.outcome, args.module, args.reason)
    print(json.dumps(entry, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
