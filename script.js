// Конфигурация игры
const CONFIG = {
    PRICES: {
        FOOD: {
            BONE: 20,
            MEAT: 50,
            FISH: 80,
            CAKE: 150
        },
        TOYS: {
            BALL: 50,
            ROPE: 80,
            PLUSH: 120,
            FRISBEE: 200
        },
        CLOTHES: {
            HAT: 100,
            GLASSES: 150,
            SCARF: 200,
            COSTUME: 300
        }
    },
    XP: {
        BASE: 10,
        LEVEL_MULTIPLIER: 1.2
    },
    DECAY_RATES: {
        HUNGER: 0.3,
        HAPPINESS: 0.2,
        ENERGY: 0.1
    },
    STATES: {
        HAPPY: 'happy',
        HUNGRY: 'hungry',
        TIRED: 'tired',
        SAD: 'sad'
    },
    ACHIEVEMENTS: {
        FIRST_STEPS: {
            name: "Первые шаги",
            desc: "Завести питомца",
            icon: "🥇",
            condition: (game) => true,
            reward: 100
        },
        FOOD_LOVER: {
            name: "Гурман",
            desc: "Накормить питомца 10 раз",
            icon: "🍗",
            condition: (game) => game.achievements.feedCount >= 10,
            reward: 200
        },
        PLAYER: {
            name: "Игрок",
            desc: "Поиграть с питомцем 10 раз",
            icon: "🎾",
            condition: (game) => game.achievements.playCount >= 10,
            reward: 200
        },
        CAREGIVER: {
            name: "Заботливый",
            desc: "Позаботиться о питомце 10 раз",
            icon: "💖",
            condition: (game) => game.achievements.careCount >= 10,
            reward: 200
        },
        FASHIONISTA: {
            name: "Модник",
            desc: "Купить всю одежду",
            icon: "👕",
            condition: (game) => Object.values(game.inventory.clothes).every(Boolean),
            reward: 300
        },
        MILLIONAIRE: {
            name: "Богач",
            desc: "Заработать 1000 монет",
            icon: "💰",
            condition: (game) => game.coins >= 1000,
            reward: 500
        },
        VETERAN: {
            name: "Ветеран",
            desc: "Достичь 5 уровня",
            icon: "🏅",
            condition: (game) => game.level >= 5,
            reward: 300
        }
    }
};

// Товары в магазине
const SHOP_ITEMS = {
    FOOD: [
        { id: 'bone', name: 'Кость', price: CONFIG.PRICES.FOOD.BONE, img: 'images/food/bone.webp', effect: 20 },
        { id: 'meat', name: 'Мясо', price: CONFIG.PRICES.FOOD.MEAT, img: 'images/food/meat.webp', effect: 40 },
        { id: 'fish', name: 'Рыба', price: CONFIG.PRICES.FOOD.FISH, img: 'images/food/fish.webp', effect: 60 },
        { id: 'cake', name: 'Торт', price: CONFIG.PRICES.FOOD.CAKE, img: 'images/food/cake.webp', effect: 100 }
    ],
    TOYS: [
        { id: 'ball', name: 'Мячик', price: CONFIG.PRICES.TOYS.BALL, img: 'images/toys/ball.webp', effect: 30 },
        { id: 'rope', name: 'Веревка', price: CONFIG.PRICES.TOYS.ROPE, img: 'images/toys/rope.webp', effect: 50 },
        { id: 'plush', name: 'Плюшка', price: CONFIG.PRICES.TOYS.PLUSH, img: 'images/toys/plush.webp', effect: 70 },
        { id: 'frisbee', name: 'Фрисби', price: CONFIG.PRICES.TOYS.FRISBEE, img: 'images/toys/frisbee.webp', effect: 100 }
    ],
    CLOTHES: [
        { id: 'hat', name: 'Шляпа', price: CONFIG.PRICES.CLOTHES.HAT, img: 'images/clothes/hat.webp', imgWear: 'images/clothes/hat_wear.webp' },
        { id: 'glasses', name: 'Очки', price: CONFIG.PRICES.CLOTHES.GLASSES, img: 'images/clothes/glasses.webp', imgWear: 'images/clothes/glasses_wear.webp' },
        { id: 'scarf', name: 'Шарф', price: CONFIG.PRICES.CLOTHES.SCARF, img: 'images/clothes/scarf.webp', imgWear: 'images/clothes/scarf_wear.webp' },
        { id: 'costume', name: 'Костюм', price: CONFIG.PRICES.CLOTHES.COSTUME, img: 'images/clothes/costume.webp', imgWear: 'images/clothes/costume_wear.webp' }
    ]
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
        food: {
            bone: 5,
            meat: 0,
            fish: 0,
            cake: 0
        },
        toys: {
            ball: 2,
            rope: 0,
            plush: 0,
            frisbee: 0
        },
        clothes: {
            hat: false,
            glasses: false,
            scarf: false,
            costume: false
        }
    },
    wearing: {
        hat: false,
        glasses: false,
        scarf: false,
        costume: false
    },
    achievements: {
        unlocked: {},
        feedCount: 0,
        playCount: 0,
        careCount: 0
    },
    settings: {
        sound: true,
        notifications: true
    }
};

