import { img } from '@cycle/dom'
import xs from 'xstream'
import { WIRE_TIMEOUT } from '../../config'
import { STOP_EVENT } from '../../constant'
import { addDelay } from '../../utils'

export default ({ MUSIC$, NOTE$, HTTP$ }) => {
  const className = '.cyclejs'

  const start$ = xs.merge(
    MUSIC$ || xs.empty(),
    NOTE$ || xs.empty(),
    HTTP$ || xs.empty(),
  )

  // Add a 'stop' event after timeout
  const stop$ = addDelay(start$, WIRE_TIMEOUT)
    .map(() => STOP_EVENT)

  const vdom$ = xs.merge(start$, stop$)
    .startWith(STOP_EVENT)
    .map(s =>
      img(
        `${className} ${s.stop ? '' : '.animate'}`,
        { props: { src: '/svg/libraries/cyclejs.svg' } },
      ))

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(MUSIC$, WIRE_TIMEOUT),
    NOTE$: addDelay(NOTE$, WIRE_TIMEOUT),
    HTTP$: addDelay(HTTP$, WIRE_TIMEOUT),
  }
}
