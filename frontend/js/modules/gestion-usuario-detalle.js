document.addEventListener("DOMContentLoaded", cargarDetalles);

async function cargarDetalles() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "adminSistema") {
        alert("Acceso no autorizado");
        return (window.location.href = "./login.html");
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("detallesUsuario").innerHTML = "<p>Error: ID inválido</p>";
        return;
    }

    try {
        const res = await fetch(`http://127.0.0.1:4000/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = await res.json();

        if (!res.ok) {
            document.getElementById("detallesUsuario").innerHTML =
                `<p>Error al cargar usuario: ${user.message}</p>`;
            return;
        }

        renderDetalles(user);

    } catch (error) {
        document.getElementById("detallesUsuario").innerHTML =
            "<p>Error de conexión con el servidor</p>";
    }
}

function renderDetalles(user) {
    const container = document.getElementById("detallesUsuario");

    const fileLink = file =>
        file ? `<a href="http://127.0.0.1:4000/${file}" target="_blank">Ver archivo</a>` : "No adjuntado";

    container.innerHTML = `
        <h2>${user.nombreEmpresa || "Sin nombre de empresa"}</h2>

        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Rol:</strong> ${user.role}</p>
        <p><strong>Estado de registro:</strong> ${user.estadoRegistro}</p>
        <hr>

        <h3>Información general</h3>
        <p><strong>Sector:</strong> ${user.sector || "No especificado"}</p>
        <p><strong>Formalizada:</strong> ${user.formalizada ? "Sí" : "No"}</p>

        <h3>Documentos cargados</h3>
        <p><strong>Logo empresa:</strong> ${fileLink(user.logoEmpresa)}</p>

        ${
            user.formalizada
                ? `
                <p><strong>NIT:</strong> ${user.nit || "No registrado"}</p>
                <p><strong>RUT:</strong> ${fileLink(user.rutFile)}</p>
                <p><strong>Certificado existencia:</strong> ${fileLink(user.certificadoExistenciaFile)}</p>
                <p><strong>Cédula representante:</strong> ${fileLink(user.cedulaRepresentanteFile)}</p>
            `
                : `
                <p><strong>RUT Provisional:</strong> ${user.rutProvisional || "No registrado"}</p>
                <p><strong>Archivo RUT provisional:</strong> ${fileLink(user.rutProvisionalFile)}</p>
                <p><strong>Comprobante de matrícula:</strong> ${fileLink(user.comprobanteMatricula)}</p>
                <p><strong>Cédula solicitante:</strong> ${fileLink(user.cedulaSolicitanteFile)}</p>
            `
        }

        <h3>Catálogos</h3>
        <p><strong>Catálogo PDF:</strong> ${fileLink(user.catalogoPDF)}</p>
        <p><strong>Necesidades PDF:</strong> ${fileLink(user.necesidadesPDF)}</p>

        <hr>
        <button onclick="cambiarEstado('${user._id}', 'aprobado')">✔ Aprobar</button>
        <button onclick="cambiarEstado('${user._id}', 'rechazado')">✖ Rechazar</button>
    `;
}

async function cambiarEstado(id, estado) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://127.0.0.1:4000/api/users/${id}/estado`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ estado })
        });

        const data = await res.json();
        alert(data.message);

        window.location.href = "./gestion-usuarios.html";

    } catch (error) {
        alert("Error de conexión");
    }
}

function volver() {
    window.location.href = "./gestion-usuarios.html";
}
