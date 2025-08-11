export const AUTH_PROVIDER = (
  (import.meta as any).env?.VITE_AUTH_PROVIDER ?? 'mock'
) as 'mock' | 'clerk'


