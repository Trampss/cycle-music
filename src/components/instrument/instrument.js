import { img } from '@cycle/dom'
import xs from 'xstream'
import { getAnimationClasses, addDelay } from '../../utils'

const className = '.instrument'

export default ({ NOTE$, props$ }) => {
  // Map the note to music
  const music$ = xs
    .combine(NOTE$, props$)
    .map(([note, props]) => ({ ...note, instrument: props.instrument }))

  const vdom$ = xs
    .combine(
      props$,
      getAnimationClasses(NOTE$),
    )
    .map(([props, animationClasses]) => img(
      `${className} ${animationClasses}`,
      { props: { src: `/svg/instruments/${props.instrument}.svg` } },
    ))

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(music$),
  }
}
