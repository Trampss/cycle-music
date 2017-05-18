import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { ANIMATION_TIMEOUT } from './config'

export const addDelay = (stream$, time) => stream$ && stream$.compose(delay(time))

export const getAnimationClasses = (stream$, timeout = ANIMATION_TIMEOUT) => {
  return xs
    .merge(
      stream$.mapTo(1),
      addDelay(stream$, timeout).mapTo(-1),
    )
    .fold((acc, curr) => acc + curr, 0)
    .map((nb) => {
      if (nb === 0) return ''
      return `.animate .animate-${nb}`
    })
}
