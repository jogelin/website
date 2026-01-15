#!/usr/bin/env python3
"""
SVG Generator for SDLC Phase Diagrams

Generates consistent, reproducible diagrams for the AI-Powered SDLC article.
Uses a fixed design system to ensure visual consistency across all diagrams.
"""

import argparse
from dataclasses import dataclass
from typing import List, Optional
import html


def escape_xml(text: str) -> str:
    """Escape special XML characters in text content"""
    return html.escape(text, quote=False)


# =============================================================================
# DESIGN SYSTEM
# =============================================================================

@dataclass
class Colors:
    """Design system colors"""
    # Backgrounds
    background: str = "#f8f9fa"
    pattern: str = "#e9ecef"

    # Primary blocks
    ai_framework: str = "#5eaaa8"  # Muted teal
    use_case: str = "#9b8ac4"      # Soft purple

    # Text
    text_dark: str = "#334155"
    text_light: str = "#ffffff"
    text_muted: str = "#64748b"

    # Connectors
    arrow: str = "#94a3b8"
    arrow_head: str = "#64748b"


@dataclass
class Dimensions:
    """Standard dimensions for diagram elements"""
    # Canvas
    width: int = 1600
    height: int = 900
    padding: int = 60

    # AI Framework block (top)
    framework_width: int = 320
    framework_height: int = 200
    framework_radius: int = 16

    # Use case blocks (bottom)
    usecase_width: int = 280
    usecase_height: int = 220
    usecase_radius: int = 16
    usecase_gap: int = 40

    # Arrow dimensions
    arrow_width: int = 2
    arrow_head_size: int = 10


COLORS = Colors()
DIMS = Dimensions()


# =============================================================================
# SVG ICONS (as path data)
# =============================================================================

