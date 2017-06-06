import { img } from '@cycle/dom'
import xs from 'xstream'
import { getNumber, getClassNameFromNumber, addDelay } from '../../../utils'

const model = sources => getNumber(sources.MUSICS$)

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
  const MUSICS$ = xs.merge(...MUSICS)

  return {
    DOM$: view(model({ MUSICS$ })),
    MUSICS$: addDelay(MUSICS$),
  }
}
