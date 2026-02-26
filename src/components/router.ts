
/* IMPORT */

import { $, $$, jsx, untrack, useMemo, useResource, customElement, type ElementAttributes, HtmlString, type JSX, useEffect } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import getBackend from '../backends/backend'
import { FALLBACK_ROUTE, NOOP } from '../constants'
import State from '../contexts/state'
import useRouter from '../hooks/use_router'
import { castPath } from '../utils'
import type { F, RouterBackend, RouterPath, RouterRoute } from '../types'

/* MAIN */

const Router = defaults(() => ({
  backend: $('path' as any, HtmlString) as ObservableMaybe<RouterBackend> | undefined,
  routes: $([] as RouterRoute[]) as ObservableMaybe<RouterRoute[]> | undefined,
  path: $(undefined as any) as ObservableMaybe<F<RouterPath> | undefined> | undefined
}), (props: { backend?: ObservableMaybe<RouterBackend>, routes?: ObservableMaybe<RouterRoute[]>, path?: ObservableMaybe<F<RouterPath> | undefined>, children?: JSX.Children }): JSX.Element => {

  const [location, navigate] = getBackend($$(props.backend) || 'path', $$(props.path))

  const pathname = useMemo(() => castPath($$(location).replace(/[?#].*$/, '')))
  const search = useMemo(() => $$(location).replace(/^.*?(?:\?|$)/, '').replace(/#.*$/, ''))
  const hash = useMemo(() => $$(location).replace(/^.*?(?:#|$)/, ''))

  const router = useRouter($$(props.routes))
  const lookup = useMemo(() => router.route($$(pathname)) || router.route('/404') || FALLBACK_ROUTE)
  const route = useMemo(() => lookup().route)
  const params = useMemo(() => lookup().params)
  const searchParams = useMemo(() => new URLSearchParams(search())) //TODO: Maybe update the URL too? Maybe push an entry into the history? Maybe react to individual changes?

  const loaderContext = () => ({ pathname: pathname(), search: search(), hash: hash(), params: params(), searchParams: searchParams(), route: route() })
  const loader = useMemo(() => useResource(() => (route().loader || NOOP)(untrack(loaderContext))))

  useEffect(() => {
    //@ts-ignore
    const l = $$(lookup) /*solve temp useMemo can't invoke*/
  })

  return jsx(State.Provider, { value: { pathname, search, hash, navigate, params, searchParams, route, loader }, children: props.children })

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