ICONS = {
    # AI Framework - Brain with gears
    "ai_framework": """
        <g transform="translate(-40, -40) scale(0.8)">
            <circle cx="50" cy="50" r="35" fill="none" stroke="white" stroke-width="2"/>
            <path d="M35 50 Q35 35 50 35 Q65 35 65 50 Q65 65 50 65 Q35 65 35 50" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="50" cy="50" r="8" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="75" cy="35" r="12" fill="none" stroke="white" stroke-width="2"/>
            <line x1="75" y1="29" x2="75" y2="41" stroke="white" stroke-width="2"/>
            <line x1="69" y1="35" x2="81" y2="35" stroke="white" stroke-width="2"/>
            <circle cx="80" cy="65" r="8" fill="none" stroke="white" stroke-width="2"/>
            <path d="M25 45 L20 40 M25 55 L20 60 M40 30 L35 22 M60 30 L65 22" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </g>
    """,

    # Task Writing - Document with pencil
    "task_writing": """
        <g transform="translate(-24, -24)">
            <rect x="8" y="4" width="28" height="36" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <line x1="14" y1="12" x2="30" y2="12" stroke="white" stroke-width="2"/>
            <line x1="14" y1="18" x2="30" y2="18" stroke="white" stroke-width="2"/>
            <line x1="14" y1="24" x2="24" y2="24" stroke="white" stroke-width="2"/>
            <path d="M32 28 L40 20 L44 24 L36 32 L32 32 Z" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Backlog - List with database
    "backlog": """
        <g transform="translate(-24, -24)">
            <rect x="4" y="4" width="24" height="8" rx="4" fill="none" stroke="white" stroke-width="2"/>
            <rect x="4" y="16" width="24" height="8" rx="4" fill="none" stroke="white" stroke-width="2"/>
            <rect x="4" y="28" width="24" height="8" rx="4" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="38" cy="28" r="10" fill="none" stroke="white" stroke-width="2"/>
            <ellipse cx="38" cy="24" rx="10" ry="4" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Interview Mode - People talking
    "interview": """
        <g transform="translate(-24, -24)">
            <circle cx="14" cy="14" r="8" fill="none" stroke="white" stroke-width="2"/>
            <path d="M4 38 Q4 28 14 28 Q24 28 24 38" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="34" cy="14" r="8" fill="none" stroke="white" stroke-width="2"/>
            <path d="M24 38 Q24 28 34 28 Q44 28 44 38" fill="none" stroke="white" stroke-width="2"/>
            <rect x="20" y="6" width="8" height="6" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <path d="M24 12 L22 16 L26 16 Z" fill="white"/>
        </g>
    """,

    # Architecture - Building blocks
    "architecture": """
        <g transform="translate(-24, -24)">
            <rect x="4" y="24" width="16" height="16" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <rect x="24" y="24" width="16" height="16" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <rect x="14" y="4" width="16" height="16" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <line x1="22" y1="20" x2="12" y2="24" stroke="white" stroke-width="2"/>
            <line x1="22" y1="20" x2="32" y2="24" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Specifications - Target/bullseye
    "specifications": """
        <g transform="translate(-24, -24)">
            <circle cx="24" cy="24" r="20" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="24" r="12" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="24" r="4" fill="white"/>
        </g>
    """,

    # UI/UX Design - Palette/design
    "ui_design": """
        <g transform="translate(-24, -24)">
            <rect x="4" y="4" width="36" height="28" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <rect x="8" y="8" width="12" height="8" rx="1" fill="none" stroke="white" stroke-width="2"/>
            <line x1="8" y1="22" x2="36" y2="22" stroke="white" stroke-width="2"/>
            <line x1="8" y1="26" x2="28" y2="26" stroke="white" stroke-width="2"/>
            <circle cx="34" cy="12" r="4" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Documentation - Book
    "documentation": """
        <g transform="translate(-24, -24)">
            <path d="M4 8 Q4 4 12 4 L24 4 L24 40 L12 40 Q4 40 4 36 Z" fill="none" stroke="white" stroke-width="2"/>
            <path d="M24 4 L36 4 Q44 4 44 8 L44 36 Q44 40 36 40 L24 40" fill="none" stroke="white" stroke-width="2"/>
            <line x1="24" y1="4" x2="24" y2="40" stroke="white" stroke-width="2"/>
            <line x1="10" y1="12" x2="18" y2="12" stroke="white" stroke-width="2"/>
            <line x1="10" y1="18" x2="18" y2="18" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Code Generation - Code brackets
    "code_generation": """
        <g transform="translate(-24, -24)">
            <path d="M16 8 L4 24 L16 40" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M32 8 L44 24 L32 40" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="28" y1="4" x2="20" y2="44" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </g>
    """,

    # Codebase Understanding - Magnifying glass with code
    "codebase": """
        <g transform="translate(-24, -24)">
            <circle cx="20" cy="20" r="16" fill="none" stroke="white" stroke-width="2"/>
            <line x1="32" y1="32" x2="44" y2="44" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <path d="M14 16 L10 20 L14 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M26 16 L30 20 L26 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </g>
    """,

    # Legacy Migration - Refresh/cycle arrows
    "migration": """
        <g transform="translate(-24, -24)">
            <path d="M24 8 A16 16 0 0 1 40 24" fill="none" stroke="white" stroke-width="2"/>
            <path d="M40 24 L36 18 M40 24 L34 26" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M24 40 A16 16 0 0 1 8 24" fill="none" stroke="white" stroke-width="2"/>
            <path d="M8 24 L12 30 M8 24 L14 22" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <rect x="18" y="18" width="12" height="12" rx="2" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Agentic Tasks - Robot
    "agentic": """
        <g transform="translate(-24, -24)">
            <rect x="12" y="12" width="24" height="20" rx="4" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
            <circle cx="28" cy="20" r="3" fill="white"/>
            <line x1="18" y1="28" x2="30" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="24" y1="6" x2="24" y2="12" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="4" r="2" fill="white"/>
            <line x1="8" y1="20" x2="12" y2="20" stroke="white" stroke-width="2"/>
            <line x1="36" y1="20" x2="40" y2="20" stroke="white" stroke-width="2"/>
        </g>
    """,

    # PR Automation - Git merge
    "pr_automation": """
        <g transform="translate(-24, -24)">
            <circle cx="12" cy="12" r="4" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="36" cy="12" r="4" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="36" r="4" fill="none" stroke="white" stroke-width="2"/>
            <line x1="12" y1="16" x2="12" y2="28" stroke="white" stroke-width="2"/>
            <line x1="36" y1="16" x2="36" y2="28" stroke="white" stroke-width="2"/>
            <path d="M12 28 Q12 32 24 32 Q36 32 36 28" fill="none" stroke="white" stroke-width="2"/>
            <line x1="24" y1="32" x2="24" y2="32" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Code Review - Eye with checkmark
    "code_review": """
        <g transform="translate(-24, -24)">
            <ellipse cx="24" cy="24" rx="20" ry="12" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="24" r="8" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="24" r="3" fill="white"/>
            <path d="M32 32 L36 36 L44 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </g>
    """,

    # Quality Gates - Shield with check
    "quality_gates": """
        <g transform="translate(-24, -24)">
            <path d="M24 4 L40 10 L40 24 Q40 40 24 44 Q8 40 8 24 L8 10 Z" fill="none" stroke="white" stroke-width="2"/>
            <path d="M16 24 L22 30 L32 18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </g>
    """,

    # Self-Healing CI - Wrench with gear
    "self_healing": """
        <g transform="translate(-24, -24)">
            <circle cx="32" cy="16" r="10" fill="none" stroke="white" stroke-width="2"/>
            <line x1="32" y1="10" x2="32" y2="22" stroke="white" stroke-width="2"/>
            <line x1="26" y1="16" x2="38" y2="16" stroke="white" stroke-width="2"/>
            <path d="M8 40 L16 32 L20 36 L12 44 Z" fill="none" stroke="white" stroke-width="2"/>
            <path d="M18 30 Q24 24 26 26" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Changelog - Document with list
    "changelog": """
        <g transform="translate(-24, -24)">
            <rect x="8" y="4" width="32" height="40" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <line x1="14" y1="14" x2="34" y2="14" stroke="white" stroke-width="2"/>
            <line x1="14" y1="22" x2="34" y2="22" stroke="white" stroke-width="2"/>
            <line x1="14" y1="30" x2="28" y2="30" stroke="white" stroke-width="2"/>
            <circle cx="14" cy="14" r="0" fill="white"/>
        </g>
    """,

    # Release Communication - Megaphone
    "communication": """
        <g transform="translate(-24, -24)">
            <path d="M8 20 L8 28 L16 28 L32 40 L32 8 L16 20 Z" fill="none" stroke="white" stroke-width="2"/>
            <path d="M36 18 Q44 24 36 30" fill="none" stroke="white" stroke-width="2"/>
            <path d="M38 14 Q48 24 38 34" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Deployment Validation - Rocket with check
    "deployment": """
        <g transform="translate(-24, -24)">
            <path d="M24 4 Q36 8 40 20 L32 28 L24 36 L16 28 L8 20 Q12 8 24 4" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="18" r="4" fill="none" stroke="white" stroke-width="2"/>
            <path d="M12 32 L8 44 L16 36" fill="none" stroke="white" stroke-width="2"/>
            <path d="M36 32 L40 44 L32 36" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Incident Analysis - Warning with magnifier
    "incident": """
        <g transform="translate(-24, -24)">
            <path d="M24 8 L40 36 L8 36 Z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <line x1="24" y1="18" x2="24" y2="26" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="24" cy="30" r="1.5" fill="white"/>
        </g>
    """,

    # Automated Refactoring - Wrench with code
    "refactoring": """
        <g transform="translate(-24, -24)">
            <path d="M8 8 L16 16 L8 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M24 8 L16 16 L24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M28 28 L40 40" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <circle cx="24" cy="24" r="8" fill="none" stroke="white" stroke-width="2"/>
        </g>
    """,

    # Automatic Upgrades - Arrow up with package
    "upgrades": """
        <g transform="translate(-24, -24)">
            <rect x="8" y="16" width="24" height="24" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <line x1="8" y1="24" x2="32" y2="24" stroke="white" stroke-width="2"/>
            <path d="M36 28 L36 8 L28 16 M36 8 L44 16" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </g>
    """,

    # Tech Debt - Chart trending down then up
    "tech_debt": """
        <g transform="translate(-24, -24)">
            <rect x="4" y="4" width="40" height="32" rx="2" fill="none" stroke="white" stroke-width="2"/>
            <polyline points="10,28 18,20 26,26 34,14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="34" cy="14" r="3" fill="white"/>
        </g>
    """,

    # Cross-Repository - Connected nodes
    "cross_repo": """
        <g transform="translate(-24, -24)">
            <circle cx="12" cy="12" r="8" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="36" cy="12" r="8" fill="none" stroke="white" stroke-width="2"/>
            <circle cx="24" cy="36" r="8" fill="none" stroke="white" stroke-width="2"/>
            <line x1="18" y1="16" x2="30" y2="16" stroke="white" stroke-width="2"/>
            <line x1="14" y1="20" x2="20" y2="30" stroke="white" stroke-width="2"/>
            <line x1="34" y1="20" x2="28" y2="30" stroke="white" stroke-width="2"/>
        </g>
    """
}


