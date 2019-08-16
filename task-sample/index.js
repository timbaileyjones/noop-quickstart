const logger = setInterval(() => console.log('doing task things...'), 1000)
setTimeout(() => {
  process.exit(0)
}, 5000)
