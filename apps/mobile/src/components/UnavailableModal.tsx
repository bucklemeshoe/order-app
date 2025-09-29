import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonButtons } from '@ionic/react'
import { storefront, close, refresh, time } from 'ionicons/icons'
import { useUnavailableStore } from '../store/unavailable'
import { getBusinessHoursStatus } from '../utils/businessHours'

interface UnavailableModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function UnavailableModal({ isOpen, onDismiss }: UnavailableModalProps) {
  const { manuallyUnavailable, outsideBusinessHours, weeklyHours, specialHours } = useUnavailableStore()
  
  const handleRefresh = () => {
    // This will reload the page to check if orders are available again
    window.location.reload()
  }

  // Determine the reason and appropriate messaging
  const getUnavailableReason = () => {
    if (manuallyUnavailable && outsideBusinessHours) {
      return {
        title: "Orders Unavailable",
        reason: "We're temporarily closed and outside business hours",
        icon: storefront
      }
    } else if (manuallyUnavailable) {
      return {
        title: "Orders Temporarily Unavailable", 
        reason: "We're temporarily not accepting online orders",
        icon: storefront
      }
    } else if (outsideBusinessHours) {
      return {
        title: "We're Currently Closed",
        reason: "Outside business hours",
        icon: time
      }
    } else {
      return {
        title: "Orders Unavailable",
        reason: "Orders are currently unavailable",
        icon: storefront
      }
    }
  }

  const unavailableInfo = getUnavailableReason()
  
  // Get business hours status for better messaging (including special hours)
  const businessHoursStatus = weeklyHours ? getBusinessHoursStatus(weeklyHours, new Date(), specialHours) : null

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{unavailableInfo.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center text-center px-6 py-8">
          {/* Icon */}
          <div className="mb-6">
            <IonIcon 
              icon={unavailableInfo.icon} 
              className={`text-5xl ${outsideBusinessHours ? 'text-orange-500' : 'text-gray-400'}`}
              style={{ fontSize: '3rem' }}
            />
          </div>

          {/* Main Message */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {unavailableInfo.title}
          </h2>

          {/* Description based on reason */}
          {outsideBusinessHours && businessHoursStatus ? (
            <div className="mb-6">
              <p className="text-gray-600 mb-2 leading-relaxed">
                {businessHoursStatus.message}
              </p>
              {businessHoursStatus.isSpecialHours && (
                <p className="text-sm text-orange-600 mb-2 font-medium">
                  ⭐ Special hours today
                </p>
              )}
              <p className="text-gray-600 leading-relaxed">
                You can still browse our menu and visit us in store.
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-600 mb-2 leading-relaxed">
                We're temporarily not accepting online orders right now.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You can still browse our menu and visit us in store.
              </p>
            </div>
          )}

          {/* Store Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
            <h3 className="font-semibold text-gray-800 mb-2">Visit Our Store</h3>
            <p className="text-sm text-gray-600 mb-1">
              📍 123 Coffee Street<br />
              City Center, State 12345
            </p>
            <p className="text-sm text-gray-600">
              📞 (555) 123-COFFEE
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 w-full">
            <IonButton 
              expand="block"
              fill="outline" 
              onClick={handleRefresh}
            >
              <IonIcon icon={refresh} slot="start" />
              Check Again
            </IonButton>
            
            <IonButton 
              expand="block"
              fill="clear" 
              onClick={onDismiss}
            >
              Continue Browsing
            </IonButton>
          </div>

          {/* Footer Message */}
          <p className="text-xs text-gray-500 mt-4">
            Thank you for your patience. We'll be back to taking orders soon!
          </p>
        </div>
      </IonContent>
    </IonModal>
  )
}
