import { create } from "zustand";

export type ResumeAnalysisResult = {
  message: string;
  word_count: number;
  text_preview: string;
  sections: Record<string, string>;
  skills: string[];
};

type ResumeState = {
  file: File | null;
  analysis: ResumeAnalysisResult | null;
  setFile: (file: File) => void;
  setAnalysis: (analysis: ResumeAnalysisResult) => void;
  clearResume: () => void;
};

export const useResumeStore = create<ResumeState>((set) => ({
  file: null,
  analysis: null,
  setFile: (file) => set({ file, analysis: null }),
  setAnalysis: (analysis) => set({ analysis }),
  clearResume: () => set({ file: null, analysis: null }),
}));
