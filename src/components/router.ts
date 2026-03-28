
/* IMPORT */

import { $, $$, jsx, untrack, useMemo, useResource, customElement, type ElementAttributes, HtmlString, type JSX, useEffect, context, SYMBOL_CONTEXT } from 'woby'
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
  routes: $([] as RouterRoute[]) as ObservableMaybe<RouterRoute[]> | undefined,
  path: $(undefined as any) as ObservableMaybe<F<RouterPath> | undefined> | undefined,
  [SYMBOL_CONTEXT]: {} // Mark as context provider
})

const Router = defaults(def, (props): JSX.Element => {

  console.log('[Router] === RENDER START ===')
  const [location, navigate] = getBackend($$(props.backend) || 'path', $$(props.path))
  console.log('[Router] Backend obtained - location:', typeof location, 'navigate:', typeof navigate)

  const pathname = useMemo(() => {
    const loc = $$(location)
    const result = castPath(loc.replace(/[?#].*$/, ''))
    console.log('[Router] pathname computed - location:', loc, '=> pathname:', result)
    return result
  })
  const search = useMemo(() => {
    const loc = $$(location)
    const result = $$(location).replace(/^.*?(?:\?|$)/, '').replace(/#.*$/, '')
    console.log('[Router] search computed - location:', loc, '=> search:', result)
    return result
  })
  const hash = useMemo(() => {
    const loc = $$(location)
    const result = $$(location).replace(/^.*?(?:#|$)/, '')
    console.log('[Router] hash computed - location:', loc, '=> hash:', result)
    return result
  })

  const router = useRouter($$(props.routes))
  console.log('[Router] Router instance created, routes:', $$(props.routes)?.length)

  const lookup = useMemo(() => {
    const pn = $$(pathname)
    const result = router.route(pn) || router.route('/404') || FALLBACK_ROUTE
    console.log('[Router] === LOOKUP COMPUTED ===')
    console.log('[Router] lookup computed - pathname:', pn, 'result route path:', result.route?.path)
    return result
  })

  const route = useMemo(() => {
    const lookupResult = $$(lookup)
    const result = lookupResult.route
    console.log('[Router] === ROUTE OBSERVABLE CREATED ===')
    console.log('[Router] route observable created:', result?.path, 'from lookup:', !!lookupResult)
    return result
  })

  const params = useMemo(() => {
    const lookupResult = $$(lookup)
    const result = lookupResult.params
    console.log('[Router] params computed:', result)
    return result
  })

  const searchParams = useMemo(() => {
    const s = $$(search)
    const result = new URLSearchParams(s)
    console.log('[Router] searchParams computed:', s, '=>', Array.from(result.entries()))
    return result
  }) //TODO: Maybe update the URL too? Maybe push an entry into the history? Maybe react to individual changes()

  const loaderContext = () => ({ pathname: pathname(), search: search(), hash: hash(), params: params(), searchParams: searchParams(), route: route() })
  const loader = useMemo(() => {
    console.log('[Router] loader useMemo starting...')
    const result = useResource(() => (route().loader || NOOP)(untrack(loaderContext)))
    console.log('[Router] loader created:', !!result)
    return result
  })

  useEffect(() => {
    //@ts-ignore
    const l = $$(lookup) /*solve temp useMemo can't invoke*/
    console.log('[Router] === USEEFFECT TRIGGERED ===')
    console.log('[Router] useEffect triggered - current route:', l.route?.path)
  })

  // Provide context for descendant custom elements
  // Children rendered within context() can reactively track observables
  console.log('[Router] About to call context() with route:', route().path)
  console.log('[Router] Context values - pathname:', typeof pathname, 'route:', typeof route)
  return context({ [State.symbol]: { pathname, search, hash, navigate, params, searchParams, route, loader } }, () => {
    console.log('[Router] context() callback executing')
    const children = props.children
    const result = typeof children === 'function' ? children() : children
    console.log('[Router] context() callback done, returning:', !!result)
    return result
  })

})

// Register as custom element
console.log('Registering woby-router custom element')
customElement('woby-router', Router)
console.log('woby-router custom element registered')

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
