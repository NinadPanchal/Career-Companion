import re


SECTION_HEADINGS = {
    "summary": {"summary", "professional summary", "profile", "objective", "career objective"},
    "skills": {"skills", "technical skills", "core competencies", "key skills", "technologies"},
    "experience": {"experience", "work experience", "professional experience", "employment history", "work history"},
    "education": {"education", "academic background", "qualifications"},
    "projects": {"projects", "personal projects", "academic projects", "selected projects"},
}


def detect_resume_sections(text: str) -> dict[str, str]:
    """Group resume text by common section headings.

    The text before the first recognised heading is returned as contact details.
    """
    sections: dict[str, list[str]] = {"contact": []}
    current_section = "contact"

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        heading = _match_heading(line)
        if heading:
            current_section = heading
            sections.setdefault(current_section, [])
            continue

        sections[current_section].append(line)

    return {
        section: "\n".join(lines)
        for section, lines in sections.items()
        if lines
    }


def _match_heading(line: str) -> str | None:
    normalized_line = re.sub(r"[^a-z0-9 ]", "", line.lower())
    normalized_line = re.sub(r"\s+", " ", normalized_line).strip()

    for section, aliases in SECTION_HEADINGS.items():
        if normalized_line in aliases:
            return section
    return None
