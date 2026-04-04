
/* IMPORT */

import { useMemo, $$ } from 'woby'
import useState from '../hooks/use_state'
import type { OR } from '../types'

/* MAIN */

const useSearchParams = (): OR<URLSearchParams> => {

    const state = useState()
    return useMemo(() => $$($$(state)?.searchParams))

}

/* EXPORT */

export default useSearchParams
