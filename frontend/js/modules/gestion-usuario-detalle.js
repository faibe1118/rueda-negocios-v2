document.addEventListener("DOMContentLoaded", cargarDetalles);

async function cargarDetalles() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "adminSistema") {
        return (window.location.href = "./login.html");
    }

    try {
        const res = await fetch(`http://127.0.0.1:4000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = await res.json();

        if (!res.ok) {
            document.getElementById("detallesUsuario").innerHTML = "Error al cargar detalles.";
            return;
        }

        mostrarDetalles(user);

    } catch (err) {
        document.getElementById("detallesUsuario").innerHTML = "Error de conexión.";
    }
}

function mostrarDetalles(user) {
    const cont = document.getElementById("detallesUsuario");
    cont.innerHTML = "";

    const crearCampo = (titulo, valor) => {
        if (!valor) return "";
        return `<p><strong>${titulo}:</strong> ${valor}</p>`;
    };

    const crearArchivo = (titulo, ruta) => {
        if (!ruta) return "";
        return `
            <p>
                <strong>${titulo}:</strong>
                <a href="http://127.0.0.1:4000/${ruta}" target="_blank">
                    Descargar archivo
                </a>
            </p>`;
    };

    cont.innerHTML += `
        <h2>Información General</h2>
        ${crearCampo("Email", user.email)}
        ${crearCampo("Rol", user.role)}
        ${crearCampo("Estado", user.estadoRegistro)}

        <h3>Información Empresarial</h3>
        ${crearCampo("Nombre Empresa", user.nombreEmpresa)}
        ${crearCampo("Sector", user.sector)}
        ${crearCampo("Formalizada", user.formalizada ? "Sí" : "No")}
    `;

    cont.innerHTML += `
        <h3>Documentos</h3>
        ${crearArchivo("Logo de Empresa", user.logoEmpresa)}
        ${crearArchivo("RUT Provisional", user.rutProvisionalFile)}
        ${crearArchivo("Comprobante Matrícula", user.comprobanteMatricula)}
        ${crearArchivo("Cédula Solicitante", user.cedulaSolicitanteFile)}

        ${crearArchivo("RUT", user.rutFile)}
        ${crearArchivo("Certificado Existencia", user.certificadoExistenciaFile)}
        ${crearArchivo("Cédula Representante", user.cedulaRepresentanteFile)}

        ${crearArchivo("Catálogo PDF", user.catalogoPDF)}
        ${crearArchivo("Necesidades PDF", user.necesidadesPDF)}
    `;
}

async function cambiarEstado(nuevoEstado) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:4000/api/users/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
    });

    const data = await res.json();
    alert(data.message);

    window.location.href = "./gestion-usuarios.html";
}

function volver() {
    window.history.back();
}
