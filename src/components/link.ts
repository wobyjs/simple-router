
/* IMPORT */

import { $$, jsx, type JSX } from 'woby'
import useNavigate from '../hooks/use_navigate'
import type { F, RouterPath } from '../types'

/* MAIN */

const Link = ({ to, replace, state, title, children, ...rest }: { to: F<RouterPath>, replace?: boolean, state?: any, title?: F<string>, children?: JSX.Children } & Omit<JSX.IntrinsicElement<'a'>, 'children' | 'href' | 'replace' | 'state' | 'title' | 'onClick'>): JSX.Element => {

    const navigate = useNavigate()

    const onClick = (event: MouseEvent): void => {

        event.preventDefault()

        navigate($$(to), { replace, state })

    }

    return jsx('a', { href: to, title, onClick, children, ...rest })

    // return <a /* href={to} title={title} onClick={onClick} */ {...{ href: to, title, onClick, ...rest }}> {children}</a>

}

{/* const A = ({ to, children }) => {
  const navigate = useNavigate()
  const onClick = event => {
    event.preventDefault()
    console.log(`Navigating to: "${to}"`)
    // Basic navigation, with history.pushState and no state value
    navigate(to)
    // Replace navigation, with history.replaceState, and no state value
    navigate(to, { replace: true })
    // Replace navigation, with history.replaceState, and an arbitrary state value
    navigate(to, { replace: true, state: {} })
  }
  return <a href={ to } onClick = { onClick } > { children } < /a>;
}; */}



/* EXPORT */

export default Link
