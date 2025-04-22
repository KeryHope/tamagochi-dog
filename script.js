// Конфигурация игры
const CONFIG = {
    PRICES: {
        FOOD: 20,
        TOY: 50,
        CLOTHES: 100
    },
    XP: {
        PER_ACTION: 10,
        TO_LEVEL: 100,
        LEVEL_MULTIPLIER: 1.2
    },
    STATES: {
        HAPPY: 'happy',
        HUNGRY: 'hungry',
        TIRED: 'tired',
        SAD: 'sad'
    },
    DECAY_RATES: {
        HUNGER: 0.5,
        HAPPINESS: 0.3,
        ENERGY: 0.2
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
    },
    achievements: {
        firstFeed: false,
        firstPlay: false,
        firstLevel: false
    },
    settings: {
        sound: true,
        notifications: true
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
    shopBtn: document.getElementById('shop-btn'),
    shopModal: document.getElementById('shop-modal'),
    inventoryModal: document.getElementById('inventory-modal'),
    particles: document.getElementById('particles')
};

// Фразы питомца
const PHRASES = {
    HAPPY: [
        "Я так тебя люблю!",
        "Ты лучший хозяин!",
        "Давай поиграем?",
        "Гав-гав!",
        "Почеши мне животик!",
        "Я счастливый пёсик!",
        "Ты мой лучший друг!"
    ],
    HUNGRY: [
        "Я голодный!",
        "Хочу вкусняшку!",
        "Покорми меня!",
        "Где моя еда?",
        "🍗🍗🍗",
        "Я бы съел что-нибудь...",
        "Мой животик урчит!"
    ],
    SAD: [
        "Мне грустно...",
        "Ты меня не любишь?",
        "Почему ты меня игнорируешь?",
        "Я скучаю...",
        "😢😢😢",
        "Мне одиноко...",
        "Ты забыл про меня?"
    ],
    TIRED: [
        "Я устал...",
        "Хочу спать...",
        "Поиграем позже?",
        "Мне нужен отдых",
        "💤💤💤",
        "Я еле держусь на лапах...",
        "Глазки слипаются..."
    ]
};

// Звуки
const SOUNDS = {
    CLICK: new Audio('sounds/click.mp3'),
    COIN: new Audio('sounds/coin.mp3'),
    SUCCESS: new Audio('sounds/success.mp3'),
    ERROR: new Audio('sounds/error.mp3'),
    FEED: new Audio('sounds/feed.mp3'),
    PLAY: new Audio('sounds/play.mp3'),
    SLEEP: new Audio('sounds/sleep.mp3')
};

// Инициализация Telegram WebApp
function initTelegramApp() {
    try {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
        
        // Получаем данные пользователя
        const user = Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
            console.log(`Привет, ${user.first_name}!`);
        }
        
        // Настройка темы
        if (Telegram.WebApp.colorScheme === 'dark') {
            document.documentElement.style.setProperty('--text-dark', '#FFFFFF');
            document.documentElement.style.setProperty('--modal-bg', 'rgba(30, 30, 30, 0.9)');
        }
    } catch (e) {
        console.log("Telegram WebApp не доступен");
    }
}

// Создание частиц фона
function createParticles() {
    const particleCount = Math.floor(window.innerWidth / 10);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Случайные параметры
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 20;
        
        // Применение стилей
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        DOM.particles.appendChild(particle);
    }
}

// Обновление интерфейса
function updateUI() {
    // Статистика
    DOM.hungerBar.style.width = `${game.stats.hunger}%`;
    DOM.happinessBar.style.width = `${game.stats.happiness}%`;
    DOM.energyBar.style.width = `${game.stats.energy}%`;
    DOM.coinsDisplay.textContent = game.coins;
    
    // Опыт и уровень
    const xpToLevel = CONFIG.XP.TO_LEVEL * Math.pow(CONFIG.XP.LEVEL_MULTIPLIER, game.level - 1);
    DOM.xpProgress.style.width = `${(game.xp / xpToLevel) * 100}%`;
    DOM.levelDisplay.textContent = game.level;
    
    // Инвентарь
    document.getElementById('food-count').textContent = game.inventory.food;
    document.getElementById('toy-count').textContent = game.inventory.toys;
    document.getElementById('clothes-count').textContent = game.inventory.clothes;
    
    // Состояние питомца
    updatePetState();
}

// Обновление состояния питомца
function updatePetState() {
    const prevState = game.state;
    
    if (game.stats.hunger < 30 || game.stats.happiness < 30) {
        game.state = CONFIG.STATES.SAD;
    } else if (game.stats.hunger < 60) {
        game.state = CONFIG.STATES.HUNGRY;
    } else if (game.stats.energy < 30) {
        game.state = CONFIG.STATES.TIRED;
    } else {
        game.state = CONFIG.STATES.HAPPY;
    }
    
    // Если состояние изменилось, показать сообщение
    if (prevState !== game.state) {
        showRandomPhrase();
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
        DOM.pet.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            DOM.pet.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
    }
}

