
/* IMPORT */

import { $$, useContext, useMemo } from 'woby'
import State, { routerState$ } from '../contexts/state'
import type { RouterState } from '../types'

/* MAIN */

const useState = (): RouterState => {
    const ctxState = useContext(State)

    // For TSX usage, useContext(State) returns the state directly.
    // For custom elements (woby-route shadow DOM), useContext returns undefined
    // due to the timing issue — fall back to the module-level routerState$.
    if (ctxState) return ctxState

    // Return a reactive proxy that always reads from routerState$
    return {
        pathname: useMemo(() => $$($$(routerState$)?.pathname)),
        search: useMemo(() => $$($$(routerState$)?.search)),
        hash: useMemo(() => $$($$(routerState$)?.hash)),
        navigate: (path: any, options?: any) => $$(routerState$)?.navigate?.(path, options),
        params: useMemo(() => $$($$(routerState$)?.params)),
        searchParams: useMemo(() => $$($$(routerState$)?.searchParams)),
        route: useMemo(() => $$($$(routerState$)?.route)),
        loader: useMemo(() => $$($$(routerState$)?.loader)),
    } as RouterState
}

/* EXPORT */

export default useState
