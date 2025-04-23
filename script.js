// Конфигурация игры
const CONFIG = {
    // Настройки параметров
    STATS: {
        MAX: 100,
        HUNGER_DECREASE: 0.3,
        HAPPINESS_DECREASE: 0.2,
        ENERGY_DECREASE: 0.1,
        
        FEED_AMOUNT: 25,
        PLAY_AMOUNT: 20,
        CARE_AMOUNT: 30,
        PET_AMOUNT: 5
    },
    
    // Магазин
    SHOP_ITEMS: [
        {
            id: 'food1',
            name: 'Рыбка',
            price: 20,
            image: 'fish.png',
            effect: { hunger: 25 }
        },
        {
            id: 'food2',
            name: 'Молоко',
            price: 40,
            image: 'milk.png',
            effect: { hunger: 40, happiness: 10 }
        },
        {
            id: 'toy1',
            name: 'Мячик',
            price: 30,
            image: 'ball.png',
            effect: { happiness: 25 }
        },
        {
            id: 'toy2',
            name: 'Мышь',
            price: 50,
            image: 'mouse.png',
            effect: { happiness: 40 }
        }
    ],
    
    // Опыт и уровни
    XP: {
        PER_ACTION: 15,
        BASE_LEVEL_UP: 100,
        MULTIPLIER: 1.2
    },
    
    // Награды
    REWARDS: {
        LEVEL_UP: 50,
        DAILY: 100
    },
    
    // Сообщения
    MESSAGES: {
        HAPPY: [
            "Мурррр!",
            "Поиграй со мной!",
            "Я тебя люблю!",
            "Чеши животик!",
            "Мяу!"
        ],
        HUNGRY: [
            "Я голодный!",
            "Дай рыбки!",
            "Хочу есть...",
            "Мяу-мяу!",
            "Ням-ням!"
        ],
        TIRED: [
            "Я устал...",
            "Хочу спать",
            "Отдохну немного",
            "Закрою глазки"
        ],
        SAD: [
            "Мне грустно...",
            "Поиграй со мной",
            "Погладь меня",
            "Я одинокий"
        ]
    },
    
    // Анимации
    ANIMATIONS: {
        IDLE: {
            frames: 4,
            speed: 300,
            path: 'idle'
        },
        EATING: {
            frames: 6,
            speed: 150,
            path: 'eating'
        },
        PLAYING: {
            frames: 8,
            speed: 120,
            path: 'playing'
        },
        SLEEPING: {
            frames: 3,
            speed: 500,
            path: 'sleeping'
        }
    }
};

// Состояние игры
const gameState = {
    stats: {
        hunger: 80,
        happiness: 90,
        energy: 100
    },
    level: 1,
    xp: 0,
    coins: 100,
    inventory: {
        food: 3,
        toys: 1
    },
    lastAction: Date.now(),
    lastPlay: 0,
    currentAnimation: 'idle',
    achievements: {
        feeds: 0,
        plays: 0,
        pets: 0
    }
};

// DOM элементы
const elements = {
    gameContainer: document.querySelector('.game-container'),
    background: document.getElementById('background'),
    petAnimation: document.getElementById('pet-animation'),
    level: document.getElementById('level'),
    coins: document.getElementById('coins'),
    xpProgress: document.getElementById('xp-progress'),
    speechBubble: document.getElementById('speech-bubble'),
    notification: document.getElementById('notification'),
    effectsLayer: document.getElementById('effects-layer'),
    shopModal: document.getElementById('shop-modal'),
    shopItems: document.getElementById('shop-items'),
    
    // Кнопки
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    careBtn: document.getElementById('care-btn'),
    shopBtn: document.getElementById('shop-btn')
};

// Анимации
let animationInterval;
let currentFrame = 0;

// Инициализация игры
function initGame() {
    loadGame();
    setupEventListeners();
    loadShopItems();
    startGameLoop();
    playAnimation('idle');
    
    // Приветственное сообщение
    setTimeout(() => {
        showSpeech("Привет! Я твой новый питомец!");
    }, 1000);
}

// Настройка обработчиков событий
function setupEventListeners() {
    elements.feedBtn.addEventListener('click', feed);
    elements.playBtn.addEventListener('click', play);
    elements.careBtn.addEventListener('click', care);
    elements.shopBtn.addEventListener('click', openShop);
    
    // Клик по питомцу
    elements.petAnimation.addEventListener('click', pet);
    
    // Закрытие модального окна
    document.querySelector('.close-btn').addEventListener('click', closeShop);
}

