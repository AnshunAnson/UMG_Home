#!/usr/bin/env python3
"""
Inject Structure - Generate ProjectDoc files from codebase analysis.
Creates structure.md, components.md, file-reference.md, tech-stack.md, etc.
"""
import os
import re
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

SCRIPT_DIR = Path(__file__).parent
SKILL_DIR = SCRIPT_DIR.parent
PROJECT_ROOT = SKILL_DIR.parent.parent.parent
PORTFOLIO_DIR = PROJECT_ROOT / "portfolio"
PROJECT_DOC_DIR = PROJECT_ROOT / "ProjectDoc"

EXTENSIONS = [".tsx", ".ts", ".css"]
EXCLUDE_DIRS = {"node_modules", ".next", "dist", ".git", "out"}


def scan_files(directory: Path, exts: list[str]) -> list[Path]:
    """Recursively scan directory for source files."""
    results = []
    try:
        for entry in directory.iterdir():
            if entry.name.startswith(".") or entry.name in EXCLUDE_DIRS:
                continue
            if entry.is_dir():
                results.extend(scan_files(entry, exts))
            elif entry.suffix in exts:
                results.append(entry)
    except PermissionError:
        pass
    return results


def count_lines(file_path: Path) -> int:
    """Count lines in a file."""
    try:
        return len(file_path.read_text(encoding="utf-8").split("\n"))
    except Exception:
        return 0


def has_use_client(file_path: Path) -> bool:
    """Check if file has 'use client' directive."""
    try:
        content = file_path.read_text(encoding="utf-8")
        return content.strip().startswith("'use client'") or content.strip().startswith('"use client"')
    except Exception:
        return False


def extract_imports(content: str) -> tuple[list[str], list[str]]:
    """Extract local and external imports."""
    local = []
    external = []
    import_pattern = re.compile(r"import\s+.*?from\s+['\"]([^'\"]+)['\"]")
    for match in import_pattern.finditer(content):
        module = match.group(1)
        if module.startswith(".") or module.startswith("@/"):
            local.append(module)
        else:
            external.append(module)
    return local, external


def extract_component_name(file_path: Path) -> str:
    """Extract component name from file."""
    return file_path.stem


def analyze_components(files: list[Path]) -> list[dict]:
    """Analyze component files."""
    components = []
    for f in files:
        try:
            content = f.read_text(encoding="utf-8")
            local_deps, ext_deps = extract_imports(content)
            components.append({
                "name": extract_component_name(f),
                "path": str(f.relative_to(PORTFOLIO_DIR)),
                "lines": count_lines(f),
                "client": has_use_client(f),
                "local_deps": local_deps,
                "ext_deps": ext_deps
            })
        except Exception:
            pass
    return components


def generate_structure_md() -> str:
    """Generate structure.md content."""
    lines = ["# Project Structure\n"]
    lines.append(f"Generated: {datetime.now().isoformat()[:19]}\n")
    lines.append("```\n")
    
    def walk_dir(directory: Path, prefix: str = ""):
        try:
            entries = sorted(directory.iterdir(), key=lambda x: (not x.is_dir(), x.name))
            for i, entry in enumerate(entries):
                if entry.name.startswith(".") or entry.name in EXCLUDE_DIRS:
                    continue
                is_last = i == len(entries) - 1
                connector = "└── " if is_last else "├── "
                lines.append(f"{prefix}{connector}{entry.name}")
                if entry.is_dir():
                    new_prefix = prefix + ("    " if is_last else "│   ")
                    walk_dir(entry, new_prefix)
        except PermissionError:
            pass
    
    walk_dir(PORTFOLIO_DIR)
    lines.append("```\n")
    return "\n".join(lines)


def generate_components_md(components: list[dict]) -> str:
    """Generate components.md content."""
    lines = ["# Components\n"]
    lines.append(f"Total: {len(components)} components\n")
    lines.append("| Name | Path | Lines | Client | Local Deps |")
    lines.append("|------|------|-------|--------|------------|")
    for c in components:
        client = "✓" if c["client"] else ""
        local = ", ".join(c["local_deps"][:3]) + ("..." if len(c["local_deps"]) > 3 else "")
        lines.append(f"| {c['name']} | {c['path']} | {c['lines']} | {client} | {local} |")
    return "\n".join(lines)


def generate_tech_stack_md() -> str:
    """Generate tech-stack.md content."""
    package_json = PORTFOLIO_DIR / "package.json"
    if not package_json.exists():
        return "# Tech Stack\n\npackage.json not found"
    
    try:
        data = json.loads(package_json.read_text(encoding="utf-8"))
    except Exception:
        return "# Tech Stack\n\nFailed to parse package.json"
    
    lines = ["# Tech Stack\n"]
    lines.append(f"Generated: {datetime.now().isoformat()[:19]}\n")
    
    deps = data.get("dependencies", {})
    dev_deps = data.get("devDependencies", {})
    
    lines.append("## Dependencies\n")
    for name, version in sorted(deps.items()):
        lines.append(f"- **{name}**: {version}")
    
    lines.append("\n## Dev Dependencies\n")
    for name, version in sorted(dev_deps.items()):
        lines.append(f"- **{name}**: {version}")
    
    return "\n".join(lines)


def generate_file_reference_md(components: list[dict]) -> str:
    """Generate file-reference.md content."""
    lines = ["# File Reference\n"]
    lines.append(f"Generated: {datetime.now().isoformat()[:19]}\n")
    
    sections = [c for c in components if "sections" in c["path"]]
    comps = [c for c in components if "components" in c["path"] and "sections" not in c["path"]]
    
    lines.append("## Sections\n")
    for c in sections:
        lines.append(f"- [{c['name']}](../portfolio/{c['path']}) ({c['lines']} lines)")
    
    lines.append("\n## Components\n")
    for c in comps:
        lines.append(f"- [{c['name']}](../portfolio/{c['path']}) ({c['lines']} lines)")
    
    return "\n".join(lines)


def main():
    if not PORTFOLIO_DIR.exists():
        print(f"Portfolio directory not found: {PORTFOLIO_DIR}")
        return
    
    PROJECT_DOC_DIR.mkdir(parents=True, exist_ok=True)
    
    tsx_files = scan_files(PORTFOLIO_DIR / "app", [".tsx"])
    components = analyze_components(tsx_files)
    
    (PROJECT_DOC_DIR / "structure.md").write_text(generate_structure_md(), encoding="utf-8")
    print(f"Generated: structure.md")
    
    (PROJECT_DOC_DIR / "components.md").write_text(generate_components_md(components), encoding="utf-8")
    print(f"Generated: components.md ({len(components)} components)")
    
    (PROJECT_DOC_DIR / "tech-stack.md").write_text(generate_tech_stack_md(), encoding="utf-8")
    print(f"Generated: tech-stack.md")
    
    (PROJECT_DOC_DIR / "file-reference.md").write_text(generate_file_reference_md(components), encoding="utf-8")
    print(f"Generated: file-reference.md")
    
    print(f"\n=== Structure Injection Complete ===")
    print(f"ProjectDoc: {PROJECT_DOC_DIR}")


if __name__ == "__main__":
    main()
