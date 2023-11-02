
/* IMPORT */

import { untrack, type JSX } from 'woby'
import useRoute from '../hooks/use_route'

/* MAIN */

const Route = (): JSX.Element => {

    const route = useRoute()

    return (): JSX.Element => {

        const to = route().to

        return (): JSX.Element => {

            return untrack(to) as any

        }

    }

}

/* EXPORT */

export default Route
