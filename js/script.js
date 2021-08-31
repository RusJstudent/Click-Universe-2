// import {levels, ranks} from '../js/levels.js';
// import {rewards, npcDamage} from './npcs.js';
// import {newUser, hp, gunDamage, addSpaces} from '../js/objects.js';
// import {destroySound, deathSound} from './sounds.js';
// import {about, welcome, guide} from './info.js';

const welcome = `Welcome to Click Universe game! 
Attack enemies to earn resourses. 
But be careful, if your HP goes to 0, 
your ship will be destroyed and you will lose all stuff you earned. 
Good luck!`;

const about = `Game developed by EvilYou.
Soon will appear: shields, autofarm option and more..
Hope you will enjoy it!

P.S. You may write me your ideas about changes you 
want to see in the game to me in discord.
Contacts: EvilYou#1118.`;

const guide = `Each enemy you destroy gives you 
some amount of exp, btc and plt.
For btc and plt you can buy stuff in shop. 
Guns provide you more damage, you 
kill npcs faster and get less damage from them`;

const levels = [
    [1, 0],
    [2, 10000],
    [3, 20000],
    [4, 40000],
    [5, 80000],
    [6, 160000],
    [7, 320000],
    [8, 640000],
    [9, 1280000],
    [10, 2560000],
    [11, 5120000],
    [12, 10240000],
    [13, 20480000],
    [14, 40960000],
    [15, 81920000],
    [16, 163840000],
    [17, 327680000],
    [18, 655360000],
    [19, 1310720000],
    [20, 2621440000],
    [21, 5242880000],
    [22, 10485760000], // max level
    [23, Infinity],
];

const ranks = [
    [1, 0],
    [2, 100000],
    [3, 400000],
    [4, 1000000],
    [5, 2000000],
    [6, 4000000],
    [7, 8000000],
    [8, 14000000],
    [9, 20000000],
    [10, 30000000],
    [11, Infinity],
];


const npcDamage = {
    hydro: 60,
    jenta: 160,
    mali: 370,
    plarion: 620,
    motron: 1200,
    xeon: 2800,
    bangoliour: 7150,
    zavientos: 11500,
    magmius: 14200,
    quattroid: 17000,
};

const rewards =  {
    hydro: {
        exp: 1000,
        btc: 1000,
        plt: 3,
    },
    jenta: {
        exp: 1700,
        btc: 2200,
        plt: 7,
    },
    mali: {
        exp: 2500,
        btc: 4300,
        plt: 18,
    },
    plarion: {
        exp: 3600,
        btc: 7200,
        plt: 32,
    },
    motron: {
        exp: 5200,
        btc: 15000,
        plt: 58,
    },
    xeon: {
        exp: 7100,
        btc: 27000,
        plt: 87,
    },
    bangoliour: {
        exp: 9600,
        btc: 58000,
        plt: 115,
    },
    zavientos: {
        exp: 13000,
        btc: 110000,
        plt: 160,
    },
    magmius: {
        exp: 25000,
        btc: 270000,
        plt: 350,
    },
    quattroid: {
        exp: 70000,
        btc: 1000000,
        plt: 1000,
    }
};

let destroySound = new Audio();
let deathSound = new Audio();

destroySound.src = 'audio/alien_1.wav';
deathSound.src = 'audio/death.mp3';
// destroySound.src = 'audio/explosion.wav';
// destroySound.src = 'audio/laser.wav';

// for registration
const formatter = new Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
});

const now = formatter.format(new Date());

// new User
const hp = 12e3;

const zeroDestroys = {
    hydro: 0,
    jenta: 0,
    mali: 0,
    plarion: 0,
    motron: 0,
    xeon: 0,
    bangoliour: 0,
    zavientos: 0,
    magmius: 0,
    quattroid: 0,
};

const newUser = {
    exp: 0,
    btc: 0,
    lvl: 1,
    plt: 0,
    rank: 1,
    nickname: 'Champion',
    hp: hp,
    damage: 0,
    guns: {
        lg1: 0,
        lg2: 0,
        lg3: 0,
    },
    registration: now,
    destroys: zeroDestroys,
}

const gunDamage = {
    lg1: 40,
    lg2: 300,
    lg3: 1000, // 10000 + 3000 + 400 = 13400 / 25400
};

// functions
function addSpaces(str) {
    let arr = [];
    for (let i = str.length - 1; i >= 0; i--) {
        let idx = str.length - i;
        arr.push(str[i]);
        if (idx % 3 === 0) arr.push(' ');
    }
    return arr.reverse().join('');
}


// general parameters
const repairPersent = 8;
const repairAmount = repairPersent / 100 * hp;

const repairTimeout = 3000;
const repairFrequency = 1000;

let repairId = setTimeout(repair, repairFrequency);

// initialization
const pve = document.querySelector('.pve__enemies');
const shopItems = document.querySelector('.shop__items');

