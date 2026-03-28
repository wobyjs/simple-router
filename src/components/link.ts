
/* IMPORT */

import { $, $$, jsx, customElement, type ElementAttributes, HtmlString, HtmlBoolean, HtmlStyle, type JSX, useMemo, useEffect } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import useNavigate from '../hooks/use_navigate'
import useLocation from '../hooks/use_location'
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
  const location = useLocation()

  const onClick = (event: MouseEvent): void => {
    event.preventDefault()
    if (navigate) {
      navigate($$(to), { replace: $$(replace), state: $$(state) })
    } else {
      window.location.href = $$(to)
    }
  }

  // Compute active state reactively - compare unwrapped pathnames
  const isActive = useMemo(() => {
    const locPathname = $$(location.pathname)
    const toPath = $$(to)
    const active = locPathname === toPath
    console.log('[Link isActive] location.pathname:', locPathname, 'to:', toPath, 'active:', active)
    return active
  })

  // Merge user-provided style with active state styling
  // Each reactive property calls isActive() inside its function to track location changes
  const computedStyle = useMemo(() => {
    const userStyleObj = typeof $$(style) === 'object' ? ($$(style) as Record<string, any>) : {}
    return {
      ...userStyleObj,
      backgroundColor: () => {
        const active = $$(isActive)
        console.log('[computedStyle.backgroundColor] active:', active)
        return active ? '#007bff' : (userStyleObj['backgroundColor'] || 'transparent')
      },
      color: () => {
        const active = $$(isActive)
        console.log('[computedStyle.color] active:', active)
        return active ? 'white' : (userStyleObj['color'] || '#333')
      }
    } as JSX.Style
  })

  // Sync active class to the custom element host
  useEffect(() => {
    const active = isActive()
    console.log('[Link useEffect] active state:', active, 'to:', $$(to))

    // Find the host custom element by querying for it
    // Since we're inside shadow DOM, we need to find our way back to the host
    const anchorEl = (typeof window !== 'undefined') ? document.querySelector(`a[href="${$$(to)}"]`) : null
    const hostEl = anchorEl?.getRootNode() instanceof ShadowRoot
      ? (anchorEl.getRootNode() as ShadowRoot).host
      : null

    console.log('[Link useEffect] anchorEl:', anchorEl, 'hostEl:', hostEl)
    if (hostEl) {
      if (active) {
        hostEl.classList.add('active-link')
        console.log('[Link useEffect] Added active-link class to:', hostEl.id)
      } else {
        hostEl.classList.remove('active-link')
        console.log('[Link useEffect] Removed active-link class from:', hostEl.id)
      }
    }
  })

  return jsx('a', { href: to, title: title, style: computedStyle, onClick, children })

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
