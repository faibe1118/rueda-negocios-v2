console.log("✅ register.js cargado correctamente");

// === register.js ===

// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    // Elementos clave
    const roleSelect = document.getElementById("role");
    const formalizadaSelect = document.getElementById("formalizada");
    const sectorSelect = document.getElementById("sector");

    const sectorOtroInput = document.getElementById("sectorOtro");
    const formalizadaDiv = document.getElementById("Formalizada");
    const noFormalizadaDiv = document.getElementById("noFormalizada");
    const catalogoFile = document.getElementById("catalogoFile");
    const necesidadesFile = document.getElementById("necesidadesFile");

    // Ocultar secciones al inicio
    formalizadaDiv.style.display = "none";
    noFormalizadaDiv.style.display = "none";
    catalogoFile.closest("fieldset").style.display = "none"; // Ocultar catálogo inicialmente

    // === Cambios según el sector ===
    sectorSelect.addEventListener("change", () => {
        if (sectorSelect.value === "Otro") {
            sectorOtroInput.style.display = "block";
        } else {
            sectorOtroInput.style.display = "none";
            sectorOtroInput.value = "";
        }
    });

    // === Cambios según formalización ===
    formalizadaSelect.addEventListener("change", () => {
        if (formalizadaSelect.value === "true") {
            formalizadaDiv.style.display = "block";
            noFormalizadaDiv.style.display = "none";
        } else if (formalizadaSelect.value === "false") {
            formalizadaDiv.style.display = "none";
            noFormalizadaDiv.style.display = "block";
        } else {
            formalizadaDiv.style.display = "none";
            noFormalizadaDiv.style.display = "none";
        }
    });

    // === Cambios según el rol ===
    roleSelect.addEventListener("change", () => {
        const role = roleSelect.value;

        // Mostrar catálogo/needs según el rol
        if (role === "ofertante") {
            catalogoFile.closest("fieldset").style.display = "block";
            catalogoFile.parentElement.style.display = "block";
            necesidadesFile.parentElement.style.display = "none";
        } else if (role === "demandante") {
            catalogoFile.closest("fieldset").style.display = "block";
            catalogoFile.parentElement.style.display = "none";
            necesidadesFile.parentElement.style.display = "block";
        } else if (role === "adminEvento") {
            catalogoFile.closest("fieldset").style.display = "none"; // no muestra catálogo/needs
        } else if (role === "adminSistema") {
            catalogoFile.closest("fieldset").style.display = "none";
            document.getElementById("datosContacto").style.display = "none";
            document.querySelector("fieldset legend:contains('Representante')")?.closest("fieldset").style.display = "none";
            document.querySelector("fieldset legend:contains('Datos de la empresa')")?.closest("fieldset").style.display = "none";
        } else {
            catalogoFile.closest("fieldset").style.display = "none";
        }
    });

    // === Envío del formulario ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost:4000/api/users/register", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Registro exitoso");
                console.log("Usuario registrado:", data);
                form.reset();
            } else {
                alert("❌ Error: " + (data.message || "No se pudo registrar"));
                console.error(data);
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Error al conectar con el servidor");
        }
    });
});
