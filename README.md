# رحلتي مع القرآن — Quran-Repeat

Application de suivi des récitations coraniques. Comptez et mémorisez combien de fois vous avez récité chacune des 114 sourates du Coran, avec un objectif de 100 récitations par sourate. Les données sont sauvegardées **localement** (AsyncStorage) et persistent entre les sessions — sur mobile comme dans le navigateur (localStorage), indépendamment pour chaque appareil.

## Stack technique

| Élément | Technologie |
| --- | --- |
| Framework | React Native + Expo (SDK 57) |
| Langage | TypeScript |
| Routage | Expo Router |
| Stockage local | AsyncStorage |
| Icônes | @expo/vector-icons (MaterialIcons) |
| Dégradés | expo-linear-gradient |
| Safe area | react-native-safe-area-context |
| Police arabe | Amiri (@expo-google-fonts/amiri) |

## Fonctionnalités

- Header en dégradé vert islamique `#00796B → #004D40`
- Saisie du prénom (affiché dans l'en-tête) avec persistance locale
- Statistiques en temps réel : total de récitations, sourates complétées, pourcentage global
- Barre de progression globale dorée `#D4AF37`
- 114 sourates en cartes blanches avec ombre
- Barre de progression individuelle avec code couleur :

| Étape | Récitations | Couleur |
| --- | --- | --- |
| Début | 0 – 29 | Rouge `#F44336` |
| Avancement | 30 – 69 | Orange `#FF9800` |
| Proche du but | 70 – 99 | Vert `#4CAF50` |
| Complété | 100 | Or `#D4AF37` |

- Bouton `+ تلاوة` pour incrémenter (bloqué à 100)
- Étoile or + coche sur les sourates complétées
- Animation spring au toucher
- Réinitialisation par sourate ou totale
- Spinner pendant le chargement initial

## Démarrage en local

```bash
npm install
npm run web      # version navigateur
npm start        # Expo Go sur téléphone (QR code)
```

## Déploiement sur GitHub Pages

L'application se déploie automatiquement via GitHub Actions sur chaque push vers `main`.

### 1. Nom du dépôt et baseUrl

GitHub Pages sert le site sous `https://selhabti.github.io/Quran-repeat/`. Le `baseUrl` est donc configuré dans `app.json` :

```json
"experiments": {
  "baseUrl": "/Quran-repeat"
}
```

⚠️ **Si ton dépôt s'appelle autrement** (ex. `quran-repeat` ou `mon-app`), modifie cette valeur pour qu'elle corresponde **exactement** au nom du dépôt (majuscules/minuscules comprises), puis recommitte.

### 2. Pousser le dépôt

```bash
git remote add origin https://github.com/selhabti/Quran-repeat.git
git push -u origin main
```

### 3. Activer GitHub Pages

1. Va dans **Settings** du dépôt → **Pages**.
2. **Source** : sélectionne **GitHub Actions**.
3. Le workflow `Deploy to GitHub Pages` se lance à chaque push. Vérifie sa progression dans l'onglet **Actions**.

L'app sera disponible à l'adresse `https://selhabti.github.io/Quran-repeat/`.

### 4. Partager le lien

Quiconque ouvre le lien voit ses **propres** compteurs : les données sont stockées dans le localStorage du navigateur (ou la mémoire de l'appareil) de chaque visiteur, jamais sur un serveur.

## Installer sur un téléphone (PWA)

L'app est une PWA (manifest + icônes + thème) : elle s'installe sur l'écran d'accueil et s'ouvre plein écran comme une vraie app, avec ses données conservées.

- **Android (Chrome)** : ouvrir `https://selhabti.github.io/Quran-repeat/` → menu ⋮ → **« Ajouter à l'écran d'accueil »** (ou « Installer l'application »).
- **iPhone / iPad (Safari)** : ouvrir le lien → bouton **Partager** → **« Sur l'écran d'accueil »**.

## Structure du projet

```
src/
├── app/
│   ├── _layout.tsx        # Layout racine : polices, providers, Stack
│   └── index.tsx          # Écran principal (liste des sourates)
├── components/
│   ├── Header.tsx         # Dégradé + stats + barre globale
│   └── SurahCard.tsx      # Carte de sourate (progression + incrément)
├── constants/
│   └── theme.ts           # Palette, couleurs de progression
├── context/
│   └── RecitationContext.tsx  # État global + persistance AsyncStorage
└── data/
    └── surahs.ts          # Les 114 sourates
```
