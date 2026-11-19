import { apiConfig } from "@/shared/config";

import { createApiInstance } from "./createApiInstance";

/** 업무 API — comment-test Edge Function (수주 + 댓글) */
export const serviceApi = createApiInstance({
  baseURL: apiConfig.baseUrl,
  apiKey: apiConfig.apiKey,
});
