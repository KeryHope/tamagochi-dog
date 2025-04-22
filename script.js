// Конфигурация игры
const CONFIG = {
    PRICES: {
        FOOD: 20,
        TOY: 50,
        CLOTHES: 100
    },
    XP: {
        PER_ACTION: 10,
        TO_LEVEL: 100
    },
    STATES: {
        HAPPY: 'happy',
        HUNGRY: 'hungry',
        TIRED: 'tired',
        SAD: 'sad'
    }
};

// Состояние игры
const game = {
    stats: {
        hunger: 80,
        happiness: 90,
        energy: 100
    },
    coins: 500,
    xp: 0,
    level: 1,
    state: CONFIG.STATES.HAPPY,
    lastAction: Date.now(),
    inventory: {
        food: 5,
        toys: 2,
        clothes: 0
    }
};

// DOM элементы
const DOM = {
    pet: document.getElementById('super-pet'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    coinsDisplay: document.getElementById('coins'),
    xpProgress: document.getElementById('xp-progress'),
    levelDisplay: document.getElementById('level'),
    speechBubble: document.getElementById('speech-bubble'),
    moodLight: document.getElementById('mood-light'),
    notification: document.getElementById('notification'),
    effectsLayer: document.getElementById('effects-layer'),
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    careBtn: document.getElementById('care-btn'),
    shopBtn: document.getElementById('shop-btn')
};

// Фразы питомца
const PHRASES = {
    HAPPY: [
        "Я так тебя люблю!",
        "Ты лучший хозяин!",
        "Давай поиграем?",
        "Гав-гав!",
        "Почеши мне животик!"
    ],
    HUNGRY: [
        "Я голодный!",
        "Хочу вкусняшку!",
        "Покорми меня!",
        "Где моя еда?",
        "🍗🍗🍗"
    ],
    SAD: [
        "Мне грустно...",
        "Ты меня не любишь?",
        "Почему ты меня игнорируешь?",
        "Я скучаю...",
        "😢😢😢"
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
    DOM.hungerBar.style.width = `${game.stats.hunger}%`;
    DOM.happinessBar.style.width = `${game.stats.happiness}%`;
    DOM.energyBar.style.width = `${game.stats.energy}%`;
    DOM.coinsDisplay.textContent = game.coins;
    
    // Опыт и уровень
    DOM.xpProgress.style.width = `${(game.xp / CONFIG.XP.TO_LEVEL) * 100}%`;
    DOM.levelDisplay.textContent = game.level;
    
    // Состояние питомца
    updatePetState();
}

// Обновление состояния питомца
function updatePetState() {
    if (game.stats.hunger < 30 || game.stats.happiness < 30) {
        game.state = CONFIG.STATES.SAD;
    } else if (game.stats.hunger < 60) {
        game.state = CONFIG.STATES.HUNGRY;
    } else if (game.stats.energy < 30) {
        game.state = CONFIG.STATES.TIRED;
    } else {
        game.state = CONFIG.STATES.HAPPY;
    }
    
    // Обновление внешнего вида
    updatePetAppearance();
}

// Обновление внешнего вида питомца
function updatePetAppearance() {
    // Изменение цвета подсветки
    let lightColor, lightOpacity;
    
    switch(game.state) {
        case CONFIG.STATES.HAPPY:
            lightColor = 'rgba(120, 115, 245, 0.3)';
            lightOpacity = 0.8;
            break;
        case CONFIG.STATES.HUNGRY:
            lightColor = 'rgba(255, 110, 199, 0.3)';
            lightOpacity = 0.6;
            break;
        case CONFIG.STATES.SAD:
            lightColor = 'rgba(255, 110, 199, 0.2)';
            lightOpacity = 0.4;
            break;
        case CONFIG.STATES.TIRED:
            lightColor = 'rgba(255, 200, 69, 0.3)';
            lightOpacity = 0.5;
            break;
    }
    
    DOM.moodLight.style.background = `radial-gradient(circle, ${lightColor} 0%, rgba(255,255,255,0) 70%)`;
    DOM.moodLight.style.opacity = lightOpacity;
    
    // Микровзаимодействия
    if (game.state === CONFIG.STATES.HAPPY) {
        DOM.pet.style.transform = 'scale(1.05)';
        setTimeout(() => {
            DOM.pet.style.transform = 'scale(1)';
        }, 300);
    }
}

// Показать речь
function showSpeech(text) {
    DOM.speechBubble.textContent = text;
    DOM.speechBubble.style.opacity = '1';
    DOM.speechBubble.style.top = '20%';
    
    setTimeout(() => {
        DOM.speechBubble.style.opacity = '0';
    }, 2000);
}

// Показать уведомление
function showNotification(text) {
    DOM.notification.textContent = text;
    DOM.notification.style.opacity = '1';
    
    setTimeout(() => {
        DOM.notification.style.opacity = '0';
    }, 2000);
}

// Добавить опыт
function addXP(amount) {
    game.xp += amount;
    
    if (game.xp >= CONFIG.XP.TO_LEVEL) {
        game.level++;
        game.xp = game.xp - CONFIG.XP.TO_LEVEL;
        showNotification(`🎉 Уровень ${game.level}!`);
    }
    
    updateUI();
}

// Создать эффект сердечек
function createHearts(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-effect';
            heart.innerHTML = '❤️';
            heart.style.left = `${40 + Math.random() * 20}%`;
            heart.style.fontSize = `${24 + Math.random() * 12}px`;
            heart.style.animationDuration = `${2 + Math.random()}s`;
            DOM.effectsLayer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 200);
    }
}

