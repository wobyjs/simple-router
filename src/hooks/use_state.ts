
/* IMPORT */

import { useContext } from 'woby'
import State from '../contexts/state'
import type { RouterState } from '../types'

/* MAIN */

const useState = (): RouterState => {
    const state = useContext(State) //as Observable< RouterState> 

    if (!state) {
        // Context not available yet during custom element initialization
        // Component will re-render once connected to DOM and context provider exists
        console.warn('[useState] Context not available - returning undefined')
        return undefined as any
    }

    // Unwrap the state observable with $$() to get the actual value
    return (state)
    // console.warn('[useState] isObservable', isObservable($$(state)))
    // const unwrappedState = $$(state)
    // return unwrappedState

}

/* EXPORT */

export default useState
