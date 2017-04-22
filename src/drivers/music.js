const context = new (window.AudioContext || window.webkitAudioContext)()

export default (sink$) => {
  sink$.addListener({ next: note => {
    const { type = 'sine', frequency, time = 200 } = note

    const osc = context.createOscillator()
    osc.type = type
    osc.frequency.value = frequency
    osc.connect(context.destination)
    osc.start()
    osc.stop(context.currentTime + (time / 1000))
  }})
}
