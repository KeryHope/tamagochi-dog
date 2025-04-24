// Конфигурация игры
const CONFIG = {
    STATS: {
        MAX: 100,
        HUNGER_DECREASE: 0.5,
        HAPPINESS_DECREASE: 0.4,
        ENERGY_DECREASE: 0.3,
        FEED_AMOUNT: 30,
        PLAY_AMOUNT: 35,
        CARE_AMOUNT: 50,
        PET_AMOUNT: 10
    },
    
    SHOP_ITEMS: {
        food: [
            {
                id: 'food1',
                name: 'Рыбка',
                price: 25,
                priceType: 'coins',
                image: 'food1.png',
                effect: { hunger: 30 },
                description: 'Восстанавливает сытость'
            },
            {
                id: 'food2',
                name: 'Премиум корм',
                price: 5,
                priceType: 'gems',
                image: 'food2.png',
                effect: { hunger: 50, happiness: 15 },
                description: 'Полное восстановление'
            }
        ],
        toys: [
            {
                id: 'toy1',
                name: 'Мячик',
                price: 40,
                priceType: 'coins',
                image: 'toy1.png',
                effect: { happiness: 30 },
                description: '+30 к счастью'
            },
            {
                id: 'toy2',
                name: 'Игрушка',
                price: 8,
                priceType: 'gems',
                image: 'toy2.png',
                effect: { happiness: 50, energy: 10 },
                description: 'Супер-развлечение'
            }
        ],
        premium: [
            {
                id: 'gem-pack',
                name: 'Набор кристаллов',
                price: 1.99,
                priceType: 'real',
                image: 'gem-pack.png',
                effect: { gems: 15 },
                description: '15 премиум кристаллов'
            },
            {
                id: 'mega-pack',
                name: 'Мега набор',
                price: 4.99,
                priceType: 'real',
                image: 'mega-pack.png',
                effect: { gems: 50, coins: 2000 },
                description: 'Максимальный набор'
            }
        ]
    },
    
    XP: {
        PER_ACTION: 20,
        BASE_LEVEL_UP: 100,
        MULTIPLIER: 1.25
    },
    
    REWARDS: {
        LEVEL_UP_COINS: 150,
        LEVEL_UP_GEMS: 2,
        DAILY_BONUS: 100,
        ACHIEVEMENT_REWARD: 50
    },
    
    MESSAGES: {
        HAPPY: [
            "Я тебя люблю!",
            "Поиграем еще?",
            "Ты лучший хозяин!",
            "Мурррр!",
            "Гав-гав!"
        ],
        HUNGRY: [
            "Я голодный!",
            "Покорми меня!",
            "Хочу вкусняшку!",
            "Где моя еда?",
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
    
    ACHIEVEMENTS: [
        {
            id: 'first_feed',
            name: 'Первый обед',
            description: 'Покормите питомца впервые',
            condition: stats => stats.feeds >= 1,
            reward: 50
        },
        {
            id: 'pet_lover',
            name: 'Любитель животных',
            description: 'Погладьте питомца 50 раз',
            condition: stats => stats.pets >= 50,
            reward: 100
        },
        {
            id: 'play_master',
            name: 'Мастер игр',
            description: 'Поиграйте 30 раз',
            condition: stats => stats.plays >= 30,
            reward: 150
        },
        {
            id: 'rich_owner',
            name: 'Богатый хозяин',
            description: 'Заработайте 5000 монет',
            condition: stats => stats.totalCoins >= 5000,
            reward: 200
        }
    ]
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
    coins: 5000,
    gems: 25,
    inventory: {
        food: 5,
        toys: 2
    },
    lastAction: Date.now(),
    lastPlay: 0,
    lastFeed: 0,
    lastDailyBonus: 0,
    achievements: {
        unlocked: [],
        stats: {
            feeds: 0,
            plays: 0,
            pets: 0,
            totalCoins: 5000
        }
    },
    settings: {
        sound: true,
        notifications: true
    }
};

// DOM элементы
const elements = {
    pet: document.getElementById('pet'),
    petEffects: document.getElementById('pet-effects'),
    level: document.getElementById('level'),
    coins: document.getElementById('coins'),
    gems: document.getElementById('gems'),
    xpProgress: document.getElementById('xp-progress'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    speechBubble: document.getElementById('speech-bubble'),
    notification: document.getElementById('notification'),
    effectsLayer: document.getElementById('effects-layer'),
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    careBtn: document.getElementById('care-btn'),
    shopBtn: document.getElementById('shop-btn'),
    dailyBonusBtn: document.getElementById('daily-bonus-btn'),
    dailyTimer: document.getElementById('daily-timer'),
    shopModal: document.getElementById('shop-modal'),
    closeBtn: document.querySelector('.close-btn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    shopItems: {
        food: document.getElementById('food-items'),
        toys: document.getElementById('toys-items'),
        premium: document.getElementById('premium-items')
    },
    achievementPopup: document.getElementById('achievement-popup'),
    achievementText: document.getElementById('achievement-text')
};

// Инициализация игры
function initGame() {
    loadGame();
    setupEventListeners();
    loadShopItems();
    startGameLoop();
    updatePetState();
    updateDailyBonusTimer();
    
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
    elements.pet.addEventListener('click', pet);
    elements.closeBtn.addEventListener('click', closeShop);
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchShopTab(btn.dataset.tab));
    });
    elements.dailyBonusBtn.addEventListener('click', claimDailyBonus);
}

