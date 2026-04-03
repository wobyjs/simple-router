
/* IMPORT */

import { useMemo, $$ } from 'woby'
import useState from '../hooks/use_state'
import type { RouterLocation } from '../types'

/* MAIN */

const useLocation = (): RouterLocation => {

    const state = useState()

    if (!state) {
        // Return a default location if context not available
        return { pathname: '/', search: '', hash: '' } as any
    }

    return { pathname: useMemo(() => $$($$(state).pathname)), search: useMemo(() => $$($$(state).search)), hash: useMemo(() => $$($$(state).hash)) }
}

/* EXPORT */

export default useLocation
