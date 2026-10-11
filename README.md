# BizAssist AI 🤖🏢

> **Assistant virtuel d'information d'entreprise et de centre de formation.**  
> Projet MVP conçu dans le cadre d'un sprint pratique de 14 jours pour démontrer une solution IA fiable, documentée et sécurisée.

---

## 🎯 Objectif du projet

BizAssist AI aide les petites entreprises et centres de formation à répondre instantanément aux questions récurrentes de leurs clients (formations disponibles, tarifs, dates de rentrée, formalités d'inscription) en s'appuyant **uniquement sur des informations officielles vérifiées**.

### Principes clés
1. **Zéro hallucination** : Si une information n'est pas dans la base approuvée, l'assistant refuse d'inventer et invite poliment à contacter l'accueil.
2. **Transparence totale** : Chaque réponse vérifiée cite explicitement sa source documentaire officielle.
3. **Architecture sécurisée** : Découplage strict entre l'interface utilisateur et le backend pour préparer l'intégration sécurisée d'un LLM sans exposer de clé API.

---

## 🚀 Fonctionnalités actuelles (Jalon Fin de Semaine 1)

* **Interface de chat responsive** : Expérience fluide adaptée mobile et desktop, avec suggestions rapides de questions.
* **Base de connaissances structurée** : 20 entrées FAQ classées par catégories (cours, tarifs, calendrier, inscriptions, contacts).
* **Moteur de recherche heuristique & seuil de confiance** :
  * Normalisation textuelle (minuscules, suppression des accents et ponctuations).
  * Pondération multicritère (titre canonique, mots-clés, contenu, correspondance exacte).
  * Seuil minimum de pertinence (`MIN_CONFIDENCE_SCORE = 3`) pour éliminer les faux positifs.
* **API Backend Express (`/api/chat`)** :
  * Validation stricte des données d'entrée (texte non vide, limite à 500 caractères).
  * Endpoint de santé (`/api/health`).
  * Proxy automatique Vite pour le développement sans configuration CORS complexe.
* **Tests automatisés complets** : 18 tests unitaires et d'intégration validant le moteur de recherche et l'API backend.

---

## 🛠️ Stack technique

* **Frontend** : React 19, TypeScript, Vite.
* **Backend** : Node.js (v24), Express 5, CORS, `tsx`.
* **Tests & Qualité** : Vitest, ESLint.

---

## 📦 Installation et démarrage rapide

### 1. Prérequis
* Node.js v20+ (recommandé v22+)
* npm

### 2. Cloner et installer
```bash
git clone https://github.com/bounyamine/bizassist-ai.git
cd bizassist-ai
npm install
```

### 3. Configurer l'environnement (Google Gemini)
Créez votre fichier local `.env` (optionnel si vous souhaitez tester le mode 100% local déterministe) :
```bash
cp .env.example .env
```
Puis renseignez votre clé d'API gratuite obtenue sur [Google AI Studio](https://aistudio.google.com/) :
```env
GEMINI_API_KEY=votre_cle_ici
GEMINI_MODEL=gemini-3.1-flash-lite
```

### 4. Lancer en mode développement
Ouvrez deux terminaux :

```bash
# Terminal 1 — Serveur API Backend (http://localhost:3001)
npm run dev:server

# Terminal 2 — Interface Frontend Vite (http://localhost:5173)
npm run dev
```

### 4. Lancer les tests automatisés
```bash
npm test
```

### 5. Compiler pour la production
```bash
npm run build
```

---

## 📂 Structure du projet

```text
bizassist-ai/
├── src/
│   ├── components/            # Composants React du chat
│   │   ├── ChatHeader.tsx     # En-tête avec statut
│   │   ├── ChatInput.tsx      # Champ de saisie avec limite de caractères
│   │   ├── ChatMessage.tsx    # Bulle de message et badge de source
│   │   └── SuggestedQuestions.tsx # Cartes de questions fréquentes
│   ├── data/
│   │   └── knowledgeBase.ts   # Base de connaissances (20 FAQ officielles)
│   ├── lib/
│   │   ├── knowledgeSearch.ts # Moteur de recherche et logique de réponse
│   │   └── knowledgeSearch.test.ts # Tests du moteur de recherche
│   ├── types.ts               # Types TypeScript partagés
│   ├── App.tsx                # Composant racine orchestrant le chat et l'API
│   └── main.tsx               # Point d'entrée de l'application
├── server/
│   ├── index.ts               # Serveur Express (POST /api/chat, GET /api/health)
│   └── index.test.ts          # Tests d'intégration de l'API backend
├── vite.config.ts             # Configuration Vite avec proxy /api
├── package.json
└── README.md
```

---

## 🗺️ Feuille de route du sprint (14 jours)

* **Semaine 1 (Fondations & MVP déterministe)**
  * [x] **Day 1** : Définition du cas d'usage et spécifications.
  * [x] **Day 2** : Initialisation de l'environnement React + TypeScript + Vite.
  * [x] **Day 3** : Construction de l'interface de chat responsive.
  * [x] **Day 4** : Modélisation de la base de connaissances et moteur de recherche.
  * [x] **Day 5** : Connexion de la recherche au chat avec seuil de confiance et sources.
  * [x] **Day 6** : Création de l'API Backend Express (`POST /api/chat`).
  * [x] **Day 7** : Revue, stabilisation du MVP, gestion des erreurs et documentation.
* **Semaine 2 (Intelligence artificielle & Portfolio)**
  * [x] **Day 8** : Connexion au modèle IA (Google Gemini RAG contextualisé avec fallback résilient).
  * [x] **Day 9** : Attribution fine des sources (Based on) et carte de contact d'assistance humaine.
  * [x] **Day 10** : Campagne de tests qualité & sécurité des réponses (banc de 20 tests, rapport [`docs/QA_SAFETY_REPORT.md`](docs/QA_SAFETY_REPORT.md)).
  * [x] **Day 11** : Finitions UI/UX, accessibilité (a11y WCAG, skip-link) et design responsive mobile (touch targets, zoom iOS).
  * [x] **Day 12** : Rédaction de l'étude de cas pour le portfolio ([`docs/PORTFOLIO_CASE_STUDY.md`](docs/PORTFOLIO_CASE_STUDY.md)).
  * [ ] **Day 13** : Validation de l'offre auprès de premiers prospects.
  * [ ] **Day 14** : Bilan, démo finale et feuille de route v2.
