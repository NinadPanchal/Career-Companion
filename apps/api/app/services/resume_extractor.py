import re
from typing import Dict, List, Any, Optional
from app.services.skill_extractor import extract_skills
from app.services.ats_scorer import score_resume_ats

SECTION_PATTERNS = {
    "summary": [
        r"^summary\b", r"^professional summary\b", r"^profile\b",
        r"^about me\b", r"^career objective\b", r"^objective\b"
    ],
    "experience": [
        r"^experience\b", r"^work experience\b", r"^professional experience\b",
        r"^employment history\b", r"^work history\b"
    ],
    "skills": [
        r"^technical skills\b", r"^skills\b", r"^core competencies\b",
        r"^technologies\b", r"^skills & tools\b", r"^tools & technologies\b"
    ],
    "education": [
        r"^education\b", r"^academic background\b", r"^qualifications\b",
        r"^academics\b"
    ],
    "projects": [
        r"^projects\b", r"^personal projects\b", r"^key projects\b",
        r"^academic projects\b", r"^selected projects\b"
    ]
}

MONTH_REGEX = r"(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)"
DATE_RANGE_REGEX = rf"(?:{MONTH_REGEX}\s+)?\b(20\d{{2}}|19\d{{2}})\b\s*[-–—to]+\s*(?:(?:{MONTH_REGEX}\s+)?\b(20\d{{2}}|19\d{{2}})\b|Present|Current)"


def extract_contact_info(text: str, top_lines: List[str]) -> Dict[str, Any]:
    """Extract candidate name, contact info, headline, and external links."""
    # 1. Email
    email_match = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", text)
    email = email_match.group(0) if email_match else None

    # 2. Phone (international, US, Indian numbers)
    phone_match = re.search(
        r"(?:(?:\+|00)\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}\b",
        text
    )
    phone = phone_match.group(0).strip() if phone_match else None

    # 3. Links
    linkedin_match = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/([A-Za-z0-9_-]+)/?", text, re.IGNORECASE)
    linkedin = f"https://linkedin.com/in/{linkedin_match.group(1)}" if linkedin_match else None

    github_match = re.search(r"(?:https?://)?(?:www\.)?github\.com/([A-Za-z0-9_-]+)/?", text, re.IGNORECASE)
    github = f"https://github.com/{github_match.group(1)}" if github_match else None

    portfolio_match = re.search(r"(?:https?://)(?:www\.)?([A-Za-z0-9_-]+\.(?:io|dev|me|tech|app|com))(?:\/[^\s]*)?", text, re.IGNORECASE)
    portfolio = portfolio_match.group(0) if portfolio_match and "linkedin" not in portfolio_match.group(0).lower() and "github" not in portfolio_match.group(0).lower() else None

    # 4. Name extraction from top lines
    candidate_name = "Candidate"
    headline = "Software Engineer"
    location = None

    for i, line in enumerate(top_lines[:8]):
        clean_line = line.strip()
        if not clean_line:
            continue
            
        # Ignore lines with email, urls, or phone
        if "@" in clean_line or "http" in clean_line.lower() or "github" in clean_line.lower() or "linkedin" in clean_line.lower():
            continue

        # Look for Location keywords
        loc_match = re.search(r"([A-Za-z\s]+,\s*(?:[A-Za-z\s]+|India|USA|UK|Canada|Germany|Remote))", clean_line)
        if loc_match and not location:
            location = loc_match.group(1).strip()
            continue

        # Candidate name is usually the very first clean title line (2-4 words, title-case or uppercase)
        words = clean_line.split()
        if candidate_name == "Candidate" and 1 < len(words) <= 4:
            if not any(char.isdigit() for char in clean_line) and not any(kw in clean_line.lower() for kw in ["curriculum", "resume", "cv", "page", "phone"]):
                candidate_name = clean_line
                continue

        # Headline line (e.g., "Full Stack Engineer | Distributed Systems")
        if candidate_name != "Candidate" and headline == "Software Engineer" and ("engineer" in clean_line.lower() or "developer" in clean_line.lower() or "|" in clean_line or "architect" in clean_line.lower()):
            headline = clean_line

    return {
        "name": candidate_name,
        "email": email,
        "phone": phone,
        "location": location or "Bengaluru, India",
        "headline": headline,
        "links": {
            "linkedin": linkedin or "",
            "github": github or "",
            "portfolio": portfolio or ""
        }
    }


