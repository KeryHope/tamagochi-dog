// Игровые константы
const DOG_STATES = {
    HAPPY: 'happy',
    HUNGRY: 'hungry',
    EATING: 'eating',
    PLAYING: 'playing',
    SLEEPING: 'sleeping',
    SAD: 'sad',
    GONE: 'gone'
};

const PRICES = {
    FOOD: 10,
    TOY: 20,
    PREMIUM: 100
};

// Игровое состояние
const state = {
    hunger: 100,
    happiness: 100,
    energy: 100,
    coins: 50,
    dogState: DOG_STATES.HAPPY,
    isSleeping: false,
    lastActionTime: Date.now(),
    inventory: {
        food: 0,
        toys: 0,
        premium: false
    }
};

// DOM элементы
const el = {
    dog: document.getElementById('dog'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    coinsDisplay: document.getElementById('coins'),
    speechBubble: document.getElementById('speech-bubble'),
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    sleepBtn: document.getElementById('sleep-btn'),
    shopBtn: document.getElementById('shop-btn'),
    effects: document.getElementById('effects'),
    notification: document.getElementById('notification')
};

// Фразы собаки
const PHRASES = [
    "Гав-гав!",
    "Хочу кушать!",
    "Поиграем?",
    "Я тебя люблю!",
    "Почеши пузико!",
    "Гулять!",
    "Мячик принеси!",
    "Хозяин, не бросай меня!",
    "Ура! Вкусняшка!",
    "Я самый счастливый пёс!"
];

// Инициализация Telegram Mini App
function initTelegramApp() {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.enableClosingConfirmation();
    
    // Показываем приветствие
    showSpeechBubble("Привет, хозяин! Давай дружить!");
}

// Показать облачко с речью
function showSpeechBubble(text) {
    el.speechBubble.textContent = text;
    el.speechBubble.style.opacity = '1';
    el.speechBubble.style.top = '20px';
    
    setTimeout(() => {
        el.speechBubble.style.opacity = '0';
    }, 2000);
}

// Показать уведомление
function showNotification(text) {
    el.notification.textContent = text;
    el.notification.style.opacity = '1';
    el.notification.style.top = '20px';
    
    setTimeout(() => {
        el.notification.style.opacity = '0';
    }, 2000);
}

// Обновить интерфейс
function updateUI() {
    // Обновляем статус-бары
    el.hungerBar.style.width = `${state.hunger}%`;
    el.happinessBar.style.width = `${state.happiness}%`;
    el.energyBar.style.width = `${state.energy}%`;
    
    // Обновляем монеты
    el.coinsDisplay.textContent = state.coins;
    
    // Изменяем цвет при низких значениях
    if (state.hunger < 30) {
        el.hungerBar.style.background = 'linear-gradient(90deg, #FF0000, #FF4500)';
    } else {
        el.hungerBar.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E53)';
    }
    
    if (state.happiness < 30) {
        el.happinessBar.style.background = 'linear-gradient(90deg, #00BFFF, #1E90FF)';
    } else {
        el.happinessBar.style.background = 'linear-gradient(90deg, #4ECDC4, #66B3FF)';
    }
    
    if (state.energy < 30) {
        el.energyBar.style.background = 'linear-gradient(90deg, #FFA500, #FF8C00)';
    } else {
        el.energyBar.style.background = 'linear-gradient(90deg, #FFD166, #FFB347)';
    }
}

// Изменить состояние собаки
function changeDogState(newState) {
    state.dogState = newState;
    
    // Обновляем изображение
    switch(newState) {
        case DOG_STATES.HAPPY:
            el.dog.src = 'images/dog_happy.png';
            break;
        case DOG_STATES.HUNGRY:
            el.dog.src = 'images/dog_hungry.png';
            break;
        case DOG_STATES.EATING:
            el.dog.src = 'images/dog_playing.gif'; // Используем анимацию игры для еды
            break;
        case DOG_STATES.PLAYING:
            el.dog.src = 'images/dog_playing.gif';
            break;
        case DOG_STATES.SLEEPING:
            el.dog.src = 'images/dog_sleeping.gif';
            break;
        case DOG_STATES.SAD:
            el.dog.src = 'images/dog_sad.png';
            break;
        case DOG_STATES.GONE:
            el.dog.src = 'images/dog_gone.gif';
            break;
    }
    
    // Случайная фраза
    if (Math.random() > 0.7 && newState !== DOG_STATES.SLEEPING) {
        const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        showSpeechBubble(randomPhrase);
    }
}

// Создать эффект сердечек
function createHearts() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.className = 'heart-effect';
            heart.style.left = `${50 + Math.random() * 20}%`;
            heart.style.fontSize = `${20 + Math.random() * 15}px`;
            heart.style.animationDuration = `${2 + Math.random() * 2}s`;
            el.effects.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 200);
    }
}

// Создать эффект монет
function createCoins(amount) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.innerHTML = '💰';
            coin.className = 'coin-effect';
            coin.style.left = `${Math.random() * 100}%`;
            coin.style.animationDuration = `${1 + Math.random()}s`;
            el.effects.appendChild(coin);
            
            setTimeout(() => {
                coin.remove();
            }, 2000);
        }, i * 100);
    }
}

// Кормление собаки
function feed() {
    if (state.hunger >= 100) {
        showSpeechBubble("Я не голодный!");
        return;
    }
    
    if (state.coins < PRICES.FOOD) {
        showPaymentDialog(PRICES.FOOD, "Покупка корма");
        return;
    }
    
    state.coins -= PRICES.FOOD;
    changeDogState(DOG_STATES.EATING);
    disableButtons();
    
    setTimeout(() => {
        state.hunger = Math.min(100, state.hunger + 30);
        state.happiness = Math.min(100, state.happiness + 10);
        state.lastActionTime = Date.now();
        changeDogState(DOG_STATES.HAPPY);
        createHearts();
        updateUI();
        enableButtons();
    }, 2000);
}

