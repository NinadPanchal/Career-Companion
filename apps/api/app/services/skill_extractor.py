import re
from typing import List, Dict

# Comprehensive canonical skills taxonomy with regex patterns and aliases
SKILL_TAXONOMY: Dict[str, str] = {
    # Languages
    "Python": r"\bpython(?:3)?\b|\bpy\b",
    "JavaScript": r"\bjavascript\b|\bjs\b|\bes6\b|\becmascript\b",
    "TypeScript": r"\btypescript\b|\bts\b",
    "Go": r"\bgolang\b|\bgo language\b|\bgo\b(?=\s*(?:developer|engineer|backend|microservices|routine|concurrency))",
    "Rust": r"\brust\b(?=\s*(?:developer|engineer|programming|lang|cargo))|\brustlang\b",
    "Java": r"\bjava\b(?!\s*script)",
    "C++": r"\bc\+\+\b|\bcpp\b",
    "C#": r"\bc#\b|\bc sharp\b|\bcsharp\b",
    "C": r"\bc language\b|\bansi c\b",
    "Ruby": r"\bruby\b(?!\s*on\s*rails)",
    "PHP": r"\bphp\b",
    "Swift": r"\bswift\b(?!\s*code)",
    "Kotlin": r"\bkotlin\b",
    "Scala": r"\bscala\b",
    "R": r"\br language\b|\br programming\b",
    "Dart": r"\bdart\b",
    "SQL": r"\bsql\b|\bstructured query language\b",
    "Bash": r"\bbash\b|\bshell scripting\b|\bzsh\b",

    # Frontend
    "React": r"\breact(?:\.js)?\b",
    "Next.js": r"\bnext(?:\.js)?\b|\bnextjs\b",
    "Vue.js": r"\bvue(?:\.js)?\b|\bvuejs\b",
    "Angular": r"\bangular(?:\.js)?\b",
    "Svelte": r"\bsvelte(?:\.js)?\b|\bsveltekit\b",
    "HTML5": r"\bhtml(?:5)?\b",
    "CSS3": r"\bcss(?:3)?\b",
    "Tailwind CSS": r"\btailwind(?:\s*css)?\b",
    "Sass": r"\bsass\b|\bscss\b",
    "Redux": r"\bredux\b|\bredux toolkit\b|\brtk\b",
    "Zustand": r"\bzustand\b",
    "GraphQL": r"\bgraphql\b",
    "REST APIs": r"\brest(?:ful)?(?:\s*apis?|\s*web\s*services)?\b|\brest\b",
    "WebSockets": r"\bwebsockets?\b|\bws\b(?=\s*api)",
    "Vite": r"\bvite(?:\.js)?\b",
    "Webpack": r"\bwebpack\b",

    # Backend
    "Node.js": r"\bnode(?:\.js)?\b|\bnodejs\b",
    "Express.js": r"\bexpress(?:\.js)?\b",
    "FastAPI": r"\bfastapi\b",
    "Django": r"\bdjango\b",
    "Flask": r"\bflask\b",
    "NestJS": r"\bnest(?:\.js)?\b|\bnestjs\b",
    "Spring Boot": r"\bspring\s*boot\b|\bspring\s*framework\b",
    "ASP.NET": r"\basp\.net\b|\b\.net\s*core\b|\bdotnet\b",
    "Ruby on Rails": r"\brails\b|\bruby\s*on\s*rails\b",
    "gRPC": r"\bgrpc\b",
    "Microservices": r"\bmicroservices?\b|\bmicroservice\s*architecture\b",

    # Databases & Caching
    "PostgreSQL": r"\bpostgres(?:ql)?\b|\bpstgres\b",
    "MySQL": r"\bmysql\b",
    "SQLite": r"\bsqlite(?:3)?\b",
    "MongoDB": r"\bmongodb\b|\bmongo\b",
    "Redis": r"\bredis\b",
    "Elasticsearch": r"\belasticsearch\b|\belastic\s*stack\b|\belk\b",
    "DynamoDB": r"\bdynamodb\b",
    "Cassandra": r"\bcassandra\b",
    "Supabase": r"\bsupabase\b",
    "Neon": r"\bneon(?:\s*postgres|\s*database)?\b",
    "Prisma": r"\bprisma(?:\s*orm)?\b",
    "SQLAlchemy": r"\bsqlalchemy\b",

    # Cloud & DevOps
    "AWS": r"\baws\b|\bamazon\s*web\s*services\b|\bec2\b|\bs3\b|\blambda\b|\brds\b",
    "Google Cloud": r"\bgcp\b|\bgoogle\s*cloud(?:\s*platform)?\b",
    "Azure": r"\bazure\b|\bmicrosoft\s*azure\b",
    "Docker": r"\bdocker\b|\bcontainers?\b",
    "Kubernetes": r"\bkubernetes\b|\bk8s\b",
    "Terraform": r"\bterraform\b|\biac\b",
    "CI/CD": r"\bci/cd\b|\bcontinuous\s*integration\b|\bcontinuous\s*deployment\b",
    "GitHub Actions": r"\bgithub\s*actions\b",
    "Linux": r"\blinux\b|\bubuntu\b|\bdebian\b|\bcentos\b",
    "Nginx": r"\bnginx\b",
    "Serverless": r"\bserverless\b",

    # Messaging & Queues
    "Apache Kafka": r"\bkafka\b|\bapache\s*kafka\b",
    "RabbitMQ": r"\brabbitmq\b",
    "Celery": r"\bcelery\b",

    # AI, ML & Data
    "Machine Learning": r"\bmachine\s*learning\b|\bml\b(?=\s*(?:engineer|pipeline|model|algorithms?))",
    "Deep Learning": r"\bdeep\s*learning\b|\bdl\b(?=\s*(?:model|neural))",
    "PyTorch": r"\bpytorch\b",
    "TensorFlow": r"\btensorflow\b|\btf\b(?=\s*model)",
    "Large Language Models": r"\bllms?\b|\blarge\s*language\s*models?\b",
    "LangChain": r"\blangchain\b",
    "LlamaIndex": r"\bllamaindex\b",
    "Pandas": r"\bpandas\b",
    "NumPy": r"\bnumpy\b",
    "scikit-learn": r"\bscikit[ -]learn\b|\bsklearn\b",
    "OpenCV": r"\bopencv\b",
    "MLOps": r"\bmlops\b",
    "Data Engineering": r"\bdata\s*engineering\b|\betl\b|\bdata\s*pipeline\b",
    "Apache Spark": r"\bspark\b|\bapache\s*spark\b|\bpyspark\b",
    "Vector Databases": r"\bvector\s*db\b|\bvector\s*database\b|\bpinecone\b|\bweaviate\b|\bchroma(?:db)?\b|\bfaiss\b",

    # Architecture, Testing & Design
    "System Design": r"\bsystem\s*design\b|\bsoftware\s*architecture\b|\bdistributed\s*systems\b",
    "Git": r"\bgit\b|\bversion\s*control\b",
    "GitHub": r"\bgithub\b",
    "GitLab": r"\bgitlab\b",
    "Unit Testing": r"\bunit\s*testing\b|\btdd\b|\bpytest\b|\bjest\b|\bmock(?:ing)?\b",
    "Cypress": r"\bcypress\b",
    "Playwright": r"\bplaywright\b",
    "Agile": r"\bagile\b|\bscrum\b|\bkanban\b",
    "Jira": r"\bjira\b",
    "Figma": r"\bfigma\b",
    "Tauri": r"\btauri\b",
}


def extract_skills(text: str) -> List[str]:
    """Return recognized skills using one canonical name for each matched skill."""
    if not text:
        return []
        
    normalized_text = text.lower()
    matched_skills = []

    for skill, pattern in SKILL_TAXONOMY.items():
        if re.search(pattern, normalized_text, re.IGNORECASE):
            matched_skills.append(skill)

    return matched_skills
