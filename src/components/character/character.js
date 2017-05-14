import { div, img } from '@cycle/dom'
import xs from 'xstream'
import Instrument from '../instrument'

export default ({ NOTE$, props$ }) => {
  const addAnimate = (a, o) => Object.assign({}, o, { animate: a })

  // When the note must be playing by character
  const note$ = xs
    .combine(NOTE$, props$).debug()
    .filter(([note, props]) => note.characters[props.name])
    .map(([note]) => note)

  // instrument transform note
  const instrument = Instrument({
    NOTE$: note$,
    props$,
  })

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
    )
    .map(([props, character, instrumentDom]) =>
      div(`.${props.name}`,
        [
          img(
            `.character ${character.animate ? '.animate' : ''}`,
            { props: { src: `/svg/characters/${props.name}.svg` } },
          ),
          instrumentDom,
        ],
      ),
    )

  return {
    DOM$: vdom$, // combine all flow of dom
    MUSIC$: instrument.MUSIC$, // return flow of Music Wire
  }
}
