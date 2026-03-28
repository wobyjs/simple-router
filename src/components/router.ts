
/* IMPORT */

import { $, $$, untrack, useMemo, useResource, customElement, type ElementAttributes, HtmlString, type JSX, useEffect, context, setPendingContextWrap } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import getBackend from '../backends/backend'
import { FALLBACK_ROUTE, NOOP } from '../constants'
import State from '../contexts/state'
import useRouter from '../hooks/use_router'
import { castPath } from '../utils'
import type { F, RouterBackend, RouterPath, RouterRoute } from '../types'

/* MAIN */

// Define default props function - required for custom elements
const def = () => ({
  backend: $('path' as any, HtmlString) as ObservableMaybe<RouterBackend> | undefined,
  routes: $([] as RouterRoute[], { toHtml: () => undefined }) as ObservableMaybe<RouterRoute[]> | undefined,
  path: $(undefined as any) as ObservableMaybe<F<RouterPath> | undefined> | undefined,
})

const Router = defaults(def, (props): JSX.Element => {

  const [location, navigate] = getBackend($$(props.backend) || 'path', $$(props.path))

  const pathname = useMemo(() => {
    const loc = $$(location)
    const result = castPath(loc.replace(/[?#].*$/, ''))
    return result
  })
  const search = useMemo(() => {
    const result = $$(location).replace(/^.*?(?:\?|$)/, '').replace(/#.*$/, '')
    return result
  })
  const hash = useMemo(() => {
    const result = $$(location).replace(/^.*?(?:#|$)/, '')
    return result
  })

  const router = useMemo(() => {
    const r = useRouter($$(props.routes) || [])
    return r
  })

  useEffect(() => {
    const pn = $$(pathname)
    const r = $$(router)
    r.route(pn)
  })

  const lookup = useMemo(() => {
    const pn = $$(pathname)
    const r = $$(router)
    const result = r.route(pn) || r.route('/404') || FALLBACK_ROUTE
    return result
  })

  const route = useMemo(() => {
    const lookupResult = $$(lookup)
    const result = lookupResult.route
    return result
  })

  const params = useMemo(() => {
    const lookupResult = $$(lookup)
    const result = lookupResult.params
    return result
  })

  const searchParams = useMemo(() => {
    const s = $$(search)
    const result = new URLSearchParams(s)
    return result
  }) //TODO: Maybe update the URL too? Maybe push an entry into the history? Maybe react to individual changes()

  const loaderContext = () => ({ pathname: pathname(), search: search(), hash: hash(), params: params(), searchParams: searchParams(), route: route() })
  const loader = useMemo(() => {
    const result = useResource(() => (route().loader || NOOP)(untrack(loaderContext)))
    return result
  })

  // Provide context for descendant custom elements
  // Children rendered within context() can reactively track observables
  const stateValue = { pathname, search, hash, navigate, params, searchParams, route, loader }

  route().path //do not remove, to trigger content changes

  setPendingContextWrap((fn: () => void) => context({ [State.symbol]: stateValue }, fn))

  return context({ [State.symbol]: stateValue }, () => {
    const children = props.children
    const result = typeof children === 'function' ? children() : children
    return result
  })

})

// Register as custom element
customElement('woby-router', Router)

// Type augmentation for JSX support
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'woby-router': ElementAttributes<typeof Router>
    }
  }
}

/* EXPORT */

export default Router
