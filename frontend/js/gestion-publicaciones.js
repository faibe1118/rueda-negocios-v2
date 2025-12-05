document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data (Publicaciones) ---
    const eventsData = [
        {
            id: 1,
            title: "Catálogo de Productos 2024",
            description: "Catálogo completo de maquinaria industrial y repuestos.",
            fullDescription: "Versión actualizada del catálogo anual. Incluye especificaciones técnicas, nuevos modelos de la serie X-200 y lista de precios sugeridos. Formato PDF de alta resolución.",
            date: "2024-12-04",
            location: "Industrial Corp", // Using as "Empresa/Departamento"
            category: "Manufactura",
            capacity: "5MB", // Used as size
            status: "pending",
            creator: "Industrial Corp",
            type: "Catálogo"
        },
        {
            id: 2,
            title: "Brochure de Servicios IT",
            description: "Resumen de servicios de consultoría y desarrollo de software.",
            fullDescription: "Documento presentacional para clientes potenciales. Detalla nuestra metodología ágil, casos de éxito y tecnologías soportadas (React, Node, Go).",
            date: "2024-12-03",
            location: "Tech Solutions",
            category: "Tecnología",
            capacity: "2.4MB",
            status: "pending",
            creator: "Tech Solutions Inc.",
            type: "Brochure"
        },
        {
            id: 3,
            title: "Lista de Precios Mayorista",
            description: "Lista de precios exclusiva para distribuidores certificados.",
            fullDescription: "Contiene precios FOB y CIF para envíos internacionales. Válido para el Q1 2025. Requiere confidencialidad.",
            date: "2024-11-20",
            location: "Import/Export Global",
            category: "Logística",
            capacity: "1.2MB",
            status: "approved",
            creator: "Global Trade Ltd.",
            type: "Lista de Precios"
        },
        {
            id: 4,
            title: "Oferta de Temporada",
            description: "Promociones especiales de fin de año.",
            fullDescription: "Descuentos de hasta el 40% en excedentes de inventario. Válido hasta agotar existencias.",
            date: "2024-12-01",
            location: "Retail Group",
            category: "Comercio",
            capacity: "800KB",
            status: "rejected",
            creator: "Retail Group SA",
            type: "Promoción"
        }
    ];

    // --- State ---
    let currentTab = 'all';
    let currentEventId = null;

    // --- Elements ---
    const grid = document.getElementById('events-grid');
    const tabs = document.querySelectorAll('.tab-btn');
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal');
    const btnApprove = document.getElementById('btn-approve');
    const btnReject = document.getElementById('btn-reject');

    // --- Render Functions ---
    function renderEvents() {
        grid.innerHTML = '';
        let filteredEvents;
        
        if (currentTab === 'all') {
            filteredEvents = eventsData;
        } else {
            filteredEvents = eventsData.filter(event => event.status === currentTab);
        }

        if (filteredEvents.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No hay publicaciones ${currentTab === 'all' ? 'registradas' : currentTab + 's'}.</div>`;
            return;
        }

        filteredEvents.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.onclick = () => openModal(event);

            let statusLabel = '';
            if(event.status === 'pending') statusLabel = 'Pendiente';
            if(event.status === 'approved') statusLabel = 'Aprobado';
            if(event.status === 'rejected') statusLabel = 'Rechazado';

            card.innerHTML = `
                <div class="card-header-badge ${event.status}">${statusLabel}</div>
                <h3>${event.title}</h3>
                <p class="event-desc">${event.description}</p>
                <div class="event-meta">
                    <span>📁 ${event.type}</span>
                    <span>🏢 ${event.creator}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm">Ver Detalles</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function openModal(event) {
        currentEventId = event.id;
        const statusLabel = getStatusLabel(event.status);
        
        modalBody.innerHTML = `
            <div class="detail-row">
                <div><strong>Título</strong><br>${event.title}</div>
                <div><strong>Estado</strong><br><span class="status-text ${event.status}">${statusLabel}</span></div>
            </div>
            <div class="detail-row">
                <div><strong>Fecha Subida</strong><br>${formatDate(event.date)}</div>
                <div><strong>Empresa</strong><br>${event.creator}</div>
            </div>
            <div class="detail-row">
                <div><strong>Categoría</strong><br>${event.category}</div>
                <div><strong>Tamaño Archivo</strong><br>${event.capacity}</div>
            </div>
            <div class="detail-section">
                <strong>Descripción</strong>
                <p>${event.description}</p>
            </div>
            <div class="detail-section">
                <strong>Contenido Completo</strong>
                <p>${event.fullDescription}</p>
            </div>
            
            <div class="detail-section" style="margin-top: 1rem;">
                <button class="btn btn-secondary" style="width: 100%; border-style: dashed;" onclick="alert('Abriendo documento PDF...')">📄 Ver Documento Adjunto (PDF)</button>
            </div>
        `;

        // Reset buttons display
        btnApprove.style.display = 'inline-block';
        btnReject.style.display = 'inline-block';
        btnApprove.textContent = 'Aprobar';
        btnReject.textContent = 'Rechazar';

        if (event.status === 'approved') {
            btnApprove.style.display = 'none';
            btnReject.textContent = 'Revocar / Rechazar';
        } else if (event.status === 'rejected') {
            btnReject.style.display = 'none';
            btnApprove.textContent = 'Reconsiderar / Aprobar';
        }

        modal.style.display = 'block';
    }

    // --- Helper Functions ---
    function getStatusLabel(status) {
        if (status === 'pending') return 'Pendiente';
        if (status === 'approved') return 'Aprobado';
        if (status === 'rejected') return 'Rechazado';
        return status;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    function closeModal() {
        modal.style.display = 'none';
        currentEventId = null;
    }

    // --- Event Listeners ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            renderEvents();
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    btnApprove.addEventListener('click', () => {
        const eventIndex = eventsData.findIndex(e => e.id === currentEventId);
        if (eventIndex !== -1) {
            eventsData[eventIndex].status = 'approved';
            alert(`Publicación "${eventsData[eventIndex].title}" aprobada.`);
            closeModal();
            renderEvents();
        }
    });

    btnReject.addEventListener('click', () => {
        const eventIndex = eventsData.findIndex(e => e.id === currentEventId);
        if (eventIndex !== -1) {
            eventsData[eventIndex].status = 'rejected';
            alert(`Publicación "${eventsData[eventIndex].title}" rechazada.`);
            closeModal();
            renderEvents();
        }
    });

    // --- Init ---
    renderEvents();
});
