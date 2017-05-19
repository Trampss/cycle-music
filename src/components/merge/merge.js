import { img } from '@cycle/dom'
import xs from 'xstream'
import { getAnimationClasses, addDelay } from '../../utils'

export default ({ MUSICS }) => {
  const music$ = xs.merge(...MUSICS)

  const vdom$ = getAnimationClasses(music$)
    .map(animationClasses =>
      img(
        `.merge ${animationClasses}`,
        { props: { src: '/svg/libraries/merge.svg' } },
      ))

  return {
    DOM$: vdom$,
    MUSICS$: addDelay(music$),
  }
}
