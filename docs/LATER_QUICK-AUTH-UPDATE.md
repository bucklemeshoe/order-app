# Order App – Auth Wrapper for `packages/core-lib`

## Purpose
This wrapper abstracts authentication logic so each app in the monorepo can run:
- **With no authentication** (guest mode / vanilla app)
- **With Clerk authentication** (or other providers in the future)

The goal is to avoid hardcoding Clerk or any other auth provider into every app.  
Instead, apps import from the wrapper, and the wrapper decides which auth system to use based on configuration.

---

## How it Works
- **`AUTH_PROVIDER`** is defined per app in `.env.local` (or `.env.example`):
  - `"none"` → No authentication, guest user only.
  - `"clerk"` → Use Clerk authentication.
  - You can extend with `"supabase"`, `"auth0"`, etc. later if needed.
- The wrapper exports:
  - `AuthProvider` → Component wrapping the app with the correct auth context.
  - `useAuth()` → Hook to get `{ user, isSignedIn, signIn, signOut }`.
- Each app imports from `@order-app/core-lib/auth` instead of directly from Clerk or a mock.

---

## File: `packages/core-lib/src/auth/index.tsx`
```ts
import React, { createContext, useContext, useState, useEffect } from "react";

const provider = import.meta.env.VITE_AUTH_PROVIDER || "none";

// -------------------
// Guest (No Auth)
// -------------------
const GuestAuthContext = createContext({
  user: null,
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

const GuestAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GuestAuthContext.Provider
      value={{
        user: null,
        isSignedIn: false,
        signIn: () => console.warn("Guest mode – signIn not available"),
        signOut: () => console.warn("Guest mode – signOut not available"),
      }}
    >
      {children}
    </GuestAuthContext.Provider>
  );
};

// -------------------
// Clerk Auth (Optional)
// -------------------
let ClerkProvider: React.FC<any> | null = null;
let useClerkAuth: (() => any) | null = null;

if (provider === "clerk") {
  // Lazy import so vanilla builds don't bundle Clerk
  ClerkProvider = React.lazy(() =>
    import("@clerk/clerk-react").then((m) => ({ default: m.ClerkProvider }))
  );
  useClerkAuth = () => {
    const { user, isSignedIn, signOut, openSignIn } = require("@clerk/clerk-react");
    return { user, isSignedIn, signIn: openSignIn, signOut };
  };
}

// -------------------
// Public API
// -------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (provider === "clerk" && ClerkProvider) {
    return (
      <React.Suspense fallback={<div>Loading auth...</div>}>
        <ClerkProvider>{children}</ClerkProvider>
      </React.Suspense>
    );
  }
  return <GuestAuthProvider>{children}</GuestAuthProvider>;
};

export const useAuth = () => {
  if (provider === "clerk" && useClerkAuth) {
    return useClerkAuth();
  }
  return useContext(GuestAuthContext);
};


Example Usage in an App

// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@order-app/core-lib/auth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);


// Profile.tsx
import { useAuth } from "@order-app/core-lib/auth";

export default function Profile() {
  const { user, isSignedIn, signIn, signOut } = useAuth();

  if (!isSignedIn) {
    return <button onClick={signIn}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.fullName || "User"}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

Adding Clerk to a Client App Later
When you want to enable Clerk for a specific client app:

Install Clerk in that app only:

cd apps/client-mobile
npm install @clerk/clerk-react


Add to .env.local in that app:

VITE_AUTH_PROVIDER=clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_xxxxxxxxx

No other code changes needed — the wrapper automatically uses Clerk.

Adding to One Pager Workflow
In the App Setup section of the One Pager:

Add: “Auth is abstracted via packages/core-lib/auth. Configure per app in .env.local with VITE_AUTH_PROVIDER=none or clerk.”

Add to New Client Steps: “If client requires auth, install Clerk in their app and set VITE_AUTH_PROVIDER=clerk.”