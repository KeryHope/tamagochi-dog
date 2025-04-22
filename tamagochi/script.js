let hunger = 100;

function feed() {
  if (hunger >= 100) return;
  hunger += 20;
  document.getElementById("hunger").textContent = hunger;
  document.getElementById("dog").src = "dog_happy.png";
  
  // Платеж через Telegram
  Telegram.WebApp.openInvoice({
    currency: 'RUB',
    amount: 1000, // 10₽ в копейках
  });
}

// Каждую минуту голод уменьшается
setInterval(() => {
  hunger -= 5;
  document.getElementById("hunger").textContent = hunger;
  if (hunger < 30) {
    document.getElementById("dog").src = "dog_hungry.png";
  }
}, 60000);