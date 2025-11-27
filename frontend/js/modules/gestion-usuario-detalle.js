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

    // Mostrar detalles bonitos
    document.getElementById("detallesUsuario").innerHTML = `
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Rol:</strong> ${data.role}</p>
        <p><strong>Estado registro:</strong> ${data.estadoRegistro}</p>
        <p><strong>Nombre Empresa:</strong> ${data.nombreEmpresa || "No aplica"}</p>
        <p><strong>Sector:</strong> ${data.sector || "No aplica"}</p>
        <p><strong>Formalizada:</strong> ${data.formalizada}</p>
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