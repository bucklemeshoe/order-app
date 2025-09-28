import React, { forwardRef } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@order-app/design-system'
import { useInspect } from '../contexts/InspectContext'

interface InspectorWrapperProps {
  componentName: string
  importPath?: string
  variant?: string
  size?: string
  children: React.ReactNode
  className?: string
}

// HOC to wrap components with inspection functionality
export function withInspector<T extends React.ComponentType<any>>(
  Component: T,
  componentName: string,
  importPath: string = '@order-app/design-system',
  filePath?: string,
  lineNumber?: number
) {
  const WrappedComponent = forwardRef<any, React.ComponentProps<T>>((props, ref) => {
    const { inspectMode } = useInspect()
    
    if (!inspectMode) {
      return <Component {...props} ref={ref} />
    }

    // Extract all props for comprehensive inspection
    const { children, ...otherProps } = props as any
    const cleanProps = Object.fromEntries(
      Object.entries(otherProps).filter(([key, value]) => 
        value !== undefined && 
        key !== 'ref' && 
        !key.startsWith('__')
      )
    )

    // Use different colors for different component types
    const isLocalComponent = importPath.includes('.tsx') || importPath.includes('local component')
    const outlineColor = isLocalComponent ? 'rgba(59, 130, 246, 0.5)' : 'rgba(236, 72, 153, 0.5)'
    const hoverColor = isLocalComponent ? 'rgba(59, 130, 246, 0.8)' : 'rgba(236, 72, 153, 0.8)'
    const bgColor = isLocalComponent ? 'rgba(59, 130, 246, 0.05)' : 'rgba(236, 72, 153, 0.05)'
    const badgeColor = isLocalComponent ? 'bg-blue-500' : 'bg-pink-500'

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="relative inline-block"
            style={{ 
              outline: `2px dashed ${outlineColor}`,
              outlineOffset: '2px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.outline = `2px solid ${hoverColor}`
              e.currentTarget.style.backgroundColor = bgColor
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.outline = `2px dashed ${outlineColor}`
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            onClick={(e) => {
              e.stopPropagation() // Prevent parent components from handling click
              copyImportToClipboard(componentName, importPath)
            }}
          >
            <Component {...props} ref={ref} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm bg-slate-900 text-white border-slate-700">
          <div className="space-y-2 text-sm">
            {/* Component Token - prominently displayed */}
            <div className={`${badgeColor} text-white text-sm px-3 py-1.5 rounded-lg font-bold text-center mb-1`}>
              {componentName}
            </div>
            
            <div className="text-slate-300 text-xs">{importPath}</div>
            {filePath && (
              <div className="text-slate-300 text-xs">
                📄 {filePath}{lineNumber ? `:${lineNumber}` : ''}
              </div>
            )}
            
            {Object.keys(cleanProps).length > 0 && (
              <div className="space-y-1">
                <div className="text-slate-400 text-xs font-medium">Props:</div>
                {Object.entries(cleanProps).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-slate-400">{key}:</span>{' '}
                    <span className="font-mono text-green-300">
                      {typeof value === 'string' ? `"${value}"` : String(value)}
                    </span>
                  </div>
                ))}
                {Object.keys(cleanProps).length > 3 && (
                  <div className="text-xs text-slate-500">
                    +{Object.keys(cleanProps).length - 3} more props
                  </div>
                )}
              </div>
            )}
            
            <div className="border-t border-slate-600 pt-2 mt-2 text-xs text-slate-400">
              💡 Click to copy import
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  })

  WrappedComponent.displayName = `withInspector(${componentName})`
  
  return WrappedComponent as T
}

// Helper function to create inspectable versions of common components
export function createInspectableComponent<T extends React.ComponentType<any>>(
  Component: T,
  componentName: string
) {
  return withInspector(Component, componentName)
}

// Copy to clipboard functionality
export function copyImportToClipboard(componentName: string, importPath: string = '@order-app/design-system') {
  const importStatement = `import { ${componentName} } from '${importPath}'`
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(importStatement).then(() => {
      console.log(`🎯 COPIED: ${importStatement}`)
      // Show temporary visual feedback
      showCopyFeedback(componentName)
    })
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = importStatement
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    console.log(`🎯 COPIED: ${importStatement}`)
    showCopyFeedback(componentName)
  }
}

// Simple visual feedback for copy action
function showCopyFeedback(componentName: string) {
  // Create a temporary notification
  const notification = document.createElement('div')
  notification.textContent = `Copied ${componentName} import!`
  notification.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: rgba(34, 197, 94, 0.95);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
  `
  
  // Add CSS animation
  if (!document.querySelector('#copy-feedback-styles')) {
    const style = document.createElement('style')
    style.id = 'copy-feedback-styles'
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)
  }
  
  document.body.appendChild(notification)
  
  // Remove after 2 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 2000)
}
