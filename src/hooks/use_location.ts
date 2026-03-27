
/* IMPORT */

import useState from '../hooks/use_state'
import type { RouterLocation } from '../types'

/* MAIN */

const useLocation = (): RouterLocation => {

    const state = useState()

    if (!state) {
        // Return a default location if context not available
        return { pathname: '/', search: '', hash: '' } as any
    }

    const { pathname, search, hash } = state

    return { pathname, search, hash }

}

/* EXPORT */

export default useLocation
