
/* IMPORT */

import { $, $$, jsx, customElement, type ElementAttributes, HtmlString, HtmlBoolean, HtmlStyle, type JSX, } from 'woby'
import { defaults } from 'woby'
import type { ObservableMaybe } from 'woby'
import useNavigate from '../hooks/use_navigate'
import type { RouterPath } from '../types'

/* MAIN */



const Link = defaults(() => ({
  to: $('/' as RouterPath as any, HtmlString) as ObservableMaybe<RouterPath> | undefined,
  replace: $(false, HtmlBoolean) as ObservableMaybe<boolean> | undefined,
  state: $(undefined as any) as ObservableMaybe<any> | undefined,
  title: $('', HtmlString) as ObservableMaybe<string> | undefined,
  style: $('', HtmlStyle) as ObservableMaybe<JSX.Style> | undefined,
}), (props: { to?: ObservableMaybe<RouterPath>, replace?: ObservableMaybe<boolean>, state?: ObservableMaybe<any>, title?: ObservableMaybe<string>, style?: ObservableMaybe<JSX.Style>, children?: JSX.Children } & Omit<JSX.IntrinsicElement<'a'>, 'children' | 'href' | 'replace' | 'state' | 'title' | 'style' | 'onClick'>): JSX.Element => {

  const navigate = useNavigate()

  const onClick = (event: MouseEvent): void => {

    event.preventDefault()

    navigate($$(props.to), { replace: $$(props.replace), state: $$(props.state) })

  }

  return jsx('a', { href: $$(props.to), title: $$(props.title), style: $$(props.style), onClick, children: props.children, ...props })

})

// Register as custom element
console.log('Registering woby-link custom element')
customElement('woby-link', Link)
console.log('woby-link custom element registered')

// Type augmentation for JSX support
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'woby-link': ElementAttributes<typeof Link>
    }
  }
}

/* EXPORT */

export default Link
