let editingTaskId = null;

/* ── Persistance ── */
function sauvegarder(taches) {
    localStorage.setItem('sentasks', JSON.stringify(taches));
}
function charger() {
    return JSON.parse(localStorage.getItem('sentasks') || '[]');
}

/* ── Modal ── */
function ouvrirModal(id = null) {
    const overlay = document.getElementById('modal-overlay');
    const title = document.querySelector('.modal-title');
    const subtitle = document.querySelector('.modal-subtitle');
    const confirmBtn = document.querySelector('.btn-confirm');
    const field = document.getElementById('taskField');

    if (id) {
        editingTaskId = id;
        const taches = charger();
        const t = taches.find(x => x.id === id);
        field.value = t.texte;
        title.textContent = "Modifier la tâche";
        subtitle.textContent = "Mettez à jour les détails de votre tâche";
        confirmBtn.textContent = "Enregistrer";
    } else {
        editingTaskId = null;
        field.value = '';
        title.textContent = "Nouvelle tâche";
        subtitle.textContent = "Que souhaitez-vous accomplir ?";
        confirmBtn.textContent = "Ajouter";
    }

    overlay.classList.add('open');
    setTimeout(() => field.focus(), 100);
}

function fermerModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.getElementById('taskField').value = '';
    editingTaskId = null;
}

/* ── Recherche ── */
function rechercherTache() {
    const query = document.getElementById('searchField').value.trim().toLowerCase();
    afficher(query);
}

/* ── Création d'une carte ── */
function creerCarte(tache) {
    const div = document.createElement('div');
    div.className = 'task-card status-' + tache.statut;
    div.dataset.id = tache.id;

    const content = document.createElement('div');
    content.className = 'task-content';
    content.onclick = () => ouvrirModal(tache.id);

    const label = document.createElement('span');
    label.className = 'task-text';
    label.textContent = tache.texte;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    dateSpan.textContent = tache.date || '';

    content.appendChild(label);
    content.appendChild(dateSpan);
    div.appendChild(content);

    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.appendChild(btn('✕', 'btn-del', () => supprimerTache(tache.id)));

    div.appendChild(actions);
    return div;
}

function btn(label, cls, fn) {
    const b = document.createElement('button');
    b.className = cls;
    b.textContent = label;
    b.onclick = (e) => {
        e.stopPropagation();
        fn();
    };
    return b;
}

/* ── Affichage ── */
function afficher(filtre) {
    filtre = filtre || '';
    const taches = charger();
    ['todo', 'doing', 'done'].forEach(statut => {
        const row = document.getElementById('row-' + statut);
        row.innerHTML = '';
        const filtered = taches
            .filter(t => t.statut === statut)
            .filter(t => t.texte.toLowerCase().includes(filtre));

        filtered.forEach(t => row.appendChild(creerCarte(t)));
        document.getElementById('count-' + statut).textContent = filtered.length;
    });
}

/* ── Actions ── */
function validerModal() {
    const field = document.getElementById('taskField');
    const texte = field.value.trim();
    if (!texte) return;

    const taches = charger();
    if (editingTaskId) {
        const t = taches.find(x => x.id === editingTaskId);
        if (t) t.texte = texte;
    } else {
        const dateStr = new Date().toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        taches.push({
            id: Date.now(),
            texte,
            statut: 'todo',
            date: dateStr
        });
    }

    sauvegarder(taches);
    fermerModal();
    afficher();
}

function supprimerTache(id) {
    if(!confirm("Supprimer cette tâche ?")) return;
    sauvegarder(charger().filter(t => t.id !== id));
    afficher();
}

function resetTaches() {
    if (confirm("Voulez-vous vraiment supprimer TOUTES les tâches ?")) {
        sauvegarder([]);
        afficher();
    }
}

/* ── Drag & Drop ── */
function initDragAndDrop() {
    const config = {
        group: 'tasks',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (evt) {
            const taskId = parseInt(evt.item.dataset.id);
            const newStatut = evt.to.id.replace('row-', '');

            const taches = charger();
            const t = taches.find(x => x.id === taskId);
            if (t) {
                t.statut = newStatut;
                sauvegarder(taches);
                afficher(); // Pour mettre à jour les compteurs et styles
            }
        }
    };

    Sortable.create(document.getElementById('row-todo'), config);
    Sortable.create(document.getElementById('row-doing'), config);
    Sortable.create(document.getElementById('row-done'), config);
}

/* ── Init ── */
document.addEventListener('deviceready', function () {
    initDragAndDrop();
    afficher();
}, false);

// Fallback pour le navigateur si Cordova n'est pas là
if (!window.cordova) {
    $(document).ready(() => {
        initDragAndDrop();
        afficher();
    });
}