# =============================================================================
# SVG COMPONENTS
# =============================================================================

def svg_background(width: int, height: int) -> str:
    """Generate background with subtle geometric pattern"""
    return f'''
    <rect width="{width}" height="{height}" fill="{COLORS.background}"/>

    <!-- Subtle geometric pattern - top right -->
    <g opacity="0.3" stroke="{COLORS.pattern}" stroke-width="1" fill="none">
        <path d="M{width-120} 20 L{width-80} 50 L{width-120} 80 L{width-160} 50 Z"/>
        <path d="M{width-80} 50 L{width-40} 80 L{width-80} 110 L{width-120} 80 Z"/>
        <path d="M{width-60} 0 L{width-60} 40"/>
        <path d="M{width-20} 40 L{width-20} 100"/>
        <line x1="{width-140}" y1="10" x2="{width-100}" y2="10"/>
        <line x1="{width-40}" y1="120" x2="{width}" y2="120"/>
    </g>

    <!-- Subtle geometric pattern - bottom left -->
    <g opacity="0.3" stroke="{COLORS.pattern}" stroke-width="1" fill="none">
        <path d="M40 {height-80} L80 {height-50} L40 {height-20} L0 {height-50} Z"/>
        <path d="M80 {height-110} L120 {height-80} L80 {height-50} L40 {height-80} Z"/>
        <line x1="0" y1="{height-120}" x2="60" y2="{height-120}"/>
        <line x1="100" y1="{height-40}" x2="160" y2="{height-40}"/>
    </g>
    '''


