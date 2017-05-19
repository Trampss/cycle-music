import { div, img } from '@cycle/dom'
import xs from 'xstream'
import Instrument from '../instrument'
import { getAnimationClasses } from '../../utils'

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

  // DOM
  const vdom$ = xs
    .combine(
      props$,
      getAnimationClasses(note$),
      instrument.DOM$,
    )
    .map(([props, animationClasses, children]) =>
      div(`.${props.name}`,
        [
          img(
            `.character ${animationClasses}`,
            { props: { src: `/svg/characters/${props.name}.svg` } },
          ),
          children,
        ],
      ),
    )

  return {
    DOM$: vdom$, // combine all flow of dom
    MUSIC$: instrument.MUSIC$, // return flow of Music Wire
  }
}
