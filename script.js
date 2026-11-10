let balance = 0;
let inventory = [];
let selectedCasePrice = 0;
let currentMultiplier = 1.5;

const itemsPool = [
    { name: "Skibidi Toilet", price: 30, rarity: "var(--rarity-common)", img: "https://api.iconify.design/fluent-emoji:toilet.svg" },
    { name: "Grimace Shake", price: 80, rarity: "var(--rarity-rare)", img: "https://api.iconify.design/fluent-emoji:cup-with-straw.svg" },
    { name: "GigaChad Moai", price: 200, rarity: "var(--rarity-rare)", img: "https://api.iconify.design/fluent-emoji:moai.svg" },
    { name: "Baby Gronk", price: 450, rarity: "var(--rarity-epic)", img: "https://api.iconify.design/fluent-emoji:baby.svg" },
    { name: "John Pork Calling", price: 1200, rarity: "var(--rarity-legendary)", img: "https://api.iconify.design/fluent-emoji:pig-face.svg" }
];

function updateBalanceDisplay() {
    document.getElementById('balance').innerText = balance + " ⭐";
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(sectionId + '-section').classList.add('active');
    event.target.classList.add('active');
}

function openDepositModal() {
    document.getElementById('deposit-modal').style.display = 'flex';
}

function closeDepositModal() {
    document.getElementById('deposit-modal').style.display = 'none';
}

/* Рулетка */
function selectCase(caseType, price) {
    if (balance < price) {
        alert("Недостаточно звёзд! Пополните баланс через @JOHNPORK77 (от 50 звёзд)");
        openDepositModal();
        return;
    }
    selectedCasePrice = price;
    document.getElementById('cases-list').style.display = 'none';
    document.getElementById('roulette-view').style.display = 'block';
    buildRouletteTrack();
}

function closeRoulette() {
    document.getElementById('cases-list').style.display = 'grid';
    document.getElementById('roulette-view').style.display = 'none';
}

function buildRouletteTrack() {
    const track = document.getElementById('roulette-track');
    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';
    track.innerHTML = '';

    for (let i = 0; i < 40; i++) {
        const randomItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];
        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.borderColor = randomItem.rarity;
        card.innerHTML = `<img src="${randomItem.img}"><div class="item-name">${randomItem.name}</div>`;
        track.appendChild(card);
    }
}

function spinCase() {
    if (balance < selectedCasePrice) return;
    balance -= selectedCasePrice;
    updateBalanceDisplay();

    const btn = document.getElementById('open-btn');
    btn.disabled = true;

    const track = document.getElementById('roulette-track');
    const wonItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];
    
    const cards = track.children;
    cards[35].style.borderColor = wonItem.rarity;
    cards[35].innerHTML = `<img src="${wonItem.img}"><div class="item-name">${wonItem.name}</div>`;

    const moveAmount = (35 * 130) - (document.querySelector('.roulette-container').offsetWidth / 2) + 65;
    
    track.style.transition = 'transform 5s cubic-bezier(0.15, 0.85, 0.35, 1.2)';
    track.style.transform = `translateX(-${moveAmount}px)`;

    setTimeout(() => {
        inventory.push(wonItem);
        updateInventoryUI();
        alert(`Вы выбили: ${wonItem.name} (${wonItem.price} ⭐)!`);
        btn.disabled = false;
    }, 5200);
}

/* Инвентарь */
function updateInventoryUI() {
    const list = document.getElementById('inventory-list');
    if (inventory.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted);">Инвентарь пуст</p>';
        return;
    }
    list.innerHTML = '';
    inventory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.borderColor = item.rarity;
        card.innerHTML = `
            <img src="${item.img}">
            <div class="item-name">${item.name}</div>
            <button style="margin-top:5px; background:var(--accent-green); border:none; border-radius:4px; cursor:pointer; padding:2px 5px; font-weight:bold;" onclick="sellItem(${index})">Продать за ${item.price}⭐</button>
        `;
        list.appendChild(card);
    });
}

function sellItem(index) {
    balance += inventory[index].price;
    inventory.splice(index, 1);
    updateBalanceDisplay();
    updateInventoryUI();
}

/* Апгрейдер */
function setMultiplier(mult, btn) {
    currentMultiplier = mult;
    document.querySelectorAll('.multiplier-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const chance = Math.max(5, Math.min(95, Math.floor(90 / mult)));
    document.getElementById('win-chance').innerText = chance + "%";
}

function runUpgrade() {
    const amount = parseInt(document.getElementById('upgrade-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("Введите корректную сумму");
        return;
    }
    if (balance < amount) {
        alert("Недостаточно баланса!");
        return;
    }

    balance -= amount;
    updateBalanceDisplay();

    const chance = Math.floor(90 / currentMultiplier);
    const roll = Math.random() * 100;

    if (roll <= chance) {
        const winAmount = Math.floor(amount * currentMultiplier);
        balance += winAmount;
        alert(`УСПЕХ! Вы выиграли ${winAmount} ⭐`);
    } else {
        alert("НЕУДАЧА! Ставка сгорела.");
    }
    updateBalanceDisplay();
}
