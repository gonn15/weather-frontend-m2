function setTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
}


function obtenerLugar(id) {
    return lugares.find(lugar => lugar.id === Number(id));
}

function calcularEstadisticas(pronosticoSemanal) {

    let minima = pronosticoSemanal[0].min;
    let maxima = pronosticoSemanal[0].max;

    let suma = 0;

    let soleados = 0;
    let nublados = 0;
    let lluviosos = 0;

    for (let i = 0; i < pronosticoSemanal.length; i++) {

        const dia = pronosticoSemanal[i];

        if (dia.min < minima) minima = dia.min;

        if (dia.max > maxima) maxima = dia.max;

        suma += (dia.min + dia.max) / 2;

        if (dia.estado === "Soleado") {
            soleados++;
        } else if (dia.estado === "Nublado") {
            nublados++;
        } else if (dia.estado === "Lluvioso") {
            lluviosos++;
        }
    }

    const promedio = (suma / pronosticoSemanal.length).toFixed(1);

    let resumen = "";

    if (soleados >= nublados && soleados >= lluviosos) {
        resumen = "Semana mayormente soleada.";
    } else if (lluviosos >= soleados && lluviosos >= nublados) {
        resumen = "Semana con varias lluvias.";
    } else {
        resumen = "Semana mayormente nublada.";
    }

    return {
        minima,
        maxima,
        promedio,
        soleados,
        nublados,
        lluviosos,
        resumen
    };
}

function obtenerIconoClima(estado) {

    if (estado === "Soleado") {
        return '<i class="bi bi-sun-fill"></i>';
    }

    else if (estado === "Nublado") {
        return '<i class="bi bi-cloud-fill"></i>';
    }

    else if (estado === "Lluvioso") {
        return '<i class="bi bi-cloud-rain-fill"></i>';
    }

    return "";

}


    function mostrarHome() {

    const cityGrid = document.getElementById("cityGrid");

    if (!cityGrid) return;

    let html = "";

    lugares.forEach((lugar) => {

        html += `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">

    <div class="city-card text-center rounded cursor-pointer"
         data-id="${lugar.id}">

        <h5 class="city-card__title">
            ${lugar.nombre}
        </h5>

        <h3 class="city-card__temp">
            ${lugar.tempActual}°C
        </h3>

    <p class="city-card__status">

    ${obtenerIconoClima(lugar.estadoActual)}

    ${lugar.estadoActual}

    </p>

    </div>

</div>
`;

    });


    cityGrid.innerHTML = html;


    document.querySelectorAll(".city-card").forEach(card => {

        card.addEventListener("click", () => {

            const id = card.dataset.id;

            window.location.href = `detalles.html?id=${id}`;

        });

    });

}

function mostrarDetalle() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    const lugar = obtenerLugar(id);


    if (!lugar) return;


    document.getElementById("cityName").textContent = lugar.nombre;

    document.getElementById("temp").textContent = `${lugar.tempActual}°C`;

    document.getElementById("estado").textContent = lugar.estadoActual;



    // Pronóstico semanal

    const pronostico = document.getElementById("pronostico");

    let html = "";


    lugar.pronosticoSemanal.forEach(dia => {

       html += `

<div class="col-12 col-sm-6 col-md-4 col-lg-3">

    <div class="forecast-card">


        <h5 class="forecast-card__day">
            ${dia.dia}
        </h5>


        <div class="forecast-card__icon">

            ${obtenerIconoClima(dia.estado)}

        </div>


        <p class="forecast-card__status">
            ${dia.estado}
        </p>


        <div class="forecast-card__temperature">

            <span class="min">
                ${dia.min}°C
            </span>

            -

            <span class="max">
                ${dia.max}°C
            </span>

        </div>


    </div>

</div>

`;

    });


    pronostico.innerHTML = html;



    // Estadísticas

    const estadisticas = calcularEstadisticas(lugar.pronosticoSemanal);


    document.getElementById("estadisticas").innerHTML = `


<div class="col-6">

    <div class="statistics-card__item">

        <h5>
            Mínima
        </h5>

        <p>
            ${estadisticas.minima}°C
        </p>

    </div>

</div>


<div class="col-6">

    <div class="statistics-card__item">

        <h5>
            Máxima
        </h5>

        <p>
            ${estadisticas.maxima}°C
        </p>

    </div>

</div>


<div class="col-12">

    <div class="statistics-card__item">

        <h5>
            Promedio semanal
        </h5>

        <p>
            ${estadisticas.promedio}°C
        </p>

    </div>

</div>


<div class="col-4 text-center">
    ☀️
    <br>
    ${estadisticas.soleados}
</div>


<div class="col-4 text-center">
    ☁️
    <br>
    ${estadisticas.nublados}
</div>


<div class="col-4 text-center">
    🌧️
    <br>
    ${estadisticas.lluviosos}
</div>


<div class="col-12">

    <p class="statistics-card__summary">
        ${estadisticas.resumen}
    </p>

</div>


`;

}



document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("cityGrid")) {
        mostrarHome();
    }

    if (document.getElementById("pronostico")) {
        mostrarDetalle();
    }

});