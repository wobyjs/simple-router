
/* IMPORT */

import { $$, useContext } from 'woby'
import State, { routerState$ } from '../contexts/state'
import type { RouterNavigate, RouterState } from '../types'

/* MAIN */

const useState = (): RouterState => {
    const ctxState = useContext(State)

    // For TSX usage, useContext(State) returns the state directly.
    // For custom elements (woby-route shadow DOM), useContext returns undefined
    // due to the timing issue — fall back to the module-level routerState$.
    if (ctxState) return ctxState

    // Return a reactive proxy that always reads from routerState$ at call time.
    // Using plain getter functions (not useMemo) so this is safe to call outside
    // a reactive scope (e.g. when components are eagerly instantiated in route arrays).
    const proxy = {
        get pathname() { return ($$(routerState$)?.pathname ?? (() => '/' as any)) },
        get search() { return ($$(routerState$)?.search ?? (() => '')) },
        get hash() { return ($$(routerState$)?.hash ?? (() => '')) },
        navigate: ((path: any, options?: any) => $$(routerState$)?.navigate?.(path, options)) as RouterNavigate,
        get params() { return ($$(routerState$)?.params ?? (() => ({} as any))) },
        get searchParams() { return ($$(routerState$)?.searchParams ?? (() => new URLSearchParams())) },
        get route() { return ($$(routerState$)?.route ?? (() => ({} as any))) },
        get loader() { return ($$(routerState$)?.loader ?? (() => undefined as any)) },
    } as unknown as RouterState
    return proxy
}

/* EXPORT */

export default useState
