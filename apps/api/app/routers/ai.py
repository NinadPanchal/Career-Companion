from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
import json
import re

router = APIRouter(prefix="/ai", tags=["AI Assistance"])


class CoverLetterRequest(BaseModel):
    job_title: str
    company_name: str
    job_description: Optional[str] = ""
    candidate_skills: List[str] = []
    tone: str = "professional"  # professional | enthusiastic | direct | technical
    format_type: str = "cover_letter"  # cover_letter | linkedin_outreach | cold_email


class CoverLetterResponse(BaseModel):
    content: str
    subject_line: Optional[str] = None
    target_keywords: List[str] = []
    estimated_read_time_secs: int = 45


class InterviewPrepRequest(BaseModel):
    job_title: str
    company_name: Optional[str] = ""
    job_description: Optional[str] = ""
    experience_level: str = "mid"  # junior | mid | senior | lead
    category: str = "all"  # all | behavioral | technical | situational


class InterviewQuestion(BaseModel):
    id: str
    category: str
    question: str
    why_they_ask: str
    star_tips: List[str]
    sample_answer: str


class InterviewPrepResponse(BaseModel):
    job_title: str
    questions: List[InterviewQuestion]


class EvaluateAnswerRequest(BaseModel):
    question: str
    category: str
    candidate_answer: str


class EvaluateAnswerResponse(BaseModel):
    score: int  # 0 to 100
    star_breakdown: dict
    strengths: List[str]
    improvements: List[str]
    coaching_summary: str


class BulletOptimizeRequest(BaseModel):
    bullet_point: str
    target_role: Optional[str] = ""
    style: str = "xyz"  # xyz | leadership | metrics | technical


class BulletOptimizeResponse(BaseModel):
    original: str
    optimized_versions: List[dict]
    action_verbs_used: List[str]
    impact_score: int


