
/* IMPORT */

import useState from '../hooks/use_state'
import type { RouterNavigate } from '../types'

/* MAIN */

const useNavigate = (): RouterNavigate => {

    const state = useState()
    return state?.navigate

}

/* EXPORT */

export default useNavigate
