// Игровые константы
const DOG_BASE_ATTACK = 10;
const ENEMY_BASE_ATTACK = 8;
const SPECIAL_ATTACK_MULTIPLIER = 2.5;
const HEAL_AMOUNT = 30;
const RAGE_PER_HIT = 15;
const WIN_REWARD = 50;

// Состояние игры
const gameState = {
    dogHP: 100,
    dogMaxHP: 100,
    rage: 0,
    coins: 50,
    wins: 0,
    enemyHP: 100,
    enemyMaxHP: 100,
    isBattleActive: true,
    dogAttack: DOG_BASE_ATTACK,
    enemyAttack: ENEMY_BASE_ATTACK
};

// DOM элементы
const elements = {
    hpBar: document.getElementById('hp-bar'),
    hpText: document.getElementById('hp-text'),
    rageBar: document.getElementById('rage-bar'),
    rageText: document.getElementById('rage-text'),
    coinsDisplay: document.getElementById('coins'),
    winsDisplay: document.getElementById('wins'),
    enemyHP: document.getElementById('enemy-hp'),
    dog: document.getElementById('dog'),
    enemy: document.getElementById('enemy'),
    combatEffects: document.getElementById('combat-effects'),
    combatLog: document.getElementById('combat-log'),
    attackBtn: document.getElementById('attack-btn'),
    specialBtn: document.getElementById('special-btn'),
    healBtn: document.getElementById('heal-btn'),
    upgradeBtn: document.getElementById('upgrade-btn')
};

// Инициализация Telegram WebApp
function initTelegramApp() {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.enableClosingConfirmation();
}

// Обновление интерфейса
function updateUI() {
    // Обновление здоровья
    const dogHPPerc = (gameState.dogHP / gameState.dogMaxHP) * 100;
    elements.hpBar.style.width = `${dogHPPerc}%`;
    elements.hpText.textContent = gameState.dogHP;
    
    // Обновление ярости
    elements.rageBar.style.width = `${gameState.rage}%`;
    elements.rageText.textContent = gameState.rage;
    
    // Обновление врага
    const enemyHPPerc = (gameState.enemyHP / gameState.enemyMaxHP) * 100;
    elements.enemyHP.textContent = `${Math.round(enemyHPPerc)}%`;
    
    // Обновление валюты
    elements.coinsDisplay.textContent = gameState.coins;
    elements.winsDisplay.textContent = gameState.wins;
    
    // Обновление кнопок
    elements.specialBtn.disabled = gameState.rage < 50;
    elements.healBtn.disabled = gameState.coins < 20;
}

// Добавление сообщения в лог
function addCombatLog(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    elements.combatLog.prepend(logEntry);
    
    // Автоскролл
    elements.combatLog.scrollTop = 0;
    
    // Ограничение количества записей
    if (elements.combatLog.children.length > 10) {
        elements.combatLog.removeChild(elements.combatLog.lastChild);
    }
}

// Эффект атаки
function createAttackEffect(x, y, isCritical = false) {
    const effect = document.createElement('div');
    effect.style.position = 'absolute';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.fontSize = isCritical ? '20px' : '16px';
    effect.style.color = isCritical ? '#ffd700' : '#ff0000';
    effect.textContent = isCritical ? '💥CRIT!💥' : '💢';
    effect.style.animation = 'float 1s linear forwards';
    elements.combatEffects.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// Эффект крови
function createBloodEffect() {
    const blood = document.createElement('div');
    blood.style.position = 'absolute';
    blood.style.width = '100%';
    blood.style.height = '100%';
    blood.style.background = 'radial-gradient(circle, rgba(255,0,0,0.7) 0%, rgba(255,0,0,0) 70%)';
    blood.style.animation = 'blood-effect 0.5s forwards';
    elements.combatEffects.appendChild(blood);
    
    setTimeout(() => {
        blood.remove();
    }, 500);
}

// Атака собаки
function dogAttack(isSpecial = false) {
    if (!gameState.isBattleActive) return;
    
    let damage = gameState.dogAttack;
    let isCritical = false;
    
    // Проверка на крит
    if (Math.random() < 0.2) {
        damage *= 2;
        isCritical = true;
    }
    
    // Ультра-атака
    if (isSpecial) {
        damage *= SPECIAL_ATTACK_MULTIPLIER;
        gameState.rage = 0;
    } else {
        // Обычная атака тратит энергию
        if (gameState.rage < 10) {
            addCombatLog('Недостаточно ярости!');
            return;
        }
        gameState.rage -= 10;
    }
    
    // Наносим урон
    gameState.enemyHP = Math.max(0, gameState.enemyHP - damage);
    
    // Анимация атаки
    elements.dog.style.animation = 'attack 0.3s';
    setTimeout(() => {
        elements.dog.style.animation = '';
    }, 300);
    
    // Эффекты
    const enemyRect = elements.enemy.getBoundingClientRect();
    createAttackEffect(
        enemyRect.left + enemyRect.width / 2,
        enemyRect.top,
        isCritical
    );
    
    // Сообщение в лог
    const attackType = isSpecial ? 'УЛЬТРА-АТАКА' : 'Атака';
    const critText = isCritical ? ' КРИТИЧЕСКИЙ УРОН!' : '';
    addCombatLog(`🐶 ${attackType}! ${damage} урона${critText}`);
    
    // Проверка победы
    if (gameState.enemyHP <= 0) {
        enemyDefeated();
        return;
    }
    
    // Ответный удар
    setTimeout(enemyAttack, 1000);
    
    updateUI();
}

// Атака врага
function enemyAttack() {
    if (!gameState.isBattleActive) return;
    
    const damage = gameState.enemyAttack + Math.floor(Math.random() * 5);
    gameState.dogHP = Math.max(0, gameState.dogHP - damage);
    
    // Анимация
    elements.enemy.style.animation = 'enemy-hit 0.3s';
    setTimeout(() => {
        elements.enemy.style.animation = '';
    }, 300);
    
    // Эффекты
    createBloodEffect();
    addCombatLog(`😾 Враг атакует! ${damage} урона`);
    
    // Увеличение ярости
    gameState.rage = Math.min(100, gameState.rage + RAGE_PER_HIT);
    
    // Проверка поражения
    if (gameState.dogHP <= 0) {
        dogDefeated();
        return;
    }
    
    updateUI();
}

// Лечение
function healDog() {
    if (gameState.coins < 20) {
        addCombatLog('Недостаточно монет!');
        return;
    }
    
    gameState.coins -= 20;
    gameState.dogHP = Math.min(gameState.dogMaxHP, gameState.dogHP + HEAL_AMOUNT);
    
    // Эффект лечения
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.position = 'absolute';
            heart.style.left = `${50 + i * 10}px`;
            heart.style.top = '50px';
            heart.style.animation = 'float 1s linear forwards';
            elements.combatEffects.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1000);
        }, i * 200);
    }
    
    addCombatLog(`❤️ Вы восстановили ${HEAL_AMOUNT} HP`);
    
    // Ответный удар
    setTimeout(enemyAttack, 1500);
    
    updateUI();
}

