import { div, img } from '@cycle/dom'
import xs from 'xstream'
import Wire from '../wire'
import Instrument from '../instrument'

export default ({ NOTE$, props$ }) => {
  const addAnimate = (a, o) => Object.assign({}, o, { animate: a })

  // show the flow of note ( -> character)
  const wireNote = Wire({ NOTE$ })

  // When the note must be playing by character
  const note$ = xs
    .combine(wireNote.NOTE$, props$)
    .filter(([note, props]) => note.character === props.name)
    .map(([note]) => note)

  // instrument transform note
  const instrument = Instrument({
    NOTE$: note$,
    props$,
  })

  // Show flow of music ( -> speaker)
  const wireMusic = Wire({ MUSIC$: instrument.MUSIC$ })

  // draw character
  const characterDom$ = xs.merge(
    note$.map(m => addAnimate(true, m)),
    instrument.MUSIC$.map(m => addAnimate(false, m)),
  )
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
      instrument.DOM$,
      wireNote.DOM$,
      wireMusic.DOM$,
    )
    .map(([props, character, instrumentDom, wireNoteDom, wireMusicDom]) =>
      div(`.${props.name}`,
        [
          wireNoteDom,
          img(
            `.character ${character.animate ? '.animate' : ''}`,
            { props: { src: `/svg/characters/${props.name}.svg` } },
          ),
          instrumentDom,
          wireMusicDom,
        ],
      ),
    )

  return {
    DOM$: vdom$, // combine all flow of dom
    MUSIC$: wireMusic.MUSIC$, // return flow of Music Wire
  }
}
