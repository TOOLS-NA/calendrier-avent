/* ==========================================================================
   CALENDRIER DE L'AVENT — RÉGLAGES ET CADEAUX
   C'est le SEUL fichier à modifier pour changer le contenu du calendrier.
   Après modification : déposer ce fichier dans le dépôt GitHub, c'est tout.
   Les écrans en caisse se mettent à jour d'eux-mêmes chaque nuit à minuit
   (ou tout de suite en rechargeant la page).
   ========================================================================== */

window.CALENDRIER = {

  config: {
    // Année du calendrier
    annee: 2026,

    // Dernier jour du calendrier : les cases vont du 1er décembre à ce jour-là
    dernierJour: 17,

    // Nom affiché en haut de l'écran
    enseigne: "Narbonne Accessoires",

    // Chemin d'une image de logo (ex. "logo.png" déposé à côté de index.html).
    // Laisser vide pour afficher simplement le nom de l'enseigne en texte.
    logo: "",

    // Durée de validité d'un cadeau, en jours, à partir du jour où il est tiré.
    // 1 = valable uniquement le jour même. 3 = le jour même + les 2 suivants.
    // Un cadeau peut avoir sa propre date de fin avec "jusquau" (voir plus bas).
    dureeValiditeJours: 1,

    // Une fois le cadeau affiché, l'écran revient tout seul au calendrier
    // au bout de ce nombre de secondes (prêt pour le client suivant).
    retourAutoSecondes: 40,

    // Texte en bas de l'écran (conditions générales de l'opération)
    mentions: "Cadeau tiré au sort, un par passage en caisse, dans la limite des stocks disponibles. Non cumulable avec d'autres promotions en cours.",

    // ---------- SONS ----------
    // true = son activé au démarrage (il peut aussi être coupé avec le bouton
    // « Son » en bas de l'écran ; ce choix est retenu par chaque écran).
    son: true,

    // Volume général, de 0 (muet) à 1 (maximum)
    volume: 0.8,

    // true = petite musique de Noël douce en continu entre deux ouvertures.
    // Elle démarre au premier toucher de l'écran (règle des navigateurs).
    musiqueDeFond: false,

    // Pour utiliser vos propres sons à la place des sons intégrés, déposez le
    // fichier (mp3) dans le dépôt et indiquez son chemin, ex. "sons/ohoo.mp3".
    fichierOhoo: "",       // joué quand le paquet s'ouvre
    fichierMusique: "",    // joué pendant que le cadeau est affiché (et en fond)

    // true  = bandeau « Démonstration » affiché (cadeaux d'exemple)
    // false = vrais cadeaux saisis
    demo: false,

    // true  = autorise l'aperçu d'une date en ajoutant ?apercu=2026-12-05 à l'adresse
    // false = à mettre au lancement, pour que l'aperçu ne fonctionne plus
    apercuAutorise: true
  },

  /* ------------------------------------------------------------------------
     LES CADEAUX — une ligne par cadeau.
     À chaque ouverture de la case du jour, un cadeau est tiré au sort dans
     cette liste : deux clients le même jour peuvent avoir des cadeaux différents.

       titre       : le cadeau en quelques mots                    obligatoire
       detail      : une ou deux phrases d'explication             facultatif
       code        : code à saisir en caisse                       facultatif
       conditions  : conditions propres à ce cadeau                facultatif
       jusquau     : date de fin "AAAA-MM-JJ" si différente        facultatif
       chances     : fréquence de tirage                           facultatif
                     1 = normal (valeur par défaut)
                     3 = sort trois fois plus souvent
                     0.2 = rare (cinq fois moins souvent)
                     0 = retiré du tirage sans effacer la ligne
       jour        : réserve ce cadeau à un jour de décembre       facultatif
                     (ce jour-là, tous les clients ont ce cadeau,
                     et il ne sort jamais les autres jours)
     ------------------------------------------------------------------------ */
  cadeaux: [
    { titre: "Un cadeau surprise", detail: "Dès 75 € d'achat." },
    { titre: "Entretien TRIMIXTE à 99 € au lieu de 130 €" },
    { titre: "2 articles achetés, le 3e offert", detail: "Sur une sélection d'articles." },
    { titre: "−15 % sur le rayon nettoyage et entretien" },
    { titre: "30 € d'accessoires offerts pour votre VAE", detail: "Pour l'achat d'un VAE." },
    { titre: "50 € de remise sur votre isolant SOPLAIR" },
    { titre: "3 AQUAKEM achetés, le 4e offert" },
    { titre: "L'adaptateur 220 V offert", detail: "Pour l'achat d'une glacière à compression EZA." },
    { titre: "Le contrôle 7 points de votre camping-car offert", detail: "Dès 150 € d'achat en magasin." },
    { titre: "−10 % sur l'article de votre choix" },
    { titre: "Les chaussettes à neige offertes", detail: "Dès 250 € d'achat en magasin." },
    { titre: "−10 % sur le rayon outdoor", detail: "Tables et chaises." },
    { titre: "Entretien TRIMIXTE offert", detail: "Pour tout achat supérieur à 200 €." },
    { titre: "Les cales anti-ovalisation offertes", detail: "Pour l'achat d'une bâche CC / F / Z." },

    // Dernier jour : le même cadeau pour tout le monde
    { titre: "Le guide ACSI 2027 offert", detail: "Dès 150 € d'achat. Votre guide vous attendra en magasin début 2027.", jour: 17 }
  ]
};
