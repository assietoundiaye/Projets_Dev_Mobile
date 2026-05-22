# SenTasks 📝

**SenTasks** est une application mobile de gestion de tâches (Kanban) intuitive et élégante, conçue pour simplifier votre productivité quotidienne. Elle allie la souplesse du web à l'ergonomie mobile pour offrir une expérience utilisateur fluide et sans friction.

## 🚀 Fonctionnalités principales

- **Interface Kanban intuitive** : Visualisez votre flux de travail en trois colonnes : *À faire*, *En cours*, et *Terminé*.
- **Drag & Drop Tactile** : Déplacez vos tâches d'une section à l'autre par simple glisser-déposer avec le doigt (via SortableJS).
- **Persistance des données** : Vos tâches sont sauvegardées localement dans le téléphone (LocalStorage). L'application fonctionne parfaitement **hors-ligne**.
- **Gestion Complète (CRUD)** : Ajoutez, modifiez, recherchez et supprimez vos tâches en toute simplicité.
- **Horodatage Automatique** : Chaque tâche affiche sa date et son heure de création pour un suivi précis.
- **Design Premium** : 
    - Thème mauve/indigo moderne et cohérent.
    - Bouton flottant (FAB) pour un ajout rapide au pouce.
    - Animations fluides (Pop-in, Slide-up).
    - Barre de recherche en temps réel.
    - Bouton Reset avec confirmation de sécurité.

## 🛠️ Stack Technique

- **Frontend** : HTML5, CSS3 (Flexbox, Variables CSS, Animations).
- **Logique** : JavaScript (ES6+), jQuery (pour les événements mobiles).
- **Bibliothèques** : 
    - **SortableJS** : Pour la gestion performante du Drag & Drop.
    - **jQuery Mobile** : Pour la structure de navigation hybride.
- **Framework Mobile** : Cordova (permet de compiler l'application pour Android et iOS).

## 📦 Installation et Lancement

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/assietoundiaye/sentasks.git
   ```

2. **Lancement Rapide** (Navigateur) :
   Ouvrez simplement le fichier `www/index.html` dans votre navigateur.

3. **Déploiement Mobile** (via Cordova) :
   ```bash
   cordova platform add android
   cordova run android
   ```

## 🎓 Contexte du Projet

Développé dans le cadre de la formation **M2GL** (Master 2 Génie Logiciel).
Date : **Mai 2026**

---
Développé avec ❤️ pour une gestion de tâches élégante et efficace.
