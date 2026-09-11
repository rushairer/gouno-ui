from pathlib import Path

path = Path("tests/core-entry-controls.test.tsx")
text = path.read_text(encoding="utf-8")
old = 'expect(screen.getByRole("radio", { name: "4" }).getAttribute("aria-checked")).toBe("true");'
new = 'expect((screen.getByRole("radio", { name: "4" }) as HTMLInputElement).checked).toBe(true);'
if old not in text:
    raise SystemExit("Rate smoke assertion marker not found")
path.write_text(text.replace(old, new, 1), encoding="utf-8")
