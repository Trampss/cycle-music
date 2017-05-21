import { img } from '@cycle/dom'
import xs from 'xstream'
import { getNumber, getClassNameFromNumber, addDelay } from '../../../utils'

const model = sources => getNumber(sources.MUSIC$)

const view = state$ => (
  state$
    .map(number => (
      img(
        `.merge ${getClassNameFromNumber(number)}`,
        { props: { src: '/svg/libraries/merge.svg' } },
      )
    ))
)

export default (MUSICS) => {
  const MUSIC$ = xs.merge(...MUSICS)

  return {
    DOM$: view(model({ MUSIC$ })),
    MUSIC$: addDelay(MUSIC$),
  }
}