def svg_ai_framework_block(x: int, y: int, subtitle: str = "Intelligent Methodology &\nPattern Recognition") -> str:
    """Generate the AI Framework block (top center)"""
    w, h, r = DIMS.framework_width, DIMS.framework_height, DIMS.framework_radius

    # Split subtitle into lines and escape XML characters
    subtitle_lines = subtitle.split('\n')
    subtitle_svg = ''
    for i, line in enumerate(subtitle_lines):
        subtitle_svg += f'<tspan x="{x}" dy="{18 if i > 0 else 0}">{escape_xml(line)}</tspan>'

    return f'''
    <g>
        <!-- Block background -->
        <rect x="{x - w//2}" y="{y}" width="{w}" height="{h}" rx="{r}"
              fill="{COLORS.ai_framework}"/>

        <!-- Title -->
        <text x="{x}" y="{y + 35}" text-anchor="middle"
              fill="{COLORS.text_light}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              font-size="22" font-weight="600">AI Framework</text>

        <!-- Icon -->
        <g transform="translate({x}, {y + 90})">
            {ICONS['ai_framework']}
        </g>

        <!-- Subtitle -->
        <text x="{x}" y="{y + 155}" text-anchor="middle"
              fill="{COLORS.text_light}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              font-size="13" opacity="0.9">
            {subtitle_svg}
        </text>
    </g>
    '''


