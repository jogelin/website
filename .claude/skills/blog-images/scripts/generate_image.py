#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "pillow>=10.0.0",
#     "python-dotenv>=1.0.0",
# ]
# ///
"""
Blog Image Generator using Google's Nano Banana Pro (Gemini 3 Pro Image) API.

Generates diagrams and cover images for blog articles with consistent
styling matching the smartsdlc.dev design system.
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

# Load .env from script directory
_script_dir = Path(__file__).parent
load_dotenv(_script_dir / ".env")

# MIME type to extension mapping
MIME_TO_EXT = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
}


def get_api_key(provided_key: str | None) -> str:
    """Get API key from argument or environment variable."""
    if provided_key:
        return provided_key

    env_key = os.environ.get("GEMINI_API_KEY")
    if env_key:
        return env_key

    print("Error: No API key provided.", file=sys.stderr)
    print("Please provide --api-key argument or set GEMINI_API_KEY environment variable.", file=sys.stderr)
    sys.exit(1)


def generate_image(
    prompt: str,
    filename: str,
    api_key: str,
    input_image: str | None = None,
    resolution: str = "2K",
    aspect_ratio: str = "16:9",
    style: str = "diagram",
) -> str:
    """Generate or edit an image using Nano Banana Pro (Gemini 3 Pro Image) API."""

    client = genai.Client(api_key=api_key)

    # Build the enhanced prompt with design system context
    enhanced_prompt = build_enhanced_prompt(prompt, style)

    # Build contents (with or without reference images)
    if input_image:
        image_path = Path(input_image)
        if not image_path.exists():
            print(f"Error: Input image not found: {input_image}", file=sys.stderr)
            sys.exit(1)

        img = Image.open(image_path)
        contents: list = [img, enhanced_prompt]
    else:
        contents = enhanced_prompt

    # Generate image using Nano Banana Pro
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
                image_size=resolution
            )
        )
    )

    # Save the generated image
    output_path = Path(filename)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    image_saved = False
    for part in response.parts:
        if part.text is not None:
            print(f"[Info] {part.text}")
        elif part.inline_data is not None:
            mime_type = part.inline_data.mime_type or "image/png"
            image = part.as_image()

            # Determine output path - use provided filename or generate timestamp
            if filename:
                final_path = output_path
            else:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                ext = MIME_TO_EXT.get(mime_type, ".png")
                final_path = output_path.parent / f"{timestamp}{ext}"

            image.save(str(final_path))
            image_saved = True
            return str(final_path.resolve())

    if not image_saved:
        print("Error: No image was generated in the response.", file=sys.stderr)
        sys.exit(1)

    return str(output_path.resolve())


def build_enhanced_prompt(prompt: str, style: str) -> str:
    """Enhance prompt with design system context for consistent styling."""

    # Design system context for smartsdlc.dev - clean, professional, light theme
    design_context = """
Style guidelines for smartsdlc.dev blog diagrams:
- Light/white background with very subtle geometric line patterns
- Muted, professional color palette: soft grays (#f5f5f5, #e0e0e0), slate blues (#64748b)
- Accent colors used sparingly: soft teal, muted purple, gentle amber
- Clean, corporate, minimalist aesthetic
- Soft drop shadows on elements
- No harsh contrasts or neon/glowing effects
- Typography: clean sans-serif, dark gray text (#334155)
- Overall feel: professional, calm, trustworthy, like a polished presentation slide
"""

    if style == "diagram":
        style_guidance = """
Create a technical diagram with:
- Clean white/light gray background with subtle geometric patterns
- Soft rounded rectangles with gentle shadows
- Muted color accents (not bright or saturated)
- Professional corporate presentation style
- Clear labels in dark gray text
- Subtle connecting lines
"""
    elif style == "cover":
        style_guidance = """
Create a blog cover image with:
- Light gradient background (white to soft gray)
- Abstract subtle wave or geometric patterns
- Muted accent colors
- Professional and calm aesthetic
- No text (text will be added separately)
- Suitable for 16:9 aspect ratio
"""
    elif style == "flowchart":
        style_guidance = """
Create a flowchart diagram with:
- Light/white background with subtle geometric patterns
- Rounded rectangles with soft shadows for process steps
- Muted color borders (soft teal, slate gray, gentle purple)
- Gray arrows showing flow direction
- Clean, corporate presentation style
- Dark gray text labels
"""
    elif style == "architecture":
        style_guidance = """
Create an architecture diagram with:
- Light background with subtle patterns
- Layered visualization with soft shadows
- Muted color-coded components
- Gentle connecting lines in gray
- Professional technical illustration style
- Corporate presentation aesthetic
"""
    else:
        style_guidance = ""

    return f"{design_context}\n\n{style_guidance}\n\nGenerate: {prompt}"


def main():
    parser = argparse.ArgumentParser(
        description="Generate blog images using Nano Banana Pro (Gemini 3 Pro Image) API"
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="Image description or editing instructions",
    )
    parser.add_argument(
        "--filename",
        required=True,
        help="Output filename (e.g., diagram-name.png)",
    )
    parser.add_argument(
        "--input-image",
        help="Path to input image for editing mode",
    )
    parser.add_argument(
        "--resolution",
        choices=["1K", "2K", "4K"],
        default="2K",
        help="Output resolution (default: 2K)",
    )
    parser.add_argument(
        "--aspect-ratio",
        default="16:9",
        help="Aspect ratio for generated images (default: 16:9)",
    )
    parser.add_argument(
        "--style",
        choices=["diagram", "cover", "flowchart", "architecture", "custom"],
        default="diagram",
        help="Image style preset (default: diagram)",
    )
    parser.add_argument(
        "--api-key",
        help="Gemini API key (or set GEMINI_API_KEY env var)",
    )

    args = parser.parse_args()

    api_key = get_api_key(args.api_key)

    output_path = generate_image(
        prompt=args.prompt,
        filename=args.filename,
        api_key=api_key,
        input_image=args.input_image,
        resolution=args.resolution,
        aspect_ratio=args.aspect_ratio,
        style=args.style,
    )

    print(f"Image saved to: {output_path}")


if __name__ == "__main__":
    main()
