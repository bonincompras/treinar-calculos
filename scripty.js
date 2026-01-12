// JavaScript Playground - Edit me!

// State
let count = 0
let totalClicks = 0
let clicksThisSecond = 0
let clickRate = 0

// Messages that show randomly
const messages = [
  'You clicked! 🎉',
  'Keep going! 🚀',
  'Awesome! 💫',
  'Nice one! ⚡',
  'On fire! 🔥',
]

// DOM Elements
const countEl = document.getElementById('count')
const subtitleEl = document.getElementById('subtitle')
const totalClicksEl = document.getElementById('total-clicks')
const clickRateEl = document.getElementById('click-rate')
const incrementBtn = document.getElementById('increment')
const decrementBtn = document.getElementById('decrement')
const actionBtn = document.getElementById('action-btn')

// Update the display
function updateDisplay() {
  countEl.textContent = count
  totalClicksEl.textContent = totalClicks
  clickRateEl.textContent = clickRate
}

// Show random message
function showRandomMessage() {
  const randomIndex = Math.floor(Math.random() * messages.length)
  subtitleEl.textContent = messages[randomIndex]
}

// Click handlers
incrementBtn.addEventListener('click', () => {
  count++
  totalClicks++
  clicksThisSecond++
  updateDisplay()
  showRandomMessage()
  console.log('Count:', count)
})

decrementBtn.addEventListener('click', () => {
  count--
  totalClicks++
  clicksThisSecond++
  updateDisplay()
  showRandomMessage()
  console.log('Count:', count)
})

actionBtn.addEventListener('click', () => {
  count += 10
  totalClicks++
  clicksThisSecond++
  updateDisplay()
  subtitleEl.textContent = '+10 Bonus! 🎁'
  console.log('Bonus! Count:', count)
})

// Calculate clicks per second
setInterval(() => {
  clickRate = clicksThisSecond
  clicksThisSecond = 0
  updateDisplay()
}, 1000)

// Initial render
updateDisplay()
console.log('JavaScript Playground loaded! Try clicking the buttons.')
