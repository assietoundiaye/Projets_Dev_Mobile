/*
 * Apache Cordova
 */

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    console.log('Cordova prêt');

}

/* Fonction calcul IMC */

function calculerIMC() {

    let poids = parseFloat(document.getElementById("poids").value);

    let tailleCm = parseFloat(document.getElementById("taille").value);

    if (!poids || !tailleCm) {

        document.getElementById("resultat").innerHTML =
            "Veuillez remplir tous les champs";

        return;
    }

    /* convertir cm -m */

    let taille = tailleCm / 100;

    let imc = poids / (taille * taille);

    let categorie = "";

    if (imc < 18.5) {
        categorie = "Maigreur";
    }
    else if (imc < 25) {
        categorie = "Poids normal";
    }
    else if (imc < 30) {
        categorie = "Surpoids";
    }
    else {
        categorie = "Obésité";
    }

    document.getElementById("resultat").innerHTML =
        "IMC = " + imc.toFixed(2) + "<br>" + categorie;
}