/**
 * SuperPet - Ultimate Virtual Pet Game
 * 
 * Основной игровой скрипт с полной функциональностью:
 * - Система ухода за питомцем
 * - Магазин с разными категориями товаров
 * - Ежедневные бонусы
 * - Достижения
 * - Настройки и персонализация
 * - PWA поддержка
 */

// Конфигурация игры
const CONFIG = {
    // Настройки параметров
    STATS: {
        MAX: 100,
        HUNGER_DECREASE: 0.5,
        HAPPINESS_DECREASE: 0.4,
        ENERGY_DECREASE: 0.3,
        HYGIENE_DECREASE: 0.2,
        
        FEED_AMOUNT: 30,
        PLAY_AMOUNT: 25,
        CARE_AMOUNT: 40,
        PET_AMOUNT: 10,
        CLEAN_AMOUNT: 35
    },
    
    // Магазин
    SHOP_ITEMS: {
        food: [
            {
                id: 'food1',
                name: 'Обычный корм',
                price: 20,
                priceType: 'coins',
                image: 'assets/images/items/food1.png',
                effect: { hunger: 25 },
                description: 'Восстанавливает сытость'
            },
            {
                id: 'food2',
                name: 'Вкусный корм',
                price: 50,
                priceType: 'coins',
                image: 'assets/images/items/food2.png',
                effect: { hunger: 40, happiness: 10 },
                description: 'Вкусная еда для питомца'
            },
            {
                id: 'food3',
                name: 'Премиум корм',
                price: 5,
                priceType: 'gems',
                image: 'assets/images/items/food3.png',
                effect: { hunger: 60, happiness: 15, energy: 10 },
                description: 'Элитное питание'
            }
        ],
        toys: [
            {
                id: 'toy1',
                name: 'Мячик',
                price: 30,
                priceType: 'coins',
                image: 'assets/images/items/toy1.png',
                effect: { happiness: 25, energy: -10 },
                description: 'Простая игрушка'
            },
            {
                id: 'toy2',
                name: 'Плюшевая игрушка',
                price: 60,
                priceType: 'coins',
                image: 'assets/images/items/toy2.png',
                effect: { happiness: 40, energy: -15 },
                description: 'Мягкая и приятная'
            },
            {
                id: 'toy3',
                name: 'Интерактивная игрушка',
                price: 8,
                priceType: 'gems',
                image: 'assets/images/items/toy3.png',
                effect: { happiness: 60, hunger: -10 },
                description: 'Супер-развлечение'
            }
        ],
        decor: [
            {
                id: 'decor1',
                name: 'Коврик',
                price: 100,
                priceType: 'coins',
                image: 'assets/images/items/toy1.png',
                effect: { happiness: 15 },
                description: 'Уютный коврик'
            },
            {
                id: 'decor2',
                name: 'Домик',
                price: 250,
                priceType: 'coins',
                image: 'assets/images/items/toy2.png',
                effect: { happiness: 30, energy: 20 },
                description: 'Уютное жилище'
            },
            {
                id: 'decor3',
                name: 'Премиум декор',
                price: 15,
                priceType: 'gems',
                image: 'assets/images/items/toy3.png',
                effect: { happiness: 50, hygiene: 20 },
                description: 'Роскошный декор'
            }
        ],
        premium: [
            {
                id: 'gem-pack-small',
                name: 'Набор кристаллов',
                price: 1.99,
                priceType: 'real',
                image: 'assets/images/ui/gem.png',
                effect: { gems: 15 },
                description: '15 премиум кристаллов'
            },
            {
                id: 'gem-pack-medium',
                name: 'Большой набор',
                price: 3.99,
                priceType: 'real',
                image: 'assets/images/ui/gem.png',
                effect: { gems: 35 },
                description: '35 премиум кристаллов'
            },
            {
                id: 'mega-pack',
                name: 'Мега набор',
                price: 4.99,
                priceType: 'real',
                image: 'assets/images/ui/coin.png',
                effect: { gems: 50, coins: 2000 },
                description: 'Максимальный набор'
            }
        ]
    },
    
    // Опыт и уровни
    XP: {
        PER_ACTION: 15,
        BASE_LEVEL_UP: 100,
        MULTIPLIER: 1.25
    },
    
    // Награды
    REWARDS: {
        LEVEL_UP_COINS: 150,
        LEVEL_UP_GEMS: 2,
        DAILY_BONUS: 100,
        ACHIEVEMENT_REWARD: 50
    },
    
    // Сообщения
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
        ],
        DIRTY: [
            "Я грязный!",
            "Помой меня!",
            "Фу, как неприятно",
            "Нужна ванна!"
        ]
    },
    
    // Достижения
    ACHIEVEMENTS: [
        {
            id: 'first_feed',
            name: 'Первый обед',
            description: 'Покормите питомца впервые',
            condition: stats => stats.feeds >= 1,
            reward: { coins: 50 }
        },
        {
            id: 'pet_lover',
            name: 'Любитель животных',
            description: 'Погладьте питомца 50 раз',
            condition: stats => stats.pets >= 50,
            reward: { coins: 100 }
        },
        {
            id: 'play_master',
            name: 'Мастер игр',
            description: 'Поиграйте 30 раз',
            condition: stats => stats.plays >= 30,
            reward: { coins: 150, gems: 1 }
        },
        {
            id: 'rich_owner',
            name: 'Богатый хозяин',
            description: 'Заработайте 5000 монет',
            condition: stats => stats.totalCoins >= 5000,
            reward: { coins: 200, gems: 5 }
        },
        {
            id: 'daily_player',
            name: 'Ежедневный игрок',
            description: 'Получите бонус 3 дня подряд',
            condition: stats => stats.dailyStreak >= 3,
            reward: { coins: 100, gems: 1 }
        },
        {
            id: 'clean_freak',
            name: 'Чистюля',
            description: 'Помойте питомца 20 раз',
            condition: stats => stats.cleans >= 20,
            reward: { coins: 150 }
        },
        {
            id: 'veteran',
            name: 'Ветеран',
            description: 'Достигните 10 уровня',
            condition: stats => stats.level >= 10,
            reward: { coins: 500, gems: 10 }
        }
    ]
};

