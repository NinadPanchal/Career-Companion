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
    <div className="space-y-5 animate-fade-in font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#f4f4f5] tracking-tight">STAR Simulator</h1>
            <Badge variant="emerald" size="sm">Interview prep</Badge>
          </div>
          <p className="text-xs text-[#71717a] mt-0.5">
            Timed behavioral and technical question practice with structured rubric scoring.
          </p>
        </div>

        {/* Target role & company configuration */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Target role"
            className="w-36 sm:w-44 h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
          />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company"
            className="w-28 sm:w-36 h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
          />
          <Button
            size="sm"
            variant="primary"
            onClick={loadQuestions}
            disabled={isLoadingQuestions}
            className="gap-1.5"
          >
            <Sparkles size={12} />
            <span>Generate</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 items-start">
        {/* Left Side: Question List Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <Card className="p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
              <h2 className="text-xs font-semibold text-[#f4f4f5]">
                Practice questions ({questions.length})
              </h2>
            </div>

            {isLoadingQuestions ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-[8px] bg-white/[0.03]" />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
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
                      className={`flex w-full items-start gap-2.5 rounded-[8px] border p-2.5 text-left transition-colors cursor-pointer ${
                        isActive
                          ? "border-[#10b981]/30 bg-[#10b981]/10 text-white"
                          : "border-white/[0.06] bg-[#09090b] text-[#a1a1aa] hover:border-white/[0.12] hover:text-[#f4f4f5]"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] text-[10px] font-mono font-bold ${
                        isActive ? "bg-[#10b981] text-[#09090b]" : "bg-white/[0.06] text-[#71717a]"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[#10b981] font-medium block">
                          {q.category}
                        </span>
                        <p className="mt-0.5 text-xs font-medium line-clamp-2 text-[#d4d4d8]">{q.question}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* STAR Framework Rule Card */}
          <Card className="p-4 space-y-2.5 bg-[#18181b]">
            <h3 className="text-xs font-semibold text-[#10b981] flex items-center gap-1.5">
              <Award size={13} /> The STAR method
            </h3>
            <ul className="space-y-1 text-xs text-[#a1a1aa]">
              <li><strong className="text-[#f4f4f5] font-medium">Situation:</strong> Set the context in 1–2 sentences.</li>
              <li><strong className="text-[#f4f4f5] font-medium">Task:</strong> Define the engineering goal or roadblock.</li>
              <li><strong className="text-[#f4f4f5] font-medium">Action:</strong> Explain the specific solution you built.</li>
              <li><strong className="text-[#f4f4f5] font-medium">Result:</strong> Share the measurable impact and metrics.</li>
            </ul>
          </Card>
        </div>

        {/* Right Side: Active Practice Simulator (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeQuestion ? (
            <Card className="p-5 space-y-4">
              {/* Question Banner */}
              <div className="rounded-[8px] border border-white/[0.08] bg-[#18181b] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" size="sm">
                    {activeQuestion.category} question
                  </Badge>

                  {/* Timer UI */}
                  <div className="flex items-center gap-2 rounded-[6px] border border-white/[0.08] bg-[#09090b] px-2.5 py-1 text-xs font-mono text-[#d4d4d8]">
                    <Clock size={12} className="text-[#10b981]" />
                    <span>{formatTimer(timerSeconds)}</span>
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="ml-1 text-[#71717a] hover:text-white cursor-pointer"
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
                      className="text-[#52525b] hover:text-white cursor-pointer"
                      title="Reset timer"
                      aria-label="Reset timer"
                    >
                      <RotateCcw size={11} />
                    </button>
                  </div>
                </div>

                <h2 className="text-sm font-semibold text-[#f4f4f5] leading-snug">{activeQuestion.question}</h2>
                <p className="text-xs text-[#a1a1aa]">
                  💡 <strong className="text-[#f4f4f5] font-medium">Interviewer intent:</strong> {activeQuestion.why_they_ask}
                </p>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-[#a1a1aa]">
                  <span>Your Structured Answer Draft</span>
                  <span className="text-[#71717a] font-mono text-[11px]">
                    {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Draft your STAR response... (Situation: At my last team..., Task: We needed to scale..., Action: I migrated the Kafka consumer..., Result: Reduced p99 by 40%.)"
                  className="w-full rounded-[8px] border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] resize-none transition-colors"
                />
              </div>

              {/* Evaluation Action */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="text-xs text-[#71717a] hover:text-[#10b981] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{showSampleAnswer ? "Hide Sample STAR Answer" : "View Ideal STAR Model"}</span>
                  {showSampleAnswer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !candidateAnswer.trim()}
                  className="gap-1.5"
                >
                  <Bot size={13} />
                  <span>{isEvaluating ? "Scoring Response..." : "Evaluate Answer (AI)"}</span>
                </Button>
              </div>

              {/* Sample Answer Accordion */}
              {showSampleAnswer && (
                <div className="rounded-[8px] border border-[#10b981]/20 bg-[#10b981]/[0.03] p-3.5 text-xs text-[#d4d4d8] space-y-1.5">
                  <span className="font-mono text-[#10b981] font-medium text-[11px] uppercase tracking-wider block">
                    Model Exemplary STAR Answer:
                  </span>
                  <p className="leading-relaxed">{activeQuestion.sample_answer}</p>
                </div>
              )}

              {/* Evaluation Output Section */}
              {evaluation && (
                <div className="rounded-[8px] border border-white/[0.08] bg-[#18181b] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-[#10b981]" />
                      <h3 className="text-xs font-semibold text-[#f4f4f5]">Automated Rubric Evaluation</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#71717a] font-mono">Score:</span>
                      <span className="text-xs font-bold font-mono text-[#10b981]">{evaluation.score}/100</span>
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
                        className={`p-2 rounded-[6px] border flex items-center justify-between text-[11px] font-mono ${
                          step.pass
                            ? "bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]"
                            : "bg-white/[0.02] border-white/[0.06] text-[#71717a]"
                        }`}
                      >
                        <span>{step.label}</span>
                        {step.pass ? <Check size={12} /> : <span className="text-[10px]">Missing</span>}
                      </div>
                    ))}
                  </div>

                  {/* Coaching Summary */}
                  <p className="text-xs text-[#a1a1aa] leading-relaxed bg-[#09090b] p-2.5 rounded-[6px] border border-white/[0.06]">
                    {evaluation.coaching_summary}
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <div className="py-20 text-center text-[#71717a]">
              <Bot size={32} className="mx-auto mb-2 opacity-30 text-[#71717a]" />
              <p className="text-xs text-[#a1a1aa]">No questions loaded. Enter a target role and click "Generate".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
