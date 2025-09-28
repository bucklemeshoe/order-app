import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react'
import { construct, refresh, time } from 'ionicons/icons'

export default function AppMaintenance() {
  const handleRefresh = () => {
    // This will reload the page to check if maintenance is complete
    window.location.reload()
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-full text-center px-6">
          {/* Icon */}
          <div className="mb-8">
            <IonIcon 
              icon={construct} 
              className="text-6xl text-orange-500"
              style={{ fontSize: '4rem' }}
            />
          </div>

          {/* Main Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            App Under Maintenance
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2 leading-relaxed max-w-sm">
            We're currently performing maintenance to improve your experience.
          </p>
          
          <p className="text-gray-600 mb-8 leading-relaxed max-w-sm">
            This should only take a few minutes. Thank you for your patience!
          </p>

          {/* Maintenance Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 max-w-sm w-full">
            <div className="flex items-center justify-center mb-2">
              <IonIcon icon={time} className="text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-800">Estimated Time</h3>
            </div>
            <p className="text-sm text-orange-700 mb-3">
              Maintenance usually takes 5-15 minutes
            </p>
            <div className="text-xs text-orange-600 bg-orange-100 rounded px-2 py-1">
              Started at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* What's Being Updated */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 max-w-sm w-full">
            <h3 className="font-semibold text-gray-800 mb-3">What We're Updating</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Performance improvements
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                New features
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Bug fixes
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <IonButton 
            fill="solid" 
            color="warning"
            onClick={handleRefresh}
            className="w-full max-w-xs mb-4"
          >
            <IonIcon icon={refresh} slot="start" />
            Check if Ready
          </IonButton>

          {/* Alternative Actions */}
          <div className="space-y-2 w-full max-w-xs">
            <IonButton 
              fill="outline" 
              size="small"
              onClick={() => window.open('tel:+15551234567')}
              className="w-full"
            >
              📞 Call Store Instead
            </IonButton>
          </div>

          {/* Footer Message */}
          <p className="text-xs text-gray-500 mt-6 max-w-sm">
            We apologize for the inconvenience. The app will be back shortly with exciting updates!
          </p>
        </div>
      </IonContent>
    </IonPage>
  )
}
