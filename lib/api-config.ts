export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"

export function getApiUrl(endpoint: string): string {
  if (USE_MOCK_API) {
    return `/api/mock${endpoint}`
  }
  return `/api${endpoint}`
}
