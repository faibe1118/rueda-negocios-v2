document.addEventListener("DOMContentLoaded", cargarUsuario);

async function cargarUsuario() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const contenedor = document.getElementById("contenido");

    if (!token || role !== "adminSistema") {
        return (window.location.href = "./login.html");
    }

    try {
        const res = await fetch(`http://127.0.0.1:4000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = await res.json();

        if (!res.ok) {
            contenedor.innerHTML = `<p>Error: ${user.message}</p>`;
            return;
        }

        renderizarUsuario(user);

    } catch (error) {
        contenedor.innerHTML = `<p>Error de conexión con backend</p>`;
    }
}

function renderizarUsuario(user) {
    const c = document.getElementById("contenido");
    c.innerHTML = "";

    const agregar = (titulo, contenido) => {
        if (!contenido || contenido === "null" || contenido === "undefined") return;
        c.innerHTML += `
            <div class="card">
                <h2>${titulo}</h2>
                <p>${contenido}</p>
            </div>
        `;
    };

    const agregarArchivo = (titulo, filePath) => {
        if (!filePath) return;

        const url = `http://127.0.0.1:4000/${filePath.replace(/\\/g, "/")}`;

        c.innerHTML += `
            <div class="card archivo">
                <h2>${titulo}</h2>
                <a href="${url}" target="_blank">Ver archivo</a>
            </div>
        `;
    };

    // ----------------------------
    // DATOS GENERALES
    // ----------------------------
    agregar("Correo", user.email);
    agregar("Rol", user.role);
    agregar("Estado Registro", user.estadoRegistro);

    // ----------------------------
    // EMPRESA
    // ----------------------------
    agregar("Nombre de la Empresa", user.nombreEmpresa);
    agregar("Sector", user.sector);

    agregarArchivo("Logo de la Empresa", user.logoEmpresa);

    // ----------------------------
    // FORMALIZACIÓN / NO FORMALIZADA
    // ----------------------------

    if (!user.formalizada) {
        agregar("Empresa No Formalizada", "Sí");
        agregar("RUT Provisional", user.rutProvisional);
        agregarArchivo("RUT Provisional (archivo)", user.rutProvisionalFile);
        agregarArchivo("Comprobante de Matrícula", user.comprobanteMatricula);
        agregarArchivo("Cédula del Solicitante", user.cedulaSolicitanteFile);
    } else {
        agregar("Empresa Formalizada", "Sí");

        agregar("NIT", user.nit);
        agregarArchivo("RUT", user.rutFile);
        agregarArchivo("Certificado de Existencia", user.certificadoExistenciaFile);
        agregarArchivo("Cédula del Representante", user.cedulaRepresentanteFile);
    }

    // ----------------------------
    // CATÁLOGOS
    // ----------------------------
    agregarArchivo("Catálogo PDF", user.catalogoPDF);
    agregarArchivo("Necesidades PDF", user.necesidadesPDF);

    // ----------------------------
    // BOTONES DE APROBACIÓN
    // ----------------------------
    c.innerHTML += `
        <div style="margin-top: 30px;">
            <button onclick="cambiarEstado('${user._id}','aprobado')" style="background: green; color: white;">Aprobar</button>
            <button onclick="cambiarEstado('${user._id}','rechazado')" style="background: red; color: white;">Rechazar</button>
        </div>
    `;
}

async function cambiarEstado(id, estado) {
    const token = localStorage.getItem("token");

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
}

function volver() {
    window.location.href = "./gestion-usuarios.html";
}
