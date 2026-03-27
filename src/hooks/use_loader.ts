
/* IMPORT */

import { untrack } from 'woby'
import useState from '../hooks/use_state'
import type { Resource } from '../types'

/* MAIN */

const useLoader = <T = unknown>(): Resource<T> => {

    const state = useState()
    return state ? untrack(state.loader) : undefined

}

/* EXPORT */

export default useLoader
