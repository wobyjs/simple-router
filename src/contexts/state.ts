
/* IMPORT */

import { $, createContext } from 'woby'
import type { RouterState } from '../types'

/* MAIN */

const State = createContext<RouterState>()

// Module-level observable so Router can push state and Route can read it
// reactively — works even when woby context chain is not yet established
// (e.g. woby-route custom element constructs before woby-router's context fires).
export const routerState$ = $<RouterState | undefined>(undefined)

/* EXPORT */

export default State
