// Конфигурация игры
const CONFIG = {
    // Настройки параметров
    STATS: {
        MAX: 100,
        HUNGER_DECREASE: 0.4,
        HAPPINESS_DECREASE: 0.3,
        ENERGY_DECREASE: 0.2,
        
        FEED_AMOUNT: 30,
        PLAY_AMOUNT: 25,
        CARE_AMOUNT: 40,
        PET_AMOUNT: 5
    },
    
    // Магазин
    SHOP_ITEMS: {
        food: [
            {
                id: 'food1',
                name: 'Рыбка',
                price: 20,
                priceType: 'coins',
                image: 'food1.png',
                effect: { hunger: 25 }
            },
            {
                id: 'food2',
                name: 'Премиум корм',
                price: 5,
                priceType: 'gems',
                image: 'food2.png',
                effect: { hunger: 50, happiness: 10 }
            }
        ],
        toys: [
            {
                id: 'toy1',
                name: 'Мячик',
                price: 30,
                priceType: 'coins',
                image: 'toy1.png',
                effect: { happiness: 25 }
            },
            {
                id: 'toy2',
                name: 'Игрушка',
                price: 8,
                priceType: 'gems',
                image: 'toy2.png',
                effect: { happiness: 40 }
            }
        ],
        premium: [
            {
                id: 'gem-pack',
                name: 'Набор кристаллов',
                price: 1.99,
                priceType: 'real',
                image: 'gem-pack.png',
                effect: { gems: 10 }
            },
            {
                id: 'premium-pack',
                name: 'Премиум набор',
                price: 4.99,
                priceType: 'real',
                image: 'premium-pack.png',
                effect: { gems: 30, coins: 1000 }
            }
        ]
    },
    
    // Опыт и уровни
    XP: {
        PER_ACTION: 15,
        BASE_LEVEL_UP: 100,
        MULTIPLIER: 1.2
    },
    
    // Награды
    REWARDS: {
        LEVEL_UP_COINS: 100,
        LEVEL_UP_GEMS: 1,
        DAILY_BONUS: 50
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
    coins: 1000,
    gems: 10,
    inventory: {
        food: 3,
        toys: 1
    },
    lastAction: Date.now(),
    lastPlay: 0,
    lastFeed: 0,
    achievements: {
        feeds: 0,
        plays: 0,
        pets: 0
    }
};

// DOM элементы
const elements = {
    pet: document.getElementById('pet'),
    level: document.getElementById('level'),
    coins: document.getElementById('coins'),
    gems: document.getElementById('gems'),
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
    shopBtn: document.getElementById('shop-btn'),
    
    // Модальные окна
    closeBtn: document.querySelector('.close-btn'),
    tabBtns: document.querySelectorAll('.tab-btn')
};

// Инициализация игры
function initGame() {
    loadGame();
    setupEventListeners();
    loadShopItems();
    startGameLoop();
    updatePetState();
    
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
    elements.closeBtn.addEventListener('click', closeShop);
    
    // Клик по питомцу
    elements.pet.addEventListener('click', pet);
    
    // Переключение вкладок магазина
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchShopTab(btn.dataset.tab));
    });
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
    elements.gems.textContent = gameState.gems;
    elements.xpProgress.style.width = `${(gameState.xp / getXpToLevel()) * 100}%`;
    
    saveGame();
}

// Получение XP для следующего уровня
function getXpToLevel() {
    return CONFIG.XP.BASE_LEVEL_UP * Math.pow(CONFIG.XP.MULTIPLIER, gameState.level - 1);
}

// Обновление состояния питомца
function updatePetState() {
    if (gameState.stats.hunger < 30 || gameState.stats.happiness < 30) {
        // Грустный
        elements.pet.style.backgroundImage = "url('images/pet/hungry.png')";
    } else if (gameState.stats.energy < 30) {
        // Уставший
        elements.pet.style.backgroundImage = "url('images/pet/sleep.png')";
    } else if (gameState.stats.happiness > 70) {
        // Счастливый
        elements.pet.style.backgroundImage = "url('images/pet/happy.png')";
        elements.pet.classList.add('pet-happy');
    } else {
        // Обычный
        elements.pet.style.backgroundImage = "url('images/pet/idle.png')";
        elements.pet.classList.remove('pet-happy');
    }
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
        updatePetState();
        
        // Случайные сообщения
        if (Math.random() > 0.95) {
            showRandomMessage();
        }
    }, 60000); // Каждую минуту
}

