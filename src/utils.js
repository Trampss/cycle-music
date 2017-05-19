import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { ANIMATION_TIMEOUT } from './constants'

export const addDelay = (stream$, time = ANIMATION_TIMEOUT) =>
  stream$ && stream$.compose(delay(time))

export const getNumber = (stream$, timeout = ANIMATION_TIMEOUT) => {
  return xs
    .merge(
      stream$.mapTo(1),
      addDelay(stream$, timeout).mapTo(-1),
    )
    .fold((acc, curr) => acc + curr, 0)
}

export const getClassNameFromNumber = (nb) => {
  if (nb === 0) return ''
  return `.animate .animate-${nb}`
}