// Загрузка сохранений
function loadGame() {
    const savedGame = localStorage.getItem('superPetGame');
    if (savedGame) {
        const parsedData = JSON.parse(savedGame);
        const settings = parsedData.settings || gameState.settings;
        Object.assign(gameState, parsedData);
        gameState.settings = settings;
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
    
    const xpPercentage = (gameState.xp / getXpToLevel()) * 100;
    elements.xpProgress.style.width = `${xpPercentage}%`;
    
    elements.hungerBar.style.width = `${gameState.stats.hunger}%`;
    elements.happinessBar.style.width = `${gameState.stats.happiness}%`;
    elements.energyBar.style.width = `${gameState.stats.energy}%`;
    
    saveGame();
}

// Получение XP для следующего уровня
function getXpToLevel() {
    return CONFIG.XP.BASE_LEVEL_UP * Math.pow(CONFIG.XP.MULTIPLIER, gameState.level - 1);
}

// Обновление состояния питомца
function updatePetState() {
    elements.pet.className = 'pet';
    elements.petEffects.style.backgroundImage = '';
    
    if (gameState.stats.hunger < 30 || gameState.stats.happiness < 30) {
        elements.pet.style.backgroundImage = "url('images/pet/hungry.png')";
    } else if (gameState.stats.energy < 30) {
        elements.pet.style.backgroundImage = "url('images/pet/sleep.png')";
    } else if (gameState.stats.happiness > 70) {
        elements.pet.style.backgroundImage = "url('images/pet/happy.png')";
        elements.pet.classList.add('pet-happy');
        elements.petEffects.style.backgroundImage = "url('images/effects/glow.png')";
    } else {
        elements.pet.style.backgroundImage = "url('images/pet/idle.png')";
        elements.pet.classList.add('pet-idle');
    }
}

// Игровой цикл
function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        const minutesPassed = (now - gameState.lastAction) / (1000 * 60);
        
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
        
        if (Math.random() > 0.95) {
            showRandomMessage();
        }
        
        updateDailyBonusTimer();
    }, 60000);
}

// Основные действия
function feed() {
    if (gameState.inventory.food <= 0) {
        showNotification("Нет еды! Купите в магазине");
        playSound('notification.mp3');
        return;
    }
    
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
    gameState.achievements.stats.feeds++;
    
    animatePet('eating');
    createHeartsEffect(3);
    createSparkleEffect();
    
    addXP(CONFIG.XP.PER_ACTION);
    showSpeech("Вкусно! Спасибо!");
    updateUI();
    updatePetState();
    checkAchievements();
    playSound('eat.mp3');
}

function play() {
    if (gameState.stats.energy < 20) {
        showSpeech("Я устал...");
        playSound('notification.mp3');
        return;
    }
    
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
    gameState.achievements.stats.plays++;
    
    animatePet('playing');
    createHeartsEffect(8);
    createSparkleEffect(5);
    
    addXP(CONFIG.XP.PER_ACTION);
    showSpeech("Это было весело!");
    updateUI();
    updatePetState();
    checkAchievements();
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
    gameState.lastAction = Date.now();
    
    animatePet('sleeping');
    createSparkleEffect(3);
    
    setTimeout(() => {
        showSpeech("Я отдохнул!");
        updatePetState();
    }, 2000);
    
    addXP(CONFIG.XP.PER_ACTION);
    updateUI();
    checkAchievements();
    playSound('sleep.mp3');
}

