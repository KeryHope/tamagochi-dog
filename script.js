// Конфигурация игры
const CONFIG = {
    // Настройки параметров
    STATS: {
        HUNGER_DECREASE: 0.5, // % в минуту
        HAPPINESS_DECREASE: 0.3,
        ENERGY_DECREASE: 0.2,
        
        FEED_AMOUNT: 30,
        PLAY_AMOUNT: 25,
        CARE_AMOUNT: 40
    },
    
    // Настройки магазина
    SHOP_ITEMS: {
        FOOD: [
            { id: 'food1', name: 'Обычный корм', price: 20, image: 'food1.png', effect: { hunger: 30 } },
            { id: 'food2', name: 'Премиум корм', price: 50, image: 'food2.png', effect: { hunger: 50, happiness: 10 } }
        ],
        TOYS: [
            { id: 'toy1', name: 'Мячик', price: 30, image: 'ball.png', effect: { happiness: 20 } },
            { id: 'toy2', name: 'Кость', price: 50, image: 'bone.png', effect: { happiness: 35 } }
        ]
    },
    
    // Настройки прогресса
    XP_PER_ACTION: 10,
    XP_TO_LEVEL: 100,
    COINS_PER_LEVEL: 50
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
    lastAction: Date.now()
};

// DOM элементы
const elements = {
    pet: document.getElementById('pet'),
    level: document.getElementById('level'),
    coins: document.getElementById('coins'),
    xpProgress: document.getElementById('xp-progress'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    speechBubble: document.getElementById('speech-bubble'),
    moodLight: document.getElementById('mood-light'),
    notification: document.getElementById('notification'),
    effectsLayer: document.getElementById('effects-layer'),
    
    // Кнопки
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    careBtn: document.getElementById('care-btn'),
    shopBtn: document.getElementById('shop-btn'),
    
    // Модальные окна
    shopModal: document.getElementById('shop-modal'),
    closeBtns: document.querySelectorAll('.close-btn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    shopItems: {
        food: document.getElementById('food-items'),
        toys: document.getElementById('toys-items')
    }
};

// Инициализация игры
function initGame() {
    updateUI();
    setupEventListeners();
    startGameLoop();
    
    // Загружаем товары в магазин
    loadShopItems();
    
    // Первое сообщение
    setTimeout(() => {
        showSpeech("Привет! Я твой новый питомец!");
    }, 1000);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Основные кнопки
    elements.feedBtn.addEventListener('click', feed);
    elements.playBtn.addEventListener('click', play);
    elements.careBtn.addEventListener('click', care);
    elements.shopBtn.addEventListener('click', () => {
        elements.shopModal.style.display = 'flex';
    });
    
    // Клик по питомцу
    elements.pet.addEventListener('click', pet);
    
    // Закрытие модальных окон
    elements.closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.shopModal.style.display = 'none';
        });
    });
    
    // Переключение вкладок магазина
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            Object.values(elements.shopItems).forEach(el => el.classList.add('hidden'));
            elements.shopItems[category].classList.remove('hidden');
        });
    });
}

