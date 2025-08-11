import React, { createContext, useContext, useMemo, type PropsWithChildren } from 'react'

type MockUser = { id: string; name: string }
type MockAuthContext = {
  user: MockUser | null
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<MockAuthContext | undefined>(undefined)

export function MockAuthProvider({ children }: PropsWithChildren) {
  const value = useMemo<MockAuthContext>(
    () => ({ user: { id: 'guest', name: 'Guest' }, signIn: () => {}, signOut: () => {} }),
    [],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useMockAuth(): MockAuthContext {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useMockAuth must be used within MockAuthProvider')
  return ctx
}


