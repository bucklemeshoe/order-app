import { useEffect, useState } from 'react'
import { IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonSpinner, IonToast, IonIcon } from '@ionic/react'
import { checkmarkCircleOutline } from 'ionicons/icons'
import { useSupabase } from '../lib/useSupabase'

type UserProfile = {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  dietary_prefs: string | null
}

export default function ProfilePage() {
  const supabase = useSupabase()

  // Vanilla app uses a demo user - no authentication needed
  const currentUserId = 'demo-user-123'
  const defaultEmail = 'demo@example.com'
  const defaultName = 'Demo User'

  const [profile, setProfile] = useState<UserProfile>({
    id: currentUserId,
    email: defaultEmail,
    name: defaultName,
    phone: '',
    dietary_prefs: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; color?: 'success' | 'danger' | 'warning' }>(
    { open: false, message: '', color: 'success' }
  )

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUserId)
          .maybeSingle()
        if (error) throw error
        if (isMounted) {
          if (data) {
            setProfile({
              id: data.id,
              email: data.email,
              name: data.name,
              phone: data.phone,
              dietary_prefs: data.dietary_prefs,
            })
          } else {
            // Pre-fill from auth defaults if no profile yet
            setProfile((p) => ({ ...p, email: defaultEmail, name: defaultName }))
          }
        }
      } catch (e: any) {
        setToast({ open: true, message: e?.message ?? 'Failed to load profile', color: 'danger' })
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => { isMounted = false }
  }, [supabase, currentUserId, defaultEmail, defaultName])

  const handleSave = async () => {
    try {
      setSaving(true)
      setToast({ open: false, message: '' })
      const payload = {
        id: currentUserId,
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        dietary_prefs: profile.dietary_prefs,
      }
      const { error } = await supabase
        .from('users')
        .upsert(payload, { onConflict: 'id' })
      if (error) throw error
      setToast({ open: true, message: 'Profile saved', color: 'success' })
    } catch (e: any) {
      setToast({ open: true, message: e?.message ?? 'Failed to save profile', color: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <IonContent className="ion-padding">
      <div className="space-y-6 pt-12 text-center">
          <IonSpinner name="crescent" color="warning" />
          <h1 className="text-xl font-semibold text-neutral-900">Loading Profile…</h1>
        </div>
      </IonContent>
    )
  }

  return (
    <IonContent className="ion-padding">
      <div className="space-y-6 pt-12">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-neutral-900">My Profile</h1>
          <p className="text-neutral-600 text-sm">Manage your contact details and preferences</p>
        </div>

        <IonCard className="border border-neutral-200">
          <IonCardContent>
            <div className="space-y-4">
              <IonItem lines="full">
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={profile.email ?? ''}
                  onIonInput={(e) => setProfile((p) => ({ ...p, email: e.detail.value ?? '' }))}
                  placeholder="you@example.com"
                  readonly={false}
                  disabled={false}
                />

              </IonItem>

              <IonItem lines="full">
                <IonLabel position="stacked">Full name</IonLabel>
                <IonInput
                  value={profile.name ?? ''}
                  onIonInput={(e) => setProfile((p) => ({ ...p, name: e.detail.value ?? '' }))}
                  placeholder="e.g. Alex Coffee"
                />
              </IonItem>

              <IonItem lines="full">
                <IonLabel position="stacked">Phone</IonLabel>
                <IonInput
                  type="tel"
                  value={profile.phone ?? ''}
                  onIonInput={(e) => setProfile((p) => ({ ...p, phone: e.detail.value ?? '' }))}
                  placeholder="e.g. 071 234 5678"
                />
              </IonItem>

              <IonItem lines="full">
                <IonLabel position="stacked">Dietary preferences</IonLabel>
                <IonTextarea
                  value={profile.dietary_prefs ?? ''}
                  onIonInput={(e) => setProfile((p) => ({ ...p, dietary_prefs: e.detail.value ?? '' }))}
                  autoGrow
                  placeholder="e.g. Oat milk, no sugar"
                />
              </IonItem>

              <div className="pt-2">
                <IonButton expand="block" color="warning" size="large" className="rounded-full" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <IonSpinner name="crescent" />
                      <span className="ml-2">Saving…</span>
                    </>
                  ) : (
                    <>
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      Save Profile
                    </>
                  )}
                </IonButton>

              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={toast.open}
          onDidDismiss={() => setToast((t) => ({ ...t, open: false }))}
          message={toast.message}
          duration={2000}
          color={toast.color}
          position="top"
        />
      </div>
    </IonContent>
  )
}

