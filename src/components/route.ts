
/* IMPORT */

import { $$, customElement, type ElementAttributes, type JSX, useMemo } from 'woby'
import { defaults } from 'woby'

import useRoute from '../hooks/use_route'

/* MAIN */

// Define default props function - required for custom elements
const def = () => ({})

const Route = defaults(def, (_props): JSX.Element => {
  const route = useRoute()

  // Reactively render the current route's component using useMemo
  // This creates a computed observable that tracks route changes
  return useMemo((): JSX.Element => {
    const routeValue = route ? $$(route) : undefined
    // Return null for empty/fallback routes (no path means FALLBACK_ROUTE with throwing to())
    if (!routeValue || !routeValue.to || !routeValue.path) {
      return null
    }
    try {
      const component = $$(routeValue.to)
      return component as any
    } catch (e) {
      return null
    }
  })

})

// Register as custom element
customElement('woby-route', Route)

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