// DOM элементы
const DOM = {
    // Основные элементы
    pet: document.getElementById('pet'),
    petAnimation: document.getElementById('pet-animation'),
    petClothes: document.getElementById('pet-clothes'),
    moodIndicator: document.getElementById('mood-indicator'),
    speechBubble: document.getElementById('speech-bubble'),
    notification: document.getElementById('notification'),
    effectsLayer: document.getElementById('effects-layer'),
    
    // Статус
    level: document.getElementById('level'),
    coins: document.getElementById('coins'),
    xpProgress: document.getElementById('xp-progress'),
    
    // Индикаторы
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    
    // Счетчики
    foodCount: document.getElementById('food-count'),
    toyCount: document.getElementById('toy-count'),
    
    // Кнопки
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    careBtn: document.getElementById('care-btn'),
    shopBtn: document.getElementById('shop-btn'),
    
    // Модальные окна
    modalOverlay: document.getElementById('modal-overlay'),
    shopModal: document.getElementById('shop-modal'),
    inventoryModal: document.getElementById('inventory-modal'),
    achievementsModal: document.getElementById('achievements-modal'),
    
    // Закрытие модалок
    closeShop: document.getElementById('close-shop'),
    closeInventory: document.getElementById('close-inventory'),
    closeAchievements: document.getElementById('close-achievements'),
    
    // Вкладки
    tabs: document.querySelectorAll('.tab-btn'),
    
    // Контент магазина
    foodItems: document.getElementById('food-items'),
    toysItems: document.getElementById('toys-items'),
    clothesItems: document.getElementById('clothes-items'),
    
    // Контент инвентаря
    invFoodItems: document.getElementById('inv-food-items'),
    invToysItems: document.getElementById('inv-toys-items'),
    invClothesItems: document.getElementById('inv-clothes-items'),
    
    // Достижения
    achievementsList: document.getElementById('achievements-list'),
    
    // Аудио
    soundClick: document.getElementById('sound-click'),
    soundCoin: document.getElementById('sound-coin'),
    soundBark: document.getElementById('sound-bark'),
    soundEat: document.getElementById('sound-eat'),
    soundLevelup: document.getElementById('sound-levelup')
};

// Фразы питомца
const PHRASES = {
    HAPPY: [
        "Я так тебя люблю!",
        "Ты лучший хозяин!",
        "Давай поиграем?",
        "Гав-гав!",
        "Почеши мне животик!",
        "Я счастлив!",
        "Ты мой лучший друг!",
        "Жизнь прекрасна!",
        "Я готов к приключениям!",
        "Спасибо, что ты есть!"
    ],
    HUNGRY: [
        "Я голодный!",
        "Хочу вкусняшку!",
        "Покорми меня!",
        "Где моя еда?",
        "🍗🍗🍗",
        "Я бы не отказался от перекуса",
        "Мой животик урчит...",
        "Когда обед?",
        "Я могу съесть слона!",
        "Хочу есть!"
    ],
    SAD: [
        "Мне грустно...",
        "Ты меня не любишь?",
        "Почему ты меня игнорируешь?",
        "Я скучаю...",
        "😢😢😢",
        "Мне одиноко...",
        "Ты забыл обо мне?",
        "Я чувствую себя брошенным",
        "Никто меня не любит...",
        "Мне нужно внимание"
    ],
    TIRED: [
        "Я устал...",
        "Хочу спать",
        "Давай отдохнем",
        "Мне нужно вздремнуть",
        "😴😴😴",
        "Глазки слипаются...",
        "Я еле стою на лапах",
        "Мне бы поспать",
        "Так устал...",
        "Пойду полежу"
    ]
};

