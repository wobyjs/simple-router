
/* IMPORT */

import { createContext } from 'woby'
import type { RouterState } from '../types'

/* MAIN */

const State = createContext<RouterState>()

/* EXPORT */

export default State
