// Конфигурация игры
const config = {
  prices: {
    food: 10,
    toy: 20,
    premium: 100
  },
  states: {
    HAPPY: 'happy',
    HUNGRY: 'hungry',
    EATING: 'eating',
    PLAYING: 'playing',
    SLEEPING: 'sleeping',
    SAD: 'sad',
    GONE: 'gone'
  }
};

// Состояние игры
const state = {
  stats: {
    hunger: 100,
    happiness: 100,
    energy: 100
  },
  coins: 50,
  currentState: config.states.HAPPY,
  isSleeping: false,
  lastAction: Date.now()
};

// Инициализация Telegram WebApp
const initTelegramApp = () => {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
  Telegram.WebApp.enableClosingConfirmation();
};

// Анимация сердечек
const createHearts = () => {
  const container = document.createElement('div');
  container.className = 'hearts-container';
  
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.setProperty('--x', Math.random() * 100);
      heart.style.setProperty('--delay', i * 0.2);
      container.appendChild(heart);
      
      setTimeout(() => heart.remove(), 3000);
    }, i * 200);
  }
  
  document.body.appendChild(container);
};

// Обновление UI
const updateUI = () => {
  // Обновляем статус-бары
  document.getElementById('hunger-bar').style.width = `${state.stats.hunger}%`;
  document.getElementById('happiness-bar').style.width = `${state.stats.happiness}%`;
  document.getElementById('energy-bar').style.width = `${state.stats.energy}%`;
  
  // Обновляем монеты
  document.getElementById('coins').textContent = state.coins;
};

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
  initTelegramApp();
  updateUI();
  
  // Обработчики событий
  document.getElementById('feed-btn').addEventListener('click', feed);
  document.getElementById('play-btn').addEventListener('click', play);
  document.getElementById('sleep-btn').addEventListener('click', sleep);
  document.getElementById('shop-btn').addEventListener('click', openShop);
  
  // Игровой цикл
  setInterval(gameLoop, 60000);
});