// Инициализация Telegram WebApp
function initTelegramApp() {
    try {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
        
        // Настройка основной кнопки
        Telegram.WebApp.MainButton.setText('Меню');
        Telegram.WebApp.MainButton.onClick(toggleMainMenu);
        Telegram.WebApp.MainButton.show();
        
        // Загрузка сохранений
        if (Telegram.WebApp.initDataUnsafe.user) {
            loadGameData();
        }
    } catch (e) {
        console.log('Telegram WebApp not available');
    }
}

// Загрузка данных игры
function loadGameData() {
    Telegram.WebApp.CloudStorage.getItem('pet_game_data', (err, data) => {
        if (!err && data) {
            const savedData = JSON.parse(data);
            Object.assign(game, savedData);
            updateUI();
            updatePetClothes();
        }
    });
}

// Сохранение данных игры
function saveGameData() {
    const data = JSON.stringify(game);
    
    if (Telegram.WebApp.initDataUnsafe.user) {
        Telegram.WebApp.CloudStorage.setItem('pet_game_data', data, (err) => {
            if (err) console.error('Save error:', err);
        });
    } else {
        localStorage.setItem('pet_game_data', data);
    }
}

// Переключение главного меню
function toggleMainMenu() {
    playSound('click');
    
    const menuItems = [
        { text: '🎒 Инвентарь', callback: showInventory },
        { text: '🏆 Достижения', callback: showAchievements },
        { text: '⚙️ Настройки', callback: showSettings },
        { text: '❌ Закрыть', callback: () => Telegram.WebApp.MainButton.hide() }
    ];
    
    Telegram.WebApp.showPopup({
        title: 'Меню',
        message: 'Выберите действие',
        buttons: menuItems.map(item => ({
            id: item.text,
            type: 'default',
            text: item.text
        }))
    }, (buttonId) => {
        const selectedItem = menuItems.find(item => item.text === buttonId);
        if (selectedItem) selectedItem.callback();
    });
}

// Показать настройки
function showSettings() {
    const settingsItems = [
        { 
            text: game.settings.sound ? '🔊 Звук: Вкл' : '🔇 Звук: Выкл', 
            callback: () => {
                game.settings.sound = !game.settings.sound;
                showSettings();
            } 
        },
        { 
            text: game.settings.notifications ? '🔔 Уведомления: Вкл' : '🔕 Уведомления: Выкл', 
            callback: () => {
                game.settings.notifications = !game.settings.notifications;
                showSettings();
            } 
        },
        { text: '❌ Закрыть', callback: () => Telegram.WebApp.close() }
    ];
    
    Telegram.WebApp.showPopup({
        title: 'Настройки',
        message: 'Настройте приложение',
        buttons: settingsItems.map(item => ({
            id: item.text,
            type: 'default',
            text: item.text
        }))
    }, (buttonId) => {
        const selectedItem = settingsItems.find(item => item.text === buttonId);
        if (selectedItem) selectedItem.callback();
    });
}

// Воспроизведение звука
function playSound(soundName) {
    if (!game.settings.sound) return;
    
    try {
        const sound = DOM[`sound${soundName.charAt(0).toUpperCase() + soundName.slice(1)}`];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play error:', e));
        }
    } catch (e) {
        console.log('Sound error:', e);
    }
}

