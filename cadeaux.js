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
    dernierJour: 19,

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
    // false = à mettre dès que les vrais cadeaux sont saisis
    demo: true,

    // true  = autorise l'aperçu d'une date en ajoutant ?apercu=2026-12-05 à l'adresse
    // false = à mettre au lancement, pour que l'aperçu ne fonctionne plus
    apercuAutorise: true
  },

  /* ------------------------------------------------------------------------
     LES CADEAUX — une ligne par cadeau, sans date.
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

     Les cadeaux ci-dessous sont des EXEMPLES à remplacer.
     ------------------------------------------------------------------------ */
  cadeaux: [
    { titre: "Un sachet de papillotes offert", detail: "Demandez-le à votre conseiller.", chances: 3 },
    { titre: "−10 % sur votre prochain passage en caisse", detail: "Un bon de réduction vous est remis avec votre ticket.", code: "AVENT10" },
    { titre: "Un porte-clés offert", detail: "Demandez-le à votre conseiller.", chances: 2 },
    { titre: "Un désodorisant de cabine offert", detail: "Parfum sapin, évidemment." },
    { titre: "−20 % sur un produit d'entretien au choix", detail: "Valable sur toute la gamme entretien.", code: "AVENT20" },
    { titre: "Une lampe de poche offerte", detail: "Toujours utile dans la boîte à gants." },
    { titre: "Un mug de voyage offert", detail: "Pour le café des départs matinaux." },
    { titre: "−15 % sur la vaisselle de voyage", detail: "Assiettes, verres et couverts incassables.", code: "AVENT15" },
    { titre: "Un grattoir à givre offert", detail: "Le pare-brise vous dira merci.", chances: 2 },
    { titre: "Un sac cabas offert", detail: "Pour emporter vos achats du jour." },
    { titre: "−15 % sur un article de literie", detail: "Sur-matelas, draps-housses et oreillers.", code: "LITERIE15" },
    { titre: "Un jeu de cartes offert", detail: "Pour les soirées sur l'aire d'étape." },
    { titre: "Un carnet de voyage offert", detail: "Notez-y vos plus belles étapes." },
    { titre: "−25 % sur les accessoires de cuisine", detail: "Réchauds, cafetières et rangements malins.", code: "CUISINE25" },
    { titre: "Une housse de volant offerte", detail: "Demandez-la à votre conseiller." },
    { titre: "−10 % sur l'éclairage LED", detail: "Spots, réglettes et lampes baladeuses.", code: "LED10" },
    { titre: "Une boîte de chocolats offerte", detail: "À partager, ou pas." },
    { titre: "−20 % sur les idées cadeaux", detail: "Une sélection à glisser sous le sapin.", code: "IDEES20" },
    { titre: "Le gros lot : un bon d'achat de 50 €", detail: "Bravo ! Votre conseiller vous remet votre bon.", chances: 0.05 }
  ]
};
