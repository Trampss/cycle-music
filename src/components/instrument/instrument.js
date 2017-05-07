import { img } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { INSTRUMENT_TIMEOUT } from '../../config'
import { STOP_EVENT } from '../../constant'

const addDelay = stream$ => stream$ && stream$.compose(delay(INSTRUMENT_TIMEOUT))
const className = '.instrument'

export default ({ NOTE$, props$ }) => {
  // Map the note to music
  const music$ = xs
    .combine(NOTE$, props$)
    .map(([note, props]) => Object.assign({}, note, { instrument: props.instrument }))

  const stop$ = music$.compose(delay(INSTRUMENT_TIMEOUT))
    .map(() => STOP_EVENT)

  const vdom$ = xs
    .combine(
      xs.merge(music$, stop$).startWith(STOP_EVENT),
      props$,
    )
    .map(([music, props]) => img(
      `${className}${music.stop ? '' : '.animate'}`,
      { props: { src: `/svg/instruments/${props.instrument}.svg` } },
    ))

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(music$),
  }
}
