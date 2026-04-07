
/* IMPORT */

import { $$ } from 'woby'
import useState from '../hooks/use_state'
import type { RouterNavigateOptions, RouterPath } from '../types'

/* MAIN */

const useNavigate = () =>
    (path: RouterPath, options?: RouterNavigateOptions) => {
        const state = useState()
        return $$(state)?.navigate(path, options)

    }

/* EXPORT */

export default useNavigate