function pet() {
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + CONFIG.STATS.PET_AMOUNT
    );
    gameState.achievements.stats.pets++;
    gameState.lastAction = Date.now();
    
    elements.pet.style.transform = 'scale(1.1)';
    setTimeout(() => {
        elements.pet.style.transform = '';
    }, 300);
    
    createHeartsEffect(2);
    showRandomMessage();
    updateUI();
    updatePetState();
    checkAchievements();
    playSound('click.mp3');
}

// Анимации питомца
function animatePet(action) {
    switch(action) {
        case 'eating':
            elements.pet.style.transform = 'scale(1.1)';
            setTimeout(() => {
                elements.pet.style.transform = '';
            }, 300);
            break;
            
        case 'playing':
            elements.pet.classList.add('pet-excited');
            setTimeout(() => {
                elements.pet.classList.remove('pet-excited');
            }, 1000);
            break;
            
        case 'sleeping':
            const originalBg = elements.pet.style.backgroundImage;
            elements.pet.style.backgroundImage = "url('images/pet/sleep.png')";
            setTimeout(() => {
                elements.pet.style.backgroundImage = originalBg;
            }, 2000);
            break;
    }
}

// Магазин
function loadShopItems() {
    for (const category in CONFIG.SHOP_ITEMS) {
        elements.shopItems[category].innerHTML = '';
        
        CONFIG.SHOP_ITEMS[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            
            const priceDisplay = item.priceType === 'real' 
                ? `$${item.price}` 
                : `<img src="images/ui/${item.priceType}.png"><span>${item.price}</span>`;
            
            itemElement.innerHTML = `
                <img src="images/items/${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price">${priceDisplay}</div>
                <button class="buy-btn" data-id="${item.id}">Купить</button>
            `;
            
            itemElement.querySelector('.buy-btn').addEventListener('click', () => buyItem(item));
            elements.shopItems[category].appendChild(itemElement);
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
    
    for (const category in elements.shopItems) {
        elements.shopItems[category].classList.add('hidden');
    }
    
    elements.shopItems[tabName].classList.remove('hidden');
    playSound('click.mp3');
}

function buyItem(item) {
    if (item.priceType === 'real') {
        showNotification(`Покупка успешна! Получено: ${item.effect.gems ? item.effect.gems + ' кристаллов' : ''} ${item.effect.coins ? item.effect.coins + ' монет' : ''}`);
        
        if (item.effect.gems) {
            gameState.gems += item.effect.gems;
            createCoinsEffect(0, item.effect.gems);
        }
        if (item.effect.coins) {
            gameState.coins += item.effect.coins;
            gameState.achievements.stats.totalCoins += item.effect.coins;
            createCoinsEffect(item.effect.coins, 0);
        }
    } else {
        if (gameState[item.priceType] < item.price) {
            showNotification(`Недостаточно ${item.priceType === 'coins' ? 'монет' : 'кристаллов'}!`);
            playSound('notification.mp3');
            return;
        }
        
        gameState[item.priceType] -= item.price;
        
        if (item.id.includes('food')) {
            gameState.inventory.food++;
        } else if (item.id.includes('toy')) {
            gameState.inventory.toys++;
        }
        
        createCoinsEffect(
            item.priceType === 'coins' ? -item.price : 0,
            item.priceType === 'gems' ? -item.price : 0
        );
        
        showNotification(`Куплено! Осталось: ${gameState[item.priceType]} ${item.priceType === 'coins' ? 'монет' : 'кристаллов'}`);
    }
    
    updateUI();
    checkAchievements();
    playSound('win.mp3');
}

// Ежедневный бонус
function updateDailyBonusTimer() {
    const now = new Date();
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    
    const diff = nextDay - now;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    elements.dailyTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const lastBonusDate = new Date(gameState.lastDailyBonus);
    const today = new Date();
    
    if (lastBonusDate.getDate() !== today.getDate() || 
        lastBonusDate.getMonth() !== today.getMonth() || 
        lastBonusDate.getFullYear() !== today.getFullYear()) {
        elements.dailyBonusBtn.disabled = false;
        elements.dailyBonusBtn.style.opacity = '1';
    } else {
        elements.dailyBonusBtn.disabled = true;
        elements.dailyBonusBtn.style.opacity = '0.7';
    }
}

function claimDailyBonus() {
    const lastBonusDate = new Date(gameState.lastDailyBonus);
    const today = new Date();
    
    if (lastBonusDate.getDate() === today.getDate() && 
        lastBonusDate.getMonth() === today.getMonth() && 
        lastBonusDate.getFullYear() === today.getFullYear()) {
        showNotification("Вы уже получали бонус сегодня!");
        playSound('notification.mp3');
        return;
    }
    
    gameState.coins += CONFIG.REWARDS.DAILY_BONUS;
    gameState.achievements.stats.totalCoins += CONFIG.REWARDS.DAILY_BONUS;
    gameState.lastDailyBonus = Date.now();
    
    showNotification(`Ежедневный бонус: +${CONFIG.REWARDS.DAILY_BONUS} монет!`);
    createCoinsEffect(CONFIG.REWARDS.DAILY_BONUS, 0);
    updateUI();
    updateDailyBonusTimer();
    checkAchievements();
    playSound('win.mp3');
}

// Опыт и уровни
function addXP(amount) {
    gameState.xp += amount;
    const xpToLevel = getXpToLevel();
    
    if (gameState.xp >= xpToLevel) {
        gameState.level++;
        gameState.coins += CONFIG.REWARDS.LEVEL_UP_COINS;
        gameState.gems += CONFIG.REWARDS.LEVEL_UP_GEMS;
        gameState.achievements.stats.totalCoins += CONFIG.REWARDS.LEVEL_UP_COINS;
        gameState.xp = gameState.xp - xpToLevel;
        
        showNotification(`🎉 Уровень ${gameState.level}! +${CONFIG.REWARDS.LEVEL_UP_COINS} монет и +${CONFIG.REWARDS.LEVEL_UP_GEMS} кристаллов`);
        createCoinsEffect(CONFIG.REWARDS.LEVEL_UP_COINS, CONFIG.REWARDS.LEVEL_UP_GEMS);
        checkAchievements();
        playSound('win.mp3');
    }
    
    updateUI();
}

// Достижения
function checkAchievements() {
    CONFIG.ACHIEVEMENTS.forEach(achievement => {
        if (!gameState.achievements.unlocked.includes(achievement.id) && 
            achievement.condition(gameState.achievements.stats)) {
            
            gameState.achievements.unlocked.push(achievement.id);
            gameState.coins += achievement.reward;
            gameState.achievements.stats.totalCoins += achievement.reward;
            
            showAchievement(achievement.name, achievement.description, achievement.reward);
        }
    });
}

function showAchievement(name, description, reward) {
    elements.achievementText.textContent = `${name}: ${description} (+${reward} монет)`;
    elements.achievementPopup.style.bottom = '20px';
    
    setTimeout(() => {
        elements.achievementPopup.style.bottom = '-100px';
    }, 3000);
    
    playSound('win.mp3');
}

// Эффекты
function createHeartsEffect(count = 3) {
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

function createSparkleEffect(count = 3) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.style.left = `${30 + Math.random() * 40}%`;
            sparkle.style.top = `${30 + Math.random() * 40}%`;
            elements.effectsLayer.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }, i * 300);
    }
}

