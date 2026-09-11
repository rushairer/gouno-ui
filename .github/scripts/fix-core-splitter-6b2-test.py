from pathlib import Path

path = Path("tests/core-splitter-6b2.test.tsx")
text = path.read_text(encoding="utf-8")
text = text.replace(
    'import { fireEvent, render, screen } from "@testing-library/react";',
    'import { cleanup, fireEvent, render, screen } from "@testing-library/react";',
    1,
)
text = text.replace(
    'import { describe, expect, it, vi } from "vitest";',
    'import { afterEach, describe, expect, it, vi } from "vitest";',
    1,
)
marker = 'import { layoutDocuments } from "../showcase/demos/core/layout";\n\n'
if marker not in text:
    raise SystemExit("Splitter test import marker not found")
text = text.replace(marker, marker + 'afterEach(cleanup);\n\n', 1)
path.write_text(text, encoding="utf-8")