def split_sections(text: str) -> Dict[str, str]:
    """Segment resume text into standard sections."""
    lines = text.splitlines()
    sections: Dict[str, List[str]] = {"header": []}
    current_section = "header"

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        clean_lower = re.sub(r"[^a-z0-9\s]", "", stripped.lower()).strip()
        matched_section = None

        for sec_name, patterns in SECTION_PATTERNS.items():
            for pat in patterns:
                if re.match(pat, clean_lower):
                    matched_section = sec_name
                    break
            if matched_section:
                break

        if matched_section:
            current_section = matched_section
            sections.setdefault(current_section, [])
        else:
            sections.setdefault(current_section, []).append(stripped)

    return {k: "\n".join(v) for k, v in sections.items() if v}


def parse_experience_section(exp_text: str) -> List[Dict[str, Any]]:
    """Parse experience text into structured job roles with company, title, dates, and bullets."""
    if not exp_text:
        return []

    lines = exp_text.splitlines()
    roles: List[Dict[str, Any]] = []
    current_role: Optional[Dict[str, Any]] = None

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Check for date range in line
        date_match = re.search(DATE_RANGE_REGEX, stripped, re.IGNORECASE)
        
        # Check if line looks like a role title or company (contains pipe, dash, or dates)
        is_bullet = bool(re.match(r"^[•\-\*▪▫–—]\s*", stripped)) or (current_role and len(stripped) > 40 and not date_match)

        if date_match and not is_bullet:
            if current_role:
                roles.append(current_role)
            
            # Extract role details
            date_str = date_match.group(0)
            prefix = stripped.replace(date_str, "").strip(" |-,•–—")
            parts = [p.strip() for p in re.split(r"[|•–—]", prefix) if p.strip()]

            title = parts[0] if parts else "Software Engineer"
            company = parts[1] if len(parts) > 1 else "Tech Company"

            current_role = {
                "title": title,
                "company": company,
                "start": date_match.group(1),
                "end": date_match.group(2) if date_match.group(2) else "Present",
                "bullets": []
            }
        elif is_bullet:
            clean_bullet = re.sub(r"^[•\-\*▪▫–—\d\.]+\s*", "", stripped).strip()
            if clean_bullet:
                if not current_role:
                    current_role = {
                        "title": "Software Engineer",
                        "company": "Engineering Organization",
                        "start": "2022",
                        "end": "Present",
                        "bullets": []
                    }
                current_role["bullets"].append(clean_bullet)
        else:
            # Title / Company line preceding date
            if not current_role:
                parts = [p.strip() for p in re.split(r"[|•–—]", stripped) if p.strip()]
                current_role = {
                    "title": parts[0] if parts else stripped,
                    "company": parts[1] if len(parts) > 1 else "Engineering Organization",
                    "start": "2022",
                    "end": "Present",
                    "bullets": []
                }

    if current_role:
        roles.append(current_role)

    # Fallback default if none structured
    if not roles and exp_text.strip():
        bullets = [re.sub(r"^[•\-\*▪▫–—\d\.]+\s*", "", l).strip() for l in lines if len(l.strip()) > 20]
        roles.append({
            "title": "Software Engineer",
            "company": "Core Organization",
            "start": "2022",
            "end": "Present",
            "bullets": bullets[:5]
        })

    return roles


