const pantalla = document.querySelector("input[type='text']");
let operacionRecienTerminada = false;
let errorMultiplesPuntos = false;
let resultado = 0;
let operacion = "";
const teclasOperacion = document.querySelectorAll("input[type='button'].operacion, input[type='button'].igual");
const backgroundModal = document.querySelector(".background-modal");

pantalla.value = "0";

// Añadir evento click a los botones de la calculara. Se ejecuta la función "click" con el objeto "input" como parámetro
document.querySelectorAll("input[type='button']").forEach(input => input.addEventListener('click', e => click(e.target)));

// Dependiendo del botón en el que se haga click, se ejecutará una función
function click(input) {
// Se ejecuta la función resetearCalculadora si al hacer click, previamente se realizaron acciones que podrían distorsionar
// los futuros resultados
	if (pantalla.value == "Err"
		|| (operacionRecienTerminada && 
			(
				input.classList.contains("numero")
				|| input.classList.contains("punto")
			)
		)
	) resetearCalculadora();

	if (input.classList.contains("numero")) clickNumero(input);

	if (input.classList.contains("punto")) {
		if (!pantalla.value.includes(".")) {
			clickNumero(input);
		} else {
			pantalla.value = "Err";
			errorMultiplesPuntos = true;
			bloquearTeclasOperacion(true);
		}
	}

	if (input.classList.contains("operacion")) clickOperacion(input);

	if (input.classList.contains("igual")) igual();

	if (input.classList.contains("reset")) resetearCalculadora(true);
}

// Función que resetea completamente la calculadora.
// El parámetro reset indica si la función está siendo activada por el botón "c"
function resetearCalculadora(reset = false) {
	pantalla.value = "0";
	resultado = 0;
	operacion = "";
	operacionRecienTerminada = false;
	errorMultiplesPuntos = false;

	if (!reset) {
		bloquearTeclasOperacion(false);
	}
}

function clickNumero(input) {
	if (
		pantalla.value == "/"
		|| pantalla.value == "-"
		|| pantalla.value == "*"
		|| pantalla.value == "+"
		|| pantalla.value == "Err"
		|| pantalla.value == "0"
	) {
		pantalla.value = "";
	}

	if (!operacionRecienTerminada) {
		pantalla.value += input.value;
	} else {
		resetearCalculadora();
		pantalla.value = input.value;
	}
}

function clickOperacion(input) {
	// Sólo trabaja cuando hay números en la pantalla
	if (
		pantalla.value != "/"
		&& pantalla.value != "-"
		&& pantalla.value != "*"
		&& pantalla.value != "+"
		&& pantalla.value != "Err"
	) {
		// Se gestiona si es una cadena de operaciones o es la primera operación que se realiza 
		if (operacion == "") {
			// Si únicamente se introduce un ".", se guarda en resultado como "0"
			if (pantalla.value != ".") {
				resultado = parseFloat(pantalla.value);
			} else {
				resultado = 0;
			}

			operacion = input.dataset.operation;
			pantalla.value = input.value;
		} else {
			if (!operacionRecienTerminada) {
				ejecutarOperacion();
			} else {
				operacionRecienTerminada = false;
			}

			operacion = input.dataset.operation;
			pantalla.value = input.value;
		}
	}

	// Sólo trabaja cuando hay un operador en la pantalla
	if (
		pantalla.value == "/"
		|| pantalla.value == "-"
		|| pantalla.value == "*"
		|| pantalla.value == "+"
	) {
		operacion = input.dataset.operation;
		pantalla.value = input.value;
	}

	// Sólo trabaja cuando aparece "Err" en la pantalla
	if (resultado == "Err") {
		pantalla.value = "Err"
		bloquearTeclasOperacion(true);
	}
}

function ejecutarOperacion() {
	// Cuando únicamente hay "." en la pantalla, se sustituye internamente por "0"
	switch (operacion) {
		case "/":
			if (pantalla.value != "0") {
				if (pantalla.value != ".") {
					resultado = resultado / parseFloat(pantalla.value);
				} else {
					resultado = "Err";
				}
			} else {
				resultado = "Err";
			}
			break;
		case "-":
		if (pantalla.value != ".") {
			resultado = resultado - parseFloat(pantalla.value);
		} else {
			resultado = resultado - 0;
		}	
			break;
		case "*":
		if (pantalla.value != ".") {
			resultado = resultado * parseFloat(pantalla.value);
		} else {
			resultado = resultado * 0;
		}	
			break;
		case "+":
		if (pantalla.value != ".") {
			resultado = resultado + parseFloat(pantalla.value);
		} else {
			resultado = resultado + 0;
		}	
			break;
		default:
			break;
	}
}

function bloquearTeclasOperacion(bloquear) {
	// Además de mostrar el modal, en caso de división por "0", deshabilita teclasOperacion
	// para que no se pueda arrastrar el error en sucesivas operaciones
	if (bloquear == true) {
		teclasOperacion.forEach(input => input.setAttribute("disabled", ""));
	} else {
		teclasOperacion.forEach(input => input.removeAttribute("disabled", ""));
	}
}

function igual() {
	// El botón igual únicamente funciona si se está realizando una operación.
	// Y activará la variable booleana operaciRecienTerminada que se utiliza en diferentes puntos del código para filtrar comportamientos
	if (operacion != "" && !operacionRecienTerminada) {
		ejecutarOperacion();
		pantalla.value = resultado;
		operacionRecienTerminada = true;
	}

	if (pantalla.value == "Err") {
		bloquearTeclasOperacion(true);
	}
}

// Desconecta el modal y resetea la calculadora
backgroundModal.addEventListener('click', () => {
	resetearCalculadora();
});