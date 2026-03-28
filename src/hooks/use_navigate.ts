
/* IMPORT */

import useState from '../hooks/use_state'
import type { RouterNavigate } from '../types'

/* MAIN */

const useNavigate = (): RouterNavigate => {

    const state = useState()
    console.log('[useNavigate] state navigate:', [state?.navigate])
    return state?.navigate

}

/* EXPORT */

export default useNavigate
