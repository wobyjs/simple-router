
/* IMPORT */

import { $$, customElement, type ElementAttributes, type JSX, useMemo, useContext } from 'woby'
import { defaults } from 'woby'

import State, { routerState$ } from '../contexts/state'

/* MAIN */

// Define default props function - required for custom elements
const def = () => ({})

const Route = defaults(def, (_props): JSX.Element => {
  // For TSX usage: useContext(State) works via soby context chain
  // For custom element usage: useContext returns undefined (timing issue),
  // so fall back to the module-level reactive routerState$ observable.
  const ctxState = useContext(State)

  return useMemo((): JSX.Element => {
    // Prefer soby context; fall back to module-level observable
    const unwrappedState = $$(ctxState) ?? $$(routerState$)
    
    // Unwrap the route observable from state
    const routeValue = unwrappedState ? $$(unwrappedState.route) : undefined
    
    if (!routeValue || !routeValue.to || !routeValue.path) {
      return null
    }
    
    const unwrappedTo = $$(routeValue.to)
    
    // Return the component/element as-is — let woby's setChild pipeline
    // invoke it and insert the result into whichever DOM target owns this
    // Route instance (shadow DOM for <woby-route>, light DOM for <Route />).
    // Invoking unwrappedTo() here would return a single HTMLElement that
    // can only live in one place; returning the function lets each
    // rendering context produce its own independent DOM node.
    return unwrappedTo
  })

})

// Register as custom element
customElement('woby-route', Route)

// // Add mounted hook to manually test shadow DOM
// if (typeof window !== 'undefined') {
//   setTimeout(() => {
//     const el = document.querySelector('woby-route') as any
//     if (el && el.shadowRoot) {
//       console.log('[TEST] Manually adding div to shadow root')
//       const testDiv = document.createElement('div')
//       testDiv.textContent = 'MANUALLY ADDED TEST'
//       testDiv.style.color = 'red'
//       testDiv.style.fontSize = '20px'
//       el.shadowRoot.appendChild(testDiv)
//     }
//   }, 1000)
// }

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
