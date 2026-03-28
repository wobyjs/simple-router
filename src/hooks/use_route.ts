
/* IMPORT */

import { isObservable } from 'woby'
import useState from '../hooks/use_state'
import type { OR, RouterRoute } from '../types'

/* MAIN */

const useRoute = (): OR<RouterRoute> => {

    console.log('[useRoute] === USEROUTE CALLED ===')
    const state = useState()
    console.log('[useRoute] useState returned:', !!state ? 'has state' : 'null/undefined')
    console.log('[useRoute] state route isObservable:', isObservable(state?.route))

    const route = state?.route
    console.log('[useRoute] Returning route:', route ? 'exists' : 'undefined')
    return route

}

/* EXPORT */

export default useRoute
