import { div } from '@cycle/dom'
import Speaker from './speaker'

const view = speaker => speaker.DOM$.map(children => div('.drivers', children))

export default (sources) => {
  const speaker = Speaker(sources)

  return {
    DOM$: view(speaker),
    MUSIC$: speaker.MUSIC$,
  }
}