// Состояние игры
const gameState = {
    stats: {
        hunger: 80,
        happiness: 70,
        energy: 90,
        hygiene: 85
    },
    level: 1,
    xp: 0,
    coins: 1000,
    gems: 10,
    inventory: {
        food: 5,
        toys: 2,
        decor: 0
    },
    lastAction: Date.now(),
    lastPlay: 0,
    lastFeed: 0,
    lastClean: 0,
    lastDailyBonus: 0,
    dailyStreak: 0,
    petType: 'cat',
    theme: 'day',
    achievements: {
        unlocked: [],
        stats: {
            feeds: 0,
            plays: 0,
            pets: 0,
            cleans: 0,
            totalCoins: 1000,
            dailyStreak: 0,
            level: 1
        }
    },
    settings: {
        sound: true,
        music: true,
        notifications: true
    },
    decor: {
        active: []
    }
};

// DOM элементы
const elements = {
    // Основные элементы
    pet: document.getElementById('pet'),
    petEffects: document.getElementById('pet-effects'),
    level: document.getElementById('level'),
    coins: document.getElementById('coins'),
    gems: document.getElementById('gems'),
    xpProgress: document.getElementById('xp-progress'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    hygieneBar: document.getElementById('hygiene-bar'),
    speechBubble: document.getElementById('speech-bubble'),
    notification: document.getElementById('notification'),
    effectsLayer: document.getElementById('effects-layer'),
    
    // Кнопки
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    careBtn: document.getElementById('care-btn'),
    shopBtn: document.getElementById('shop-btn'),
    dailyBonusBtn: document.getElementById('daily-bonus-btn'),
    dailyTimer: document.getElementById('daily-timer'),
    settingsBtn: document.getElementById('settings-btn'),
    resetBtn: document.getElementById('reset-btn'),
    soundToggle: document.getElementById('sound-toggle'),
    musicToggle: document.getElementById('music-toggle'),
    notificationsToggle: document.getElementById('notifications-toggle'),
    petTypeSelect: document.getElementById('pet-type'),
    themeSelect: document.getElementById('theme-select'),
    
    // Модальные окна
    shopModal: document.getElementById('shop-modal'),
    settingsModal: document.getElementById('settings-modal'),
    closeBtns: document.querySelectorAll('.close-btn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    shopItems: {
        food: document.getElementById('food-items'),
        toys: document.getElementById('toys-items'),
        decor: document.getElementById('decor-items'),
        premium: document.getElementById('premium-items')
    },
    
    // Достижения
    achievementPopup: document.getElementById('achievement-popup'),
    achievementText: document.getElementById('achievement-text'),
    achievementReward: document.querySelector('.achievement-reward'),
    
    // Аудио
    backgroundMusic: document.getElementById('background-music')
};

// Инициализация игры
function initGame() {
    loadGame();
    setupEventListeners();
    renderShopItems();
    startGameLoop();
    updatePetState();
    updateDailyBonusTimer();
    updateTheme();
    updateMusic();
    
    // Приветственное сообщение
    setTimeout(() => {
        showSpeech("Привет! Я твой новый питомец!");
    }, 1000);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Основные действия
    elements.feedBtn.addEventListener('click', feed);
    elements.playBtn.addEventListener('click', play);
    elements.careBtn.addEventListener('click', care);
    elements.shopBtn.addEventListener('click', openShop);
    elements.settingsBtn.addEventListener('click', openSettings);
    
    // Клик по питомцу
    elements.pet.addEventListener('click', pet);
    elements.pet.addEventListener('touchstart', pet, { passive: true });
    
    // Магазин
    elements.closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchShopTab(btn.dataset.tab));
    });
    
    // Ежедневный бонус
    elements.dailyBonusBtn.addEventListener('click', claimDailyBonus);
    
    // Настройки
    elements.soundToggle.addEventListener('change', toggleSound);
    elements.musicToggle.addEventListener('change', toggleMusic);
    elements.notificationsToggle.addEventListener('change', toggleNotifications);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.petTypeSelect.addEventListener('change', changePetType);
    elements.themeSelect.addEventListener('change', changeTheme);
}