// Обновление интерфейса
function updateUI() {
    // Статистика
    DOM.hungerBar.style.width = `${game.stats.hunger}%`;
    DOM.happinessBar.style.width = `${game.stats.happiness}%`;
    DOM.energyBar.style.width = `${game.stats.energy}%`;
    
    // Валюта и прогресс
    DOM.coins.textContent = game.coins;
    DOM.level.textContent = game.level;
    
    // Опыт
    const xpNeeded = Math.floor(CONFIG.XP.BASE * Math.pow(CONFIG.XP.LEVEL_MULTIPLIER, game.level - 1));
    DOM.xpProgress.style.width = `${(game.xp / xpNeeded) * 100}%`;
    
    // Инвентарь
    const foodTotal = Object.values(game.inventory.food).reduce((a, b) => a + b, 0);
    const toysTotal = Object.values(game.inventory.toys).reduce((a, b) => a + b, 0);
    DOM.foodCount.textContent = foodTotal;
    DOM.toyCount.textContent = toysTotal;
    
    // Состояние питомца
    updatePetState();
    
    // Сохранение
    saveGameData();
    
    // Проверка достижений
    checkAchievements();
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
    
    // Если состояние изменилось, показываем фразу
    if (prevState !== game.state) {
        showRandomPhrase();
    }
    
    // Обновление внешнего вида
    updatePetAppearance();
}

// Обновление внешнего вида питомца
function updatePetAppearance() {
    // Цвет индикатора настроения
    let indicatorColor;
    
    switch(game.state) {
        case CONFIG.STATES.HAPPY:
            indicatorColor = 'rgba(78, 205, 196, 0.3)';
            break;
        case CONFIG.STATES.HUNGRY:
            indicatorColor = 'rgba(255, 107, 107, 0.3)';
            break;
        case CONFIG.STATES.SAD:
            indicatorColor = 'rgba(239, 71, 111, 0.3)';
            break;
        case CONFIG.STATES.TIRED:
            indicatorColor = 'rgba(255, 230, 109, 0.3)';
            break;
    }
    
    DOM.moodIndicator.style.background = `radial-gradient(circle, ${indicatorColor} 0%, rgba(255,255,255,0) 70%)`;
}

// Обновление одежды питомца
function updatePetClothes() {
    let clothesHTML = '';
    
    for (const [item, isWearing] of Object.entries(game.wearing)) {
        if (isWearing) {
            const clothesItem = SHOP_ITEMS.CLOTHES.find(c => c.id === item);
            if (clothesItem) {
                clothesHTML += `<img src="${clothesItem.imgWear}" class="clothes-item" data-item="${item}">`;
            }
        }
    }
    
    DOM.petClothes.innerHTML = clothesHTML;
}

// Показать речь питомца
function showSpeech(text) {
    if (!game.settings.notifications) return;
    
    DOM.speechBubble.textContent = text;
    DOM.speechBubble.style.opacity = '1';
    DOM.speechBubble.style.top = '15%';
    
    setTimeout(() => {
        DOM.speechBubble.style.opacity = '0';
    }, 2000);
}

// Показать уведомление
function showNotification(text, type = 'info') {
    if (!game.settings.notifications) return;
    
    DOM.notification.textContent = text;
    DOM.notification.style.opacity = '1';
    
    // Цвет в зависимости от типа
    switch(type) {
        case 'success':
            DOM.notification.style.background = 'var(--success)';
            break;
        case 'warning':
            DOM.notification.style.background = 'var(--warning)';
            break;
        case 'error':
            DOM.notification.style.background = 'var(--danger)';
            break;
        default:
            DOM.notification.style.background = 'var(--primary)';
    }
    
    setTimeout(() => {
        DOM.notification.style.opacity = '0';
    }, 2000);
}

// Добавить опыт
function addXP(amount) {
    const xpNeeded = Math.floor(CONFIG.XP.BASE * Math.pow(CONFIG.XP.LEVEL_MULTIPLIER, game.level - 1));
    game.xp += amount;
    
    if (game.xp >= xpNeeded) {
        game.level++;
        game.xp = game.xp - xpNeeded;
        showNotification(`🎉 Уровень ${game.level}!`, 'success');
        playSound('levelup');
        createStars(10);
    }
    
    updateUI();
}

