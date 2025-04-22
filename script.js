// Конфигурация игры
const config = {
    prices: {
        food: 10,
        toy: 20,
        clothes: 50,
        premium: 100
    },
    xpPerAction: 5,
    xpToLevel: 100
};

// Состояние игры
const state = {
    stats: {
        hunger: 80,
        happiness: 70,
        energy: 90
    },
    coins: 250,
    xp: 0,
    level: 1,
    currentTab: 'pet',
    petState: 'happy',
    lastActionTime: Date.now(),
    inventory: {
        food: 3,
        toys: 1,
        clothes: 0
    }
};

// DOM элементы
const el = {
    // Статистика
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    coinsDisplay: document.getElementById('coins'),
    xpProgress: document.getElementById('xp-progress'),
    levelDisplay: document.getElementById('level'),
    
    // Питомец
    petImage: document.getElementById('pet-image'),
    speechBubble: document.getElementById('speech-bubble'),
    moodIndicator: document.getElementById('mood-indicator'),
    
    // Кнопки
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    sleepBtn: document.getElementById('sleep-btn'),
    
    // Навигация
    tabButtons: document.querySelectorAll('.tab-btn'),
    screens: document.querySelectorAll('.screen'),
    
    // Уведомления
    notification: document.getElementById('notification'),
    
    // Эффекты
    effectsContainer: document.getElementById('effects-container')
};

// Фразы питомца
const phrases = {
    happy: [
        "Гав-гав!",
        "Я тебя люблю!",
        "Поиграем?",
        "Почеши пузико!",
        "Ты лучший хозяин!"
    ],
    hungry: [
        "Я голодный!",
        "Хочу есть!",
        "Где моя еда?",
        "🍗🍗🍗",
        "Покорми меня!"
    ],
    sad: [
        "Мне грустно...",
        "Почему ты меня игнорируешь?",
        "Я скучаю...",
        "😢",
        "Мне нужно внимание!"
    ]
};

// Инициализация Telegram WebApp
function initTelegramApp() {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.enableClosingConfirmation();
}

// Обновление интерфейса
function updateUI() {
    // Статистика
    el.hungerBar.style.width = `${state.stats.hunger}%`;
    el.happinessBar.style.width = `${state.stats.happiness}%`;
    el.energyBar.style.width = `${state.stats.energy}%`;
    el.coinsDisplay.textContent = state.coins;
    el.xpProgress.style.width = `${(state.xp / config.xpToLevel) * 100}%`;
    el.levelDisplay.textContent = state.level;
    
    // Состояние питомца
    updatePetState();
}

// Обновление состояния питомца
function updatePetState() {
    if (state.stats.hunger < 30 || state.stats.happiness < 30) {
        state.petState = 'sad';
    } else if (state.stats.hunger < 60 || state.stats.happiness < 60) {
        state.petState = 'hungry';
    } else {
        state.petState = 'happy';
    }
    
    // Обновление изображения
    el.petImage.src = `images/dog_${state.petState}.png`;
    
    // Обновление индикатора настроения
    updateMoodIndicator();
}

// Обновление индикатора настроения
function updateMoodIndicator() {
    let emoji, color;
    
    switch(state.petState) {
        case 'happy':
            emoji = '😊';
            color = '#00CEC9';
            break;
        case 'hungry':
            emoji = '😋';
            color = '#FDCB6E';
            break;
        case 'sad':
            emoji = '😢';
            color = '#FF7675';
            break;
    }
    
    el.moodIndicator.textContent = emoji;
    el.moodIndicator.style.background = color;
}

// Показать облачко с речью
function showSpeech(text) {
    el.speechBubble.textContent = text;
    el.speechBubble.style.opacity = '1';
    el.speechBubble.style.top = '0';
    
    setTimeout(() => {
        el.speechBubble.style.opacity = '0';
    }, 2000);
}

// Показать уведомление
function showNotification(text) {
    el.notification.textContent = text;
    el.notification.style.opacity = '1';
    
    setTimeout(() => {
        el.notification.style.opacity = '0';
    }, 2000);
}

// Создать эффект сердечек
function createHearts(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-effect';
            heart.textContent = '❤️';
            heart.style.left = `${40 + Math.random() * 20}%`;
            heart.style.fontSize = `${20 + Math.random() * 10}px`;
            heart.style.animationDuration = `${2 + Math.random()}s`;
            el.effectsContainer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 200);
    }
}

// Создать эффект монет
function createCoins(count = 3) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.className = 'coin-effect';
            coin.textContent = '💰';
            coin.style.left = `${30 + Math.random() * 40}%`;
            coin.style.fontSize = `${20 + Math.random() * 10}px`;
            el.effectsContainer.appendChild(coin);
            
            setTimeout(() => coin.remove(), 1000);
        }, i * 100);
    }
}

