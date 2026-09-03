import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Clock, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles size={14} /> AI Interview Coach
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Mock Interview Simulator</h1>
          <p className="mt-1 text-zinc-400">
            Practice behavioral and technical questions with live STAR-framework scoring and coaching feedback.
          </p>
        </div>

        {/* Role configuration pill */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Target Role"
            className="w-48 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Target Company"
            className="w-36 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-emerald-500"
          />
          <Button onClick={loadQuestions} className="py-2 text-xs">
            Generate Questions
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Side: Question List Navigation */}
        <div className="space-y-4 lg:col-span-4">
          <Card className="border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-xl">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
              Interview Questions ({questions.length})
            </h2>

            {isLoadingQuestions ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-800/40" />
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
                      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                        isActive
                          ? "border-emerald-500/40 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/5"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isActive ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
                          {q.category}
                        </span>
                        <p className="mt-1 text-xs font-medium line-clamp-2">{q.question}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick STAR Framework Cheat-sheet Card */}
          <Card className="border-zinc-800 bg-zinc-900/40 p-4">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Award size={14} /> The STAR Method Rule
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><strong className="text-white">Situation:</strong> Set the scene & context in 1-2 sentences.</li>
              <li><strong className="text-white">Task:</strong> Define the goal or technical challenge.</li>
              <li><strong className="text-white">Action:</strong> Explain the specific steps <em className="text-emerald-400">you</em> implemented.</li>
              <li><strong className="text-white">Result:</strong> Quantify the outcome (e.g., % faster, $ saved, launched on time).</li>
            </ul>
          </Card>
        </div>

        {/* Right Side: Active Practice Simulator */}
        <div className="space-y-6 lg:col-span-8">
          {activeQuestion ? (
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
              {/* Question Banner */}
              <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                    {activeQuestion.category} Question
                  </span>

                  {/* Timer UI */}
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-300">
                    <Clock size={13} className="text-emerald-400" />
                    <span>{formatTimer(timerSeconds)}</span>
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="ml-1 text-zinc-400 hover:text-white"
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
                      className="text-zinc-500 hover:text-white"
                      title="Reset timer"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white leading-snug">{activeQuestion.question}</h2>
                <p className="mt-2 text-xs text-zinc-400 italic">
                  💡 <strong>Interviewer intent:</strong> {activeQuestion.why_they_ask}
                </p>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>Your Answer Draft (Practice Speaking or Typing)</span>
                  <span className="text-zinc-500">{candidateAnswer.split(/\s+/).filter(Boolean).length} words</span>
                </div>

                <textarea
                  rows={6}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Structure your answer using Situation -> Task -> Action -> Result..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500 leading-relaxed resize-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <BookOpen size={14} />
                    {showSampleAnswer ? "Hide Model Answer" : "View Top-Tier Model Answer"}
                    {showSampleAnswer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <Button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !candidateAnswer.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20"
                  >
                    <Bot size={16} />
                    {isEvaluating ? "Evaluating STAR Structure..." : "Evaluate My Answer"}
                  </Button>
                </div>
              </div>

              {/* Model Answer Drawer */}
              <AnimatePresence>
                {showSampleAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 text-sm text-zinc-300"
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                      <Sparkles size={14} /> Model Answer & Talking Points
                    </div>
                    <p className="italic leading-relaxed text-zinc-200">"{activeQuestion.sample_answer}"</p>

                    <div className="mt-4 border-t border-indigo-500/20 pt-3">
                      <p className="mb-1.5 text-xs font-semibold text-indigo-300">STAR Checklist for this question:</p>
                      <ul className="space-y-1 text-xs text-zinc-400">
                        {activeQuestion.star_tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-indigo-400">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Evaluation Report */}
              <AnimatePresence>
                {evaluation && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl"
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Bot size={18} className="text-emerald-400" /> AI Coach Assessment
                        </h3>
                        <p className="text-xs text-zinc-400">{evaluation.coaching_summary}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-black text-emerald-400">{evaluation.score}</div>
                        <div className="text-[10px] uppercase font-bold text-zinc-500">Readiness Score</div>
                      </div>
                    </div>

                    {/* STAR Pillars */}
                    <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: "Situation", passed: evaluation.star_breakdown.situation },
                        { label: "Task", passed: evaluation.star_breakdown.task },
                        { label: "Action", passed: evaluation.star_breakdown.action },
                        { label: "Result", passed: evaluation.star_breakdown.result },
                      ].map((pillar) => (
                        <div
                          key={pillar.label}
                          className={`rounded-xl border p-2 ${
                            pillar.passed
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border-zinc-800 bg-zinc-900/60 text-zinc-500"
                          }`}
                        >
                          <div className="text-xs font-bold">{pillar.label}</div>
                          <div className="mt-1 flex justify-center">
                            {pillar.passed ? <Check size={14} /> : <span className="text-[10px]">Missed</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
                        <p className="mb-1 text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Key Strengths
                        </p>
                        <ul className="space-y-1 text-xs text-zinc-300">
                          {evaluation.strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-3">
                        <p className="mb-1 text-xs font-bold text-amber-400 flex items-center gap-1">
                          <AlertCircle size={13} /> Next Level Polish
                        </p>
                        <ul className="space-y-1 text-xs text-zinc-300">
                          {evaluation.improvements.map((imp, i) => (
                            <li key={i}>• {imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ) : (
            <Card className="flex h-64 items-center justify-center p-8 text-center text-zinc-500">
              Select or generate a question from the left sidebar to start practicing.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
