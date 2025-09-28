import { Route, Routes, useLocation } from 'react-router-dom'
import { IonApp, IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon, IonHeader, IonToolbar, IonButtons, IonMenuButton, setupIonicReact } from '@ionic/react'
// No state needed for vanilla app
// No supabase needed in App component for vanilla app
import MenuPage from './pages/Menu'
import CartPage from './pages/Cart'
import CheckoutPage from './pages/Checkout'
import { OrdersPage } from './pages/Orders'
import { OrderDetailsPage } from './pages/OrderDetails'
import ProfilePage from './pages/Profile'
import OnlineOrdersUnavailable from './pages/OnlineOrdersUnavailable'
import AppMaintenance from './pages/AppMaintenance'
import UnavailableModal from './components/UnavailableModal'

import { useCartStore } from './store/cart'
import { useUnavailableStore } from './store/unavailable'
import { menuOutline, homeOutline, bagHandleOutline, listOutline, personCircleOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'

// Initialize Ionic React
setupIonicReact()

function App() {
  const location = useLocation()
  const { items: cartItems } = useCartStore()
  const { isUnavailable, checkUnavailableStatus } = useUnavailableStore()
  const [showUnavailableModal, setShowUnavailableModal] = useState(false)
  const [hasShownInitialModal, setHasShownInitialModal] = useState(() => {
    // Check if we've already shown the modal in this browser session
    return sessionStorage.getItem('unavailable-modal-shown') === 'true'
  })

  // Check unavailable status on app load and periodically
  useEffect(() => {
    checkUnavailableStatus()
    
    // Check every 15 seconds for time-sensitive availability  
    const interval = setInterval(checkUnavailableStatus, 15000)
    return () => clearInterval(interval)
  }, [checkUnavailableStatus])

  // Show modal when app becomes unavailable (only once per browser session)
  useEffect(() => {
    if (isUnavailable && !hasShownInitialModal) {
      setShowUnavailableModal(true)
      setHasShownInitialModal(true)
      sessionStorage.setItem('unavailable-modal-shown', 'true')
    }
    // Reset flag when app becomes available again
    if (!isUnavailable && hasShownInitialModal) {
      setHasShownInitialModal(false)
      sessionStorage.removeItem('unavailable-modal-shown')
    }
  }, [isUnavailable, hasShownInitialModal])

  // Handler for when user clicks grayed out cart tab
  const handleCartTabClick = () => {
    if (isUnavailable) {
      setShowUnavailableModal(true)
    }
  }

  return (
    <IonApp>
      <IonPage>
        {/* Ionic Header */}
        <IonHeader>
          <IonToolbar className="bg-white border-b border-neutral-200">
            <IonButtons slot="start">
              <IonMenuButton aria-label="Open menu">
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
              <span className="ml-3 text-lg font-semibold text-neutral-900">Order App</span>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {/* Ionic Tabs */}
        <IonTabs>
          <IonRouterOutlet>
            <Routes>
              <Route path="/" element={<MenuPage onShowUnavailableModal={() => setShowUnavailableModal(true)} />} />
              <Route path="/cart" element={
                isUnavailable ? <OnlineOrdersUnavailable /> : <CartPage />
              } />
              <Route path="/checkout" element={
                isUnavailable ? <OnlineOrdersUnavailable /> : <CheckoutPage />
              } />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/unavailable" element={<OnlineOrdersUnavailable />} />
              <Route path="/maintenance" element={<AppMaintenance />} />
            </Routes>
          </IonRouterOutlet>

          <IonTabBar slot="bottom" className="bg-white border-t border-neutral-200">
            <IonTabButton tab="menu" href="/">
              <IonIcon icon={homeOutline} />
              <IonLabel>Menu</IonLabel>
              {(location.pathname === '/' || location.pathname.startsWith('/menu')) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-yellow-500" />
              )}
            </IonTabButton>
            <IonTabButton 
              tab="cart" 
              href={isUnavailable ? undefined : "/cart"}
              disabled={isUnavailable}
              className={isUnavailable ? "opacity-50 pointer-events-none" : ""}
              onClick={handleCartTabClick}
            >
              <IonIcon icon={bagHandleOutline} />
              <IonLabel>Cart</IonLabel>
              {cartItems.length > 0 && !isUnavailable && (
                <span className="absolute right-3 top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
              {location.pathname.startsWith('/cart') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-yellow-500" />
              )}
            </IonTabButton>
            <IonTabButton tab="orders" href="/orders">
              <IonIcon icon={listOutline} />
              <IonLabel>Orders</IonLabel>
              {location.pathname.startsWith('/orders') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-yellow-500" />
              )}
            </IonTabButton>
            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={personCircleOutline} />
              <IonLabel>Profile</IonLabel>
              {location.pathname.startsWith('/profile') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-yellow-500" />
              )}
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        
        {/* Unavailable Modal */}
        <UnavailableModal 
          isOpen={showUnavailableModal} 
          onDismiss={() => setShowUnavailableModal(false)} 
        />
        
      </IonPage>
    </IonApp>
  )
}

export default App
