
/* IMPORT */

import { $$, type JSX } from 'woby'
    // import type { JSX } from 'woby/jsx-runtime'
    
import useNavigate from '../hooks/use_navigate'
import type { F, RouterPath } from '../types'

/* MAIN */

const Navigate = ({ to, state }: { to: F<RouterPath>, state?: any }): () => JSX.Element => {

    const navigate = useNavigate()

    return ((): undefined => {

        queueMicrotask(() => navigate($$(to), { replace: true, state }))

        return

    }) as any

}

/* EXPORT */

export default Navigate