// Показать речь
function showSpeech(text) {
    if (!game.settings.notifications) return;
    
    DOM.speechBubble.textContent = text;
    DOM.speechBubble.style.opacity = '1';
    DOM.speechBubble.style.top = '20%';
    
    setTimeout(() => {
        DOM.speechBubble.style.opacity = '0';
    }, 2000);
}

// Показать уведомление
function showNotification(text) {
    if (!game.settings.notifications) return;
    
    DOM.notification.textContent = text;
    DOM.notification.style.opacity = '1';
    
    setTimeout(() => {
        DOM.notification.style.opacity = '0';
    }, 2000);
    
    if (game.settings.sound) {
        SOUNDS.SUCCESS.currentTime = 0;
        SOUNDS.SUCCESS.play().catch(e => console.log("Звук не воспроизведён: ", e));
    }
}

// Добавить опыт
function addXP(amount) {
    const xpToLevel = CONFIG.XP.TO_LEVEL * Math.pow(CONFIG.XP.LEVEL_MULTIPLIER, game.level - 1);
    game.xp += amount;
    
    if (game.xp >= xpToLevel) {
        game.level++;
        game.xp = game.xp - xpToLevel;
        showNotification(`🎉 Уровень ${game.level}!`);
        
        // Награда за уровень
        game.coins += game.level * 50;
        createCoinEffect(10);
        
        if (!game.achievements.firstLevel) {
            game.achievements.firstLevel = true;
            showSpeech("Я стал сильнее! Спасибо тебе!");
        }
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

// Создать эффект монет
function createCoinEffect(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.className = 'coin-effect';
            coin.innerHTML = '🪙';
            coin.style.left = `${40 + Math.random() * 20}%`;
            coin.style.fontSize = `${24 + Math.random() * 12}px`;
            DOM.effectsLayer.appendChild(coin);
            
            setTimeout(() => coin.remove(), 2000);
        }, i * 100);
    }
    
    if (game.settings.sound) {
        SOUNDS.COIN.currentTime = 0;
        SOUNDS.COIN.play().catch(e => console.log("Звук не воспроизведён: ", e));
    }
}

// Кормление
function feed() {
    playSound(SOUNDS.CLICK);
    
    if (game.stats.hunger >= 100) {
        showSpeech("Я не голоден!");
        playSound(SOUNDS.ERROR);
        return;
    }
    
    if (game.inventory.food <= 0) {
        showNotification("Нет еды! Купите в магазине");
        playSound(SOUNDS.ERROR);
        return;
    }
    
    game.inventory.food--;
    game.stats.hunger = Math.min(100, game.stats.hunger + 30);
    game.stats.happiness = Math.min(100, game.stats.happiness + 10);
    game.lastAction = Date.now();
    
    // Анимации
    createHearts(8);
    addXP(CONFIG.XP.PER_ACTION);
    playSound(SOUNDS.FEED);
    
    // Временное изменение изображения
    const originalSrc = DOM.pet.src;
    DOM.pet.src = 'images/dog_eating.png';
    
    setTimeout(() => {
        DOM.pet.src = originalSrc;
        showSpeech("Вкусно! Спасибо!");
        updateUI();
    }, 1500);
    
    if (!game.achievements.firstFeed) {
        game.achievements.firstFeed = true;
        showNotification("Отлично! Вы покормили питомца впервые!");
        game.coins += 50;
        createCoinEffect(5);
    }
}

// Игра
function play() {
    playSound(SOUNDS.CLICK);
    
    if (game.stats.energy < 20) {
        showSpeech("Я устал...");
        playSound(SOUNDS.ERROR);
        return;
    }
    
    game.stats.happiness = Math.min(100, game.stats.happiness + 30);
    game.stats.energy = Math.max(0, game.stats.energy - 20);
    game.stats.hunger = Math.max(0, game.stats.hunger - 10);
    game.lastAction = Date.now();
    
    // Анимации
    createHearts(10);
    addXP(CONFIG.XP.PER_ACTION);
    playSound(SOUNDS.PLAY);
    
    // Временное изменение изображения
    const originalSrc = DOM.pet.src;
    DOM.pet.src = 'images/dog_playing.png';
    
    setTimeout(() => {
        DOM.pet.src = originalSrc;
        showSpeech("Это было весело!");
        updateUI();
    }, 2000);
    
    if (!game.achievements.firstPlay) {
        game.achievements.firstPlay = true;
        showNotification("Ура! Вы впервые поиграли с питомцем!");
        game.coins += 50;
        createCoinEffect(5);
    }
}

// Уход
function care() {
    playSound(SOUNDS.CLICK);
    
    if (game.stats.energy >= 90) {
        showSpeech("Я не хочу спать!");
        playSound(SOUNDS.ERROR);
        return;
    }
    
    game.stats.energy = 100;
    game.stats.happiness = Math.min(100, game.stats.happiness + 15);
    game.stats.hunger = Math.max(0, game.stats.hunger - 10);
    game.lastAction = Date.now();
    
    // Анимации
    addXP(CONFIG.XP.PER_ACTION * 2);
    playSound(SOUNDS.SLEEP);
    
    // Временное изменение изображения
    const originalSrc = DOM.pet.src;
    DOM.pet.src = 'images/dog_sleeping.png';
    
    setTimeout(() => {
        DOM.pet.src = originalSrc;
        showSpeech("Я выспался!");
        updateUI();
    }, 3000);
}