// Добавить монеты
function addCoins(amount) {
    game.coins += amount;
    showNotification(`+${amount} монет`, 'success');
    playSound('coin');
    createCoins(5);
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
            heart.style.fontSize = `${20 + Math.random() * 12}px`;
            heart.style.animationDuration = `${2 + Math.random()}s`;
            DOM.effectsLayer.appendChild(heart);
            
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
            coin.style.left = `${40 + Math.random() * 20}%`;
            coin.style.animationDuration = `${1.5 + Math.random()}s`;
            DOM.effectsLayer.appendChild(coin);
            
            setTimeout(() => coin.remove(), 2000);
        }, i * 300);
    }
}

// Создать эффект звезд
function createStars(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'star-effect';
            star.innerHTML = '⭐';
            star.style.left = `${40 + Math.random() * 20}%`;
            star.style.fontSize = `${24 + Math.random() * 12}px`;
            star.style.animationDuration = `${2 + Math.random()}s`;
            DOM.effectsLayer.appendChild(star);
            
            setTimeout(() => star.remove(), 3000);
        }, i * 200);
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
    } else if (game.state === CONFIG.STATES.TIRED) {
        const phrase = PHRASES.TIRED[Math.floor(Math.random() * PHRASES.TIRED.length)];
        showSpeech(phrase);
    }
}

// Кормление
function feed() {
    playSound('click');
    
    if (game.stats.hunger >= 100) {
        showSpeech("Я не голоден!");
        return;
    }
    
    const foodTotal = Object.values(game.inventory.food).reduce((a, b) => a + b, 0);
    if (foodTotal <= 0) {
        showNotification("Нет еды! Купите в магазине", 'warning');
        return;
    }
    
    // Показываем меню выбора еды
    const foodItems = Object.entries(game.inventory.food)
        .filter(([_, count]) => count > 0)
        .map(([foodId, _]) => {
            const foodItem = SHOP_ITEMS.FOOD.find(item => item.id === foodId);
            return {
                text: `${foodItem.name} (${game.inventory.food[foodId]})`,
                callback: () => useFoodItem(foodId)
            };
        });
    
    if (foodItems.length === 0) return;
    
    Telegram.WebApp.showPopup({
        title: 'Выберите еду',
        message: 'Какой едой покормить питомца?',
        buttons: foodItems.map((item, index) => ({
            id: `food_${index}`,
            type: 'default',
            text: item.text
        }))
    }, (buttonId) => {
        const index = parseInt(buttonId.split('_')[1]);
        if (!isNaN(index) && foodItems[index]) {
            foodItems[index].callback();
        }
    });
}

// Использовать еду
function useFoodItem(foodId) {
    if (game.inventory.food[foodId] <= 0) return;
    
    game.inventory.food[foodId]--;
    const foodItem = SHOP_ITEMS.FOOD.find(item => item.id === foodId);
    
    game.stats.hunger = Math.min(100, game.stats.hunger + foodItem.effect);
    game.stats.happiness = Math.min(100, game.stats.happiness + foodItem.effect / 2);
    game.lastAction = Date.now();
    
    // Анимации
    createHearts(8);
    playSound('eat');
    addXP(CONFIG.XP.BASE);
    game.achievements.feedCount++;
    
    // Анимация еды
    DOM.petAnimation.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
        DOM.petAnimation.classList.remove('animate__animated', 'animate__pulse');
    }, 1000);
    
    showSpeech("Вкусно! Спасибо!");
    updateUI();
}

// Играть
function play() {
    playSound('click');
    
    if (game.stats.energy < 20) {
        showSpeech("Я устал...");
        return;
    }
    
    const toysTotal = Object.values(game.inventory.toys).reduce((a, b) => a + b, 0);
    if (toysTotal <= 0) {
        showNotification("Нет игрушек! Купите в магазине", 'warning');
        return;
    }
    
    // Показываем меню выбора игрушки
    const toyItems = Object.entries(game.inventory.toys)
        .filter(([_, count]) => count > 0)
        .map(([toyId, _]) => {
            const toyItem = SHOP_ITEMS.TOYS.find(item => item.id === toyId);
            return {
                text: `${toyItem.name} (${game.inventory.toys[toyId]})`,
                callback: () => useToyItem(toyId)
            };
        });
    
    if (toyItems.length === 0) return;
    
    Telegram.WebApp.showPopup({
        title: 'Выберите игрушку',
        message: 'С чем поиграть?',
        buttons: toyItems.map((item, index) => ({
            id: `toy_${index}`,
            type: 'default',
            text: item.text
        }))
    }, (buttonId) => {
        const index = parseInt(buttonId.split('_')[1]);
        if (!isNaN(index) && toyItems[index]) {
            toyItems[index].callback();
        }
    });
}

