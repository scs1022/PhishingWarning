const palabrasClave = [
    "contraseña",
    "clave",
    "confirmación",
    "datos",
    "codigo",
    "verificar cuenta",
    "actualizar información",
    "haz clic aquí",
    "verificar",
    "verifica",
    "update",
    "notificación",
    // ... otras palabras clave ...
];

// Estilos para la notificación

// .custom-notification {
//     position: fixed;
//     bottom: 20px;
//     right: 20px;
//     background-color: #444;
//     color: white;
//     padding: 10px 20px;
//     border-radius: 5px;
//     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
//     max-width: 300px;
//     z-index: 9999;
//     display: none;
//   }
const styles = `

/* Estilo para la notificación inicial */
.initial-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(233, 246, 220,0.9); /* Cambiar a verde claro */
    color: black; /* Cambiar el color del texto a negro */
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    z-index: 9999;
    display: none;
}

/* Estilo para la notificación de asunto, remitente y contenido (gris) */
.alert-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #444;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    z-index: 9999;
    display: none;
}



  /* Estilo para centrar los iconos */
.icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px; /* Espacio superior para separarlos del texto */
}
.icon {
    width: 50px;
    height: 50px;
    margin: 0 10px; /* Margen horizontal para separar los iconos */
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const notification = document.createElement("div");
notification.className = "custom-notification";
document.body.appendChild(notification);

let correoAbiertoAnterior = null;

function marcarCorreosSospechosos() {
    const correos = document.querySelectorAll(".zA");
    correos.forEach((correo) => {
        const elementoAsunto = correo.querySelector(".bog");
        const asunto = elementoAsunto.textContent.toLowerCase();

        const esSospechoso = palabrasClave.some((palabra) =>
            asunto.includes(palabra)
        );

        if (
            esSospechoso &&
            !elementoAsunto.querySelector(".sospechoso-label")
        ) {
            const advertencia = document.createElement("span");
            advertencia.textContent = "[SOSPECHOSO]";
            advertencia.className = "sospechoso-label";
            advertencia.style.color = "red";
            advertencia.style.marginLeft = "5px";

            elementoAsunto.appendChild(advertencia);
        }
    });
}

function escanearCorreoDetalle() {
    const correoAbierto = document.querySelector(".nH.a98.iY");
    if (correoAbierto && correoAbierto !== correoAbiertoAnterior) {
        correoAbiertoAnterior = correoAbierto;

        let intentos = 0;
        const maxIntentos = 5;

        notification.classList.remove("custom-notification");
        notification.classList.remove("alert-notification");


        // Mostramos la notificación inicial "Analizando el Contenido..."
        notification.innerHTML = `
            <strong>Analizando el Contenido...</strong><br>
            <div class="icon-container">
                <img src="https://cdn.icon-icons.com/icons2/868/PNG/512/magnifier_icon-icons.com_67993.png" alt="Icono de lupa" class="icon">
                <img src="https://cdn-icons-png.flaticon.com/512/379/379988.png" alt="Icono de documento" class="icon">
            </div>
            `;
        notification.classList.add("initial-notification"); // Agrega la clase para el fondo verde claro
        notification.style.display = "block"; // Muestra la notificación

        const buscarAsunto = () => {
            const asuntoElement = correoAbierto.querySelector(".hP");
            const asunto = asuntoElement
                ? asuntoElement.textContent
                : "Asunto no encontrado";

            if (asunto || intentos >= maxIntentos) {
                const remitenteElement = correoAbierto.querySelector("[email]");
                const remitente = remitenteElement
                    ? remitenteElement.getAttribute("email")
                    : "Remitente no encontrado";

                const cuerpoElement =
                    correoAbierto.querySelector(".a3s") ||
                    correoAbierto.querySelector(".ii.gt");
                const cuerpo = cuerpoElement
                    ? cuerpoElement.textContent
                    : "Cuerpo no encontrado";

                // Ocultamos la notificación inicial
                notification.style.display = "none";
                notification.classList.remove("initial-notification");

                // Mostramos la notificación de asunto, remitente y contenido
                notification.innerHTML = `<strong>Asunto:</strong> ${asunto} <br>
                                          <strong>Remitente:</strong> ${remitente} <br>
                                          <strong>Extracto:</strong> ${cuerpo.slice(
                                              0,
                                              1000
                                          )}...`;
                notification.classList.add("alert-notification"); // Agrega la clase para el fondo verde claro
                notification.style.display = "block";

                // Ocultamos la notificación después de 5 segundos
                setTimeout(() => {
                    notification.style.display = "none";
                    notification.classList.remove("alert-notification");
                }, 5000);
            } else {
                intentos++;
                setTimeout(buscarAsunto, 1000); // Esperar 1 segundo antes de volver a intentar
            }
        };

        setTimeout(buscarAsunto, 5000); // Esperamos 5 segundos antes del primer intento
    }
}

const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
            marcarCorreosSospechosos();
            escanearCorreoDetalle();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

marcarCorreosSospechosos();
