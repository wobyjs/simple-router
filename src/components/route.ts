
/* IMPORT */

import { untrack, $$, customElement, type ElementAttributes, type JSX, useMemo } from 'woby'
import { defaults } from 'woby'

import useRoute from '../hooks/use_route'

/* MAIN */

// Define default props function - required for custom elements
const def = () => ({})

const Route = defaults(def, (_props): JSX.Element => {
  console.log('[Route] === ROUTE COMPONENT RENDER START ===')
  const route = useRoute()

  console.log('[Route] Rendering with route:', route ? 'exists' : 'null')

  // Reactively render the current route's component using useMemo
  // This creates a computed observable that tracks route changes
  return useMemo((): JSX.Element => {
    console.log('[Route] === USEMEMO EXECUTING ===')
    const routeValue = route ? $$(route) : undefined
    console.log('[Route] useMemo - routeValue path:', routeValue?.path)
    // Return null for empty/fallback routes (no path means FALLBACK_ROUTE with throwing to())
    if (!routeValue || !routeValue.to || !routeValue.path) {
      console.log('[Route] No route value or empty path (fallback), returning null')
      return null
    }
    try {
      const component = $$(routeValue.to)
      console.log('[Route] Rendering component for', routeValue.path, 'component type:', typeof component)
      console.log('[Route] === USEMEMO DONE ===')
      return component as any
    } catch (e) {
      console.log('[Route] Error rendering component for', routeValue.path, ':', e)
      return null
    }
  })

})

// Register as custom element
console.log('Registering woby-route custom element')
customElement('woby-route', Route)
console.log('woby-route custom element registered')

// Type augmentation for JSX support
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'woby-route': ElementAttributes<typeof Route>
    }
  }
}

/* EXPORT */

export default Route
