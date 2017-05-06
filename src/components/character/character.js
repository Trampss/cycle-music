import { div, img } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'
import Wire from '../wire'

export default ({ NOTE$, props$ }) => {
  const tempo = 1000
  const addAnimate = (a, o) => Object.assign({}, o, { animate: a })

  // show the flow of note ( -> character)
  const wireNote = Wire({ NOTE$ })

  // modify the note by character
  const note$ = xs
    .combine(wireNote.NOTE$, props$)
    .filter(([note, props]) => note.character === props.name)
    .map(([note, props]) =>
      Object.assign({}, note, { note: note.note, instrument: props.instrument }))

  // Character wait <tempo> before play the note
  const music$ = note$.compose(delay(tempo))

  // Show flow of music ( -> speaker)
  const wireMusic = Wire({ MUSIC$: music$ })

  // draw character
  const characterDom$ = xs.merge(
    note$.map(m => addAnimate(true, m)),
    music$.map(m => addAnimate(false, m)))
    .startWith(addAnimate(false))

  // Combine all character DOM
  // Draw :
  // - Character, show animation
  // - Note wire ( -> player )
  // - Music wire ( -> speaker )
  const vdom$ = xs
    .combine(
      props$,
      characterDom$,
      wireNote.DOM$,
      wireMusic.DOM$,
    )
    .map(([props, character, wireNoteDom, wireMusicDom]) =>
      div(`.${props.name}`,
        [
          wireNoteDom,
          img(
            `.character ${character.animate ? '.animate' : ''}`,
            { props: { src: `/svg/${props.name}.svg` } },
          ),
          wireMusicDom,
        ],
      ),
    )

  return {
    DOM$: vdom$, // combine all flow of dom
    MUSIC$: wireMusic.MUSIC$, // return flow of Music Wire
  }
}
