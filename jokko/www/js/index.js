/**
 * JOKKO - Persistent Color & Precise UI
 */

var STORAGE_KEY = 'jokko_simple';
var currentContactId = null;

var COLORS = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#009688', '#4CAF50', '#FF9800', '#FF5722', '#795548'];

function getContacts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveContacts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getAvatarColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    return COLORS[hash % COLORS.length];
}

function renderList() {
    var list = getContacts();
    var query = ($('#search-input').val() || "").toLowerCase();
    var $ul = $('#contact-list').empty();

    list.sort((a, b) => {
        var nameA = (a.nom || a.prenom || '').toUpperCase();
        var nameB = (b.nom || b.prenom || '').toUpperCase();
        return nameA.localeCompare(nameB);
    });

    var lastLetter = "";

    list.forEach(function(c) {
        var fullName = (c.prenom + ' ' + c.nom).trim();
        if (!query || fullName.toLowerCase().indexOf(query) !== -1 || c.tel.indexOf(query) !== -1) {

            var firstChar = (c.nom || c.prenom || "?").charAt(0).toUpperCase();
            var displayLetter = "";

            if (firstChar !== lastLetter) {
                displayLetter = firstChar;
                lastLetter = firstChar;
            }

            // Utiliser la couleur stockée ou en générer une par défaut
            var color = c.color || getAvatarColor(fullName);

            var $li = $('<li data-icon="false">').append(
                $('<a href="#" class="contact-row-item" data-id="' + c.id + '">').append(
                    $('<div class="letter-header">').text(displayLetter),
                    $('<div class="contact-main">').append(
                        $('<div class="avatar">').text(firstChar).css('background-color', color),
                        $('<div class="contact-name">').text(fullName)
                    )
                )
            );
            $ul.append($li);
        }
    });

    if (list.length === 0) {
        $ul.append('<li style="text-align:center; padding: 40px; color: #757575;">Aucun contact</li>');
    }

    $ul.listview('refresh');
}

// Evenements
$(document).on('pageshow', '#page-list', renderList);
$(document).on('input', '#search-input', renderList);

$(document).on('click', '#btn-search-toggle', function() {
    $('#search-container').slideToggle(200, function() {
        if ($(this).is(':visible')) $('#search-input').focus();
        else { $('#search-input').val(''); renderList(); }
    });
});

$(document).on('click', '#btn-delete-all', function() {
    if (confirm('Voulez-vous vraiment supprimer TOUS vos contacts ?')) {
        saveContacts([]);
        renderList();
        $('#menu-popup').popup('close');
    }
});

$(document).on('click', '.contact-row-item', function(e) {
    e.preventDefault();
    currentContactId = $(this).data('id');
    var c = getContacts().find(x => x.id == currentContactId);
    if (c) {
        var fullName = (c.prenom + ' ' + c.nom).trim();
        $('#d-nom-complet').text(fullName);
        $('#d-tel').text(c.tel);
        var initial = (c.nom || c.prenom || "?").charAt(0).toUpperCase();
        // Utiliser la couleur stockée
        var color = c.color || getAvatarColor(fullName);
        $('#d-avatar').text(initial).css('background-color', color);
        $(':mobile-pagecontainer').pagecontainer('change', '#page-detail');
    }
});

$(document).on('click', '#btn-add-new', function() {
    currentContactId = null;
    $('#f-prenom, #f-nom, #f-tel').val('');
    $('#form-title').text('Créer un contact');
});

$(document).on('click', '#btn-edit', function() {
    var c = getContacts().find(x => x.id == currentContactId);
    if (c) {
        $('#f-prenom').val(c.prenom);
        $('#f-nom').val(c.nom);
        $('#f-tel').val(c.tel);
        $('#form-title').text('Modifier le contact');
        $(':mobile-pagecontainer').pagecontainer('change', '#page-form');
    }
});

$(document).on('click', '#btn-save', function() {
    var p = $('#f-prenom').val().trim();
    var n = $('#f-nom').val().trim();
    var t = $('#f-tel').val().trim();

    if (!p && !n) { alert('Veuillez entrer au moins un nom'); return; }

    var list = getContacts();
    var fullName = (p + ' ' + n).trim();

    if (currentContactId) {
        var idx = list.findIndex(x => x.id == currentContactId);
        if (idx !== -1) {
            var oldContact = list[idx];
            // On préserve la couleur d'origine
            var persistentColor = oldContact.color || getAvatarColor(fullName);
            list[idx] = { id: currentContactId, prenom: p, nom: n, tel: t, color: persistentColor };
        }
    } else {
        // Nouveau contact : on définit la couleur une fois pour toutes
        var newContact = {
            id: Date.now(),
            prenom: p,
            nom: n,
            tel: t,
            color: getAvatarColor(fullName)
        };
        list.push(newContact);
    }

    saveContacts(list);
    $(':mobile-pagecontainer').pagecontainer('change', '#page-list');
});

$(document).on('click', '#btn-delete', function() {
    if (confirm('Supprimer ce contact ?')) {
        saveContacts(getContacts().filter(x => x.id != currentContactId));
        $(':mobile-pagecontainer').pagecontainer('change', '#page-list');
    }
});
