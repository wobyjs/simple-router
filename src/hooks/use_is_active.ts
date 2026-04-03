
/* IMPORT */

import { useContext } from 'woby'
import { LinkContext } from '../components/link'

/* MAIN */

const useIsActive = (): any => {
    const isActive = useContext(LinkContext)
    return isActive ?? false
}

/* EXPORT */

export default useIsActive