// Использовать игрушку
function useToyItem(toyId) {
    if (game.inventory.toys[toyId] <= 0) return;
    
    const toyItem = SHOP_ITEMS.TOYS.find(item => item.id === toyId);
    
    game.stats.happiness = Math.min(100, game.stats.happiness + toyItem.effect);
    game.stats.energy = Math.max(0, game.stats.energy - 20);
    game.stats.hunger = Math.max(0, game.stats.hunger - 10);
    game.lastAction = Date.now();
    
    // Анимации
    createHearts(10);
    playSound('bark');
    addXP(CONFIG.XP.BASE);
    game.achievements.playCount++;
    
    // Анимация игры
    DOM.petAnimation.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        DOM.petAnimation.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
    
    showSpeech("Это было весело!");
    updateUI();
}

// Уход за питомцем
function care() {
    playSound('click');
    
    if (game.stats.energy >= 90) {
        showSpeech("Я не хочу спать!");
        return;
    }
    
    game.stats.energy = 100;
    game.stats.happiness = Math.min(100, game.stats.happiness + 15);
    game.stats.hunger = Math.max(0, game.stats.hunger - 10);
    game.lastAction = Date.now();
    
    // Анимации
    addXP(CONFIG.XP.BASE * 2);
    game.achievements.careCount++;
    
    // Анимация ухода
    DOM.petAnimation.classList.add('animate__animated', 'animate__fadeOut');
    setTimeout(() => {
        DOM.petAnimation.classList.remove('animate__animated', 'animate__fadeOut');
        DOM.petAnimation.classList.add('animate__animated', 'animate__fadeIn');
        setTimeout(() => {
            DOM.petAnimation.classList.remove('animate__animated', 'animate__fadeIn');
        }, 500);
    }, 1000);
    
    showSpeech("Я выспался!");
    updateUI();
}

// Показать магазин
function showShop() {
    playSound('click');
    openModal('shop-modal');
    renderShopItems();
}

// Отрендерить товары в магазине
function renderShopItems() {
    // Еда
    DOM.foodItems.innerHTML = SHOP_ITEMS.FOOD.map(item => `
        <div class="shop-item" data-id="${item.id}">
            <img src="${item.img}" class="item-img">
            <div class="item-name">${item.name}</div>
            <div class="item-price">
                <img src="images/coin.webp"> ${item.price}
            </div>
            <button class="buy-btn" data-item="${item.id}" data-type="food" ${game.coins < item.price ? 'disabled' : ''}>
                Купить
            </button>
        </div>
    `).join('');
    
    // Игрушки
    DOM.toysItems.innerHTML = SHOP_ITEMS.TOYS.map(item => `
        <div class="shop-item" data-id="${item.id}">
            <img src="${item.img}" class="item-img">
            <div class="item-name">${item.name}</div>
            <div class="item-price">
                <img src="images/coin.webp"> ${item.price}
            </div>
            <button class="buy-btn" data-item="${item.id}" data-type="toys" ${game.coins < item.price ? 'disabled' : ''}>
                Купить
            </button>
        </div>
    `).join('');
    
    // Одежда
    DOM.clothesItems.innerHTML = SHOP_ITEMS.CLOTHES.map(item => `
        <div class="shop-item" data-id="${item.id}">
            <img src="${item.img}" class="item-img">
            <div class="item-name">${item.name}</div>
            <div class="item-price">
                <img src="images/coin.webp"> ${item.price}
            </div>
            <button class="buy-btn" data-item="${item.id}" data-type="clothes" ${game.coins < item.price || game.inventory.clothes[item.id] ? 'disabled' : ''}>
                ${game.inventory.clothes[item.id] ? 'Куплено' : 'Купить'}
            </button>
        </div>
    `).join('');
    
    // Обработчики кнопок покупки
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => buyItem(
            btn.dataset.item, 
            btn.dataset.type
        ));
    });
}

