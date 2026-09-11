from pathlib import Path

path = Path("src/core/splitter.tsx")
text = path.read_text(encoding="utf-8")
old = "const specifiedTotal = declared.reduce(\n"
new = "const specifiedTotal = declared.reduce<number>(\n"
if old not in text:
    raise SystemExit("Splitter reduce marker not found")
path.write_text(text.replace(old, new, 1), encoding="utf-8")
