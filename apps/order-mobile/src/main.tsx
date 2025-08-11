import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@order-app/core-theme/index.css'
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
import './theme/variables.css'
import App from './App.tsx'
import { AUTH_PROVIDER } from './config/auth'
import { MockAuthProvider } from './auth/MockAuthProvider'
// import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'

const Root = () => {
  if (AUTH_PROVIDER === 'mock') {
    return (
      <MockAuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MockAuthProvider>
    )
  }
  // Clerk path (enable and configure when using Clerk)
  // const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string
  // return (
  //   <ClerkProvider publishableKey={clerkPublishableKey}>
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   </ClerkProvider>
  // )
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
