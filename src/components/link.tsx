
/* IMPORT */

import { $, $$, customElement, type ElementAttributes, HtmlString, HtmlBoolean, type JSX, useMemo, createContext, useContext, context } from 'woby'
import { defaults, setPendingContextWrap } from 'woby'
import type { ObservableMaybe } from 'woby'
import useLocation from '../hooks/use_location'
import State, { routerState$ } from '../contexts/state'
import type { RouterPath } from '../types'

/* MAIN */

// Create context for active state
export const LinkContext = createContext<boolean>(false)

// Define default props function - required for custom elements
const def = () => {
  const r = {
    to: $('/' as RouterPath as any, HtmlString) as ObservableMaybe<RouterPath> | undefined,
    replace: $(false, HtmlBoolean) as ObservableMaybe<boolean> | undefined,
    state: $(undefined as any) as ObservableMaybe<any> | undefined,
    title: $('', HtmlString) as ObservableMaybe<string> | undefined,
  }

  return r as typeof r & JSX.HTMLAttributes<HTMLAnchorElement>
}

const Link = defaults(def, (props): JSX.Element => {
  const {
    to,
    replace,
    state,
    title,
    children,
    // Destructure HTML anchor attributes to forward them
    ...htmlAttrs
  } = props as typeof props & JSX.HTMLAttributes<HTMLAnchorElement>

  // useContext(State) works for TSX usage; falls back to routerState$ for custom element
  // (same timing issue as woby-route: child constructs before parent sets context)
  const ctxState = useContext(State)
  const navigate = useMemo(() => {
    const state = $$(ctxState) ?? $$(routerState$)
    return state?.navigate
  })

  const location = useLocation()

  // Compute active state reactively
  const isActive = useMemo(() => {
    const locPathname = $$(location.pathname)
    const toPath = $$(to)
    return locPathname === toPath
  })

  // For custom elements: expose LinkContext via setPendingContextWrap so light DOM children
  // (like <active-button>) can collect it via collectAncestorContextWrap
  // IMPORTANT: Pass the observable itself so consumers can react to changes
  if (typeof setPendingContextWrap === 'function') {
    const { symbol } = LinkContext
    setPendingContextWrap((fn: () => void) => {
      context({ [symbol]: isActive }, fn)
    })
  }

  return useMemo((): JSX.Element => {
    const toValue = $$(to)
    const handleClickMemo = (event: MouseEvent): void => {
      event.preventDefault()
      const nav = $$(navigate)
      if (nav) nav(toValue, { replace: $$(replace), state: $$(state) })
    }

    return (
      <LinkContext.Provider value={isActive}>
        <a href={toValue} title={$$(title)} onClick={handleClickMemo} {...(htmlAttrs as any)}>{children}</a>
      </LinkContext.Provider>
    )
  })
})

// Register as custom element
customElement('woby-link', Link)

// Type augmentation for JSX support
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'woby-link': ElementAttributes<typeof Link> & JSX.HTMLAttributes<HTMLAnchorElement>
    }
  }
}

/* EXPORT */

// Export Link with proper type that includes HTML anchor attributes
export default Link as typeof Link & {
  (props: Parameters<typeof Link>[0] & JSX.HTMLAttributes<HTMLAnchorElement>): JSX.Element
}