def svg_usecase_block(x: int, y: int, title: str, description: str, icon_name: str) -> str:
    """Generate a use case block"""
    w, h, r = DIMS.usecase_width, DIMS.usecase_height, DIMS.usecase_radius

    # Word wrap description (roughly 25 chars per line)
    words = description.split()
    lines = []
    current_line = []
    current_length = 0

    for word in words:
        if current_length + len(word) + 1 > 28:
            lines.append(' '.join(current_line))
            current_line = [word]
            current_length = len(word)
        else:
            current_line.append(word)
            current_length += len(word) + 1
    if current_line:
        lines.append(' '.join(current_line))

    desc_svg = ''
    for i, line in enumerate(lines[:4]):  # Max 4 lines
        desc_svg += f'<tspan x="{x}" dy="{16 if i > 0 else 0}">{escape_xml(line)}</tspan>'

    icon_svg = ICONS.get(icon_name, ICONS['task_writing'])

    return f'''
    <g>
        <!-- Block background -->
        <rect x="{x - w//2}" y="{y}" width="{w}" height="{h}" rx="{r}"
              fill="{COLORS.use_case}"/>

        <!-- Icon -->
        <g transform="translate({x}, {y + 50})">
            {icon_svg}
        </g>

        <!-- Title -->
        <text x="{x}" y="{y + 100}" text-anchor="middle"
              fill="{COLORS.text_light}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              font-size="18" font-weight="600">{escape_xml(title)}</text>

        <!-- Description -->
        <text x="{x}" y="{y + 125}" text-anchor="middle"
              fill="{COLORS.text_light}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              font-size="12" opacity="0.9">
            {desc_svg}
        </text>
    </g>
    '''


def svg_arrow(x1: int, y1: int, x2: int, y2: int, label: str = "") -> str:
    """Generate an arrow with optional label"""
    # Calculate control points for a nice curve
    mid_y = (y1 + y2) // 2

    return f'''
    <g>
        <!-- Arrow line -->
        <path d="M{x1} {y1} L{x1} {mid_y} L{x2} {mid_y} L{x2} {y2-10}"
              fill="none" stroke="{COLORS.arrow}" stroke-width="{DIMS.arrow_width}"/>

        <!-- Arrow head -->
        <polygon points="{x2},{y2} {x2-6},{y2-12} {x2+6},{y2-12}"
                 fill="{COLORS.arrow_head}"/>
    </g>
    '''


def svg_connection_label(x: int, y: int, text: str) -> str:
    """Generate a connection label"""
    lines = text.split('\n')
    label_svg = ''
    for i, line in enumerate(lines):
        label_svg += f'<tspan x="{x}" dy="{16 if i > 0 else 0}">{escape_xml(line)}</tspan>'

    return f'''
    <text x="{x}" y="{y}" text-anchor="middle"
          fill="{COLORS.text_dark}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="14">
        {label_svg}
    </text>
    '''


def svg_branding(width: int, height: int) -> str:
    """Generate the smartsdlc.dev branding"""
    return f'''
    <text x="{width - 30}" y="{height - 25}" text-anchor="end"
          fill="{COLORS.text_muted}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="14">smartsdlc.dev</text>
    '''


# =============================================================================
# DIAGRAM GENERATORS
# =============================================================================

@dataclass
class UseCase:
    """Use case definition"""
    title: str
    description: str
    icon: str


