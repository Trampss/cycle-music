import xs from 'xstream'
import { img } from '@cycle/dom'
import { addDelay } from '../../utils'
import { STOP_EVENT } from '../../constant'

export default ({ MUSIC$ }) => {
  // FIXME: the dataflow shouldn't transfert the data stop
  const musicStart$ = MUSIC$.map(m => Object.assign({}, m, { stop: false }))

  // Add a 'stop' event (for animation)
  const musicStop$ = musicStart$
    .map(music => addDelay(xs.of(music), music.time * 1000))
    .flatten()
    .map(music => Object.assign({}, music, STOP_EVENT))

  const music$ = xs.merge(musicStart$, musicStop$)

  const vdom$ = music$
    .startWith(STOP_EVENT)
    .map(music => img(
      `.speaker${music.stop ? '' : '.animate'}`,
       { props: { src: 'svg/drivers/speaker.svg' } },
    ))

  return {
    DOM$: vdom$,
    MUSIC$, // Speaker doesn't transform the music, it just 'print' it
  }
}
