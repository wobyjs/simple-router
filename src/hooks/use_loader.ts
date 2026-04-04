
/* IMPORT */

import { untrack, $$ } from 'woby'
import useState from '../hooks/use_state'
import type { Resource } from '../types'

/* MAIN */

const useLoader = <T = unknown>(): Resource<T> => {

    const state = useState()
    if (!state) return undefined as any
    // Unwrap state first, then access loader (which is already an OR<Resource>)
    // Use untrack to avoid re-triggering when loader changes
    return untrack(() => $$($$(state).loader))

}

/* EXPORT */

export default useLoader