// Магазин
function openShop() {
    playSound(SOUNDS.CLICK);
    DOM.shopModal.classList.add('active');
}

// Инвентарь
function openInventory() {
    playSound(SOUNDS.CLICK);
    DOM.inventoryModal.classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    playSound(SOUNDS.CLICK);
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Купить предмет
function buyItem(itemType, price) {
    if (game.coins < price) {
        showNotification("Недостаточно монет!");
        playSound(SOUNDS.ERROR);
        return;
    }
    
    game.coins -= price;
    game.inventory[itemType]++;
    
    showNotification(`Вы купили ${getItemName(itemType)}!`);
    playSound(SOUNDS.SUCCESS);
    createCoinEffect(3);
    updateUI();
}

// Получить название предмета
function getItemName(itemType) {
    switch(itemType) {
        case 'food': return 'корм';
        case 'toy': return 'игрушку';
        case 'clothes': return 'костюм';
        default: return 'предмет';
    }
}

// Воспроизвести звук
function playSound(sound) {
    if (!game.settings.sound) return;
    
    try {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Звук не воспроизведён: ", e));
    } catch (e) {
        console.log("Ошибка воспроизведения звука: ", e);
    }
}

// Игровой цикл
function gameLoop() {
    const now = Date.now();
    const secondsPassed = (now - game.lastAction) / 1000;
    
    // Уменьшение показателей со временем
    game.stats.hunger = Math.max(0, game.stats.hunger - CONFIG.DECAY_RATES.HUNGER * secondsPassed);
    game.stats.happiness = Math.max(0, game.stats.happiness - CONFIG.DECAY_RATES.HAPPINESS * secondsPassed);
    game.stats.energy = Math.max(0, game.stats.energy - CONFIG.DECAY_RATES.ENERGY * secondsPassed);
    
    game.lastAction = now;
    updateUI();
    
    // Случайные фразы
    if (Math.random() > 0.95) {
        showRandomPhrase();
    }
    
    // Автосохранение каждые 5 минут
    if (now % (5 * 60 * 1000) < 1000) {
        saveGame();
    }
}

// Показать случайную фразу
function showRandomPhrase() {
    let phrase;
    
    switch(game.state) {
        case CONFIG.STATES.HAPPY:
            phrase = PHRASES.HAPPY[Math.floor(Math.random() * PHRASES.HAPPY.length)];
            break;
        case CONFIG.STATES.HUNGRY:
            phrase = PHRASES.HUNGRY[Math.floor(Math.random() * PHRASES.HUNGRY.length)];
            break;
        case CONFIG.STATES.SAD:
            phrase = PHRASES.SAD[Math.floor(Math.random() * PHRASES.SAD.length)];
            break;
        case CONFIG.STATES.TIRED:
            phrase = PHRASES.TIRED[Math.floor(Math.random() * PHRASES.TIRED.length)];
            break;
        default:
            phrase = "Гав-гав!";
    }
    
    showSpeech(phrase);
}

// Сохранение игры
function saveGame() {
    try {
        localStorage.setItem('superDogGame', JSON.stringify(game));
        console.log("Игра сохранена");
    } catch (e) {
        console.log("Ошибка сохранения: ", e);
    }
}

// Загрузка игры
function loadGame() {
    try {
        const savedGame = localStorage.getItem('superDogGame');
        if (savedGame) {
            const parsedGame = JSON.parse(savedGame);
            Object.assign(game, parsedGame);
            console.log("Игра загружена");
        }
    } catch (e) {
        console.log("Ошибка загрузки: ", e);
    }
}

// Клик по питомцу
DOM.pet.addEventListener('click', () => {
    playSound(SOUNDS.CLICK);
    
    if (game.state === CONFIG.STATES.HAPPY) {
        DOM.pet.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            DOM.pet.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);
        
        showRandomPhrase();
    }
});

// Инициализация игры
function initGame() {
    loadGame();
    initTelegramApp();
    createParticles();
    updateUI();
    
    // Обработчики событий
    DOM.feedBtn.addEventListener('click', feed);
    DOM.playBtn.addEventListener('click', play);
    DOM.careBtn.addEventListener('click', care);
    DOM.shopBtn.addEventListener('click', openShop);
    
    // Модальные окна
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Кнопки покупки
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.dataset.item;
            const price = parseInt(btn.dataset.price);
            buyItem(item, price);
        });
    });
    
    // Игровой цикл
    setInterval(gameLoop, 10000);
    
    // Приветственное сообщение
    setTimeout(() => {
        showSpeech("Привет! Я твой новый пёсик!");
    }, 1000);
    
    // Обработка закрытия
    window.addEventListener('beforeunload', saveGame);
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
