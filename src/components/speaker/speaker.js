import { img } from '@cycle/dom'
import { getAnimationClasses } from '../../utils'

export default ({ MUSIC$ }) => {
  const animation$ = MUSIC$
    .map(music => music.time)

  const vdom$ = getAnimationClasses(animation$)
    .map(animationClasses => img(
      `.speaker ${animationClasses}`,
       { props: { src: 'svg/drivers/speaker.svg' } },
    ))

  return {
    DOM$: vdom$,
    MUSIC$, // Speaker doesn't transform the music, it just 'prints' it
  }
}
