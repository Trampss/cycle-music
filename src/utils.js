import delay from 'xstream/extra/delay'

export const addDelay = (stream$, time) => stream$ && stream$.compose(delay(time))