function createCoinsEffect(coins = 0, gems = 0) {
    if (coins > 0) {
        const coin = document.createElement('div');
        coin.className = 'coin-effect';
        coin.textContent = `+${coins}💰`;
        coin.style.left = '50%';
        coin.style.top = '20%';
        elements.effectsLayer.appendChild(coin);
        
        setTimeout(() => coin.remove(), 1500);
    }
    
    if (gems > 0) {
        const gem = document.createElement('div');
        gem.className = 'coin-effect';
        gem.textContent = `+${gems}💎`;
        gem.style.left = '50%';
        gem.style.top = '25%';
        elements.effectsLayer.appendChild(gem);
        
        setTimeout(() => gem.remove(), 1500);
    }
}

// Сообщения
function showSpeech(text) {
    if (!gameState.settings.notifications) return;
    
    elements.speechBubble.textContent = text;
    elements.speechBubble.style.opacity = '1';
    elements.speechBubble.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        elements.speechBubble.style.opacity = '0';
        elements.speechBubble.style.transform = 'translateY(10px)';
    }, 2000);
}

function showRandomMessage() {
    if (!gameState.settings.notifications) return;
    
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
    if (!gameState.settings.notifications) return;
    
    elements.notification.textContent = text;
    elements.notification.style.opacity = '1';
    
    setTimeout(() => {
        elements.notification.style.opacity = '0';
    }, 2000);
}

// Звуки
function playSound(soundFile) {
    if (!gameState.settings.sound) return;
    
    const audio = new Audio(`sounds/${soundFile}`);
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Автовоспроизведение заблокировано"));
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
