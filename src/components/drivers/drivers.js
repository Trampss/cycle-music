import { div } from '@cycle/dom'
import Speaker from '../speaker'

export default ({ MUSIC$ }) => {
  // Create Speaker
  const speaker = Speaker({ MUSIC$ })

  // Combine all dom component
  const vdom$ = speaker.DOM$.map(driversDom => div('.drivers', driversDom))

  return {
    DOM$: vdom$,
    MUSIC$: speaker.MUSIC$,
  }
}
