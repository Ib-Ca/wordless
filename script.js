const adivina_boton = document.getElementById("adivina_boton");
const palabra_recibida = document.getElementById("adivina");
const grid = document.getElementById("grid");
const guesses = document.getElementById("intentos");
let diccionario = ["PERRO", "BARCO", "MESAS", "PATIO"];
var palabra_api = '';
let total_intentos = 6; //numero total de intentos
const mostrarModalBtn = document.getElementById('mostrarModal');
const modal = document.getElementById('miModal');
const cerrarModalBtn = document.getElementById('cerrarModal');
mostrarModalBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Cerrar modal cuando se hace clic en el botón de cierre (X)
cerrarModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Cerrar modal cuando se hace clic en cualquier parte del fondo oscuro
window.addEventListener('click', (event) => {
  if (event.target === modal) {
      modal.style.display = 'none';
  }
});

//Sacar la palabra de la API, es aleatoria, en español y de longitud 5
function palabra_API() {
  fetch("https://random-word-api.herokuapp.com/word?lang=es&length=5") //consigue la palabra de la API
    .then((Response) =>
      Response.json().then((data) => {
         palabra_api = data[0].toUpperCase();
        console.log(palabra_api);
      })
    )
    .catch((error) => {
      //en caso de que haya un error en la API, utiliza el diccionario para sacar una palabra random
      console.log(error);
      palabra_api = diccionario[Math.floor(Math.random() * diccionario.length)];
      console.log(palabra_api);
    });
}

adivina_boton.addEventListener("click", jugar); //llama a jugar si se presiona el boton
palabra_recibida.addEventListener("keydown", function (event) {
  //hace lo mismo que lo anterior si se apreta enter
  if (event.key === "Enter") {
    jugar();
  }
});
//al terminar el juego
function final(resultado) {
  palabra_recibida.disabled = true;
  guesses.innerHTML = resultado;
  adivina_boton.textContent = "Otra vez!";
  adivina_boton.addEventListener("click", function () {
    location.reload();
  });
}
//validar input recibido
function input_check(palabra) {
  if (/^[a-zA-Z]+$/.test(palabra)) {
    //admite solo numeros
    if (palabra.length !== 5) {
      //console.log("intento no valido");
      return false;
    } else {
      //console.log("intento valido");
      return true;
    }
  } else {
    //console.log("los numeros no estan permitidos");
    return false;
  }
}
function caracteres_error(resultado) {
  guesses.innerHTML = resultado;
}

function cln_error() {
  //elimina el mensaje de error de la pantalla
  guesses.innerHTML = "";
}

function jugar() {
  cln_error();
  const palabra = palabra_recibida.value.toUpperCase();
  if (!input_check(palabra)) {
    caracteres_error(
      "Debe ingresar 5 letras y no se permiten numeros ni simbolos"
    );
    return;
  }
  if (palabra === palabra_api) {
    final("<p class='resultado'>GANASTEEEEEE!!!!</p>");
    return;
  }
  const row = document.createElement("div");
  row.className = "row";
  for (let i = 0; i < palabra_api.length; i++) {
    const span = document.createElement("span");
    span.className = "letter";
    if (palabra[i] === palabra_api[i]) {
      span.innerHTML = palabra[i];
      span.style.backgroundColor = "#79b851"; //verde
    } else if (palabra_api.includes(palabra[i])) {
      span.innerHTML = palabra[i];
      span.style.backgroundColor = "#f3c237"; //amarillo
    } else {
      span.innerHTML = palabra[i];

      span.style.backgroundColor = "#a4aec4"; //gris
    }
    row.appendChild(span);
  }
  grid.appendChild(row);
  total_intentos--;

  if (total_intentos === 0) {
    final("<p class='resultado'>NAO NAO PERDISTE</p>");
  }
}

palabra_API();
