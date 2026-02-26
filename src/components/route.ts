
/* IMPORT */

import { untrack, customElement, type ElementAttributes, type JSX } from 'woby'
import { defaults } from 'woby'

import useRoute from '../hooks/use_route'

/* MAIN */

const Route = defaults(() => ({}), (_props: { children?: JSX.Children }): JSX.Element => {

  const route = useRoute()

  return (): JSX.Element => {

    const routeValue = route()
    if (!routeValue || !routeValue.to) {
      // If route is not ready or doesn't have a 'to' property, return null
      return () => null
    }

    const to = routeValue.to

    return (): JSX.Element => {

      return untrack(to) as any

    }

  }

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
