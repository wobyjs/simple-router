
/* IMPORT */

import { useContext } from 'woby'
import State from '../contexts/state'
import type { RouterState } from '../types'

/* MAIN */

const useState = (): RouterState => {

    const state = useContext(State)

    if (!state) {
        console.error('Router context not found. This may occur during initial render before context is established.')
        // Return a temporary state to avoid breaking the render cycle
        // The router will re-render once context is available
        throw new Error('Router context not found')
    }

    return state

}

/* EXPORT */

export default useState
