import re
from typing import List, Dict, Any

STRONG_ACTION_VERBS = {
    "accelerated", "accomplished", "achieved", "architected", "automated",
    "benchmarked", "built", "centralized", "compiled", "consolidated",
    "constructed", "created", "decreased", "delivered", "deployed",
    "designed", "developed", "devised", "eliminated", "enabled",
    "engineered", "enhanced", "established", "executed", "expanded",
    "expedited", "formulated", "generated", "implemented", "improved",
    "increased", "initiated", "instituted", "integrated", "launched",
    "led", "maximized", "migrated", "minimized", "modernized",
    "orchestrated", "optimized", "overhauled", "pioneered", "reduced",
    "refactored", "resolved", "restructured", "scaled", "simplified",
    "slashed", "spearheaded", "standardized", "streamlined", "surpassed",
    "transformed", "upgraded", "yielded"
}

METRIC_PATTERNS = [
    r"\b\d+(?:\.\d+)?%\b",                           # 35%, 99.9%
    r"[\$₹€£]\s*\d+(?:,\d+)*(?:\.\d+)?[kmb]?\b",    # $2,400, ₹40M
    r"\b\d+(?:,\d+)*(?:\.\d+)?\s*(?:k|m|b|million|billion|thousand)\b",  # 50k+, 14M
    r"\b\d+(?:\.\d+)?x\b",                           # 2.5x, 10x
    r"\b\d+\s*(?:ms|sec|seconds?|mins?|minutes?|hours?|days?|weeks?|months?)\b",  # 42ms
    r"\b\d+(?:,\d+)*\s*(?:qps|rps|req\/sec|users|customers|requests|transactions)\b", # 14,200 req/sec
    r"\b(?:top\s*\d+%|reduced\s*by\s*\d+|increased\s*by\s*\d+)\b"
]


def score_resume_ats(
    profile_data: Dict[str, Any],
    raw_text: str = ""
) -> Dict[str, Any]:
    """Audit parsed resume content against ATS best practices and the Google XYZ rubric.
    
    Rubric: Accomplished [X] as measured by [Y] by doing [Z].
    Produces a composite score (0-100) and actionable improvement issues.
    """
    issues: List[str] = []
    points = 100

    # 1. Contact info audit (15 pts)
    contact_pts = 0
    if profile_data.get("email"):
        contact_pts += 4
    else:
        issues.append("Missing contact email address.")

    if profile_data.get("phone"):
        contact_pts += 4
    else:
        issues.append("Missing phone number for recruiter outreach.")

    links = profile_data.get("links") or {}
    if links.get("linkedin"):
        contact_pts += 4
    else:
        issues.append("Include a LinkedIn profile URL for recruiter verification.")

    if links.get("github") or links.get("portfolio"):
        contact_pts += 3
    else:
        issues.append("Add a GitHub or portfolio link to showcase technical projects.")

    if contact_pts < 15:
        points -= (15 - contact_pts)

    # 2. Section completeness audit (20 pts)
    section_pts = 0
    skills = profile_data.get("skills") or []
    if len(skills) >= 5:
        section_pts += 6
    elif len(skills) > 0:
        section_pts += 3
        issues.append("Add at least 5-8 relevant core skills to pass ATS keyword thresholds.")
    else:
        issues.append("No technical skills detected. Ensure your resume has a dedicated 'Skills' section.")

    experience = profile_data.get("experience") or []
    if len(experience) >= 1:
        section_pts += 7
    else:
        issues.append("No structured work experience detected. Check job titles and company names.")

    education = profile_data.get("education") or []
    if len(education) >= 1:
        section_pts += 4
    else:
        issues.append("No education credentials detected (Degree, University, Graduation Year).")

    if profile_data.get("summary") or profile_data.get("headline"):
        section_pts += 3

    if section_pts < 20:
        points -= (20 - section_pts)

    # 3. Google XYZ & Bullet Impact Audit (45 pts)
    all_bullets = []
    for exp in experience:
        all_bullets.extend(exp.get("bullets") or [])
    for proj in (profile_data.get("projects") or []):
        all_bullets.extend(proj.get("bullets") or [])

    if all_bullets:
        action_verb_count = 0
        metric_count = 0

        for bullet in all_bullets:
            words = re.findall(r"\w+", bullet.lower())
            first_word = words[0] if words else ""
            if first_word in STRONG_ACTION_VERBS:
                action_verb_count += 1

            if any(re.search(pat, bullet, re.IGNORECASE) for pat in METRIC_PATTERNS):
                metric_count += 1

        total_b = len(all_bullets)
        verb_ratio = action_verb_count / total_b
        metric_ratio = metric_count / total_b

        if verb_ratio < 0.6:
            deduct = int((0.6 - verb_ratio) * 25)
            points -= deduct
            issues.append(
                f"Only {int(verb_ratio * 100)}% of bullets start with strong action verbs (e.g., Engineered, Spearheaded, Architected)."
            )

        if metric_ratio < 0.5:
            deduct = int((0.5 - metric_ratio) * 35)
            points -= deduct
            issues.append(
                f"Google XYZ Rubric: Add quantifiable metrics (%, numbers, throughput, $ saved) to more bullets ({int(metric_ratio * 100)}% currently measured)."
            )
    else:
        points -= 30
        issues.append("No individual accomplishment bullets found in experience or projects.")

    # 4. Length & Readability (20 pts)
    word_count = len(raw_text.split()) if raw_text else 0
    if word_count > 0:
        if word_count < 200:
            points -= 10
            issues.append(f"Resume text is very short ({word_count} words). Aim for 400-800 words for technical depth.")
        elif word_count > 1200:
            points -= 8
            issues.append(f"Resume is lengthy ({word_count} words). Tighten accomplishment bullets to keep it concise.")

    final_score = max(35, min(99, points))

    return {
        "score": final_score,
        "issues": issues,
        "breakdown": {
            "contact_score": contact_pts,
            "section_score": section_pts,
            "bullets_evaluated": len(all_bullets),
            "word_count": word_count
        }
    }