def parse_education_section(edu_text: str) -> List[Dict[str, Any]]:
    """Parse degree, institution, and graduation year."""
    if not edu_text:
        return []

    lines = edu_text.splitlines()
    entries: List[Dict[str, Any]] = []
    
    current_entry: Dict[str, Any] = {
        "institution": "",
        "degree": "",
        "field": "",
        "graduation_year": ""
    }

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Look for year
        year_match = re.search(r"\b(20\d{2}|19\d{2})\b", stripped)
        if year_match:
            current_entry["graduation_year"] = year_match.group(1)

        # Look for degree
        degree_match = re.search(r"\b(B\.?Tech|B\.?E\.?|B\.?S\.?|Bachelor|M\.?Tech|M\.?S\.?|Master|Ph\.?D|Diploma)\b", stripped, re.IGNORECASE)
        if degree_match:
            current_entry["degree"] = degree_match.group(0)

        # Look for field
        field_match = re.search(r"(?:in|of)\s+([A-Za-z\s]+(?:Engineering|Science|Technology|Analytics|Mathematics))", stripped, re.IGNORECASE)
        if field_match:
            current_entry["field"] = field_match.group(1).strip()

        # Institution detection
        if any(w in stripped.lower() for w in ["university", "institute", "college", "school", "academy", "iit", "nit", "bits"]):
            current_entry["institution"] = re.sub(r"\b(20\d{2}|19\d{2})\b", "", stripped).strip(" ,|-•")

    if not current_entry["institution"]:
        current_entry["institution"] = lines[0] if lines else "University Institute of Technology"
    if not current_entry["degree"]:
        current_entry["degree"] = "Bachelor of Technology (B.Tech)"
    if not current_entry["field"]:
        current_entry["field"] = "Computer Science & Engineering"
    if not current_entry["graduation_year"]:
        current_entry["graduation_year"] = "2024"

    entries.append(current_entry)
    return entries


def parse_projects_section(proj_text: str) -> List[Dict[str, Any]]:
    """Parse projects into name, description, link, and bullets."""
    if not proj_text:
        return []

    lines = proj_text.splitlines()
    projects: List[Dict[str, Any]] = []
    current_proj: Optional[Dict[str, Any]] = None

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        is_bullet = bool(re.match(r"^[•\-\*▪▫–—]\s*", stripped)) or (current_proj and len(stripped) > 40)

        if not is_bullet and len(stripped) < 60:
            if current_proj:
                projects.append(current_proj)
            
            link_match = re.search(r"https?://[^\s]+", stripped)
            name = re.sub(r"https?://[^\s]+", "", stripped).strip(" |-,•–—")
            current_proj = {
                "name": name or "Technical Project",
                "description": "",
                "link": link_match.group(0) if link_match else "",
                "bullets": []
            }
        else:
            clean_b = re.sub(r"^[•\-\*▪▫–—\d\.]+\s*", "", stripped).strip()
            if clean_b:
                if not current_proj:
                    current_proj = {
                        "name": "Featured Project",
                        "description": "",
                        "link": "",
                        "bullets": []
                    }
                current_proj["bullets"].append(clean_b)

    if current_proj:
        projects.append(current_proj)

    return projects


def parse_resume_to_candidate_profile(raw_text: str, original_filename: str = "") -> Dict[str, Any]:
    """Extract complete structured profile from resume text."""
    sections = split_sections(raw_text)
    header_lines = sections.get("header", "").splitlines()

    # 1. Contact Info
    contact = extract_contact_info(raw_text, header_lines)

    # 2. Skills
    skills = extract_skills(raw_text)

    # 3. Experience
    experience = parse_experience_section(sections.get("experience", ""))

    # 4. Education
    education = parse_education_section(sections.get("education", ""))

    # 5. Projects
    projects = parse_projects_section(sections.get("projects", ""))

    # 6. Summary
    summary = sections.get("summary", "").strip()
    if not summary and header_lines:
        # Use first descriptive line under header
        summary = " ".join([l for l in header_lines[1:4] if len(l) > 30])
    if not summary:
        summary = f"Results-driven software engineer with core competencies in {', '.join(skills[:5]) if skills else 'modern software engineering'}."

    profile_dict = {
        "name": contact["name"],
        "email": contact["email"],
        "phone": contact["phone"],
        "location": contact["location"],
        "headline": contact["headline"],
        "summary": summary,
        "links": contact["links"],
        "skills": skills,
        "experience": experience,
        "education": education,
        "projects": projects,
        "resume_filename": original_filename
    }

    # 7. ATS & Google XYZ Scoring
    ats_result = score_resume_ats(profile_dict, raw_text)
    profile_dict["ats_score"] = ats_result["score"]
    profile_dict["ats_issues"] = ats_result["issues"]
    profile_dict["ats"] = ats_result

    return profile_dict

