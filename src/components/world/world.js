import xs from 'xstream'
import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import Rythmbox from '../rythmbox/index'
import Character from '../character/index'
import Speaker from '../speaker/index'
import { CHARACTERS } from '../../config'

export default ({ DOM$ }) => {
  const rythmbox = Rythmbox({ DOM$, props$: xs.of(CHARACTERS) })

  const characters = CHARACTERS.map(props =>
    isolate(Character, `${props.name}-${props.instrument}`)(
      {
        NOTE$: rythmbox.NOTE$,
        props$: xs.of(props),
      },
    ))

  const speaker = Speaker({ MUSIC$: xs.merge(...characters.map(c => c.MUSIC$)) })

  const charactersDom$ = xs
    .combine(...characters.map(c => c.DOM$))
    .map(c => div('.characters', c))

  const vdom$ = xs
    .combine(
      rythmbox.DOM$,
      charactersDom$,
      speaker.DOM$,
    )
    .map(components => div(components))

  const music$ = speaker.MUSIC$

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