// Основные действия
function feed() {
    if (gameState.inventory.food <= 0) {
        showNotification("Нет еды! Купите в магазине");
        return;
    }
    
    // Проверка на спам
    const now = Date.now();
    if (now - gameState.lastFeed < 3000) return;
    gameState.lastFeed = now;
    
    gameState.inventory.food--;
    gameState.stats.hunger = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.hunger + CONFIG.STATS.FEED_AMOUNT
    );
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + 5
    );
    gameState.lastAction = now;
    gameState.achievements.feeds++;
    
    // Анимация
    elements.pet.style.transform = 'scale(1.1)';
    setTimeout(() => {
        elements.pet.style.transform = 'scale(1)';
    }, 300);
    
    addXP(CONFIG.XP.PER_ACTION);
    showSpeech("Вкусно! Спасибо!");
    createHeartsEffect();
    updateUI();
    updatePetState();
    playSound('eat.mp3');
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
    
    // Анимация
    elements.pet.style.transform = 'scale(0.9)';
    setTimeout(() => {
        elements.pet.style.transform = 'scale(1)';
    }, 300);
    
    addXP(CONFIG.XP.PER_ACTION);
    showSpeech("Это было весело!");
    createHeartsEffect(8);
    updateUI();
    updatePetState();
    playSound('play.mp3');
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
    gameState.lastAction = now;
    
    // Анимация
    elements.pet.style.backgroundImage = "url('images/pet/sleep.png')";
    setTimeout(() => {
        updatePetState();
        showSpeech("Я отдохнул!");
    }, 3000);
    
    addXP(CONFIG.XP.PER_ACTION);
    updateUI();
    playSound('sleep.mp3');
}

function pet() {
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + CONFIG.STATS.PET_AMOUNT
    );
    gameState.achievements.pets++;
    gameState.lastAction = Date.now();
    
    // Анимация
    elements.pet.style.transform = 'scale(1.05)';
    setTimeout(() => {
        elements.pet.style.transform = 'scale(1)';
    }, 300);
    
    showRandomMessage();
    createHeartsEffect(3);
    updateUI();
    updatePetState();
    playSound('meow.mp3');
}

// Магазин
function loadShopItems() {
    elements.shopItems.innerHTML = '';
    
    for (const category in CONFIG.SHOP_ITEMS) {
        CONFIG.SHOP_ITEMS[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <img src="images/items/${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <div class="price">
                    ${item.priceType === 'real' ? `$${item.price}` : `
                        <img src="images/ui/${item.priceType}.png">
                        <span>${item.price}</span>
                    `}
                </div>
                <button class="buy-btn" data-id="${item.id}">Купить</button>
            `;
            
            itemElement.querySelector('.buy-btn').addEventListener('click', () => buyItem(item));
            elements.shopItems.appendChild(itemElement);
        });
    }
}

function openShop() {
    elements.shopModal.style.display = 'flex';
    playSound('click.mp3');
}

function closeShop() {
    elements.shopModal.style.display = 'none';
    playSound('click.mp3');
}

function switchShopTab(tabName) {
    elements.tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    loadShopItems();
    playSound('click.mp3');
}

function buyItem(item) {
    if (item.priceType === 'real') {
        // Реальная покупка (имитация)
        showNotification("Покупка успешно завершена!");
        if (item.effect.gems) gameState.gems += item.effect.gems;
        if (item.effect.coins) gameState.coins += item.effect.coins;
    } else {
        // Покупка за игровую валюту
        if (gameState[item.priceType] >= item.price) {
            gameState[item.priceType] -= item.price;
            
            // Добавление в инвентарь
            if (item.id.includes('food')) {
                gameState.inventory.food++;
            } else if (item.id.includes('toy')) {
                gameState.inventory.toys++;
            }
            
            showNotification(`Куплено! Осталось: ${gameState[item.priceType]} ${item.priceType === 'coins' ? 'монет' : 'кристаллов'}`);
            createCoinsEffect(item.priceType === 'coins' ? -item.price : 0, item.priceType === 'gems' ? -item.price : 0);
        } else {
            showNotification(`Недостаточно ${item.priceType === 'coins' ? 'монет' : 'кристаллов'}!`);
        }
    }
    
    updateUI();
    playSound('click.mp3');
}

// Опыт и уровни
function addXP(amount) {
    gameState.xp += amount;
    const xpToLevel = getXpToLevel();
    
    if (gameState.xp >= xpToLevel) {
        gameState.level++;
        gameState.coins += CONFIG.REWARDS.LEVEL_UP_COINS;
        gameState.gems += CONFIG.REWARDS.LEVEL_UP_GEMS;
        gameState.xp = gameState.xp - xpToLevel;
        showNotification(`🎉 Уровень ${gameState.level}! +${CONFIG.REWARDS.LEVEL_UP_COINS} монет и +${CONFIG.REWARDS.LEVEL_UP_GEMS} кристаллов`);
        playSound('win.mp3');
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

function createCoinsEffect(coins = 0, gems = 0) {
    if (coins !== 0) {
        const coin = document.createElement('div');
        coin.className = 'coin-effect';
        coin.textContent = `${coins > 0 ? '+' : ''}${coins}💰`;
        coin.style.left = '50%';
        coin.style.top = '20%';
        elements.effectsLayer.appendChild(coin);
        
        setTimeout(() => coin.remove(), 1500);
    }
    
    if (gems !== 0) {
        const gem = document.createElement('div');
        gem.className = 'coin-effect';
        gem.textContent = `${gems > 0 ? '+' : ''}${gems}💎`;
        gem.style.left = '50%';
        gem.style.top = '25%';
        elements.effectsLayer.appendChild(gem);
        
        setTimeout(() => gem.remove(), 1500);
    }
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
    playSound('notification.mp3');
}

// Звуки
function playSound(soundFile) {
    const audio = new Audio(`sounds/${soundFile}`);
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Автовоспроизведение заблокировано"));
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
