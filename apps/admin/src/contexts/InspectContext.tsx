import { createContext, useContext } from 'react'

// Component Inspection Context
export interface InspectContextType {
  inspectMode: boolean
  setInspectMode: (mode: boolean) => void
}

export const InspectContext = createContext<InspectContextType>({
  inspectMode: false,
  setInspectMode: () => {}
})

export const useInspect = () => useContext(InspectContext)
