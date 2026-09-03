from app.services.skill_extractor import extract_skills

def calculate_match(
    resume_skills: list[str],
    job_description: str,
    job_title: str | None = None,
    target_role: str | None = None,
) -> dict:
    """Calculate a comprehensive match score between resume skills and a job."""
    job_skills = extract_skills(job_description)
    
    # Normalize for case-insensitive comparison
    resume_set = {s.lower() for s in resume_skills}
    
    matched = [s for s in job_skills if s.lower() in resume_set]
    missing = [s for s in job_skills if s.lower() not in resume_set]
    
    # Skill overlap score (0-100)
    skill_score = round((len(matched) / len(job_skills)) * 100) if job_skills else 0
    
    # Title relevance bonus (0-15 points)
    title_bonus = 0
    if target_role and job_title:
        target_words = set(target_role.lower().split())
        title_words = set(job_title.lower().split())
        common = target_words & title_words
        if common:
            title_bonus = min(15, round((len(common) / len(target_words)) * 15))
    
    # Final weighted score, capped at 100
    final_score = min(100, skill_score + title_bonus)
    
    return {
        "match_score": final_score,
        "skill_score": skill_score,
        "title_bonus": title_bonus,
        "job_skills": job_skills,
        "matched_skills": matched,
        "missing_skills": missing,
    }