// Загрузка сохранений
function loadGame() {
    const savedGame = localStorage.getItem('superPetGame');
    if (savedGame) {
        try {
            const parsedData = JSON.parse(savedGame);
            
            // Сохраняем настройки даже если они не были в сохранении
            const settings = parsedData.settings || gameState.settings;
            const theme = parsedData.theme || 'day';
            const petType = parsedData.petType || 'cat';
            
            Object.assign(gameState, parsedData);
            gameState.settings = settings;
            gameState.theme = theme;
            gameState.petType = petType;
            
            // Обновляем переключатели в настройках
            elements.soundToggle.checked = gameState.settings.sound;
            elements.musicToggle.checked = gameState.settings.music;
            elements.notificationsToggle.checked = gameState.settings.notifications;
            elements.petTypeSelect.value = gameState.petType;
            elements.themeSelect.value = gameState.theme;
            
            updateUI();
        } catch (e) {
            console.error('Ошибка загрузки сохранения:', e);
            resetGame();
        }
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
    elements.hygieneBar.style.width = `${gameState.stats.hygiene}%`;
    
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
    
    // Устанавливаем правильное изображение питомца
    const petImage = getPetImage();
    elements.pet.style.backgroundImage = `url('assets/images/pets/${gameState.petType}/${petImage}.png')`;
    
    if (gameState.stats.hygiene < 30) {
        elements.pet.classList.add('dirty');
    } else if (gameState.stats.hunger < 30 || gameState.stats.happiness < 30) {
        elements.pet.classList.add('sad');
    } else if (gameState.stats.energy < 30) {
        elements.pet.classList.add('tired');
    } else if (gameState.stats.happiness > 70) {
        elements.pet.classList.add('happy');
        elements.petEffects.style.backgroundImage = "url('assets/images/effects/glow.png')";
    } else {
        elements.pet.classList.add('idle');
    }
}

function getPetImage() {
    if (gameState.stats.hygiene < 30) return 'dirty';
    if (gameState.stats.hunger < 30 || gameState.stats.happiness < 30) return 'hungry';
    if (gameState.stats.energy < 30) return 'sleep';
    if (gameState.stats.happiness > 70) return 'happy';
    return 'idle';
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
        
        gameState.stats.hygiene = Math.max(
            0, 
            gameState.stats.hygiene - (CONFIG.STATS.HYGIENE_DECREASE * minutesPassed)
        );
        
        gameState.lastAction = now;
        updateUI();
        updatePetState();
        
        // Случайные сообщения
        if (Math.random() > 0.95) {
            showRandomMessage();
        }
        
        // Обновление таймера ежедневного бонуса
        updateDailyBonusTimer();
    }, 60000); // Каждую минуту
    
    // Анимация питомца
    setInterval(() => {
        if (gameState.stats.happiness > 70 && gameState.stats.energy > 30) {
            elements.pet.style.animation = 'pet-happy 2s infinite';
        } else if (gameState.stats.energy > 30) {
            elements.pet.style.animation = 'pet-idle 3s infinite';
        }
    }, 100);
}

