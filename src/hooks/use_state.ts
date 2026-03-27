
/* IMPORT */

import { useContext } from 'woby'
import State from '../contexts/state'
import type { RouterState } from '../types'

/* MAIN */

const useState = (): RouterState => {

    const state = useContext(State)

    if (!state) {
        // Context not available yet during custom element initialization
        // Component will re-render once connected to DOM and context provider exists
        return undefined as any
    }

    return state

}

/* EXPORT */

export default useState
