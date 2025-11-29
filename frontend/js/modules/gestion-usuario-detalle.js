document.addEventListener("DOMContentLoaded", cargarDetalle);

async function cargarDetalle() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "adminSistema") {
        alert("Acceso no autorizado");
        return window.location.href = "./login.html";
    }

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const res = await fetch(`http://127.0.0.1:4000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) {
        document.getElementById("detallesUsuario").innerHTML =
            `<p>Error al cargar los datos</p>`;
        return;
    }

    // Construir HTML dinámico
    const html = [];

    // 📌 Datos básicos
    html.push(`
        <h3>Datos Básicos</h3>
        ${campo("Email", data.email)}
        ${campo("Rol", data.role)}
        ${campo("Estado Registro", data.estadoRegistro)}
    `);

    // 📌 Datos de empresa (según rol)
    if (data.role !== "adminSistema") {
        html.push(`<h3>Datos de Empresa</h3>`);
        html.push(`
            ${campo("Nombre Empresa", data.nombreEmpresa)}
            ${campo("Sector", data.sector)}
            ${campo("Sector Otro", data.sectorOtro)}
            ${campo("NIT", data.nit)}
            ${campo("Formalizada", data.formalizada)}
        `);

        // 📌 Archivos de empresa
        html.push("<h4>Archivos de Empresa</h4>");
        html.push(`
            ${archivo("Logo Empresa", data.logoEmpresa)}
            ${archivo("RUT", data.rutProvisional)}
            ${archivo("Certificado Existencia", data.documentosFormalizados?.certificadoExistencia)}
            ${archivo("Cédula Representante", data.documentosFormalizados?.cedulaRepresentante)}
            ${archivo("Documento No Formalizada", data.documentosNoFormalizados?.documentoNoFormalizada)}
        `);
    }

    // 📌 Representante
    if (data.representante) {
        html.push(`<h3>Datos del Representante</h3>`);
        html.push(`
            ${campo("Nombre Representante", data.representante.nombre)}
            ${campo("Cargo", data.representante.cargo)}
            ${campo("Documento", data.representante.documento)}
            ${campo("Teléfono", data.representante.telefono)}
            ${campo("Correo", data.representante.correo)}
        `);
    }

    // 📌 Datos de contacto
    if (data.datosContacto) {
        html.push(`<h3>Datos de Contacto</h3>`);
        html.push(`
            ${campo("Dirección", data.datosContacto.direccion)}
            ${campo("Redes Sociales", data.datosContacto.redesSociales)}
        `);
    }

    // 📌 Catálogos (solo ofertante)
    if (data.role === "ofertante" && data.catalogoPDF) {
        html.push(`<h3>Catálogos</h3>`);
        html.push(archivo("Catálogo PDF", data.catalogoPDF));
    }

    // 📌 Necesidades (solo demandante)
    if (data.role === "demandante" && data.necesidadesPDF) {
        html.push(`<h3>Necesidades</h3>`);
        html.push(archivo("Necesidades PDF", data.necesidadesPDF));
    }

    document.getElementById("detallesUsuario").innerHTML = html.join("");
}

// 🔧 FUNCIONES UTILITARIAS

function campo(nombre, valor) {
    if (!valor) return "";
    return `<p><strong>${nombre}:</strong> ${valor}</p>`;
}

function archivo(nombre, ruta) {
    if (!ruta) return "";
    return `
        <p><strong>${nombre}:</strong> 
        <a href="http://127.0.0.1:4000${ruta}" target="_blank">Descargar</a></p>
    `;
}

async function cambiarEstado(estado) {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const res = await fetch(`http://127.0.0.1:4000/api/users/${userId}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
        window.location.href = "./gestion-usuarios.html";
    }
}

function volver() {
    window.history.back();
}
