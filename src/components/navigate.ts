
/* IMPORT */

import { $, $$, customElement, type ElementAttributes, HtmlString, type JSX } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import type { RouterPath } from '../types'
import useNavigate from '../hooks/use_navigate'


/* MAIN */

// Define default props function - required for custom elements
const def = () => ({
  to: $('/' as RouterPath as any, HtmlString) as ObservableMaybe<RouterPath> | undefined,
  state: $(undefined as any) as ObservableMaybe<any> | undefined
})

const Navigate = defaults(def, (props): JSX.Element => {
  const { to, state, children } = props

  queueMicrotask(() => {
    const navigate = useNavigate()
    if (navigate) {
      navigate($$(to), { replace: true, state: $$(state) })
    } else {
      window.location.href = $$(to)
    }
  })

  return children as any || null

})

// Register as custom element
customElement('woby-navigate', Navigate)

// Type augmentation for JSX support
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'woby-navigate': ElementAttributes<typeof Navigate>
    }
  }
}

/* EXPORT */

export default Navigate
