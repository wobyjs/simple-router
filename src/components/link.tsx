
/* IMPORT */

import { $, $$, customElement, type ElementAttributes, HtmlString, HtmlBoolean, type JSX, useMemo, useEffect, createContext, useContext } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import useLocation from '../hooks/use_location'
import State from '../contexts/state'
import type { RouterPath } from '../types'

/* MAIN */

// Create context for active state
export const LinkContext = createContext<boolean>(false)

// Define default props function - required for custom elements
const def = () => {
  return {
    to: $('/' as RouterPath as any, HtmlString) as ObservableMaybe<RouterPath> | undefined,
    replace: $(false, HtmlBoolean) as ObservableMaybe<boolean> | undefined,
    state: $(undefined as any) as ObservableMaybe<any> | undefined,
    title: $('', HtmlString) as ObservableMaybe<string> | undefined,
  }
}

const Link = defaults(def, (props): JSX.Element => {
  const {
    to,
    replace,
    state,
    title,
    children,
    ...restProps
  } = props

  // Get navigate directly from State context (bypassing useNavigate hook which has issues)
  const stateContext = useContext(State) as any
  const unwrappedState = $$(stateContext)
  const navigateFromState = unwrappedState?.navigate
  
  const location = useLocation()

  // Compute active state reactively - compare unwrapped pathnames
  const isActive = useMemo(() => {
    const locPathname = $$(location.pathname)
    const toPath = $$(to)
    const active = locPathname === toPath
    return active
  })

  // Sync active class to the custom element host
  useEffect(() => {
    const active = isActive()

    // Find the host custom element by querying for it
    // Since we're inside shadow DOM, we need to find our way back to the host
    const anchorEl = (typeof window !== 'undefined') ? document.querySelector(`a[href="${$$(to)}"]`) : null
    const hostEl = anchorEl?.getRootNode() instanceof ShadowRoot
      ? (anchorEl.getRootNode() as ShadowRoot).host
      : null

    if (hostEl) {
      if (active) {
        hostEl.classList.add('active-link')
      } else {
        hostEl.classList.remove('active-link')
      }
    }
  })

  // Manually attach click handler to prevent default navigation
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const nav = navigateFromState
    
    const anchorEl = document.querySelector(`a[href="${$$(to)}"]`)
    if (!anchorEl) return
    
    const handleClickDirect = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      
      if (nav) {
        nav($$(to), { replace: $$(replace), state: $$(state) })
      }
    }
    
    anchorEl.addEventListener('click', handleClickDirect as EventListener)
    
    return () => {
      anchorEl.removeEventListener('click', handleClickDirect as EventListener)
    }
  })

  // Create click handler that prevents default navigation
  const handleClick = (event: MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()
    
    if (navigateFromState) {
      navigateFromState($$(to), { replace: $$(replace), state: $$(state) })
    }
  }

  return (
    <LinkContext.Provider value={isActive}>
      <a href={$$(to)} title={title} onClick={handleClick}>{children}</a>
    </LinkContext.Provider>
  )
})

// Register as custom element
customElement('woby-link', Link)

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
