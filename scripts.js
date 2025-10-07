const categorias = {
  deportes: ["futbol", "baloncesto", "tenis", "natacion"],
  objetos: ["mesa", "silla", "ordenador", "libro"],
  colores: ["rojo", "azul", "verde", "amarillo"]
};

let palabraSecreta = "";
let oculta = [];
let errores = 0;
const maxErrores = 6;
let letrasAdivinadas = [];

// Elementos del DOM
const categoriaSelect = document.getElementById("categoria");
const iniciarBtn = document.getElementById("iniciar");
const juegoDiv = document.getElementById("juego");
const palabraOcultaP = document.getElementById("palabraOculta");
const erroresP = document.getElementById("errores");
const letrasP = document.getElementById("letras");
const letraInput = document.getElementById("letraInput");
const probarBtn = document.getElementById("probarLetra");
const mensajeFinal = document.getElementById("mensajeFinal");
const reiniciarBtn = document.getElementById("reiniciar");
const ahorcadoDiv = document.getElementById("ahorcado");

// --- Crear las partes del ahorcado ---
const partes = [
  "cabeza",
  "cuerpo",
  "brazoIzq",
  "brazoDer",
  "piernaIzq",
  "piernaDer"
];

// --- Teclado virtual ---
function crearTeclado() {
  let tecladoDiv = document.getElementById("tecladoVirtual");
  if (!tecladoDiv) {
    tecladoDiv = document.createElement("div");
    tecladoDiv.id = "tecladoVirtual";
    tecladoDiv.style.marginTop = "15px";
    juegoDiv.appendChild(tecladoDiv);
  }
  tecladoDiv.innerHTML = "";
  const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  for (let letra of letras) {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.className = "tecla";
    btn.disabled = false;
    btn.onclick = () => {
      probarLetraVirtual(letra.toLowerCase(), btn);
    };
    tecladoDiv.appendChild(btn);
  }
}

function actualizarTeclado() {
  const tecladoDiv = document.getElementById("tecladoVirtual");
  if (!tecladoDiv) return;
  const botones = tecladoDiv.querySelectorAll("button");
  botones.forEach(btn => {
    if (letrasAdivinadas.includes(btn.textContent.toLowerCase())) {
      btn.disabled = true;
    }
  });
}

function probarLetraVirtual(letra, btn) {
  if (letrasAdivinadas.includes(letra)) return;
  letrasAdivinadas.push(letra);

  if (palabraSecreta.includes(letra)) {
    for (let i = 0; i < palabraSecreta.length; i++) {
      if (palabraSecreta[i] === letra) oculta[i] = letra;
    }
  } else {
    errores++;
    mostrarParte(errores);
  }

  btn.disabled = true;
  actualizarPantalla();
  verificarEstado();
}

// --- Dibujo del ahorcado ---
function dibujarAhorcado() {
  ahorcadoDiv.innerHTML = `
    <div class="base"></div>
    <div class="poste"></div>
    <div class="brazo"></div>
    <div class="cuerda"></div>
    <div class="cabeza"></div>
    <div class="cuerpo"></div>
    <div class="brazoIzq"></div>
    <div class="brazoDer"></div>
    <div class="piernaIzq"></div>
    <div class="piernaDer"></div>
  `;
  partes.forEach(p => {
    document.querySelector("." + p).style.display = "none";
  });
}

// --- Iniciar juego ---
iniciarBtn.addEventListener("click", () => {
  const categoria = categoriaSelect.value;
  const palabras = categorias[categoria];
  palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
  oculta = Array(palabraSecreta.length).fill("_");
  errores = 0;
  letrasAdivinadas = [];
  mensajeFinal.textContent = "";
  reiniciarBtn.classList.add("hidden");
  dibujarAhorcado();
  actualizarPantalla();
  crearTeclado();
  juegoDiv.classList.remove("hidden");
  letraInput.value = "";
  letraInput.disabled = false;
  probarBtn.disabled = false;
});

// --- Probar letra desde input ---
probarBtn.addEventListener("click", () => {
  const letra = letraInput.value.toLowerCase();
  letraInput.value = "";

  if (!letra.match(/^[a-zñ]$/)) {
    alert("Por favor, ingresa una sola letra válida.");
    return;
  }

  if (letrasAdivinadas.includes(letra)) {
    alert("Ya intentaste esa letra.");
    return;
  }

  letrasAdivinadas.push(letra);

  if (palabraSecreta.includes(letra)) {
    for (let i = 0; i < palabraSecreta.length; i++) {
      if (palabraSecreta[i] === letra) oculta[i] = letra;
    }
  } else {
    errores++;
    mostrarParte(errores);
  }

  actualizarPantalla();
  actualizarTeclado();
  verificarEstado();
});

// --- Actualizar pantalla ---
function actualizarPantalla() {
  palabraOcultaP.textContent = oculta.join(" ");
  erroresP.textContent = `Errores: ${errores} / ${maxErrores}`;
  letrasP.textContent = `Letras intentadas: ${letrasAdivinadas.join(", ")}`;
  actualizarTeclado();
}

// --- Mostrar parte del cuerpo ---
function mostrarParte(num) {
  if (num > 0 && num <= partes.length) {
    document.querySelector("." + partes[num - 1]).style.display = "block";
  }
}

// --- Verificar estado del juego ---
function verificarEstado() {
  if (!oculta.includes("_")) {
    mensajeFinal.textContent = `🎉 ¡Ganaste! La palabra era "${palabraSecreta}".`;
    juegoDiv.classList.add("hidden");
    reiniciarBtn.classList.remove("hidden");
  } else if (errores >= maxErrores) {
    mensajeFinal.textContent = `💀 Ahorcado. La palabra era "${palabraSecreta}".`;
    juegoDiv.classList.add("hidden");
    reiniciarBtn.classList.remove("hidden");
  }
}

// --- Reiniciar juego ---
reiniciarBtn.addEventListener("click", () => {
  mensajeFinal.textContent = "";
  juegoDiv.classList.add("hidden");
  reiniciarBtn.classList.add("hidden");
  const tecladoDiv = document.getElementById("tecladoVirtual");
  if (tecladoDiv) tecladoDiv.innerHTML = "";
});