def generate_sdlc_phase_diagram(
    phase_name: str,
    framework_subtitle: str,
    connection_label: str,
    use_cases: List[UseCase],
    output_path: str
) -> str:
    """Generate an SDLC phase diagram"""

    w, h = DIMS.width, DIMS.height

    # Calculate positions
    framework_x = w // 2
    framework_y = 80
    framework_bottom = framework_y + DIMS.framework_height

    # Use case positions (evenly distributed)
    num_cases = len(use_cases)
    total_width = num_cases * DIMS.usecase_width + (num_cases - 1) * DIMS.usecase_gap
    start_x = (w - total_width) // 2 + DIMS.usecase_width // 2
    usecase_y = 520

    usecase_positions = [
        start_x + i * (DIMS.usecase_width + DIMS.usecase_gap)
        for i in range(num_cases)
    ]

    # Build SVG
    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">',

        # Background
        svg_background(w, h),

        # AI Framework block
        svg_ai_framework_block(framework_x, framework_y, framework_subtitle),

        # Connection label (left of center)
        svg_connection_label(framework_x - 200, framework_bottom + 60, connection_label),

        # Arrows from framework to use cases
    ]

    for uc_x in usecase_positions:
        svg_parts.append(svg_arrow(uc_x, framework_bottom + 80, uc_x, usecase_y))

    # Horizontal connector line
    if num_cases > 1:
        svg_parts.append(f'''
        <line x1="{usecase_positions[0]}" y1="{framework_bottom + 80}"
              x2="{usecase_positions[-1]}" y2="{framework_bottom + 80}"
              stroke="{COLORS.arrow}" stroke-width="{DIMS.arrow_width}"/>
        ''')
        # Vertical line from framework
        svg_parts.append(f'''
        <line x1="{framework_x}" y1="{framework_bottom}"
              x2="{framework_x}" y2="{framework_bottom + 80}"
              stroke="{COLORS.arrow}" stroke-width="{DIMS.arrow_width}"/>
        ''')

    # Use case blocks
    for i, uc in enumerate(use_cases):
        svg_parts.append(svg_usecase_block(
            usecase_positions[i], usecase_y,
            uc.title, uc.description, uc.icon
        ))

    # Branding
    svg_parts.append(svg_branding(w, h))

    svg_parts.append('</svg>')

    svg_content = '\n'.join(svg_parts)

    # Write to file
    with open(output_path, 'w') as f:
        f.write(svg_content)

    return svg_content


# =============================================================================
# PHASE DEFINITIONS
# =============================================================================

