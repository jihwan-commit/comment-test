import axios, { type AxiosInstance } from "axios";

interface CreateApiInstanceOptions {
  baseURL: string;
  /** Supabase 게이트웨이용 publishable key — 매 요청 `apikey` 헤더로 붙는다 */
  apiKey?: string;
}

/** axios 인스턴스 팩토리 — geulim 의 createApiInstance 를 단순화(인증·조직 헤더 없음) */
export function createApiInstance({
  baseURL,
  apiKey,
}: CreateApiInstanceOptions): AxiosInstance {
  const instance = axios.create({
    baseURL,
    paramsSerializer: { indexes: null },
  });
  if (apiKey) {
    instance.interceptors.request.use((config) => {
      config.headers.apikey = apiKey;
      return config;
    });
  }
  return instance;
}
