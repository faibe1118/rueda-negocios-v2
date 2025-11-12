document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ register.js cargado correctamente");

    const roleSelect = document.getElementById("role");
    const formalizadaSelect = document.getElementById("formalizada");
    const sectorSelect = document.getElementById("sector");

    const sectorOtroInput = document.getElementById("sectorOtro");
    const formalizadaDiv = document.getElementById("Formalizada");
    const noFormalizadaDiv = document.getElementById("noFormalizada");

    const datosEmpresa = document.querySelector("fieldset legend:textEquals('Datos de la empresa')")?.closest("fieldset") || document.querySelector("fieldset:nth-of-type(2)");
    const datosContacto = document.getElementById("datosContacto");
    const representante = [...document.querySelectorAll("fieldset legend")].find(el => el.textContent.includes("Representante"))?.closest("fieldset");
    const catalogos = [...document.querySelectorAll("fieldset legend")].find(el => el.textContent.includes("Catalogos"))?.closest("fieldset");

    // 🔧 Helper para ocultar o mostrar
    const mostrar = (el) => el && (el.style.display = "block");
    const ocultar = (el) => el && (el.style.display = "none");

    // Inicializar visibilidad
    ocultar(formalizadaDiv);
    ocultar(noFormalizadaDiv);
    ocultar(sectorOtroInput);
    ocultar(catalogos);

    // 🎯 Cambio en "Sector"
    sectorSelect.addEventListener("change", () => {
        if (sectorSelect.value === "Otro") mostrar(sectorOtroInput);
        else ocultar(sectorOtroInput);
    });

    // 🎯 Cambio en "Formalizada"
    formalizadaSelect.addEventListener("change", () => {
        if (formalizadaSelect.value === "true") {
            mostrar(formalizadaDiv);
            ocultar(noFormalizadaDiv);
        } else if (formalizadaSelect.value === "false") {
            mostrar(noFormalizadaDiv);
            ocultar(formalizadaDiv);
        } else {
            ocultar(formalizadaDiv);
            ocultar(noFormalizadaDiv);
        }
    });

    // 🎯 Cambio en "Rol"
    roleSelect.addEventListener("change", () => {
        const role = roleSelect.value;

        // Siempre ocultar todo lo variable al inicio
        ocultar(datosEmpresa);
        ocultar(datosContacto);
        ocultar(representante);
        ocultar(catalogos);

        const catalogoFile = document.getElementById("catalogoFile");
        const necesidadesFile = document.getElementById("necesidadesFile");

        // reset catálogo y necesidades
        catalogoFile.closest("label").style.display = "none";
        necesidadesFile.closest("label").style.display = "none";

        switch (role) {
            case "adminSistema":
                // Solo credenciales, todo oculto
                break;

            case "adminEvento":
                mostrar(datosEmpresa);
                mostrar(datosContacto);
                mostrar(representante);
                // sin catálogos
                break;

            case "ofertante":
                mostrar(datosEmpresa);
                mostrar(datosContacto);
                mostrar(representante);
                mostrar(catalogos);
                catalogoFile.closest("label").style.display = "block";
                break;

            case "demandante":
                mostrar(datosEmpresa);
                mostrar(datosContacto);
                mostrar(representante);
                mostrar(catalogos);
                necesidadesFile.closest("label").style.display = "block";
                break;

            default:
                // Si no hay selección
                ocultar(datosEmpresa);
                ocultar(datosContacto);
                ocultar(representante);
                ocultar(catalogos);
                break;
        }
    });

    console.log("✅ DOM cargado y listeners activos");
});
