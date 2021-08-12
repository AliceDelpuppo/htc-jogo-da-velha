const $switchBot = document.querySelector('.switch-bot')
const $switchPlayer2 = document.querySelector('.switch-player-2')
const $botName = document.querySelector('.bot-name')
const $battlefield = document.querySelectorAll('.field')

$switchBot.addEventListener('click', function(){
    $switchPlayer2.classList.toggle('active-bot')
    $botName.classList.toggle('active-bot')
})

console.log($bot)