// Загрузка сохранений
function loadGame() {
    const savedGame = localStorage.getItem('superPetGame');
    if (savedGame) {
        Object.assign(gameState, JSON.parse(savedGame));
        updateUI();
    }
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('superPetGame', JSON.stringify(gameState));
}

// Обновление интерфейса
function updateUI() {
    elements.level.textContent = gameState.level;
    elements.coins.textContent = gameState.coins;
    elements.xpProgress.style.width = `${(gameState.xp / getXpToLevel()) * 100}%`;
    
    // Изменение фона в зависимости от времени суток
    const hour = new Date().getHours();
    elements.background.style.backgroundImage = `url('images/backgrounds/${
        hour > 6 && hour < 20 ? 'day' : 'night'
    }.png')`;
    
    saveGame();
}

// Получение XP для следующего уровня
function getXpToLevel() {
    return CONFIG.XP.BASE_LEVEL_UP * Math.pow(CONFIG.XP.MULTIPLIER, gameState.level - 1);
}

// Игровой цикл
function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        const minutesPassed = (now - gameState.lastAction) / (1000 * 60);
        
        // Уменьшение параметров
        gameState.stats.hunger = Math.max(
            0, 
            gameState.stats.hunger - (CONFIG.STATS.HUNGER_DECREASE * minutesPassed)
        );
        
        gameState.stats.happiness = Math.max(
            0, 
            gameState.stats.happiness - (CONFIG.STATS.HAPPINESS_DECREASE * minutesPassed)
        );
        
        gameState.stats.energy = Math.max(
            0, 
            gameState.stats.energy - (CONFIG.STATS.ENERGY_DECREASE * minutesPassed)
        );
        
        gameState.lastAction = now;
        updateUI();
        
        // Автоматическое возвращение к idle анимации
        if (gameState.currentAnimation !== 'idle' && 
            gameState.currentAnimation !== 'sleeping' &&
            Date.now() - gameState.lastAction > 10000) {
            playAnimation('idle');
        }
        
        // Случайные сообщения
        if (Math.random() > 0.95) {
            showRandomMessage();
        }
    }, 60000); // Каждую минуту
}

// Воспроизведение анимации
function playAnimation(animationName) {
    clearInterval(animationInterval);
    gameState.currentAnimation = animationName;
    
    const animation = CONFIG.ANIMATIONS[animationName.toUpperCase()];
    currentFrame = 0;
    
    // Установка первого кадра
    updateAnimationFrame(animation);
    
    // Запуск анимации
    if (animation.frames > 1) {
        animationInterval = setInterval(() => {
            currentFrame = (currentFrame + 1) % animation.frames;
            updateAnimationFrame(animation);
        }, animation.speed);
    }
}

function updateAnimationFrame(animation) {
    elements.petAnimation.style.backgroundImage = 
        `url('images/pet/${animation.path}/frame${currentFrame + 1}.png')`;
}

// Основные действия
function feed() {
    if (gameState.inventory.food <= 0) {
        showNotification("Нет еды! Купите в магазине");
        return;
    }
    
    gameState.inventory.food--;
    gameState.stats.hunger = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.hunger + CONFIG.STATS.FEED_AMOUNT
    );
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + 5
    );
    gameState.lastAction = Date.now();
    gameState.achievements.feeds++;
    
    playAnimation('eating');
    setTimeout(() => playAnimation('idle'), 2000);
    
    addXP(CONFIG.XP.PER_ACTION);
    showSpeech("Вкусно! Спасибо!");
    createHeartsEffect();
    updateUI();
}

function play() {
    if (gameState.stats.energy < 20) {
        showSpeech("Я устал...");
        return;
    }
    
    // Проверка на спам
    const now = Date.now();
    if (now - gameState.lastPlay < 5000) return;
    gameState.lastPlay = now;
    
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + CONFIG.STATS.PLAY_AMOUNT
    );
    gameState.stats.energy = Math.max(
        0, 
        gameState.stats.energy - 15
    );
    gameState.stats.hunger = Math.max(
        0, 
        gameState.stats.hunger - 10
    );
    gameState.lastAction = now;
    gameState.achievements.plays++;
    
    playAnimation('playing');
    setTimeout(() => playAnimation('idle'), 2500);
    
    addXP(CONFIG.XP.PER_ACTION);
    showSpeech("Это было весело!");
    createHeartsEffect(8);
    updateUI();
}

