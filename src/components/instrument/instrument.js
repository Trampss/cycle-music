import { img } from '@cycle/dom'
import xs from 'xstream'
import { ANIMATION_TIMEOUT } from '../../config'
import { getAnimationClasses, addDelay } from '../../utils'

const className = '.instrument'

export default ({ NOTE$, props$ }) => {
  // Map the note to music
  const music$ = xs
    .combine(NOTE$, props$)
    .map(([note, props]) => Object.assign({}, note, { instrument: props.instrument }))

  const vdom$ = xs
    .combine(
      getAnimationClasses(NOTE$),
      props$,
    )
    .map(([animationClasses, props]) => img(
      `${className} ${animationClasses}`,
      { props: { src: `/svg/instruments/${props.instrument}.svg` } },
    ))

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(music$, ANIMATION_TIMEOUT),
  }
}
