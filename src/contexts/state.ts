
/* IMPORT */

import { createContext } from 'woby'
import type { RouterState } from '../types'

/* MAIN */

const State = createContext<RouterState>()

// DO NOT register State.Provider as a custom element - this breaks context propagation
// customElement('state-provider', State.Provider)

/* EXPORT */

export default State