function care() {
    gameState.stats.energy = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.energy + CONFIG.STATS.CARE_AMOUNT
    );
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + 10
    );
    gameState.lastAction = Date.now();
    
    playAnimation('sleeping');
    setTimeout(() => {
        playAnimation('idle');
        showSpeech("Я отдохнул!");
    }, 3000);
    
    addXP(CONFIG.XP.PER_ACTION);
    updateUI();
}

function pet() {
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + CONFIG.STATS.PET_AMOUNT
    );
    gameState.achievements.pets++;
    gameState.lastAction = Date.now();
    
    // Анимация реакции
    elements.petAnimation.style.transform = 'scale(1.1)';
    setTimeout(() => {
        elements.petAnimation.style.transform = 'scale(1)';
    }, 300);
    
    showRandomMessage();
    createHeartsEffect(3);
    updateUI();
}

// Магазин
function loadShopItems() {
    elements.shopItems.innerHTML = '';
    
    CONFIG.SHOP_ITEMS.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.innerHTML = `
            <img src="images/items/${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>${item.price} монет</p>
            <button class="buy-btn" data-id="${item.id}">Купить</button>
        `;
        
        itemElement.querySelector('.buy-btn').addEventListener('click', () => buyItem(item));
        elements.shopItems.appendChild(itemElement);
    });
}

function openShop() {
    elements.shopModal.style.display = 'flex';
}

function closeShop() {
    elements.shopModal.style.display = 'none';
}

function buyItem(item) {
    if (gameState.coins >= item.price) {
        gameState.coins -= item.price;
        
        // Добавление в инвентарь
        if (item.id.includes('food')) {
            gameState.inventory.food++;
        } else if (item.id.includes('toy')) {
            gameState.inventory.toys++;
        }
        
        showNotification(`Куплено! Осталось: ${gameState.coins} монет`);
        createCoinsEffect(-item.price);
        updateUI();
    } else {
        showNotification('Недостаточно монет!');
    }
}

// Опыт и уровни
function addXP(amount) {
    gameState.xp += amount;
    const xpToLevel = getXpToLevel();
    
    if (gameState.xp >= xpToLevel) {
        gameState.level++;
        gameState.coins += CONFIG.REWARDS.LEVEL_UP;
        gameState.xp = gameState.xp - xpToLevel;
        showNotification(`🎉 Уровень ${gameState.level}! +${CONFIG.REWARDS.LEVEL_UP} монет`);
    }
    
    updateUI();
}

// Эффекты
function createHeartsEffect(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-effect';
            heart.innerHTML = '❤️';
            heart.style.left = `${40 + Math.random() * 20}%`;
            heart.style.top = `${50 + Math.random() * 20}%`;
            elements.effectsLayer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 200);
    }
}

function createCoinsEffect(amount) {
    const coin = document.createElement('div');
    coin.className = 'coin-effect';
    coin.textContent = amount > 0 ? `+${amount}💰` : `${amount}💰`;
    coin.style.left = '50%';
    coin.style.top = '20%';
    elements.effectsLayer.appendChild(coin);
    
    setTimeout(() => coin.remove(), 1500);
}

// Сообщения
function showSpeech(text) {
    elements.speechBubble.textContent = text;
    elements.speechBubble.style.opacity = '1';
    
    setTimeout(() => {
        elements.speechBubble.style.opacity = '0';
    }, 2000);
}

function showRandomMessage() {
    let messages;
    
    if (gameState.stats.hunger < 30) {
        messages = CONFIG.MESSAGES.HUNGRY;
    } else if (gameState.stats.energy < 30) {
        messages = CONFIG.MESSAGES.TIRED;
    } else if (gameState.stats.happiness < 30) {
        messages = CONFIG.MESSAGES.SAD;
    } else {
        messages = CONFIG.MESSAGES.HAPPY;
    }
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showSpeech(randomMessage);
}

function showNotification(text) {
    elements.notification.textContent = text;
    elements.notification.style.opacity = '1';
    
    setTimeout(() => {
        elements.notification.style.opacity = '0';
    }, 2000);
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