const hpLine = document.querySelector('.ship__hp-line');
const hpValue = document.getElementById('hp_value');
const hpMax = document.getElementById('hp_max');

const exp = document.getElementById('exp');
const btc = document.getElementById('btc');
const lvl = document.getElementById('lvl');
const plt = document.getElementById('plt');

const rank = document.getElementById('ranks');
const nickname = document.querySelector('.ship__nickname');
const destroysStats = document.getElementById('info__destroys');
const aboutInfo = document.getElementById('info__about');
const howToPlay = document.getElementById('info__how');

// set absolute parameters:
hpMax.textContent = hp;

// parameters from CSS:
const hpLineWidth = parseInt(getComputedStyle(hpLine).width);

// registration
let user;
let registered = localStorage.getItem('reg');
registered ? getUserData() : createNewUser();
displayData();

function getUserData() {
    user = JSON.parse(localStorage.getItem('user'));
}

function createNewUser() {
    user = newUser;

    alert(welcome);
    user.nickname = prompt('Enter your nickname, please', '') || 'Your nickname';

    localStorage.setItem('reg', true);
    localStorage.setItem('user', JSON.stringify(user));
}

function displayData() {
    nickname.textContent = user.nickname;
    rank.className = `rank${user.rank}`;
    displayProfileInfo();
    updateHp();
}

// event listeners
pve.addEventListener('click', function(e) {
    console.log(user);
    let npc = e.target.dataset.enemy;
    if (!npc) return;

    clearTimeout(repairId);
    repairId = setTimeout(repair, repairTimeout);

    let hpBefore = user.hp;

    let damage = npcDamage[npc] - user.damage;
    let minDamage = npcDamage[npc] / 70;
    damage = Math.max(damage, minDamage);

    let hpAfter = Math.round(hpBefore - damage);

    let isDead = hpAfter <= 0;
    if (isDead) {
        dead();
        return;
    }

    destroySound.currentTime = 0;
    destroySound.play();

    user.destroys[npc]++;

    user.exp = +user.exp + rewards[npc].exp;
    user.btc = +user.btc + rewards[npc].btc;
    user.plt = +user.plt + rewards[npc].plt;
    user.hp = hpAfter;

    updateHp();
    updateLevel();
    updateRank();
    displayProfileInfo();
    saveData();
});

pve.onkeydown = e => !e.repeat;

destroysStats.onclick = e => alert(JSON.stringify(user.destroys, null, 2));

aboutInfo.onclick = e => alert(about);

howToPlay.onclick = e => alert(guide);

shopItems.addEventListener('click', function(e) {
    let button = e.target;
    if (e.target.tagName !== 'BUTTON') return;

    let currency = button.dataset.btc ? 'btc' : 'plt';

    let requiredAmount = button.dataset[currency];
    let currentAmount = currency === 'btc' ? user.btc : user.plt;
    let gunName = button.dataset.name;

    if (currentAmount < requiredAmount) {
        alert(`Not enough ${currency}`);
        return;
    }

    if (user.guns[gunName] >= 10) {
        alert(`You already have max ${gunName}`);
        return;
    }

    user[currency] -= requiredAmount;
    user.damage += gunDamage[gunName];
    user.guns[gunName]++;
    displayProfileInfo();
    saveData();
});

function dead() {
    localStorage.clear();

    deathSound.play();
    alert('You dead');

    location.reload();
}

function repair() {
    if (user.hp < hp - repairAmount) {
        let hpAfter = user.hp + repairAmount;
        hpLine.style.width = hpAfter / hp * hpLineWidth + 'px';
        hpValue.textContent = user.hp = hpAfter;

        repairId = setTimeout(repair, repairFrequency);
    } else {
        hpLine.style.width = hpLineWidth + 'px';
        hpValue.textContent = user.hp = hp;

        clearTimeout(repairId);
    }

    saveData();
}

function updateHp() {
    hpValue.textContent = user.hp;
    hpLine.style.width = user.hp / hp * hpLineWidth + 'px';
}

function updateLevel() {
    let levelBefore = user.lvl;
    let levelAfter = levels.find( lvl => lvl[1] >= user.exp )[0] - 1;

    if (levelAfter > levelBefore) {
        user.lvl = levelAfter;
        lvl.textContent = levelAfter;
    }
}

function updateRank() {
    let currentRank = ranks.find( rank => rank[1] >= user.exp )[0] - 1;
    user.rank = currentRank;

    rank.className = `rank${currentRank}`;
}

function saveData() {
    localStorage.setItem('user', JSON.stringify(user));
}

function displayProfileInfo() {
    let expStr = user.exp.toString();
    exp.textContent = addSpaces(expStr);

    let btcStr = user.btc.toString();
    btc.textContent = addSpaces(btcStr);

    let pltStr = user.plt.toString();
    plt.textContent = addSpaces(pltStr);

    lvl.textContent = user.lvl;
}