// Магазин улучшений
function openUpgradeShop() {
    Telegram.WebApp.showPopup({
        title: '🛠 АПГРЕЙДЫ',
        message: `Ваши монеты: ${gameState.coins}₽`,
        buttons: [
            {id: 'attack', type: 'default', text: '🗡 +5 АТАКИ (50₽)'},
            {id: 'health', type: 'default', text: '❤️ +20 HP (30₽)'},
            {id: 'cancel', type: 'cancel', text: '❌ ЗАКРЫТЬ'}
        ]
    }, (buttonId) => {
        if (buttonId === 'attack' && gameState.coins >= 50) {
            gameState.coins -= 50;
            gameState.dogAttack += 5;
            addCombatLog('🗡 АТАКА +5!');
            updateUI();
        } else if (buttonId === 'health' && gameState.coins >= 30) {
            gameState.coins -= 30;
            gameState.dogMaxHP += 20;
            gameState.dogHP += 20;
            addCombatLog('❤️ MAX HP +20!');
            updateUI();
        } else if (buttonId === 'attack' || buttonId === 'health') {
            addCombatLog('Недостаточно монет!');
        }
    });
}

// Победа над врагом
function enemyDefeated() {
    gameState.isBattleActive = false;
    addCombatLog('⚔️ ВРАГ ПОБЕЖДЁН! +50₽');
    gameState.coins += WIN_REWARD;
    gameState.wins++;
    
    // Эффект победы
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.textContent = '💰';
            coin.style.position = 'absolute';
            coin.style.left = `${Math.random() * 100}%`;
            coin.style.top = `${Math.random() * 100}%`;
            coin.style.animation = 'float 2s linear forwards';
            elements.combatEffects.appendChild(coin);
            
            setTimeout(() => {
                coin.remove();
            }, 2000);
        }, i * 200);
    }
    
    // Новый враг через 3 секунды
    setTimeout(() => {
        gameState.enemyHP = gameState.enemyMaxHP;
        gameState.isBattleActive = true;
        addCombatLog('😾 Появился новый враг!');
        updateUI();
    }, 3000);
}

// Поражение
function dogDefeated() {
    gameState.isBattleActive = false;
    addCombatLog('☠️ ВЫ ПРОИГРАЛИ!');
    
    // Воскрешение через 5 секунд
    setTimeout(() => {
        gameState.dogHP = gameState.dogMaxHP;
        gameState.enemyHP = gameState.enemyMaxHP;
        gameState.isBattleActive = true;
        addCombatLog('🐶 Вы восстановились!');
        updateUI();
    }, 5000);
}

// Инициализация игры
function initGame() {
    initTelegramApp();
    
    // Назначение обработчиков
    elements.attackBtn.addEventListener('click', () => dogAttack(false));
    elements.specialBtn.addEventListener('click', () => dogAttack(true));
    elements.healBtn.addEventListener('click', healDog);
    elements.upgradeBtn.addEventListener('click', openUpgradeShop);
    
    // Первоначальное обновление
    updateUI();
    addCombatLog('⚔️ БОЙ НАЧИНАЕТСЯ!');
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