// Основные действия
function feed() {
    if (gameState.inventory.food <= 0) {
        showNotification("Нет еды! Купите в магазине");
        playSound('notification.mp3');
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
    gameState.stats.hygiene = Math.max(
        0, 
        gameState.stats.hygiene - 5
    );
    gameState.lastAction = now;
    gameState.achievements.stats.feeds++;
    
    // Анимация
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
    
    if (gameState.inventory.toys <= 0) {
        showNotification("Нет игрушек! Купите в магазине");
        playSound('notification.mp3');
        return;
    }
    
    // Проверка на спам
    const now = Date.now();
    if (now - gameState.lastPlay < 5000) return;
    gameState.lastPlay = now;
    
    gameState.inventory.toys--;
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
    gameState.stats.hygiene = Math.max(
        0, 
        gameState.stats.hygiene - 10
    );
    gameState.lastAction = now;
    gameState.achievements.stats.plays++;
    
    // Анимация
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
    if (gameState.stats.hygiene < 30) {
        clean();
        return;
    }
    
    gameState.stats.energy = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.energy + CONFIG.STATS.CARE_AMOUNT
    );
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + 10
    );
    gameState.lastAction = Date.now();
    
    // Анимация
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

function clean() {
    // Проверка на спам
    const now = Date.now();
    if (now - gameState.lastClean < 5000) return;
    gameState.lastClean = now;
    
    gameState.stats.hygiene = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.hygiene + CONFIG.STATS.CLEAN_AMOUNT
    );
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + 5
    );
    gameState.stats.energy = Math.max(
        0, 
        gameState.stats.energy - 5
    );
    gameState.lastAction = now;
    gameState.achievements.stats.cleans++;
    
    // Анимация
    animatePet('cleaning');
    createSparkleEffect(5);
    
    addXP(CONFIG.XP.PER_ACTION);
    showSpeech("Теперь я чистый!");
    updateUI();
    updatePetState();
    checkAchievements();
    playSound('clean.mp3');
}

function pet() {
    gameState.stats.happiness = Math.min(
        CONFIG.STATS.MAX, 
        gameState.stats.happiness + CONFIG.STATS.PET_AMOUNT
    );
    gameState.achievements.stats.pets++;
    gameState.lastAction = Date.now();
    
    // Анимация
    elements.pet.style.transform = 'scale(1.1)';
    setTimeout(() => {
        elements.pet.style.transform = '';
    }, 300);
    
    createHeartsEffect(2);
    showRandomMessage();
    updateUI();
    updatePetState();
    checkAchievements();
    playSound('pet.mp3');
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
            elements.pet.style.backgroundImage = `url('assets/images/pets/${gameState.petType}/sleep.png')`;
            setTimeout(() => {
                elements.pet.style.backgroundImage = originalBg;
            }, 2000);
            break;
            
        case 'cleaning':
            elements.pet.style.animation = 'none';
            void elements.pet.offsetWidth; // Trigger reflow
            elements.pet.style.animation = 'pet-happy 0.5s 3';
            break;
    }
}