// Кормление
function feed() {
    if (game.stats.hunger >= 100) {
        showSpeech("Я не голоден!");
        return;
    }
    
    if (game.inventory.food <= 0) {
        showNotification("Нет еды! Купите в магазине");
        return;
    }
    
    game.inventory.food--;
    game.stats.hunger = Math.min(100, game.stats.hunger + 30);
    game.stats.happiness = Math.min(100, game.stats.happiness + 10);
    game.lastAction = Date.now();
    
    // Анимации
    createHearts(8);
    addXP(CONFIG.XP.PER_ACTION);
    
    // Временное изменение изображения
    const originalSrc = DOM.pet.src;
    DOM.pet.src = 'images/dog_eating.png';
    
    setTimeout(() => {
        DOM.pet.src = originalSrc;
        showSpeech("Вкусно! Спасибо!");
        updateUI();
    }, 1500);
}

// Игра
function play() {
    if (game.stats.energy < 20) {
        showSpeech("Я устал...");
        return;
    }
    
    game.stats.happiness = Math.min(100, game.stats.happiness + 30);
    game.stats.energy = Math.max(0, game.stats.energy - 20);
    game.stats.hunger = Math.max(0, game.stats.hunger - 10);
    game.lastAction = Date.now();
    
    // Анимации
    createHearts(10);
    addXP(CONFIG.XP.PER_ACTION);
    
    // Временное изменение изображения
    const originalSrc = DOM.pet.src;
    DOM.pet.src = 'images/dog_playing.png';
    
    setTimeout(() => {
        DOM.pet.src = originalSrc;
        showSpeech("Это было весело!");
        updateUI();
    }, 2000);
}

// Уход
function care() {
    if (game.stats.energy >= 90) {
        showSpeech("Я не хочу спать!");
        return;
    }
    
    game.stats.energy = 100;
    game.stats.happiness = Math.min(100, game.stats.happiness + 15);
    game.stats.hunger = Math.max(0, game.stats.hunger - 10);
    game.lastAction = Date.now();
    
    // Анимации
    addXP(CONFIG.XP.PER_ACTION * 2);
    
    // Временное изменение изображения
    const originalSrc = DOM.pet.src;
    DOM.pet.src = 'images/dog_sleeping.png';
    
    setTimeout(() => {
        DOM.pet.src = originalSrc;
        showSpeech("Я выспался!");
        updateUI();
    }, 3000);
}

// Игровой цикл
function gameLoop() {
    const now = Date.now();
    const hoursPassed = (now - game.lastAction) / (1000 * 60 * 60);
    
    if (hoursPassed > 4) {
        game.stats.hunger = Math.max(0, game.stats.hunger - 15);
        game.stats.happiness = Math.max(0, game.stats.happiness - 20);
    } else if (hoursPassed > 2) {
        game.stats.hunger = Math.max(0, game.stats.hunger - 8);
        game.stats.happiness = Math.max(0, game.stats.happiness - 10);
    }
    
    game.stats.energy = Math.max(0, game.stats.energy - 2);
    
    updateUI();
    
    // Случайные фразы
    if (Math.random() > 0.9) {
        showRandomPhrase();
    }
}

// Показать случайную фразу
function showRandomPhrase() {
    if (game.state === CONFIG.STATES.HAPPY) {
        const phrase = PHRASES.HAPPY[Math.floor(Math.random() * PHRASES.HAPPY.length)];
        showSpeech(phrase);
    } else if (game.state === CONFIG.STATES.HUNGRY) {
        const phrase = PHRASES.HUNGRY[Math.floor(Math.random() * PHRASES.HUNGRY.length)];
        showSpeech(phrase);
    } else if (game.state === CONFIG.STATES.SAD) {
        const phrase = PHRASES.SAD[Math.floor(Math.random() * PHRASES.SAD.length)];
        showSpeech(phrase);
    }
}

// Клик по питомцу
DOM.pet.addEventListener('click', () => {
    if (game.state === CONFIG.STATES.HAPPY) {
        DOM.pet.style.transform = 'scale(1.1)';
        setTimeout(() => {
            DOM.pet.style.transform = 'scale(1)';
        }, 300);
        
        showRandomPhrase();
    }
});

// Инициализация игры
function initGame() {
    initTelegramApp();
    updateUI();
    
    // Обработчики событий
    DOM.feedBtn.addEventListener('click', feed);
    DOM.playBtn.addEventListener('click', play);
    DOM.careBtn.addEventListener('click', care);
    
    // Игровой цикл
    setInterval(gameLoop, 60000);
    
    // Приветственное сообщение
    setTimeout(() => {
        showSpeech("Привет! Я твой новый пёсик!");
    }, 1000);
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
