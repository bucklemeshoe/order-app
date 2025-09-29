import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react'
import { storefront, refresh } from 'ionicons/icons'

export default function OnlineOrdersUnavailable() {
  const handleRefresh = () => {
    // This will reload the page to check if orders are available again
    window.location.reload()
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-full text-center px-6">
          {/* Icon */}
          <div className="mb-8">
            <IonIcon 
              icon={storefront} 
              className="text-6xl text-gray-400"
              style={{ fontSize: '4rem' }}
            />
          </div>

          {/* Main Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Online Orders Unavailable
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2 leading-relaxed max-w-sm">
            We're temporarily not accepting online orders right now.
          </p>
          
          <p className="text-gray-600 mb-8 leading-relaxed max-w-sm">
            Please check back soon or visit us in store.
          </p>

          {/* Store Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 max-w-sm w-full">
            <h3 className="font-semibold text-gray-800 mb-2">Visit Our Store</h3>
            <p className="text-sm text-gray-600 mb-1">
              📍 123 Coffee Street<br />
              City Center, State 12345
            </p>
            <p className="text-sm text-gray-600">
              📞 (555) 123-COFFEE
            </p>
          </div>

          {/* Refresh Button */}
          <IonButton 
            fill="outline" 
            onClick={handleRefresh}
            className="w-full max-w-xs"
          >
            <IonIcon icon={refresh} slot="start" />
            Check Again
          </IonButton>

          {/* Footer Message */}
          <p className="text-xs text-gray-500 mt-6 max-w-sm">
            Thank you for your patience. We'll be back to taking orders soon!
          </p>
        </div>
      </IonContent>
    </IonPage>
  )
}
