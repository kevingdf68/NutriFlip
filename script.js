let timeLeft = 0;
let timerInterval = null;

const tempoPorFase = {
  fase1: 75,
  fase2: 60,
  fase3: 45,
  fase4: 30
};
const errorSound = new Audio("assets/erro.mp3");
const flipSound = new Audio("assets/flip.mp3");
const fruits = [
  { name: 'Banana', emoji: '🍌', benefit: 'Rica em potássio, ajuda na digestão e energia' },
  { name: 'Maçã', emoji: '🍎', benefit: 'Fonte de fibras e boa para o coração' },
  { name: 'Morango', emoji: '🍓', benefit: 'Rico em vitamina C e antioxidantes' },
  { name: 'Uva', emoji: '🍇', benefit: 'Melhora a circulação e tem antioxidantes' },
  { name: 'Coco', emoji: '🥥', benefit: 'Hidrata e fornece minerais' },
  { name: 'Cereja', emoji: '🍒', benefit: 'Ajuda na inflamação e saúde cardiovascular' }
];

const faseConfig = {
  1: { pares: 3, bgClass: 'fase-1' },
  2: { pares: 4, bgClass: 'fase-2' },
  3: { pares: 5, bgClass: 'fase-3' },
  4: { pares: 6, bgClass: 'fase-4' }
};

let revealed = [];
let lock = false;

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function goHome() {
 clearInterval(timerInterval);
 document.body.className = 'menu-inicial';
  document.getElementById("gameBoard").innerHTML = "";
  document.getElementById("popup").classList.add("hidden");
  show("menu");
}

function showPhaseMenu() {
  show("faseMenu");
  document.body.className = 'fase-menu';
}

function startGame(fase) {
  const config = faseConfig[fase];
  document.body.className = config.bgClass;
  show("game");

  document.getElementById("faseTitle").innerText = `Fase ${fase}`;
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";
  revealed = [];
  lock = false;

  const selected = fruits.slice(0, config.pares);
  const cards = shuffle([...selected, ...selected]);
clearInterval(timerInterval); // limpa o anterior

timeLeft = tempoPorFase[`fase${fase}`] || 60;
 // usa o valor específico
document.getElementById("timer").innerText = timeLeft;

timerInterval = setInterval(() => {
  timeLeft--;
  document.getElementById("timer").innerText = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    showPopup("⏰ Tempo esgotado!");
    setTimeout(() => {
      goHome();
    }, 2000);
  }
}, 1000);
  cards.forEach((fruit, i) => {
   const card = document.createElement("div");
card.className = "card";
card.dataset.index = i;

card.innerHTML = `
  <div class="card-inner">
    <div class="card-front">?</div>
    <div class="card-back">${fruit.emoji}</div>
  </div>
`;

card.onclick = () => {
  if (lock || card.classList.contains("revealed") || card.classList.contains("matched")) return;
  handleCard(card, fruit);
};

board.appendChild(card);

  });
}

function handleCard(card, fruit) {
  // Toca o som ao virar
  flipSound.currentTime = 0;
  flipSound.play();

  card.classList.add("revealed");
  revealed.push({ card, fruit });

  if (revealed.length === 2) {
    const [a, b] = revealed;
    lock = true;

    if (a.fruit.name === b.fruit.name && a.card !== b.card) {
      showPopup(a.fruit.benefit);
      a.card.classList.add("matched");
      b.card.classList.add("matched");
      revealed = [];
      setTimeout(() => {
        lock = false;
        if (document.querySelectorAll(".card:not(.matched)").length === 0) {
          showPopup("Parabéns! Você finalizou a fase!");
        }
      }, 800);
    } else {
     errorSound.currentTime = 0;
errorSound.play();

setTimeout(() => {
  a.card.classList.remove("revealed");
  b.card.classList.remove("revealed");
  revealed = [];
  lock = false;
}, 1000);

    }
  }
}

function showPopup(text) {
  document.getElementById("benefitText").innerText = text;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function showAjudaMenu() {
  show("ajudaMenu");
  document.body.className = 'ajuda-menu';
}

function showTelaAjuda(tipo) {
  show("telaAjuda");
  document.body.className = 'ajuda-' + tipo;

  const titulo = {
    termo: "📜 Termo de Serviço",
    privacidade: "🔒 Política de Privacidade",
    dicas: "🍏 Dicas para Jogar",
    sobre: "❤️ Sobre Nós"
  };

  const texto = {
    termo: `Ao utilizar nosso jogo da memória de frutas, você concorda em usá-lo de forma pessoal e recreativa...`,
    privacidade: `Nosso jogo foi desenvolvido com foco na diversão e segurança. Não coletamos nem armazenamos dados...`,
    dicas: `Preste atenção nas frutas que já viu. A memória é sua aliada! Tente lembrar as posições e divirta-se aprendendo.`,
    sobre: `Criado para educar e entreter, o NutriFlip promove hábitos saudáveis através de um jogo divertido de memória.`
  };

  document.getElementById("ajudaTitulo").innerText = titulo[tipo];
  document.getElementById("ajudaTexto").innerText = texto[tipo];
}
