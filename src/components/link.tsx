
/* IMPORT */

import { $, $$, customElement, type ElementAttributes, HtmlString, HtmlBoolean, type JSX, useMemo, createContext, useContext } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import useLocation from '../hooks/use_location'
import State, { routerState$ } from '../contexts/state'
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
    children
  } = props

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

  return useMemo((): JSX.Element => {
    const toValue = $$(to)
    const handleClickMemo = (event: MouseEvent): void => {
      event.preventDefault()
      const nav = $$(navigate)
      if (nav) nav(toValue, { replace: $$(replace), state: $$(state) })
    }

    return (
      <LinkContext.Provider value={isActive}>
        <a href={toValue} title={$$(title)} onClick={handleClickMemo}>{children}</a>
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
      'woby-link': ElementAttributes<typeof Link>
    }
  }
}

/* EXPORT */

export default Link
