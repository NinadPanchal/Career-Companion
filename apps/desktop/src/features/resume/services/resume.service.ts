import { api } from "../../../lib/api";

export const resumeService = {
  async uploadResume(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post("/resume/upload", formData);

    return response.data;
  },
};