@router.post("/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(req: CoverLetterRequest):
    skills_str = ", ".join(req.candidate_skills[:8]) if req.candidate_skills else "software engineering, problem solving, full-stack architecture"
    company = req.company_name or "your team"
    title = req.job_title or "Software Engineer"
    
    # Extract keywords from job description if provided
    keywords = []
    if req.job_description:
        words = re.findall(r'\b[A-Za-z]{4,}\b', req.job_description)
        keywords = list(set([w for w in words if w.lower() not in {'with', 'have', 'from', 'this', 'that', 'will', 'your', 'about', 'role'}]))[:6]
    else:
        keywords = req.candidate_skills[:6] if req.candidate_skills else ["Scalability", "System Design", "Agile", "TypeScript", "Python"]

    if req.format_type == "linkedin_outreach":
        subject = f"Connecting regarding {title} role at {company}"
        content = (
            f"Hi [Hiring Manager / Recruiter Name],\n\n"
            f"I hope you're having a great week! I came across the {title} opening at {company} and was immediately drawn to the team's mission.\n\n"
            f"With hands-on experience in {skills_str}, I’ve spearheaded end-to-end features and built resilient systems that drive measurable impact. I'd love to connect and share how my background aligns with {company}'s current goals.\n\n"
            f"Would you be open to a brief 10-minute chat this week?\n\n"
            f"Best regards,\n[Your Name]\n[LinkedIn Profile / Portfolio Link]"
        )
    elif req.format_type == "cold_email":
        subject = f"Application for {title} — [Your Name]"
        content = (
            f"Dear {company} Hiring Team,\n\n"
            f"I am writing to express my strong interest in the {title} role at {company}. Having tracked {company}'s recent product innovations, I admire your approach to engineering excellence and customer-centric design.\n\n"
            f"Throughout my career, I have focused on solving high-leverage challenges using {skills_str}. For example, I recently led initiatives that improved application throughput and reduced latency while collaborating across cross-functional teams.\n\n"
            f"Key strengths I would bring to {company}:\n"
            f"• Proven ability to deliver production-grade solutions across modern stacks\n"
            f"• Deep technical foundation in {skills_str}\n"
            f"• Rigorous focus on code quality, testing, and system maintainability\n\n"
            f"I have attached my resume for your review and welcome the opportunity to discuss how I can contribute to {company}'s continued success.\n\n"
            f"Sincerely,\n[Your Name]\n[Your Email] | [Your Phone Number]"
        )
    else:
        subject = f"{title} Application - [Your Name]"
        tone_intro = (
            f"It is with great enthusiasm that I submit my application for the {title} position at {company}."
            if req.tone == "enthusiastic"
            else f"I am writing to apply for the {title} position at {company}."
        )
        content = (
            f"[Your Name]\n[Your City, State / Remote] | [Your Email] | [Your Phone]\n[Portfolio / GitHub / LinkedIn]\n\n"
            f"Dear Hiring Team at {company},\n\n"
            f"{tone_intro} With deep experience in {skills_str}, I am excited by the prospect of contributing to {company}'s engineering initiatives and engineering culture.\n\n"
            f"In my previous roles, I have consistently delivered robust software products by translating ambiguous product requirements into clean, scalable architecture. My background includes designing responsive user experiences, orchestrating microservices, and implementing automated testing suites that ensure rock-solid stability.\n\n"
            f"What particularly excites me about {company} is the standard of innovation you've set in the industry. I am confident that my technical skills in {skills_str}, combined with my collaborative problem-solving mindset, will allow me to make an immediate, positive impact on your team.\n\n"
            f"Thank you for your time and consideration. I look forward to the opportunity to discuss how my skill set aligns with your team's roadmap.\n\n"
            f"Warm regards,\n\n[Your Name]"
        )

    return CoverLetterResponse(
        content=content,
        subject_line=subject,
        target_keywords=keywords,
        estimated_read_time_secs=len(content.split()) // 3
    )


@router.post("/interview-prep", response_model=InterviewPrepResponse)
async def get_interview_prep(req: InterviewPrepRequest):
    role = req.job_title or "Software Engineer"
    comp = req.company_name or "the hiring company"
    
    questions = [
        InterviewQuestion(
            id="q1",
            category="Behavioral",
            question=f"Tell me about a time you faced a critical roadblock or technical disagreement while working on a complex project.",
            why_they_ask=f"Interviewers want to see your conflict-resolution, ownership, and collaborative communication skills under pressure.",
            star_tips=[
                "Situation: Briefly set the context (the feature, timeline, and stakes).",
                "Task: Explain what your responsibility was and the exact conflict.",
                "Action: Focus on objective data/benchmarks used to resolve the disagreement respectfully.",
                "Result: Highlight the successful delivery and what the team learned."
            ],
            sample_answer="In my last role, we were deciding between synchronous REST calls vs an asynchronous queue for our export pipeline. My teammate preferred synchronous to ship faster, but I was concerned about gateway timeouts under high load. I set up a quick benchmark simulating 500 concurrent exports, which proved timeout failures. We collaboratively implemented the async queue with a lightweight polling UI, which eliminated timeouts and handled 10x traffic on launch day."
        ),
        InterviewQuestion(
            id="q2",
            category="Technical",
            question=f"How would you design a scalable, low-latency architecture for a core feature in {role}?",
            why_they_ask=f"Tests system design breadth, caching strategies, database indexing, and fault tolerance.",
            star_tips=[
                "Clarify functional & non-functional requirements (QPS, read/write ratio, latency SLA).",
                "Start with high-level design (Client -> CDN/LB -> API Gateway -> App Server -> DB).",
                "Deep dive into bottlenecks: Redis caching, DB sharding, background workers.",
                "Address failure modes: circuit breakers, idempotency keys, and graceful degradation."
            ],
            sample_answer="I would start by decomposing the workflow: using an API gateway for authentication and rate limiting, stateless microservices deployed across multiple availability zones, a Redis write-through cache for hot data (sub-10ms response times), and PostgreSQL with proper composite indexes and connection pooling. For asynchronous tasks, I would leverage RabbitMQ/Kafka to decouple long-running operations."
        ),
        InterviewQuestion(
            id="q3",
            category="Situational",
            question=f"Imagine you are 2 days before a scheduled release at {comp} and discover a major edge-case bug. What steps do you take?",
            why_they_ask=f"Evaluates triage capability, risk management, and cross-functional stakeholder communication.",
            star_tips=[
                "Assess severity (user impact, security, data integrity).",
                "Notify Tech Lead and Product Manager with clear trade-offs and options.",
                "Propose mitigation (feature flag rollback, hotfix patch, or scope postponement).",
                "Post-mortem: add regression test cases and CI pipeline checks."
            ],
            sample_answer="First, I would immediately triage the bug to understand blast radius: is it data corrupting or cosmetic? Next, I'd notify the Tech Lead and Product Manager with three concrete paths: 1) Ship on time behind a feature flag with the specific edge case disabled, 2) Hotfix if risk is isolated with unit tests, or 3) Delay by 24h. Once aligned, I'd implement the chosen fix with comprehensive regression tests."
        ),
        InterviewQuestion(
            id="q4",
            category="Behavioral",
            question=f"Why are you interested in joining {comp} as a {role} at this point in your career?",
            why_they_ask=f"Assesses candidate motivation, company research, and long-term alignment.",
            star_tips=[
                "Mention specific products, tech stack, or engineering challenges of the company.",
                "Connect your past achievements with their upcoming trajectory.",
                "Convey authentic passion for growth and team contribution."
            ],
            sample_answer=f"I've been closely following {comp}'s recent engineering work, particularly how you prioritize developer experience and high reliability. My background aligns directly with the architectural challenges in this {role}, and I am looking for a high-ownership environment where I can both contribute significantly and continue learning from a world-class team."
        )
    ]

    return InterviewPrepResponse(
        job_title=role,
        questions=questions
    )


@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_interview_answer(req: EvaluateAnswerRequest):
    ans = req.candidate_answer.strip()
    if not ans:
        raise HTTPException(status_code=400, detail="Please provide an answer to evaluate.")

    words = ans.split()
    word_count = len(words)
    
    has_situation = any(w in ans.lower() for w in ['when', 'during', 'at my', 'project', 'situation', 'faced', 'worked on'])
    has_task = any(w in ans.lower() for w in ['task', 'needed to', 'goal', 'responsibility', 'objective', 'challenge'])
    has_action = any(w in ans.lower() for w in ['i implemented', 'i designed', 'i built', 'i decided', 'i analyzed', 'i led', 'i solved', 'action'])
    has_result = any(w in ans.lower() for w in ['result', 'improved', 'reduced', 'increased', 'achieved', 'delivered', '%', 'successfully'])

    # Score calculation
    base_score = 50
    if word_count > 60:
        base_score += 15
    if has_situation:
        base_score += 10
    if has_task:
        base_score += 5
    if has_action:
        base_score += 10
    if has_result:
        base_score += 10

    score = min(100, max(20, base_score))

    strengths = []
    improvements = []

    if has_action:
        strengths.append("Clear focus on individual ownership and concrete technical actions.")
    else:
        improvements.append("Highlight more specific first-person actions ('I designed', 'I benchmarked').")

    if has_result:
        strengths.append("Effective inclusion of outcomes and positive project impact.")
    else:
        improvements.append("Add measurable outcomes or metrics (e.g. '% reduction in latency', 'shipped on time').")

    if word_count < 40:
        improvements.append("Elaborate on the context and technical trade-offs to demonstrate depth.")
    elif word_count > 180:
        improvements.append("Aim for concise delivery (approx. 90-120 seconds spoken time).")
    else:
        strengths.append("Good conciseness and pacing suitable for a live interview.")

    summary = (
        f"Strong structure demonstrating core problem solving skills. "
        f"To elevate this answer into the top 5%, quantify the final business/engineering impact and briefly mention what you learned."
    )

    return EvaluateAnswerResponse(
        score=score,
        star_breakdown={
            "situation": has_situation,
            "task": has_task,
            "action": has_action,
            "result": has_result
        },
        strengths=strengths if strengths else ["Good baseline communication"],
        improvements=improvements if improvements else ["Refine with exact benchmark metrics"],
        coaching_summary=summary
    )


@router.post("/optimize-bullet", response_model=BulletOptimizeResponse)
async def optimize_bullet_point(req: BulletOptimizeRequest):
    original = req.bullet_point.strip()
    if not original:
        raise HTTPException(status_code=400, detail="Bullet point text is required.")

    # Generate 3 powerful variations based on Google XYZ format: Accomplished [X] as measured by [Y] by doing [Z]
    # Clean leading bullet markers
    cleaned = re.sub(r'^[•\-\*\s]+', '', original)
    
    variations = [
        {
            "framework": "Google XYZ (High Impact)",
            "text": f"Engineered and deployed scalable {cleaned.lower()}, achieving 35% improvement in processing latency and zero production downtime across 50,000+ monthly active requests.",
            "metrics": "35% latency improvement, 50k+ requests",
            "tone": "Impact-Driven"
        },
        {
            "framework": "Technical Architecture",
            "text": f"Architected end-to-end resilient pipelines for {cleaned.lower()} utilizing modern best practices, automated CI/CD checks, and optimized database indexing.",
            "metrics": "System resiliency & test coverage",
            "tone": "Technical Rigor"
        },
        {
            "framework": "Leadership & Ownership",
            "text": f"Spearheaded the technical roadmap for {cleaned.lower()}, aligning cross-functional stakeholders and accelerating release cycles by 2.5x.",
            "metrics": "2.5x release cycle acceleration",
            "tone": "Executive Presence"
        }
    ]

    action_verbs = ["Engineered", "Architected", "Spearheaded", "Optimized", "Deployed"]
    
    return BulletOptimizeResponse(
        original=original,
        optimized_versions=variations,
        action_verbs_used=action_verbs,
        impact_score=94
    )
