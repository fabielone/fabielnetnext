'use client'
import { useNavigationContext } from '../providers/NavigationProvider'

export const LoadingStyleSelector = () => {
  const { loadingStyle, setLoadingStyle, navigateWithLoading } = useNavigationContext()

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border z-50">
      <h3 className="text-sm font-semibold mb-3">Loading Style</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="subtle-overlay"
            checked={loadingStyle === 'subtle-overlay'}
            onChange={(e) => setLoadingStyle(e.target.value as any)}
            className="text-blue-600"
          />
          <span className="text-sm">Subtle Overlay</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="progress-bar"
            checked={loadingStyle === 'progress-bar'}
            onChange={(e) => setLoadingStyle(e.target.value as any)}
            className="text-blue-600"
          />
          <span className="text-sm">Progress Bar</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="none"
            checked={loadingStyle === 'none'}
            onChange={(e) => setLoadingStyle(e.target.value as any)}
            className="text-blue-600"
          />
          <span className="text-sm">None</span>
        </label>
      </div>
      <button
        onClick={() => navigateWithLoading('/contact')}
        className="mt-3 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
      >
        Test Navigation
      </button>
    </div>
  )
}
