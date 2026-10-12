# Calendrier de l'Avent

Un cadeau tiré au sort chaque jour du 1er au 19 décembre, pensé pour un écran
de caisse (24 à 32 pouces, en paysage), avec animation et sons. PWA pour
GitHub Pages : aucun serveur, aucune base de données, aucune dépendance externe.

## Mise en ligne

1. Créer un dépôt dans l'organisation `TOOLS-NA`, par exemple `calendrier-avent`.
2. Y déposer **tout le contenu** de ce dossier (en conservant `fonts/` et `icons/`).
3. Settings → Pages → Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`.
4. L'adresse sera `https://tools-na.github.io/calendrier-avent/`.

Pour un simple essai, un double-clic sur `index.html` suffit : le calendrier
s'ouvre dans le navigateur sans rien installer.

## Installation sur un écran de caisse

1. Ouvrir l'adresse dans Chrome ou Edge.
2. Appuyer sur **Plein écran** en bas à droite (ou touche F11).
3. Brancher des haut-parleurs (ou vérifier ceux de l'écran) et régler le volume du PC.

L'écran peut ensuite rester allumé toute la journée et d'un jour sur l'autre :

- la mise en page s'adapte à la taille de l'écran, sans barre de défilement ;
- à minuit (heure de Paris) la page se recharge seule : la case du jour change
  et les cadeaux modifiés entre-temps sont pris en compte ;
- la mise en veille de l'écran est bloquée tant que le calendrier est affiché ;
- sans connexion, le calendrier continue de fonctionner avec sa dernière version.

## Ce que voit et entend le client

- La case du jour est dorée, cerclée d'or, et fait signe.
- Un toucher (ou un clic) lance le suspens : roulement de grelots, le paquet
  s'agite en trois salves, puis le couvercle saute avec un « Ohoo » et des
  confettis, et un cadeau tiré au sort s'affiche sur l'air de « Vive le vent ».
- Un second toucher pendant le suspens ouvre tout de suite.
- Le cadeau se referme seul au bout de 40 secondes, prêt pour le client suivant.
- Les cases passées et à venir ne s'ouvrent pas : un message indique pourquoi.

**Chaque toucher de la case du jour fait un nouveau tirage** : c'est à la
personne en caisse de veiller à une ouverture par client.

## Les cadeaux

Tout se passe dans `cadeaux.js`, le seul fichier à modifier. Les cadeaux sont
une simple liste, sans date : à chaque ouverture, l'un d'eux est tiré au sort.

- `titre`, `detail`, `code`, `conditions` : ce qui s'affiche.
- `chances` : 1 = normal, 3 = sort trois fois plus souvent, 0.2 = rare,
  0 = retiré du tirage sans effacer la ligne.
- `jusquau` : date de fin propre à un cadeau ; passé cette date, il ne sort plus.

## Les sons

Tous les sons sont fabriqués par le navigateur : grelots, boîte à musique,
« Ohoo » de foule, et deux airs du domaine public, « Vive le vent »
(J. Pierpont, 1857) et « Douce nuit » (F. Gruber, 1818).

- Bouton **Son activé / Son coupé** en bas de l'écran : le choix est retenu
  par chaque écran.
- `volume` dans `cadeaux.js` : de 0 à 1.
- `musiqueDeFond: true` : une musique douce tourne en continu entre deux
  ouvertures et se met en pause pendant l'ouverture. Elle démarre au premier
  toucher de l'écran (les navigateurs interdisent le son avant).
- `fichierOhoo` et `fichierMusique` : pour utiliser vos propres sons, déposez
  un mp3 dans le dépôt (par exemple dans un dossier `sons/`) et indiquez son
  chemin. Si le fichier est introuvable, le son intégré prend le relais.

## Tester avant décembre

Ajouter `?apercu=2026-12-05` à l'adresse pour voir le calendrier tel qu'il sera ce jour-là.

## Avant le lancement

Dans `cadeaux.js` :

- passer `demo` à `false` (retire le bandeau « Démonstration ») ;
- passer `apercuAutorise` à `false` (désactive l'aperçu par l'adresse).

## À savoir

- Le fichier `cadeaux.js` est public : quelqu'un de curieux peut y lire la
  liste des cadeaux et leurs chances en connaissant l'adresse.
- Chaque écran tire au sort de son côté : il n'y a pas de stock commun entre
  les caisses ni entre les magasins.
- Il y a une case par jour, dimanches compris.
- Si Windows est réglé sur « réduire les animations », le suspens est remplacé
  par un affichage direct du cadeau (avec le son).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'écran, sa mise en forme et son fonctionnement |
| `cadeaux.js` | Réglages et cadeaux (à modifier) |
| `sons.js` | Les sons et les airs de Noël |
| `sw.js` | Fonctionnement hors connexion |
| `manifest.webmanifest` | Installation en application |
| `fonts/` | Polices Barlow et Berkshire Swash (licence libre OFL) |
| `icons/` | Icônes de l'application |
