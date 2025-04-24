// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Состояние игры
const gameState = {
    pet: {
        name: "Питомец",
        type: "cat",
        hunger: 80,
        happiness: 70,
        energy: 90,
        level: 1,
        xp: 0
    },
    inventory: {
        food: 5,
        toys: 3,
        coins: 100,
        ton: 0
    },
    settings: {
        sound: true,
        notifications: true
    }
};

// Элементы интерфейса
const elements = {
    app: document.getElementById('app'),
    loader: document.getElementById('loader'),
    pet: document.getElementById('pet'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    tonAmount: document.getElementById('ton-amount'),
    shopModal: document.getElementById('shop-modal')
};

// Инициализация игры
function initGame() {
    // Загрузка сохранений из localStorage
    loadGame();
    
    // Настройка обработчиков событий
    setupEventListeners();
    
    // Инициализация TON кошелька
    initTONWallet();
    
    // Запуск игрового цикла
    startGameLoop();
    
    // Показываем интерфейс после загрузки
    setTimeout(() => {
        elements.loader.style.display = 'none';
        elements.app.style.display = 'flex';
    }, 1000);
}

// Инициализация TON кошелька
function initTONWallet() {
    if (window.ton) {
        window.ton.request({ method: 'ton_requestWallets' })
            .then(wallets => {
                if (wallets.length > 0) {
                    gameState.inventory.ton = wallets[0].balance;
                    updateUI();
                }
            });
    }
}

// Игровой цикл
function startGameLoop() {
    setInterval(() => {
        // Уменьшаем показатели со временем
        gameState.pet.hunger = Math.max(0, gameState.pet.hunger - 1);
        gameState.pet.happiness = Math.max(0, gameState.pet.happiness - 0.8);
        gameState.pet.energy = Math.max(0, gameState.pet.energy - 0.5);
        
        // Обновляем интерфейс
        updateUI();
        
        // Проверяем состояние питомца
        checkPetStatus();
        
        // Автосохранение
        saveGame();
    }, 60000); // Обновление каждую минуту
}

// Основные действия
function feedPet() {
    if (gameState.inventory.food > 0) {
        gameState.pet.hunger = Math.min(100, gameState.pet.hunger + 25);
        gameState.inventory.food--;
        animatePet('eat');
        showNotification('Питомец поел!');
        playSound('eat.mp3');
    } else {
        showNotification('Нет еды! Купите в магазине');
    }
    updateUI();
}

function playWithPet() {
    gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 30);
    gameState.pet.energy = Math.max(0, gameState.pet.energy - 15);
    animatePet('play');
    showNotification('Питомец поиграл!');
    updateUI();
}

function careForPet() {
    gameState.pet.energy = Math.min(100, gameState.pet.energy + 40);
    animatePet('care');
    showNotification('Питомец отдохнул!');
    updateUI();
}

// Обновление интерфейса
function updateUI() {
    elements.hungerBar.style.width = `${gameState.pet.hunger}%`;
    elements.happinessBar.style.width = `${gameState.pet.happiness}%`;
    elements.energyBar.style.width = `${gameState.pet.energy}%`;
    elements.tonAmount.textContent = gameState.inventory.ton;
    
    // Обновляем спрайт питомца в зависимости от состояния
    updatePetSprite();
}

// Анимации
function animatePet(action) {
    const pet = elements.pet;
    pet.classList.remove('animate-eat', 'animate-play', 'animate-care');
    void pet.offsetWidth; // Trigger reflow
    pet.classList.add(`animate-${action}`);
}

// Уведомления через Telegram WebApp
function showNotification(text) {
    if (gameState.settings.notifications) {
        tg.showAlert(text);
    }
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('superPetSave', JSON.stringify(gameState));
}

// Загрузка игры
function loadGame() {
    const save = localStorage.getItem('superPetSave');
    if (save) {
        Object.assign(gameState, JSON.parse(save));
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Обработчики событий
function setupEventListeners() {
    document.getElementById('feed-btn').addEventListener('click', feedPet);
    document.getElementById('play-btn').addEventListener('click', playWithPet);
    document.getElementById('care-btn').addEventListener('click', careForPet);
    document.getElementById('shop-btn').addEventListener('click', () => {
        elements.shopModal.style.display = 'flex';
    });
    
    // Закрытие модальных окон
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Обработка нажатия на питомца
    elements.pet.addEventListener('click', () => {
        gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 5);
        animatePet('pet');
        updateUI();
    });
}

// Проверка состояния питомца
function checkPetStatus() {
    if (gameState.pet.hunger < 20) {
        showNotification('Питомец голоден!');
    }
    if (gameState.pet.happiness < 20) {
        showNotification('Питомцу грустно!');
    }
}