// Игра с собакой
function play() {
    if (state.energy < 20) {
        showSpeechBubble("Я устал...");
        return;
    }
    
    changeDogState(DOG_STATES.PLAYING);
    disableButtons();
    
    setTimeout(() => {
        state.happiness = Math.min(100, state.happiness + 30);
        state.energy = Math.max(0, state.energy - 20);
        state.hunger = Math.max(0, state.hunger - 10);
        state.lastActionTime = Date.now();
        changeDogState(DOG_STATES.HAPPY);
        createHearts();
        updateUI();
        enableButtons();
    }, 3000);
}

// Сон собаки
function sleep() {
    if (state.isSleeping) return;
    
    state.isSleeping = true;
    changeDogState(DOG_STATES.SLEEPING);
    disableButtons();
    
    setTimeout(() => {
        state.energy = 100;
        state.hunger = Math.max(0, state.hunger - 15);
        state.isSleeping = false;
        state.lastActionTime = Date.now();
        changeDogState(DOG_STATES.HAPPY);
        showSpeechBubble("Я выспался!");
        updateUI();
        enableButtons();
    }, 5000);
}

// Открыть магазин
function openShop() {
    Telegram.WebApp.showPopup({
        title: "🐶 Магазин для пёсика",
        message: "Выберите товар:",
        buttons: [
            {id: 'food', type: 'default', text: `🍖 Корм (${PRICES.FOOD}₽)`},
            {id: 'toy', type: 'default', text: `🎾 Игрушка (${PRICES.TOY}₽)`},
            {id: 'premium', type: 'default', text: `🌟 Премиум (${PRICES.PREMIUM}₽)`},
            {id: 'cancel', type: 'cancel', text: "❌ Закрыть"}
        ]
    }, (buttonId) => {
        if (buttonId === 'food') {
            showPaymentDialog(PRICES.FOOD, "Покупка корма");
        } else if (buttonId === 'toy') {
            showPaymentDialog(PRICES.TOY, "Покупка игрушки");
        } else if (buttonId === 'premium') {
            showPaymentDialog(PRICES.PREMIUM, "Премиум пакет");
        }
    });
}

// Платежное окно
function showPaymentDialog(amount, description) {
    Telegram.WebApp.openInvoice({
        currency: 'RUB',
        amount: amount * 100,
        description: description
    }, (status) => {
        if (status === 'paid') {
            state.coins += amount * 2;
            createCoins(amount);
            showNotification(`✅ Спасибо! +${amount * 2} монет!`);
            updateUI();
        }
    });
}

// Отключить кнопки
function disableButtons() {
    el.feedBtn.disabled = true;
    el.playBtn.disabled = true;
    el.sleepBtn.disabled = true;
    el.shopBtn.disabled = true;
}

// Включить кнопки
function enableButtons() {
    el.feedBtn.disabled = false;
    el.playBtn.disabled = false;
    el.sleepBtn.disabled = false;
    el.shopBtn.disabled = false;
}

// Игровой цикл
function gameLoop() {
    const now = Date.now();
    const hoursSinceAction = (now - state.lastActionTime) / (1000 * 60 * 60);
    
    // Уменьшение показателей со временем
    if (hoursSinceAction > 4) {
        state.hunger = Math.max(0, state.hunger - 5);
        state.happiness = Math.max(0, state.happiness - 3);
    } else if (hoursSinceAction > 2) {
        state.hunger = Math.max(0, state.hunger - 2);
    }
    
    if (!state.isSleeping) {
        state.energy = Math.max(0, state.energy - 1);
    }
    
    // Автоматическое изменение состояния
    if (state.hunger <= 0 || state.happiness <= 0) {
        changeDogState(DOG_STATES.GONE);
        disableButtons();
        showSpeechBubble("Я убежал... Воскреси меня!");
    } else if (state.hunger < 30 || state.happiness < 30 || state.energy < 30) {
        changeDogState(DOG_STATES.SAD);
    } else if (state.dogState === DOG_STATES.SAD || state.dogState === DOG_STATES.HAPPY) {
        changeDogState(DOG_STATES.HAPPY);
    }
    
    updateUI();
}

// Клик по собаке
el.dog.addEventListener('click', () => {
    if (state.dogState === DOG_STATES.HAPPY) {
        el.dog.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            el.dog.style.transform = 'scale(1) rotate(0)';
        }, 300);
        
        const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        showSpeechBubble(randomPhrase);
    } else if (state.dogState === DOG_STATES.GONE) {
        if (state.coins >= 10) {
            state.coins -= 10;
            state.hunger = 50;
            state.happiness = 50;
            state.energy = 50;
            changeDogState(DOG_STATES.HAPPY);
            enableButtons();
            updateUI();
            showNotification("Пёсик вернулся! -10 монет");
        } else {
            showPaymentDialog(10, "Воскрешение пёсика");
        }
    }
});

// Инициализация игры
function initGame() {
    initTelegramApp();
    
    // Назначение обработчиков
    el.feedBtn.addEventListener('click', feed);
    el.playBtn.addEventListener('click', play);
    el.sleepBtn.addEventListener('click', sleep);
    el.shopBtn.addEventListener('click', openShop);
    
    // Запуск игрового цикла
    setInterval(gameLoop, 60000); // Обновление каждую минуту
    
    // Первоначальная настройка
    updateUI();
    changeDogState(DOG_STATES.HAPPY);
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
