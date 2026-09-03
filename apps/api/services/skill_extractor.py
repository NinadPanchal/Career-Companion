import re


SKILL_PATTERNS = {
    "Python": r"\bpython\b",
    "JavaScript": r"\bjavascript\b|\bjs\b",
    "TypeScript": r"\btypescript\b|\bts\b",
    "Java": r"\bjava\b",
    "C++": r"c\+\+",
    "C#": r"c#|c sharp",
    "SQL": r"\bsql\b",
    "React": r"\breact(?:\.js)?\b",
    "Node.js": r"\bnode(?:\.js)?\b",
    "FastAPI": r"\bfastapi\b",
    "Django": r"\bdjango\b",
    "Flask": r"\bflask\b",
    "HTML": r"\bhtml(?:5)?\b",
    "CSS": r"\bcss(?:3)?\b",
    "Tailwind CSS": r"\btailwind(?:\s+css)?\b",
    "Git": r"\bgit\b",
    "Docker": r"\bdocker\b",
    "AWS": r"\baws\b|amazon web services",
    "GitHub": r"\bgithub\b",
    "PostgreSQL": r"\bpostgres(?:ql)?\b",
    "MongoDB": r"\bmongodb\b|\bmongo\b",
    "Machine Learning": r"\bmachine learning\b",
    "Deep Learning": r"\bdeep learning\b",
    "PyTorch": r"\bpytorch\b",
    "TensorFlow": r"\btensorflow\b",
    "Pandas": r"\bpandas\b",
    "NumPy": r"\bnumpy\b",
    "scikit-learn": r"\bscikit[ -]learn\b|\bsklearn\b",
    "Figma": r"\bfigma\b",
}


def extract_skills(text: str) -> list[str]:
    """Return recognised skills using one canonical name for each variation."""
    normalized_text = text.lower()

    return [
        skill
        for skill, pattern in SKILL_PATTERNS.items()
        if re.search(pattern, normalized_text)
    ]
