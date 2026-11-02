import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  Clock, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Check, 
} from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";
import { aiService, InterviewQuestionItem, EvaluateAnswerResult } from "../../features/ai/services/ai.service";

export default function InterviewPrep() {
  const [jobTitle, setJobTitle] = useState("Senior Software Engineer");
  const [companyName, setCompanyName] = useState("Google");
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Practice session state
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluateAnswerResult | null>(null);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const data = await aiService.getInterviewPrep(jobTitle, companyName);
      setQuestions(data.questions);
      setActiveQuestionIdx(0);
      setCandidateAnswer("");
      setEvaluation(null);
      setShowSampleAnswer(false);
      setTimerSeconds(120);
      setIsTimerRunning(false);
    } catch (err) {
      console.error("Failed to load interview questions", err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleEvaluate = async () => {
    if (!candidateAnswer.trim() || !activeQuestion) return;
    setIsEvaluating(true);
    try {
      const result = await aiService.evaluateAnswer(
        activeQuestion.question,
        activeQuestion.category,
        candidateAnswer
      );
      setEvaluation(result);
    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const activeQuestion = questions[activeQuestionIdx];

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="flex flex-col gap-6 font-sans select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--divider)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold text-[var(--text)] tracking-tight">
              STAR Simulator
            </h1>
            <Badge variant="emerald" size="sm">
              Interview prep
            </Badge>
          </div>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1 leading-relaxed">
            Timed behavioral and technical question practice with structured rubric scoring.
          </p>
        </div>

        {/* Target role & company configuration */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Target role"
            className="w-36 sm:w-44 h-9 px-3.5 rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-xs)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company"
            className="w-28 sm:w-36 h-9 px-3.5 rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-xs)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <Button
            size="sm"
            variant="primary"
            onClick={loadQuestions}
            disabled={isLoadingQuestions}
            leftIcon={<Sparkles size={13} />}
          >
            Generate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Side: Question List Navigation (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--divider)]">
              <h2 className="text-[var(--text-xs)] font-semibold text-[var(--text)]">
                Practice questions ({questions.length})
              </h2>
            </div>

            {isLoadingQuestions ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-[var(--radius-md)] bg-[var(--glass-bg)]" />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isActive = idx === activeQuestionIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setActiveQuestionIdx(idx);
                        setCandidateAnswer("");
                        setEvaluation(null);
                        setShowSampleAnswer(false);
                        setTimerSeconds(120);
                        setIsTimerRunning(false);
                      }}
                      className={`flex w-full items-start gap-2.5 rounded-[var(--radius-md)] border p-2.5 text-left transition-all cursor-pointer ${
                        isActive
                          ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--text)] shadow-sm"
                          : "border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-muted)] hover:border-[var(--glass-highlight)] hover:text-[var(--text)]"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[10px] font-mono font-bold ${
                        isActive ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--glass-bg-strong)] text-[var(--text-muted)]"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[var(--accent)] font-medium block">
                          {q.category}
                        </span>
                        <p className="mt-0.5 text-[var(--text-xs)] font-medium line-clamp-2 text-[var(--text)]">
                          {q.question}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* STAR Framework Rule Card */}
          <Card className="space-y-2.5">
            <h3 className="text-[var(--text-xs)] font-semibold text-[var(--accent)] flex items-center gap-1.5">
              <Award size={14} /> The STAR method
            </h3>
            <ul className="space-y-1.5 text-[var(--text-xs)] text-[var(--text-muted)]">
              <li><strong className="text-[var(--text)] font-medium">Situation:</strong> Set the context in 1–2 sentences.</li>
              <li><strong className="text-[var(--text)] font-medium">Task:</strong> Define the engineering goal or roadblock.</li>
              <li><strong className="text-[var(--text)] font-medium">Action:</strong> Explain the specific solution you built.</li>
              <li><strong className="text-[var(--text)] font-medium">Result:</strong> Share the measurable impact and metrics.</li>
            </ul>
          </Card>
        </div>

        {/* Right Side: Active Practice Simulator (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeQuestion ? (
            <Card className="space-y-4">
              {/* Question Banner */}
              <div className="rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" size="sm">
                    {activeQuestion.category} question
                  </Badge>

                  {/* Timer UI */}
                  <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[var(--surface-solid)] px-2.5 py-1 text-[var(--text-xs)] font-mono text-[var(--text)]">
                    <Clock size={12} className="text-[var(--accent)]" />
                    <span className="tabular-nums font-semibold">{formatTimer(timerSeconds)}</span>
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="ml-1 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                      title={isTimerRunning ? "Pause timer" : "Start timer"}
                      aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
                    >
                      {isTimerRunning ? <Pause size={11} /> : <Play size={11} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSeconds(120);
                      }}
                      className="text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
                      title="Reset timer"
                      aria-label="Reset timer"
                    >
                      <RotateCcw size={11} />
                    </button>
                  </div>
                </div>

                <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)] leading-snug">
                  {activeQuestion.question}
                </h2>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                  💡 <strong className="text-[var(--text)] font-medium">Interviewer intent:</strong> {activeQuestion.why_they_ask}
                </p>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[var(--text-xs)] font-medium text-[var(--text-muted)]">
                  <span>Your Structured Answer Draft</span>
                  <span className="text-[var(--text-faint)] font-mono text-[11px] tabular-nums">
                    {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Draft your STAR response... (Situation: At my last team..., Task: We needed to scale..., Action: I migrated the Kafka consumer..., Result: Reduced p99 by 40%.)"
                  className="w-full rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 text-[var(--text-sm)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] resize-none transition-colors"
                />
              </div>

              {/* Evaluation Action */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="text-[var(--text-xs)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{showSampleAnswer ? "Hide Sample STAR Answer" : "View Ideal STAR Model"}</span>
                  {showSampleAnswer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !candidateAnswer.trim()}
                  leftIcon={<Bot size={13} />}
                >
                  {isEvaluating ? "Scoring Response..." : "Evaluate Answer (AI)"}
                </Button>
              </div>

              {/* Sample Answer Accordion */}
              {showSampleAnswer && (
                <div className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--accent)_4%,transparent)] p-3.5 text-[var(--text-xs)] text-[var(--text)] space-y-1.5">
                  <span className="font-mono text-[var(--accent)] font-semibold text-[11px] uppercase tracking-wider block">
                    Model Exemplary STAR Answer:
                  </span>
                  <p className="leading-relaxed text-[var(--text-muted)]">{activeQuestion.sample_answer}</p>
                </div>
              )}

              {/* Evaluation Output Section */}
              {evaluation && (
                <div className="rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--divider)]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-[var(--success)]" />
                      <h3 className="text-[var(--text-xs)] font-semibold text-[var(--text)]">
                        Automated Rubric Evaluation
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">Score:</span>
                      <span className="text-[var(--text-xs)] font-bold font-mono text-[var(--success)] tabular-nums">
                        {evaluation.score}/100
                      </span>
                    </div>
                  </div>

                  {/* STAR Checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Situation", pass: evaluation.star_breakdown.situation },
                      { label: "Task", pass: evaluation.star_breakdown.task },
                      { label: "Action", pass: evaluation.star_breakdown.action },
                      { label: "Result", pass: evaluation.star_breakdown.result },
                    ].map((step) => (
                      <div
                        key={step.label}
                        className={`p-2 rounded-[var(--radius-sm)] border flex items-center justify-between text-[11px] font-mono ${
                          step.pass
                            ? "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] border-[color-mix(in_srgb,var(--success)_24%,transparent)] text-[var(--success)]"
                            : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-faint)]"
                        }`}
                      >
                        <span>{step.label}</span>
                        {step.pass ? <Check size={12} /> : <span className="text-[10px]">Missing</span>}
                      </div>
                    ))}
                  </div>

                  {/* Coaching Summary */}
                  <p className="text-[var(--text-xs)] text-[var(--text)] leading-relaxed bg-[var(--surface-solid)] p-3 rounded-[var(--radius-sm)] border border-[var(--divider)]">
                    {evaluation.coaching_summary}
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="py-20 text-center text-[var(--text-muted)]">
              <Bot size={32} className="mx-auto mb-2 opacity-30 text-[var(--text-faint)]" />
              <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                No questions loaded. Enter a target role and click "Generate".
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
