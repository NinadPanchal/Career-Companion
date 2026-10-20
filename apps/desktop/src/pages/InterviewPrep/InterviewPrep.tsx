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
    <div className="space-y-6 animate-fade-in font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>STAR Interview Simulator</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Interactive Drill
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Timed behavioral & architecture drills with automated rubric scoring and coaching.
          </p>
        </div>

        {/* Target role & company configuration */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Target Role"
            className="w-40 sm:w-44 rounded-xl border border-white/[0.08] bg-[#07080a] px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
          />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Target Company"
            className="w-32 rounded-xl border border-white/[0.08] bg-[#07080a] px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
          />
          <Button
            size="sm"
            variant="primary"
            onClick={loadQuestions}
            disabled={isLoadingQuestions}
            className="gap-1.5"
          >
            <Sparkles size={13} />
            <span>Generate</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Side: Question List Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Questions ({questions.length})
            </h2>

            {isLoadingQuestions ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-white/[0.03]" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
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
                      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                        isActive
                          ? "border-emerald-500/30 bg-emerald-500/10 text-white shadow-sm"
                          : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                        isActive ? "bg-emerald-500 text-zinc-950" : "bg-white/[0.06] text-zinc-400"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-emerald-400">
                          {q.category}
                        </span>
                        <p className="mt-0.5 text-xs font-medium line-clamp-2 text-zinc-200">{q.question}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* STAR Framework Rule Card */}
          <Card className="p-4 space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-semibold">
              <Award size={14} /> The STAR Structure
            </h3>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li><strong className="text-zinc-200 font-medium">S:</strong> Situation (context in 1-2 lines)</li>
              <li><strong className="text-zinc-200 font-medium">T:</strong> Task (the technical goal or blocker)</li>
              <li><strong className="text-zinc-200 font-medium">A:</strong> Action (<em className="text-emerald-400 not-italic">you</em> engineered)</li>
              <li><strong className="text-zinc-200 font-medium">R:</strong> Result (measurable metric outcome)</li>
            </ul>
          </Card>
        </div>

        {/* Right Side: Active Practice Simulator (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeQuestion ? (
            <Card ambient className="p-6 space-y-5">
              {/* Question Banner */}
              <div className="rounded-xl border border-white/[0.08] bg-[#07080a] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" size="sm">
                    {activeQuestion.category} Question
                  </Badge>

                  {/* Timer UI */}
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-mono text-zinc-300">
                    <Clock size={13} className="text-emerald-400" />
                    <span>{formatTimer(timerSeconds)}</span>
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="ml-1 text-zinc-400 hover:text-white cursor-pointer"
                      title={isTimerRunning ? "Pause" : "Start"}
                    >
                      {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSeconds(120);
                      }}
                      className="text-zinc-500 hover:text-white cursor-pointer"
                      title="Reset timer"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white leading-snug">{activeQuestion.question}</h2>
                <p className="text-xs text-zinc-400 italic">
                  💡 <strong>Interviewer intent:</strong> {activeQuestion.why_they_ask}
                </p>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>Your Structured Answer Draft</span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Draft your STAR response... (Situation: At my last team..., Task: We needed to scale..., Action: I migrated the Kafka consumer..., Result: Reduced p99 by 40%.)"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 resize-none transition-colors"
                />
              </div>

              {/* Evaluation Action */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{showSampleAnswer ? "Hide Sample STAR Answer" : "View Ideal STAR Model"}</span>
                  {showSampleAnswer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !candidateAnswer.trim()}
                  className="gap-1.5"
                >
                  <Bot size={14} />
                  <span>{isEvaluating ? "Scoring Response..." : "Evaluate Answer (AI)"}</span>
                </Button>
              </div>

              {/* Sample Answer Accordion */}
              {showSampleAnswer && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 text-xs text-zinc-300 space-y-2">
                  <span className="font-mono text-emerald-400 font-semibold text-[11px] uppercase tracking-wider block">
                    Model Exemplary STAR Answer:
                  </span>
                  <p className="leading-relaxed">{activeQuestion.sample_answer}</p>
                </div>
              )}

              {/* Evaluation Output Section */}
              {evaluation && (
                <div className="rounded-xl border border-white/[0.08] bg-[#07080a] p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white">Automated Rubric Evaluation</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 font-mono">Score:</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">{evaluation.score}/100</span>
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
                        className={`p-2 rounded-lg border flex items-center justify-between text-xs font-mono ${
                          step.pass
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-white/[0.02] border-white/[0.06] text-zinc-500"
                        }`}
                      >
                        <span>{step.label}</span>
                        {step.pass ? <Check size={13} /> : <span className="text-[10px]">Missing</span>}
                      </div>
                    ))}
                  </div>

                  {/* Coaching Summary */}
                  <p className="text-xs text-zinc-300 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                    {evaluation.coaching_summary}
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <div className="py-24 text-center text-zinc-500">
              <Bot size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">No questions loaded. Enter a target role and click "Generate".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