// Магазин
function renderShopItems() {
    for (const category in CONFIG.SHOP_ITEMS) {
        elements.shopItems[category].innerHTML = '';
        
        CONFIG.SHOP_ITEMS[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            
            const priceDisplay = item.priceType === 'real' 
                ? `$${item.price}` 
                : `<img src="assets/images/ui/${item.priceType}.png"><span>${item.price}</span>`;
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
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

function openSettings() {
    elements.settingsModal.style.display = 'flex';
    playSound('click.mp3');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
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
        // Имитация реальной покупки
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
        // Проверка баланса
        if (gameState[item.priceType] < item.price) {
            showNotification(`Недостаточно ${item.priceType === 'coins' ? 'монет' : 'кристаллов'}!`);
            playSound('notification.mp3');
            return;
        }
        
        // Списание средств
        gameState[item.priceType] -= item.price;
        gameState.achievements.stats.totalCoins -= item.priceType === 'coins' ? item.price : 0;
        
        // Применение эффекта
        if (item.effect.hunger) {
            gameState.stats.hunger = Math.min(CONFIG.STATS.MAX, gameState.stats.hunger + item.effect.hunger);
        }
        if (item.effect.happiness) {
            gameState.stats.happiness = Math.min(CONFIG.STATS.MAX, gameState.stats.happiness + item.effect.happiness);
        }
        if (item.effect.energy) {
            gameState.stats.energy = Math.min(CONFIG.STATS.MAX, gameState.stats.energy + item.effect.energy);
        }
        if (item.effect.hygiene) {
            gameState.stats.hygiene = Math.min(CONFIG.STATS.MAX, gameState.stats.hygiene + item.effect.hygiene);
        }
        
        // Добавление в инвентарь
        if (item.id.includes('food')) {
            gameState.inventory.food++;
        } else if (item.id.includes('toy')) {
            gameState.inventory.toys++;
        } else if (item.id.includes('decor')) {
            gameState.inventory.decor++;
            gameState.decor.active.push(item.id);
        }
        
        // Эффекты
        createCoinsEffect(
            item.priceType === 'coins' ? -item.price : 0,
            item.priceType === 'gems' ? -item.price : 0
        );
        
        showNotification(`Куплено! Осталось: ${gameState[item.priceType]} ${item.priceType === 'coins' ? 'монет' : 'кристаллов'}`);
    }
    
    updateUI();
    updatePetState();
    checkAchievements();
    playSound('win.mp3');
}

// Настройки
function toggleSound() {
    gameState.settings.sound = elements.soundToggle.checked;
    saveGame();
}

function toggleMusic() {
    gameState.settings.music = elements.musicToggle.checked;
    updateMusic();
    saveGame();
}

function updateMusic() {
    if (gameState.settings.music) {
        elements.backgroundMusic.volume = 0.3;
        elements.backgroundMusic.play().catch(e => console.log("Автовоспроизведение заблокировано"));
    } else {
        elements.backgroundMusic.pause();
    }
}

function toggleNotifications() {
    gameState.settings.notifications = elements.notificationsToggle.checked;
    saveGame();
}

function changePetType() {
    gameState.petType = elements.petTypeSelect.value;
    updatePetState();
    saveGame();
}

function changeTheme() {
    gameState.theme = elements.themeSelect.value;
    updateTheme();
    saveGame();
}

function updateTheme() {
    // Удаляем все классы тем
    document.body.classList.remove('night-theme', 'space-theme');
    
    // Добавляем нужный класс
    if (gameState.theme === 'night') {
        document.body.classList.add('night-theme');
        elements.backgroundMusic.src = 'assets/sounds/ambient/night.mp3';
    } else if (gameState.theme === 'space') {
        document.body.classList.add('space-theme');
        elements.backgroundMusic.src = 'assets/sounds/ambient/day.mp3';
    } else {
        elements.backgroundMusic.src = 'assets/sounds/ambient/day.mp3';
    }
    
    if (gameState.settings.music) {
        elements.backgroundMusic.play().catch(e => console.log("Автовоспроизведение заблокировано"));
    }
}

function resetGame() {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
        localStorage.removeItem('superPetGame');
        
        // Сброс состояния игры
        gameState.stats = {
            hunger: 80,
            happiness: 70,
            energy: 90,
            hygiene: 85
        };
        gameState.level = 1;
        gameState.xp = 0;
        gameState.coins = 1000;
        gameState.gems = 10;
        gameState.inventory = {
            food: 5,
            toys: 2,
            decor: 0
        };
        gameState.lastAction = Date.now();
        gameState.lastPlay = 0;
        gameState.lastFeed = 0;
        gameState.lastClean = 0;
        gameState.lastDailyBonus = 0;
        gameState.dailyStreak = 0;
        gameState.petType = 'cat';
        gameState.theme = 'day';
        gameState.achievements = {
            unlocked: [],
            stats: {
                feeds: 0,
                plays: 0,
                pets: 0,
                cleans: 0,
                totalCoins: 1000,
                dailyStreak: 0,
                level: 1
            }
        };
        gameState.settings = {
            sound: true,
            music: true,
            notifications: true
        };
        gameState.decor = {
            active: []
        };
        
        // Обновление UI
        elements.soundToggle.checked = true;
        elements.musicToggle.checked = true;
        elements.notificationsToggle.checked = true;
        elements.petTypeSelect.value = 'cat';
        elements.themeSelect.value = 'day';
        updateUI();
        updatePetState();
        updateTheme();
        updateMusic();
        
        showNotification("Игра сброшена!");
        playSound('notification.mp3');
    }
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
    
    // Проверка доступности бонуса
    const lastBonusDate = new Date(gameState.lastDailyBonus);
    const today = new Date();
    
    // Проверка на новый день
    if (lastBonusDate.getDate() !== today.getDate() || 
        lastBonusDate.getMonth() !== today.getMonth() || 
        lastBonusDate.getFullYear() !== today.getFullYear()) {
        
        // Проверка на последовательные дни
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastBonusDate.getDate() === yesterday.getDate() && 
            lastBonusDate.getMonth() === yesterday.getMonth() && 
            lastBonusDate.getFullYear() === yesterday.getFullYear()) {
            gameState.achievements.stats.dailyStreak++;
            gameState.dailyStreak++;
        } else {
            gameState.achievements.stats.dailyStreak = 0;
            gameState.dailyStreak = 0;
        }
        
        elements.dailyBonusBtn.disabled = false;
        elements.dailyBonusBtn.style.opacity = '1';
    } else {
        elements.dailyBonusBtn.disabled = true;
        elements.dailyBonusBtn.style.opacity = '0.7';
    }
    
    checkAchievements();
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
    
    let bonusMessage = `Ежедневный бонус: +${CONFIG.REWARDS.DAILY_BONUS} монет!`;
    if (gameState.dailyStreak > 0) {
        bonusMessage += ` (Стрик: ${gameState.dailyStreak} дней)`;
    }
    
    showNotification(bonusMessage);
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
        gameState.achievements.stats.level = gameState.level;
        gameState.coins += CONFIG.REWARDS.LEVEL_UP_COINS;
        gameState.gems += CONFIG.REWARDS.LEVEL_UP_GEMS;
        gameState.achievements.stats.totalCoins += CONFIG.REWARDS.LEVEL_UP_COINS;
        gameState.xp = gameState.xp - xpToLevel;
        
        showNotification(`🎉 Уровень ${gameState.level}! +${CONFIG.REWARDS.LEVEL_UP_COINS} монет и +${CONFIG.REWARDS.LEVEL_UP_GEMS} кристаллов`);
        createCoinsEffect(CONFIG.REWARDS.LEVEL_UP_COINS, CONFIG.REWARDS.LEVEL_UP_GEMS);
        createConfettiEffect(10);
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
            
            if (achievement.reward.coins) {
                gameState.coins += achievement.reward.coins;
                gameState.achievements.stats.totalCoins += achievement.reward.coins;
            }
            if (achievement.reward.gems) {
                gameState.gems += achievement.reward.gems;
            }
            
            showAchievement(achievement.name, achievement.description, achievement.reward);
        }
    });
}

function showAchievement(name, description, reward) {
    elements.achievementText.textContent = `${name}: ${description}`;
    
    let rewardText = '';
    if (reward.coins) {
        rewardText += `+${reward.coins} <img src="assets/images/ui/coin.png" style="width:16px;height:16px;">`;
    }
    if (reward.gems) {
        if (rewardText) rewardText += ' ';
        rewardText += `+${reward.gems} <img src="assets/images/ui/gem.png" style="width:16px;height:16px;">`;
    }
    
    elements.achievementReward.innerHTML = rewardText;
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

function createConfettiEffect(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-effect';
            confetti.style.left = `${20 + Math.random() * 60}%`;
            confetti.style.top = `${20 + Math.random() * 60}%`;
            elements.effectsLayer.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 2000);
        }, i * 200);
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
    
    if (gameState.stats.hygiene < 30) {
        messages = CONFIG.MESSAGES.DIRTY;
    } else if (gameState.stats.hunger < 30) {
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
    
    const audio = new Audio(`assets/sounds/ui/${soundFile}`);
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Автовоспроизведение заблокировано"));
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
