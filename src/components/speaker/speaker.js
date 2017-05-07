import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { div } from '@cycle/dom'

export default ({ MUSIC$ }) => {
  // FIXME: the dataflow shouldn't transfert the data stop
  const musicStart$ = MUSIC$.map(m => Object.assign({}, m, { stop: false }))

  // Add a 'stop' event (for animation)
  const musicStop$ = musicStart$
    .map(music => xs.of(music).compose(delay(music.time * 1000)))
    .flatten()
    .map(music => Object.assign({}, music, { stop: true }))

  const music$ = xs.merge(musicStart$, musicStop$)

  const vdom$ = music$
    .startWith({ stop: true }).debug()
    .map(music => div(
      `.speaker${music.stop ? '' : '.animate'}`,
      '🔊',
    ))

  return {
    DOM$: vdom$,
    MUSIC$, // Speaker doesn't transform the music, it just 'print' it
  }
}
