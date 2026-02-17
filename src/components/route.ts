
/* IMPORT */

import { untrack, type JSX } from 'woby'
import useRoute from '../hooks/use_route'

/* MAIN */

const Route = (): JSX.Element => {

    const route = useRoute()

    return (): JSX.Element => {

        const routeValue = route()
        if (!routeValue || !routeValue.to) {
            // If route is not ready or doesn't have a 'to' property, return null
            return () => null
        }

        const to = routeValue.to

        return (): JSX.Element => {

            return untrack(to) as any

        }

    }

}

/* EXPORT */

export default Route
