
/* IMPORT */

import useState from '../hooks/use_state'
import type { OR, RouterRoute } from '../types'

/* MAIN */

const useRoute = (): OR<RouterRoute> => {

    const state = useState()
    return state?.route

}

/* EXPORT */

export default useRoute
