import { div, img } from '@cycle/dom'
import xs from 'xstream'
import Instrument from '../instrument'

export default ({ NOTE$, props$ }) => {
  // When the note must be playing by character
  const note$ = xs
    .combine(NOTE$, props$)
    .filter(([note, props]) => note.characters[props.name])
    .map(([note]) => note)

  // instrument transform note
  const instrument = Instrument({
    NOTE$: note$,
    props$,
  })

  // Number of notes that the character is still holding
  const nbNotes$ = xs.merge(
    note$.mapTo(1), // entering
    instrument.MUSIC$.mapTo(-1), // leaving : the note is converted to music
  )
  .fold((acc, curr) => acc + curr, 0)
  .startWith(0)

  // DOM
  const vdom$ = xs
    .combine(
      props$,
      nbNotes$,
      instrument.DOM$,
    )
    .map(([props, nbNotes, instrumentDom]) =>
      div(`.${props.name}`,
        [
          img(
            `.character ${nbNotes > 0 ? '.animate' : ''}`,
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