// Загрузка товаров в магазин
function loadShopItems() {
    for (const category in CONFIG.SHOP_ITEMS) {
        CONFIG.SHOP_ITEMS[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <img src="images/items/${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.price} монет</p>
                <button class="buy-btn" data-id="${item.id}" data-price="${item.price}">Купить</button>
            `;
            
            elements.shopItems[category].appendChild(itemElement);
        });
    }
    
    // Обработчики для кнопок покупки
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const price = parseInt(this.dataset.price);
            if (gameState.coins >= price) {
                gameState.coins -= price;
                updateUI();
                showNotification(`Куплено! Осталось: ${gameState.coins} монет`);
                
                // Добавляем эффект
                createCoinsEffect(this, -price);
            } else {
                showNotification('Недостаточно монет!');
            }
        });
    });
}

// Основные действия
function feed() {
    if (gameState.inventory.food <= 0) {
        showNotification('Нет еды! Купите в магазине');
        return;
    }
    
    gameState.inventory.food--;
    gameState.stats.hunger = Math.min(100, gameState.stats.hunger + CONFIG.STATS.FEED_AMOUNT);
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + 5);
    gameState.lastAction = Date.now();
    
    // Анимация
    elements.pet.src = 'images/pet/eating.png';
    setTimeout(() => {
        elements.pet.src = 'images/pet/default.png';
    }, 1500);
    
    addXP(CONFIG.XP_PER_ACTION);
    showSpeech("Вкусно! Спасибо!");
    createHeartsEffect();
}

function play() {
    if (gameState.stats.energy < 20) {
        showSpeech("Я устал...");
        return;
    }
    
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + CONFIG.STATS.PLAY_AMOUNT);
    gameState.stats.energy = Math.max(0, gameState.stats.energy - 15);
    gameState.stats.hunger = Math.max(0, gameState.stats.hunger - 10);
    gameState.lastAction = Date.now();
    
    // Анимация
    elements.pet.src = 'images/pet/playing.png';
    setTimeout(() => {
        elements.pet.src = 'images/pet/default.png';
    }, 2000);
    
    addXP(CONFIG.XP_PER_ACTION);
    showSpeech("Это было весело!");
    createHeartsEffect(8);
}

function care() {
    gameState.stats.energy = Math.min(100, gameState.stats.energy + CONFIG.STATS.CARE_AMOUNT);
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + 10);
    gameState.lastAction = Date.now();
    
    // Анимация
    elements.pet.src = 'images/pet/sleeping.png';
    setTimeout(() => {
        elements.pet.src = 'images/pet/default.png';
        showSpeech("Я отдохнул!");
    }, 3000);
    
    addXP(CONFIG.XP_PER_ACTION);
}

function pet() {
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + 5);
    elements.pet.style.transform = 'scale(1.1)';
    setTimeout(() => {
        elements.pet.style.transform = 'scale(1)';
    }, 300);
    
    showRandomSpeech();
}

// Игровой цикл
function gameLoop() {
    const now = Date.now();
    const minutesPassed = (now - gameState.lastAction) / (1000 * 60);
    
    // Уменьшение параметров со временем
    gameState.stats.hunger = Math.max(0, gameState.stats.hunger - (CONFIG.STATS.HUNGER_DECREASE * minutesPassed));
    gameState.stats.happiness = Math.max(0, gameState.stats.happiness - (CONFIG.STATS.HAPPINESS_DECREASE * minutesPassed));
    gameState.stats.energy = Math.max(0, gameState.stats.energy - (CONFIG.STATS.ENERGY_DECREASE * minutesPassed));
    
    gameState.lastAction = now;
    updateUI();
    
    // Случайные сообщения
    if (Math.random() > 0.95) {
        showRandomSpeech();
    }
    
    setTimeout(gameLoop, 60000); // Обновляем каждую минуту
}

// Обновление интерфейса
function updateUI() {
    // Статистика
    elements.hungerBar.style.width = `${gameState.stats.hunger}%`;
    elements.happinessBar.style.width = `${gameState.stats.happiness}%`;
    elements.energyBar.style.width = `${gameState.stats.energy}%`;
    
    // Прогресс
    elements.level.textContent = gameState.level;
    elements.coins.textContent = gameState.coins;
    elements.xpProgress.style.width = `${(gameState.xp / CONFIG.XP_TO_LEVEL) * 100}%`;
    
    // Подсветка настроения
    updateMoodLight();
}

// Добавление опыта
function addXP(amount) {
    gameState.xp += amount;
    
    if (gameState.xp >= CONFIG.XP_TO_LEVEL) {
        gameState.level++;
        gameState.coins += CONFIG.COINS_PER_LEVEL;
        gameState.xp = gameState.xp - CONFIG.XP_TO_LEVEL;
        showNotification(`🎉 Уровень ${gameState.level}! +${CONFIG.COINS_PER_LEVEL} монет`);
    }
    
    updateUI();
}

// Подсветка настроения
function updateMoodLight() {
    let color, opacity;
    
    if (gameState.stats.hunger < 30 || gameState.stats.happiness < 30) {
        color = 'rgba(255, 107, 107, 0.3)';
        opacity = 0.6;
    } else if (gameState.stats.hunger < 60) {
        color = 'rgba(255, 230, 109, 0.3)';
        opacity = 0.5;
    } else if (gameState.stats.energy < 30) {
        color = 'rgba(78, 205, 196, 0.3)';
        opacity = 0.4;
    } else {
        color = 'rgba(255, 255, 255, 0.3)';
        opacity = 0.8;
    }
    
    elements.moodLight.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;
    elements.moodLight.style.opacity = opacity;
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
            heart.style.animation = `float ${2 + Math.random()}s ease-out forwards`;
            elements.effectsLayer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 200);
    }
}

function createCoinsEffect(element, amount) {
    const coin = document.createElement('div');
    coin.className = 'coin-effect';
    coin.textContent = amount > 0 ? `+${amount}💰` : `${amount}💰`;
    coin.style.left = `${element.getBoundingClientRect().left}px`;
    coin.style.top = `${element.getBoundingClientRect().top}px`;
    coin.style.animation = `float ${1.5}s ease-out forwards`;
    document.body.appendChild(coin);
    
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

function showRandomSpeech() {
    const phrases = [
        "Я тебя люблю!",
        "Поиграем?",
        "Гав-гав!",
        "Чеши мне животик!",
        "Я счастлив!"
    ];
    
    if (gameState.stats.hunger < 30) {
        showSpeech("Я голодный!");
    } else if (gameState.stats.happiness < 30) {
        showSpeech("Мне грустно...");
    } else {
        showSpeech(phrases[Math.floor(Math.random() * phrases.length)]);
    }
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
