// Состояние игры
const gameState = {
    hunger: 100,
    happiness: 100,
    energy: 100,
    coins: 50,
    dogState: 'happy',
    isSleeping: false,
    lastActionTime: Date.now()
};

// DOM элементы
const elements = {
    dogImage: document.getElementById('dog-image'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    coinsDisplay: document.getElementById('coins'),
    speechBubble: document.getElementById('speech'),
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    sleepBtn: document.getElementById('sleep-btn'),
    shopBtn: document.getElementById('shop-btn'),
    heartsEffect: document.getElementById('hearts-effect'),
    coinsEffect: document.getElementById('coins-effect')
};

// Изображения состояний
const dogImages = {
    happy: 'images/dog_happy.png',
    hungry: 'images/dog_hungry.png',
    eating: 'images/dog_playing.gif',
    playing: 'images/dog_playing.gif',
    sleeping: 'images/dog_sleeping.gif',
    sad: 'images/dog_sad.png',
    gone: 'images/dog_gone.gif'
};

// Фразы собаки
const dogPhrases = [
    "Гав-гав!",
    "Хочу кушать!",
    "Поиграем?",
    "Я тебя люблю!",
    "Почеши пузико!",
    "Гулять!",
    "Мячик принеси!"
];

// Инициализация Telegram WebApp
function initTelegramApp() {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.enableClosingConfirmation();
    
    // Показываем приветственное сообщение
    showSpeechBubble("Привет, хозяин!");
}

// Показать облачко с текстом
function showSpeechBubble(text) {
    elements.speechBubble.textContent = text;
    elements.speechBubble.style.opacity = '1';
    elements.speechBubble.style.top = '-40px';
    
    setTimeout(() => {
        elements.speechBubble.style.opacity = '0';
    }, 2000);
}

// Обновление интерфейса
function updateUI() {
    // Обновляем полоски статусов
    elements.hungerBar.style.width = `${gameState.hunger}%`;
    elements.happinessBar.style.width = `${gameState.happiness}%`;
    elements.energyBar.style.width = `${gameState.energy}%`;
    
    // Обновляем монеты
    elements.coinsDisplay.textContent = gameState.coins;
    
    // Меняем цвет при низких значениях
    elements.hungerBar.style.background = gameState.hunger < 30 
        ? 'linear-gradient(90deg, #FF0000, #FF4500)' 
        : 'linear-gradient(90deg, #FF6B6B, #FF8E53)';
        
    elements.happinessBar.style.background = gameState.happiness < 30 
        ? 'linear-gradient(90deg, #00BFFF, #1E90FF)' 
        : 'linear-gradient(90deg, #4ECDC4, #66B3FF)';
        
    elements.energyBar.style.background = gameState.energy < 30 
        ? 'linear-gradient(90deg, #FFA500, #FF8C00)' 
        : 'linear-gradient(90deg, #FFD166, #FFB347)';
}

// Изменение состояния собаки
function changeDogState(newState) {
    gameState.dogState = newState;
    elements.dogImage.src = dogImages[newState];
    
    // Случайная фраза при изменении состояния
    if (Math.random() > 0.7 && newState !== 'sleeping') {
        const randomPhrase = dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
        showSpeechBubble(randomPhrase);
    }
}

// Эффект сердечек
function createHearts() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'absolute';
            heart.style.left = `${50 + Math.random() * 50}%`;
            heart.style.bottom = '0';
            heart.style.fontSize = `${20 + Math.random() * 15}px`;
            heart.style.animation = `float ${2 + Math.random() * 3}s linear forwards`;
            elements.heartsEffect.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 200);
    }
}

// Эффект монеток
function createCoins(amount) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.innerHTML = '💰';
            coin.style.position = 'absolute';
            coin.style.left = `${Math.random() * 100}%`;
            coin.style.top = `${Math.random() * 100}%`;
            coin.style.fontSize = '20px';
            coin.style.animation = `bounce 0.5s ease ${i * 0.1}s 2 alternate`;
            elements.coinsEffect.appendChild(coin);
            
            setTimeout(() => {
                coin.remove();
            }, 1000);
        }, i * 100);
    }
}

// Кормление собаки
function feedDog() {
    if (gameState.hunger >= 100) {
        showSpeechBubble("Я не голодный!");
        return;
    }
    
    if (gameState.coins < 10) {
        showPaymentDialog(10, "Покупка корма");
        return;
    }
    
    gameState.coins -= 10;
    gameState.lastActionTime = Date.now();
    changeDogState('eating');
    disableButtons();
    
    setTimeout(() => {
        gameState.hunger = Math.min(100, gameState.hunger + 30);
        gameState.happiness = Math.min(100, gameState.happiness + 10);
        changeDogState('happy');
        createHearts();
        updateUI();
        enableButtons();
    }, 2000);
}

