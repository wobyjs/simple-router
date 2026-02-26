
/* IMPORT */

import { $, $$, customElement, type ElementAttributes, HtmlString, type JSX } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import type { RouterPath } from '../types'
import useNavigate from '../hooks/use_navigate'


/* MAIN */

const Navigate = defaults(() => ({
  to: $('/' as RouterPath as any, HtmlString) as ObservableMaybe<RouterPath> | undefined,
  state: $(undefined as any) as ObservableMaybe<any> | undefined
}), (props: { to?: ObservableMaybe<RouterPath>, state?: ObservableMaybe<any>, children?: JSX.Children }): JSX.Element => {

  const navigate = useNavigate()

  queueMicrotask(() => navigate($$(props.to), { replace: true, state: $$(props.state) }))

  return props.children as any || null

})

// Register as custom element
console.log('Registering woby-navigate custom element')
customElement('woby-navigate', Navigate)
console.log('woby-navigate custom element registered')

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