// Показать инвентарь
function showInventory() {
    playSound('click');
    openModal('inventory-modal');
    renderInventoryItems();
}

// Отрендерить инвентарь
function renderInventoryItems() {
    // Еда
    DOM.invFoodItems.innerHTML = SHOP_ITEMS.FOOD.map(item => {
        const count = game.inventory.food[item.id];
        return `
            <div class="inventory-item" data-id="${item.id}">
                <img src="${item.img}" class="item-img">
                <div class="item-name">${item.name}</div>
                <div class="item-count">${count} шт.</div>
                <button class="use-btn" data-item="${item.id}" data-type="food" ${count <= 0 ? 'disabled' : ''}>
                    Использовать
                </button>
            </div>
        `;
    }).join('');
    
    // Игрушки
    DOM.invToysItems.innerHTML = SHOP_ITEMS.TOYS.map(item => {
        const count = game.inventory.toys[item.id];
        return `
            <div class="inventory-item" data-id="${item.id}">
                <img src="${item.img}" class="item-img">
                <div class="item-name">${item.name}</div>
                <div class="item-count">${count} шт.</div>
                <button class="use-btn" data-item="${item.id}" data-type="toys" ${count <= 0 ? 'disabled' : ''}>
                    Использовать
                </button>
            </div>
        `;
    }).join('');
    
    // Одежда
    DOM.invClothesItems.innerHTML = SHOP_ITEMS.CLOTHES.map(item => {
        const hasItem = game.inventory.clothes[item.id];
        const isWearing = game.wearing[item.id];
        
        return `
            <div class="inventory-item" data-id="${item.id}">
                <img src="${item.img}" class="item-img">
                <div class="item-name">${item.name}</div>
                <div class="item-count">${hasItem ? 'Есть' : 'Нет'}</div>
                <button class="use-btn" data-item="${item.id}" data-type="clothes" ${!hasItem ? 'disabled' : ''}>
                    ${isWearing ? 'Снять' : 'Надеть'}
                </button>
            </div>
        `;
    }).join('');
    
    // Обработчики кнопок использования
    document.querySelectorAll('.use-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemType = btn.dataset.type;
            const itemId = btn.dataset.item;
            
            if (itemType === 'food') {
                useFoodItem(itemId);
                closeModal();
            } else if (itemType === 'toys') {
                useToyItem(itemId);
                closeModal();
            } else if (itemType === 'clothes') {
                toggleClothes(itemId);
                renderInventoryItems();
            }
        });
    });
}

// Показать достижения
function showAchievements() {
    playSound('click');
    openModal('achievements-modal');
    renderAchievements();
}

// Отрендерить достижения
function renderAchievements() {
    DOM.achievementsList.innerHTML = Object.entries(CONFIG.ACHIEVEMENTS).map(([key, achievement]) => {
        const isUnlocked = game.achievements.unlocked[key];
        const isCompleted = achievement.condition(game);
        
        return `
            <div class="achievement ${isUnlocked ? '' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
                ${!isUnlocked ? `
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar" style="width: ${isCompleted ? '100%' : '0%'}"></div>
                    </div>
                    <div class="achievement-reward">Награда: ${achievement.reward} монет</div>
                ` : `
                    <div class="achievement-completed">✅ Получено</div>
                `}
            </div>
        `;
    }).join('');
}

// Купить предмет
function buyItem(itemId, itemType) {
    playSound('click');
    
    let item, price;
    
    if (itemType === 'food') {
        item = SHOP_ITEMS.FOOD.find(i => i.id === itemId);
        price = item.price;
        
        if (game.coins < price) {
            showNotification("Недостаточно монет", 'warning');
            return;
        }
        
        game.coins -= price;
        game.inventory.food[itemId]++;
    } 
    else if (itemType === 'toys') {
        item = SHOP_ITEMS.TOYS.find(i => i.id === itemId);
        price = item.price;
        
        if (game.coins < price) {
            showNotification("Недостаточно монет", 'warning');
            return;
        }
        
        game.coins -= price;
        game.inventory.toys[itemId]++;
    } 
    else if (itemType === 'clothes') {
        item = SHOP_ITEMS.CLOTHES.find(i => i.id === itemId);
        price = item.price;
        
        if (game.inventory.clothes[itemId]) {
            showNotification("Уже куплено", 'warning');
            return;
        }
        
        if (game.coins < price) {
            showNotification("Недостаточно монет", 'warning');
            return;
        }
        
        game.coins -= price;
        game.inventory.clothes[itemId] = true;
    }
    
    showNotification(`Куплено: ${item.name}`, 'success');
    playSound('coin');
    createCoins(3);
    updateUI();
    renderShopItems();
}

