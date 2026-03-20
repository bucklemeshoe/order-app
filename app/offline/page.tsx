"use client"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-neutral-200 rounded-full flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-neutral-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v20M2 12h20" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          You're Offline
        </h1>
        
        <p className="text-neutral-600 mb-6">
          It looks like you've lost your internet connection. Don't worry, you can still browse your recent orders when you're back online.
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#F83D60] text-white px-6 py-3 rounded-full font-medium hover:bg-[#d6345a] transition-colors"
        >
          Try Again
        </button>
        
        <div className="mt-8 text-sm text-neutral-500">
          <p>O App - Order & Delivery</p>
        </div>
      </div>
    </div>
  )
}