// Добавить опыт
function addXP(amount) {
    state.xp += amount;
    
    if (state.xp >= config.xpToLevel) {
        state.level++;
        state.xp = state.xp - config.xpToLevel;
        showNotification(`🎉 Уровень ${state.level}!`);
    }
    
    updateUI();
}

// Кормление
function feed() {
    if (state.stats.hunger >= 100) {
        showSpeech("Я не голоден!");
        return;
    }
    
    if (state.inventory.food <= 0) {
        showNotification("Нет еды! Купите в магазине");
        return;
    }
    
    state.inventory.food--;
    state.stats.hunger = Math.min(100, state.stats.hunger + 30);
    state.stats.happiness = Math.min(100, state.stats.happiness + 10);
    state.lastActionTime = Date.now();
    
    // Анимации
    el.petImage.src = 'images/dog_eating.gif';
    createHearts();
    addXP(config.xpPerAction);
    
    setTimeout(() => {
        updatePetState();
        showSpeech("Вкусно!");
    }, 2000);
    
    updateUI();
}

// Игра
function play() {
    if (state.stats.energy < 20) {
        showSpeech("Я устал...");
        return;
    }
    
    state.stats.happiness = Math.min(100, state.stats.happiness + 30);
    state.stats.energy = Math.max(0, state.stats.energy - 20);
    state.stats.hunger = Math.max(0, state.stats.hunger - 10);
    state.lastActionTime = Date.now();
    
    // Анимации
    el.petImage.src = 'images/dog_playing.gif';
    createHearts(8);
    addXP(config.xpPerAction);
    
    setTimeout(() => {
        updatePetState();
        showSpeech("Это было весело!");
    }, 3000);
    
    updateUI();
}

// Сон
function sleep() {
    if (state.petState === 'sleeping') return;
    
    state.petState = 'sleeping';
    el.petImage.src = 'images/dog_sleeping.gif';
    disableButtons();
    
    setTimeout(() => {
        state.stats.energy = 100;
        state.stats.hunger = Math.max(0, state.stats.hunger - 15);
        updatePetState();
        showSpeech("Я выспался!");
        enableButtons();
        addXP(config.xpPerAction * 2);
    }, 5000);
    
    updateUI();
}

// Переключение вкладок
function switchTab(tabId) {
    state.currentTab = tabId;
    
    // Обновление активной кнопки
    el.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Обновление экранов
    el.screens.forEach(screen => {
        screen.classList.toggle('active', screen.dataset.tab === tabId);
    });
}

// Отключение кнопок
function disableButtons() {
    el.feedBtn.disabled = true;
    el.playBtn.disabled = true;
    el.sleepBtn.disabled = true;
}

// Включение кнопок
function enableButtons() {
    el.feedBtn.disabled = false;
    el.playBtn.disabled = false;
    el.sleepBtn.disabled = false;
}

// Игровой цикл
function gameLoop() {
    const now = Date.now();
    const hoursPassed = (now - state.lastActionTime) / (1000 * 60 * 60);
    
    if (hoursPassed > 4) {
        state.stats.hunger = Math.max(0, state.stats.hunger - 10);
        state.stats.happiness = Math.max(0, state.stats.happiness - 15);
    } else if (hoursPassed > 2) {
        state.stats.hunger = Math.max(0, state.stats.hunger - 5);
        state.stats.happiness = Math.max(0, state.stats.happiness - 5);
    }
    
    if (state.petState !== 'sleeping') {
        state.stats.energy = Math.max(0, state.stats.energy - 2);
    }
    
    updateUI();
}

// Инициализация игры
function initGame() {
    initTelegramApp();
    updateUI();
    
    // Обработчики событий
    el.feedBtn.addEventListener('click', feed);
    el.playBtn.addEventListener('click', play);
    el.sleepBtn.addEventListener('click', sleep);
    
    // Клик по питомцу
    el.petImage.addEventListener('click', () => {
        if (state.petState === 'happy') {
            const randomPhrase = phrases.happy[Math.floor(Math.random() * phrases.happy.length)];
            showSpeech(randomPhrase);
        } else if (state.petState === 'hungry') {
            const randomPhrase = phrases.hungry[Math.floor(Math.random() * phrases.hungry.length)];
            showSpeech(randomPhrase);
        } else if (state.petState === 'sad') {
            const randomPhrase = phrases.sad[Math.floor(Math.random() * phrases.sad.length)];
            showSpeech(randomPhrase);
        }
    });
    
    // Переключение вкладок
    el.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Игровой цикл
    setInterval(gameLoop, 60000);
    
    // Приветственное сообщение
    setTimeout(() => {
        showSpeech("Привет, хозяин! Давай дружить!");
    }, 1000);
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
