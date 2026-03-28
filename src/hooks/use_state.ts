
/* IMPORT */

import { useContext } from 'woby'
import State from '../contexts/state'
import type { RouterState } from '../types'

/* MAIN */

const useState = (): RouterState => {

    console.log('[useState] === USESTATE CALLED ===')
    const state = useContext(State)
    console.log('[useState] useContext returned:', !!state ? 'state object' : 'null/undefined')

    if (!state) {
        // Context not available yet during custom element initialization
        // Component will re-render once connected to DOM and context provider exists
        console.log('[useState] State is null/undefined, returning undefined')
        return undefined as any
    }

    console.log('[useState] Returning state with keys:', Object.keys(state))
    return state

}

/* EXPORT */

export default useState
