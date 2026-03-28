
/* IMPORT */

import { $, $$, jsx, customElement, type ElementAttributes, HtmlString, HtmlBoolean, HtmlStyle, type JSX, } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import useNavigate from '../hooks/use_navigate'
import type { RouterPath } from '../types'

/* MAIN */

// Define default props function - required for custom elements
const def = () => {
  return {
    to: $('/' as RouterPath as any, HtmlString) as ObservableMaybe<RouterPath> | undefined,
    replace: $(false, HtmlBoolean) as ObservableMaybe<boolean> | undefined,
    state: $(undefined as any) as ObservableMaybe<any> | undefined,
    title: $('', HtmlString) as ObservableMaybe<string> | undefined,
    style: $('', HtmlStyle) as ObservableMaybe<JSX.Style> | undefined
  }
}

const Link = defaults(def, (props): JSX.Element => {
  const {
    to,
    replace,
    state,
    title,
    style,
    children
  } = props

  const navigate = useNavigate()

  const onClick = (event: MouseEvent): void => {
    event.preventDefault()
    if (navigate) {
      navigate($$(to), { replace: $$(replace), state: $$(state) })
    } else {
      window.location.href = $$(to)
    }
  }

  return jsx('a', { href: $$(to), title: $$(title), style: $$(style), onClick, children, ...props })

})

// Register as custom element
console.log('Registering woby-link custom element')
customElement('woby-link', Link)
console.log('woby-link custom element registered')

// Type augmentation for JSX support
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'woby-link': ElementAttributes<typeof Link>
    }
  }
}

/* EXPORT */

export default Link
