import xs from 'xstream'
import { div } from '@cycle/dom'
import Speaker from '../speaker/index'

export default ({ MUSIC$ }) => {
  /*
   Create Speaker
   */
  const speaker = Speaker({ MUSIC$ })

  // Combine all dom component
  const vdom$ = xs
    .combine(
      speaker.DOM$,
    )
    .map(driversDom => div('.drivers', driversDom))

  return {
    DOM$: vdom$,
    MUSIC$: speaker.MUSIC$,
  }
}
