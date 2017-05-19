import { img } from '@cycle/dom'
import xs from 'xstream'
import { getAnimationClasses, addDelay } from '../../utils'

export default ({ MUSIC$, NOTE$, HTTP$ }) => {
  const animate$ = xs.merge(
    MUSIC$ || xs.empty(),
    NOTE$ || xs.empty(),
    HTTP$ || xs.empty(),
  )

  const vdom$ = getAnimationClasses(animate$)
    .map(animationClasses =>
      img(
        `.cyclejs ${animationClasses}`,
        { props: { src: '/svg/libraries/cyclejs.svg' } },
      ))

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(MUSIC$),
    NOTE$: addDelay(NOTE$),
    HTTP$: addDelay(HTTP$),
  }
}