// Игра с собакой
function playWithDog() {
    if (gameState.energy < 20) {
        showSpeechBubble("Я устал...");
        return;
    }
    
    gameState.lastActionTime = Date.now();
    changeDogState('playing');
    disableButtons();
    
    setTimeout(() => {
        gameState.happiness = Math.min(100, gameState.happiness + 30);
        gameState.energy = Math.max(0, gameState.energy - 20);
        gameState.hunger = Math.max(0, gameState.hunger - 10);
        changeDogState('happy');
        createHearts();
        updateUI();
        enableButtons();
    }, 3000);
}

// Сон собаки
function putDogToSleep() {
    if (gameState.isSleeping) return;
    
    gameState.isSleeping = true;
    gameState.lastActionTime = Date.now();
    changeDogState('sleeping');
    disableButtons();
    
    setTimeout(() => {
        gameState.energy = 100;
        gameState.hunger = Math.max(0, gameState.hunger - 15);
        gameState.isSleeping = false;
        changeDogState('happy');
        showSpeechBubble("Я выспался!");
        updateUI();
        enableButtons();
    }, 5000);
}

// Магазин
function openShop() {
    Telegram.WebApp.showPopup({
        title: "🐶 Магазин для пёсика",
        message: "Что вы хотите купить?",
        buttons: [
            {id: 'food', type: 'default', text: "🍖 Корм (10₽)"},
            {id: 'toy', type: 'default', text: "🎾 Игрушка (20₽)"},
            {id: 'premium', type: 'default', text: "🌟 Премиум (100₽)"},
            {id: 'cancel', type: 'cancel', text: "❌ Закрыть"}
        ]
    }, (buttonId) => {
        if (buttonId === 'food') {
            showPaymentDialog(10, "Покупка корма");
        } else if (buttonId === 'toy') {
            showPaymentDialog(20, "Покупка игрушки");
        } else if (buttonId === 'premium') {
            showPaymentDialog(100, "Премиум пакет");
        }
    });
}

// Платежи
function showPaymentDialog(amount, description) {
    Telegram.WebApp.openInvoice({
        currency: 'RUB',
        amount: amount * 100,
        description: description
    }, (status) => {
        if (status === 'paid') {
            gameState.coins += amount * 2;
            createCoins(amount);
            showSpeechBubble("Спасибо за покупку!");
            updateUI();
        }
    });
}

// Отключение кнопок
function disableButtons() {
    elements.feedBtn.disabled = true;
    elements.playBtn.disabled = true;
    elements.sleepBtn.disabled = true;
    elements.shopBtn.disabled = true;
}

// Включение кнопок
function enableButtons() {
    elements.feedBtn.disabled = false;
    elements.playBtn.disabled = false;
    elements.sleepBtn.disabled = false;
    elements.shopBtn.disabled = false;
}

// Игровой цикл
function gameLoop() {
    const now = Date.now();
    const hoursSinceAction = (now - gameState.lastActionTime) / (1000 * 60 * 60);
    
    // Уменьшение показателей со временем
    if (hoursSinceAction > 4) {
        gameState.hunger = Math.max(0, gameState.hunger - 5);
        gameState.happiness = Math.max(0, gameState.happiness - 3);
    } else if (hoursSinceAction > 2) {
        gameState.hunger = Math.max(0, gameState.hunger - 2);
    }
    
    if (!gameState.isSleeping) {
        gameState.energy = Math.max(0, gameState.energy - 1);
    }
    
    // Автоматическое изменение состояния
    if (gameState.hunger < 30 || gameState.happiness < 30 || gameState.energy < 30) {
        changeDogState('sad');
    } else if (gameState.dogState === 'sad' || gameState.dogState === 'happy') {
        changeDogState('happy');
    }
    
    updateUI();
    
    // Уведомления
    if (gameState.hunger < 20 || gameState.happiness < 20) {
        showSpeechBubble("Мне плохо...");
    }
}

// Клик по собаке
elements.dogImage.addEventListener('click', () => {
    if (gameState.dogState === 'happy') {
        elements.dogImage.style.transform = 'scale(1.1)';
        setTimeout(() => {
            elements.dogImage.style.transform = 'scale(1)';
        }, 300);
        
        const randomPhrase = dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
        showSpeechBubble(randomPhrase);
    }
});

// Инициализация игры
function initGame() {
    initTelegramApp();
    
    // Назначение обработчиков
    elements.feedBtn.addEventListener('click', feedDog);
    elements.playBtn.addEventListener('click', playWithDog);
    elements.sleepBtn.addEventListener('click', putDogToSleep);
    elements.shopBtn.addEventListener('click', openShop);
    
    // Запуск игрового цикла
    setInterval(gameLoop, 60000); // Обновление каждую минуту
    
    // Первоначальная настройка
    updateUI();
    changeDogState('happy');
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
