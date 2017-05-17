import { img } from '@cycle/dom'
import xs from 'xstream'
import { ANIMATION_TIMEOUT } from '../../config'
import { STOP_EVENT } from '../../constant'
import { addDelay } from '../../utils'

export default ({ MUSICS }) => {
  const className = '.merge'
  const start$ = xs.merge(...MUSICS)

  // Add a 'stop' event after timeout
  const stop$ = addDelay(start$, ANIMATION_TIMEOUT)
    .map(() => STOP_EVENT)

  const vdom$ = xs.merge(start$, stop$)
    .startWith(STOP_EVENT)
    .map(s =>
      img(
        `${className} ${s.stop ? '' : '.animate'}`,
        { props: { src: '/svg/libraries/merge.svg' } },
      ))

  return {
    DOM$: vdom$,
    MUSICS$: addDelay(start$, ANIMATION_TIMEOUT),
  }
}
