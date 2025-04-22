 Состояние игры
const gameState = {
    hunger 100,
    happiness 100,
    energy 100,
    coins 50,
    dogState 'idle',
    lastFedTime Date.now(),
    lastPlayTime 0,
    isSleeping false
};

 Элементы интерфейса
const elements = {
    dogImage document.getElementById('dog-image'),
    hungerBar document.getElementById('hunger-bar'),
    happinessBar document.getElementById('happiness-bar'),
    energyBar document.getElementById('energy-bar'),
    hungerText document.getElementById('hunger-text'),
    happinessText document.getElementById('happiness-text'),
    energyText document.getElementById('energy-text'),
    coinsDisplay document.getElementById('coins'),
    feedButton document.getElementById('feed-btn'),
    playButton document.getElementById('play-btn'),
    sleepButton document.getElementById('sleep-btn'),
    shopButton document.getElementById('shop-btn')
};

 Изображения состояний собаки
const dogImages = {
    idle 'imagesdog_idle.png',
    happy 'imagesdog_happy.png',
    hungry 'imagesdog_hungry.png',
    eating 'imagesdog_eating.gif',
    playing 'imagesdog_playing.gif',
    sleeping 'imagesdog_sleeping.gif',
    sad 'imagesdog_sad.png'
};

 Инициализация Telegram WebApp
function initTelegramApp() {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.enableClosingConfirmation();
}

 Обновление интерфейса
function updateUI() {
     Обновляем полоски статуса
    elements.hungerBar.style.width = `${gameState.hunger}%`;
    elements.happinessBar.style.width = `${gameState.happiness}%`;
    elements.energyBar.style.width = `${gameState.energy}%`;
    
     Обновляем текстовые значения
    elements.hungerText.textContent = `${gameState.hunger}%`;
    elements.happinessText.textContent = `${gameState.happiness}%`;
    elements.energyText.textContent = `${gameState.energy}%`;
    elements.coinsDisplay.textContent = gameState.coins;
    
     Меняем цвета при низких значениях
    elements.hungerBar.style.backgroundColor = gameState.hunger  30  '#ff4d4d'  '#4CAF50';
    elements.happinessBar.style.backgroundColor = gameState.happiness  30  '#ff4d4d'  '#2196F3';
    elements.energyBar.style.backgroundColor = gameState.energy  30  '#ff4d4d'  '#FFC107';
}

 Изменение состояния собаки
function changeDogState(newState) {
    gameState.dogState = newState;
    elements.dogImage.src = dogImages[newState];
}

 Кормление собаки
function feedDog() {
    if (gameState.hunger = 100) {
        showAlert('Собака уже сыта!');
        return;
    }
    
    if (gameState.coins  10) {
        showPaymentDialog(10, 'Покупка еды');
        return;
    }
    
    gameState.coins -= 10;
    changeDogState('eating');
    disableButtons();
    
    setTimeout(() = {
        gameState.hunger = Math.min(100, gameState.hunger + 30);
        gameState.happiness = Math.min(100, gameState.happiness + 10);
        gameState.lastFedTime = Date.now();
        changeDogState('happy');
        updateUI();
        enableButtons();
    }, 2000);
}

 Игра с собакой
function playWithDog() {
    if (gameState.energy  20) {
        showAlert('Собака слишком устала!');
        return;
    }
    
    changeDogState('playing');
    disableButtons();
    
    setTimeout(() = {
        gameState.happiness = Math.min(100, gameState.happiness + 30);
        gameState.energy = Math.max(0, gameState.energy - 20);
        gameState.lastPlayTime = Date.now();
        changeDogState('happy');
        updateUI();
        enableButtons();
    }, 3000);
}

 Сон собаки
function putDogToSleep() {
    if (gameState.isSleeping) return;
    
    gameState.isSleeping = true;
    changeDogState('sleeping');
    disableButtons();
    
    setTimeout(() = {
        gameState.energy = 100;
        gameState.hunger = Math.max(0, gameState.hunger - 10);
        gameState.isSleeping = false;
        changeDogState('idle');
        updateUI();
        enableButtons();
    }, 5000);
}

 Магазин
function openShop() {
    Telegram.WebApp.showPopup({
        title '🐶 Магазин для пёсика',
        message 'Выберите товар',
        buttons [
            {id 'food', type 'default', text '🍖 Еда (10₽)'},
            {id 'toy', type 'default', text '🎾 Игрушка (20₽)'},
            {id 'premium', type 'default', text '🌟 Премиум (100₽)'},
            {id 'cancel', type 'cancel', text '❌ Отмена'}
        ]
    }, (buttonId) = {
        if (buttonId === 'food') {
            showPaymentDialog(10, 'Покупка еды');
        } else if (buttonId === 'toy') {
            showPaymentDialog(20, 'Покупка игрушки');
        } else if (buttonId === 'premium') {
            showPaymentDialog(100, 'Премиум пакет');
        }
    });
}

 Платежи
function showPaymentDialog(amount, description) {
    Telegram.WebApp.openInvoice({
        currency 'RUB',
        amount amount  100,
        description description
    }, (status) = {
        if (status === 'paid') {
            gameState.coins += amount  2;
            showAlert(`✅ Спасибо! Вы получили ${amount  2} монет.`);
            updateUI();
        }
    });
}

 Вспомогательные функции
function showAlert(message) {
    Telegram.WebApp.showAlert(message);
}

function disableButtons() {
    elements.feedButton.disabled = true;
    elements.playButton.disabled = true;
    elements.sleepButton.disabled = true;
    elements.shopButton.disabled = true;
}

function enableButtons() {
    elements.feedButton.disabled = false;
    elements.playButton.disabled = false;
    elements.sleepButton.disabled = false;
    elements.shopButton.disabled = false;
}

 Игровой цикл
function gameLoop() {
    const now = Date.now();
    const hoursSinceFed = (now - gameState.lastFedTime)  (1000  60  60);
    
    if (hoursSinceFed  4) {
        gameState.hunger = Math.max(0, gameState.hunger - 5);
        gameState.happiness = Math.max(0, gameState.happiness - 3);
    } else if (hoursSinceFed  2) {
        gameState.hunger = Math.max(0, gameState.hunger - 2);
    }
    
    if (!gameState.isSleeping) {
        gameState.energy = Math.max(0, gameState.energy - 1);
    }
    
     Автоматическое изменение состояния
    if (gameState.hunger  30  gameState.happiness  30  gameState.energy  30) {
        changeDogState('sad');
    } else if (gameState.dogState === 'sad'  gameState.dogState === 'idle') {
        changeDogState('idle');
    }
    
    updateUI();
    
     Уведомления
    if (gameState.hunger  20  gameState.happiness  20) {
        showAlert('⚠️ Ваш пёсик несчастен! Покормите или поиграйте с ним.');
    }
}

 Инициализация игры
function initGame() {
    initTelegramApp();
    
     Назначение обработчиков событий
    elements.feedButton.addEventListener('click', feedDog);
    elements.playButton.addEventListener('click', playWithDog);
    elements.sleepButton.addEventListener('click', putDogToSleep);
    elements.shopButton.addEventListener('click', openShop);
    
     Запуск игрового цикла
    setInterval(gameLoop, 60000);  Обновление каждую минуту
    
     Первоначальная отрисовка
    updateUI();
    changeDogState('idle');
}

 Запускаем игру при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);