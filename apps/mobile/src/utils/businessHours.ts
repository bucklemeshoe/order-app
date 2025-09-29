// Business hours checking utility

export interface WeeklyHours {
  monday: { startTime: string; endTime: string; enabled: boolean }
  tuesday: { startTime: string; endTime: string; enabled: boolean }
  wednesday: { startTime: string; endTime: string; enabled: boolean }
  thursday: { startTime: string; endTime: string; enabled: boolean }
  friday: { startTime: string; endTime: string; enabled: boolean }
  saturday: { startTime: string; endTime: string; enabled: boolean }
  sunday: { startTime: string; endTime: string; enabled: boolean }
}

export interface SpecialHour {
  id: string
  date: string // YYYY-MM-DD format
  startTime: string // HH:MM format
  endTime: string // HH:MM format
}

export function isWithinBusinessHours(
  weeklyHours: WeeklyHours, 
  currentTime: Date = new Date(), 
  specialHours: SpecialHour[] = []
): boolean {
  // Get current date in YYYY-MM-DD format
  const currentDateString = currentTime.toISOString().split('T')[0]
  
  // Check special hours first - they override regular hours
  const todaysSpecialHours = specialHours.find(sh => sh.date === currentDateString)
  if (todaysSpecialHours) {
    console.log('📅 Found special hours for today:', todaysSpecialHours)
    
    // Get current time in HH:MM format
    const currentHours = currentTime.getHours().toString().padStart(2, '0')
    const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0')
    const currentTimeString = `${currentHours}:${currentMinutes}`
    
    // Check if current time is within the special hours
    const isAfterStart = currentTimeString >= todaysSpecialHours.startTime
    const isBeforeEnd = currentTimeString <= todaysSpecialHours.endTime
    
    console.log('⭐ Special hours check:', {
      current: currentTimeString,
      start: todaysSpecialHours.startTime,
      end: todaysSpecialHours.endTime,
      isOpen: isAfterStart && isBeforeEnd
    })
    
    return isAfterStart && isBeforeEnd
  }
  
  // Fall back to regular weekly hours
  console.log('📊 Using regular weekly hours (no special hours for today)')
  
  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = currentTime.getDay()
  
  // Map day numbers to day names
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDayName = dayNames[dayOfWeek] as keyof WeeklyHours
  
  const daySchedule = weeklyHours[currentDayName]
  
  // If the day is disabled, we're closed
  if (!daySchedule.enabled) {
    return false
  }
  
  // Get current time in HH:MM format
  const currentHours = currentTime.getHours().toString().padStart(2, '0')
  const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0')
  const currentTimeString = `${currentHours}:${currentMinutes}`
  
  // Check if current time is within the business hours
  const isAfterStart = currentTimeString >= daySchedule.startTime
  const isBeforeEnd = currentTimeString <= daySchedule.endTime
  
  return isAfterStart && isBeforeEnd
}

export function getBusinessHoursStatus(
  weeklyHours: WeeklyHours, 
  currentTime: Date = new Date(), 
  specialHours: SpecialHour[] = []
): {
  isOpen: boolean
  message: string
  nextOpenTime?: string
  isSpecialHours?: boolean
} {
  const isOpen = isWithinBusinessHours(weeklyHours, currentTime, specialHours)
  
  // Check if today has special hours
  const currentDateString = currentTime.toISOString().split('T')[0]
  const todaysSpecialHours = specialHours.find(sh => sh.date === currentDateString)
  
  if (isOpen) {
    return {
      isOpen: true,
      message: todaysSpecialHours ? "We're open with special hours today!" : "We're currently open!",
      isSpecialHours: !!todaysSpecialHours
    }
  }
  
  // If closed, find next opening time
  const dayOfWeek = currentTime.getDay()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  
  const currentHours = currentTime.getHours().toString().padStart(2, '0')
  const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0')
  const currentTimeString = `${currentHours}:${currentMinutes}`
  
  // Check if we have special hours today and haven't opened yet
  if (todaysSpecialHours && currentTimeString < todaysSpecialHours.startTime) {
    return {
      isOpen: false,
      message: `Closed - Opens today at ${formatTime(todaysSpecialHours.startTime)} (special hours)`,
      nextOpenTime: todaysSpecialHours.startTime,
      isSpecialHours: true
    }
  }
  
  // Check today's regular hours (if we haven't passed opening time and no special hours)
  if (!todaysSpecialHours) {
    const currentDayName = dayNames[dayOfWeek] as keyof WeeklyHours
    const todaySchedule = weeklyHours[currentDayName]
    
    if (todaySchedule.enabled && currentTimeString < todaySchedule.startTime) {
      return {
        isOpen: false,
        message: `Closed - Opens today at ${formatTime(todaySchedule.startTime)}`,
        nextOpenTime: todaySchedule.startTime
      }
    }
  }
  
  // Look for next open day (up to 7 days ahead)
  for (let i = 1; i <= 7; i++) {
    const checkDay = (dayOfWeek + i) % 7
    const checkDayName = dayNames[checkDay] as keyof WeeklyHours
    const checkSchedule = weeklyHours[checkDayName]
    
    if (checkSchedule.enabled) {
      const dayName = checkDayName.charAt(0).toUpperCase() + checkDayName.slice(1)
      return {
        isOpen: false,
        message: `Closed - Opens ${i === 1 ? 'tomorrow' : dayName} at ${formatTime(checkSchedule.startTime)}`,
        nextOpenTime: checkSchedule.startTime
      }
    }
  }
  
  return {
    isOpen: false,
    message: "Currently closed - Check our hours"
  }
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour24 = parseInt(hours)
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
  const ampm = hour24 >= 12 ? 'PM' : 'AM'
  return `${hour12}:${minutes} ${ampm}`
}
