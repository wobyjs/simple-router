
/* IMPORT */

import { useMemo, $$ } from 'woby'
import useState from '../hooks/use_state'
import type { OR, RouterParams } from '../types'

/* MAIN */

const useParams = (): OR<RouterParams> => {

    const state = useState()
    return useMemo(()=> $$($$(state)?.params))

}

/* EXPORT */

export default useParams