// Переключить одежду
function toggleClothes(itemId) {
    game.wearing[itemId] = !game.wearing[itemId];
    updatePetClothes();
    playSound('click');
}

// Проверить достижения
function checkAchievements() {
    let newAchievements = 0;
    
    for (const [key, achievement] of Object.entries(CONFIG.ACHIEVEMENTS)) {
        if (!game.achievements.unlocked[key] && achievement.condition(game)) {
            game.achievements.unlocked[key] = true;
            addCoins(achievement.reward);
            showNotification(`Достижение: ${achievement.name}`, 'success');
            newAchievements++;
        }
    }
    
    if (newAchievements > 0) {
        createStars(15);
    }
}

// Открыть модальное окно
function openModal(modalId) {
    DOM.modalOverlay.classList.add('active');
    document.getElementById(modalId).classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    DOM.modalOverlay.classList.remove('active');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Игровой цикл
function gameLoop() {
    const now = Date.now();
    const hoursPassed = (now - game.lastAction) / (1000 * 60 * 60);
    
    // Уменьшение показателей со временем
    if (hoursPassed > 0.5) { // Если прошло больше 30 минут
        const decayFactor = Math.min(5, hoursPassed); // Максимальный фактор ухудшения - 5
        
        game.stats.hunger = Math.max(0, game.stats.hunger - CONFIG.DECAY_RATES.HUNGER * decayFactor);
        game.stats.happiness = Math.max(0, game.stats.happiness - CONFIG.DECAY_RATES.HAPPINESS * decayFactor);
        game.stats.energy = Math.max(0, game.stats.energy - CONFIG.DECAY_RATES.ENERGY * decayFactor);
    }
    
    updateUI();
    
    // Случайные фразы (10% шанс)
    if (Math.random() > 0.9) {
        showRandomPhrase();
    }
}

// Обработчики событий
function setupEventListeners() {
    // Клик по питомцу
    DOM.pet.addEventListener('click', () => {
        playSound('bark');
        
        if (game.state === CONFIG.STATES.HAPPY) {
            DOM.petAnimation.classList.add('animate__animated', 'animate__bounce');
            setTimeout(() => {
                DOM.petAnimation.classList.remove('animate__animated', 'animate__bounce');
            }, 1000);
            
            showRandomPhrase();
        }
    });
    
    // Кнопки действий
    DOM.feedBtn.addEventListener('click', feed);
    DOM.playBtn.addEventListener('click', play);
    DOM.careBtn.addEventListener('click', care);
    DOM.shopBtn.addEventListener('click', showShop);
    
    // Закрытие модалок
    DOM.closeShop.addEventListener('click', closeModal);
    DOM.closeInventory.addEventListener('click', closeModal);
    DOM.closeAchievements.addEventListener('click', closeModal);
    DOM.modalOverlay.addEventListener('click', closeModal);
    
    // Вкладки
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            // Убираем активный класс у всех вкладок и контента
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке и контенту
            tab.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            playSound('click');
        });
    });
}

// Инициализация игры
function initGame() {
    initTelegramApp();
    setupEventListeners();
    updateUI();
    
    // Проверяем локальное хранилище (если нет Telegram WebApp)
    if (!Telegram.WebApp.initDataUnsafe.user) {
        const savedData = localStorage.getItem('pet_game_data');
        if (savedData) {
            Object.assign(game, JSON.parse(savedData));
            updateUI();
            updatePetClothes();
        }
    }
    
    // Игровой цикл (каждую минуту)
    setInterval(gameLoop, 60000);
    
    // Приветственное сообщение
    setTimeout(() => {
        showSpeech("Привет! Я твой новый пёсик!");
    }, 1000);
    
    // Проверка достижений при старте
    checkAchievements();
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