PHASES = {
    "specify": {
        "framework_subtitle": "Intelligent Methodology &\nPattern Recognition",
        "connection_label": "Provides Methodology\nTemplates & Patterns",
        "use_cases": [
            UseCase("Task Writing", "Generates structured requirements, user stories, and acceptance criteria based on best practices.", "task_writing"),
            UseCase("Backlog", "Prioritizes and organizes backlog items, identifying dependencies and potential bottlenecks.", "backlog"),
            UseCase("Interview Mode", "Simulates stakeholder interviews to elicit requirements, refine scope, and clarify ambiguity.", "interview"),
        ]
    },
    "design": {
        "framework_subtitle": "Architecture Patterns &\nDesign Standards",
        "connection_label": "Provides Architecture\nPatterns & Standards",
        "use_cases": [
            UseCase("Architecture", "Generates component diagrams, data models, and ADRs following established patterns.", "architecture"),
            UseCase("Specifications", "Produces detailed technical requirements, API contracts, and integration points.", "specifications"),
            UseCase("UI/UX Design", "Creates mockups, applies design tokens, and ensures accessibility compliance.", "ui_design"),
            UseCase("Documentation", "Generates architecture docs, API references, and onboarding guides from code.", "documentation"),
        ]
    },
    "develop": {
        "framework_subtitle": "Code Patterns &\nConventions",
        "connection_label": "Provides Code Patterns\n& Conventions",
        "use_cases": [
            UseCase("Code Generation", "Generates code following naming conventions, patterns, and module boundaries.", "code_generation"),
            UseCase("Codebase Q&A", "Answers questions about code, traces dependencies, and analyzes impact.", "codebase"),
            UseCase("Migration", "Detects patterns, generates codemods, and aligns with latest standards.", "migration"),
            UseCase("Agentic Tasks", "Executes multi-step tasks: scaffolding, refactoring, and validation.", "agentic"),
        ]
    },
    "validate": {
        "framework_subtitle": "Quality Standards &\nReview Patterns",
        "connection_label": "Provides Quality\nStandards & Rules",
        "use_cases": [
            UseCase("PR Automation", "Generates PR descriptions, lists affected components, and highlights risks.", "pr_automation"),
            UseCase("Code Review", "Reviews for pattern violations, security issues, and missing coverage.", "code_review"),
            UseCase("Quality Gates", "Enforces module boundaries, dependency rules, and architecture constraints.", "quality_gates"),
            UseCase("Self-Healing CI", "Reads error logs, proposes fixes, and opens PRs to resolve failures.", "self_healing"),
        ]
    },
    "release": {
        "framework_subtitle": "Release Patterns &\nCommunication Templates",
        "connection_label": "Provides Release\nTemplates & Formats",
        "use_cases": [
            UseCase("Changelog", "Generates changelogs, release notes, and migration guides from commits.", "changelog"),
            UseCase("Communication", "Prepares stakeholder announcements and customer-facing updates.", "communication"),
            UseCase("Deployment", "Validates configurations, compares environments, and supports rollback.", "deployment"),
            UseCase("Incident Analysis", "Correlates issues with changes, analyzes logs, and suggests root causes.", "incident"),
        ]
    },
    "maintain": {
        "framework_subtitle": "Evolution Patterns &\nUpgrade Paths",
        "connection_label": "Provides Evolution\nPatterns & Strategies",
        "use_cases": [
            UseCase("Refactoring", "Performs large-scale refactoring with impact analysis and validation.", "refactoring"),
            UseCase("Upgrades", "Reads changelogs, identifies breaking changes, and proposes migrations.", "upgrades"),
            UseCase("Tech Debt", "Identifies and quantifies tech debt with prioritized remediation plans.", "tech_debt"),
            UseCase("Cross-Repo", "Coordinates changes across repositories and ensures consistency.", "cross_repo"),
        ]
    },
}


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description='Generate SDLC phase diagram SVGs')
    parser.add_argument('--phase', type=str, choices=list(PHASES.keys()) + ['all'],
                        default='specify', help='Which phase to generate')
    parser.add_argument('--output', type=str, help='Output file path (for single phase)')
    parser.add_argument('--output-dir', type=str, default='public/blog/images/ai-sdlc',
                        help='Output directory (for all phases)')

    args = parser.parse_args()

    if args.phase == 'all':
        # Generate all phases
        phase_numbers = {
            'specify': '21',
            'design': '22',
            'develop': '23',
            'validate': '24',
            'release': '25',
            'maintain': '26',
        }

        for phase_name, phase_config in PHASES.items():
            output_path = f"{args.output_dir}/{phase_numbers[phase_name]}-{phase_name}-phase.svg"
            generate_sdlc_phase_diagram(
                phase_name=phase_name,
                framework_subtitle=phase_config['framework_subtitle'],
                connection_label=phase_config['connection_label'],
                use_cases=phase_config['use_cases'],
                output_path=output_path
            )
            print(f"Generated: {output_path}")
    else:
        # Generate single phase
        phase_config = PHASES[args.phase]
        output_path = args.output or f"public/blog/images/ai-sdlc/{args.phase}-phase.svg"

        generate_sdlc_phase_diagram(
            phase_name=args.phase,
            framework_subtitle=phase_config['framework_subtitle'],
            connection_label=phase_config['connection_label'],
            use_cases=phase_config['use_cases'],
            output_path=output_path
        )
        print(f"Generated: {output_path}")


if __name__ == '__main__':
    main()
