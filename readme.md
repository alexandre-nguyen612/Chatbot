# 🖥️ Digitalisation & Automatisation de Neotravel

Bienvenue dans le projet de digitalisation et d'automatisation de Neotravel ! 🎉
Notre chatbot est conçu pour collecter les informations nécessaires à l'établissement d'un devis de transport. Il guide l'utilisateur à travers une série de questions, enregistre les réponses et envoie les données collectées à une URL spécifiée.

## 📚 Table des matières

- [🖥️ Digitalisation \& Automatisation de Neotravel](#️-digitalisation--automatisation-de-neotravel)
  - [📚 Table des matières](#-table-des-matières)
  - [⚙️ Fonctionnalités](#️-fonctionnalités)
  - [📖 Utilisation](#-utilisation)
    - [Variables globales :](#variables-globales-)
    - [🔑 Fonctions principales :](#-fonctions-principales-)
    - [Initialisation :](#initialisation-)
    - [Collecte des données :](#collecte-des-données-)
    - [Envoi des données :](#envoi-des-données-)

## ⚙️ Fonctionnalités

- 📊 Collecte interactive des données de l'utilisateur.
- 🚀 Envoi des données collectées à une URL spécifiée (airtable).
- 💻 Interface utilisateur simple et responsive.
- 📧 PDF du devis envoyé par email à l'utilisateur.

---

## 📖 Utilisation

Pour utiliser notre chatbot, rendez-vous sur votre site WordPress et ouvrez l'espace réservé au chatbot.

### Variables globales :

- `step` : Indice de l'étape actuelle dans le flux de questions.
- `formData` : Objet stockant les réponses de l'utilisateur.
- `questions` : Tableau contenant les questions à poser.

### 🔑 Fonctions principales :

```js
displayMessage(message, sender, buttons) : Affiche un message dans la zone de conversation.

displayDateTimeInput() : Affiche un champ de saisie pour les dates et heures.

displayAddressInput() : Affiche un champ de saisie pour les adresses avec autocomplétion.

handleAddressAutocomplete() : Gère l'autocomplétion des adresses en utilisant l'API Nominatim.

sendMessage() : Envoie le message de l'utilisateur et appelle nextStep.

sendFormData() : Envoie les données collectées à l'URL spécifiée.
```
### Initialisation :
```js
// Initialisation du chatbot
window.onload = function() {
    displayMessage('Bonjour !');
    setTimeout(() => displayMessage('Nous avons besoin de quelques réponses pour établir votre devis.'), 1000);
    setTimeout(nextStep, 2000);
};
```
`window.onload` : Initialise le chatbot en affichant les premiers messages de bienvenue et en lançant la première question.

---
### Collecte des données :

À chaque étape, le chatbot pose une question à l'utilisateur.
Les réponses sont enregistrées dans l'objet formData.
Les étapes incluent la collecte de texte, de dates/horaires et d'adresses.

### Envoi des données :

Une fois toutes les questions répondues, les données sont envoyées au hook (make) puis airtable.
Un nouveau doc est créer à partir d'un template

```js
function sendFormData() {
    fetch('url hook(make)', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
}
```
Un message de confirmation est affiché à l'utilisateur.
```js
    .then(response => response.json())
    .then(data => {
        console.log('Données reçues:', data);
        if (data.pdfLink) {
            displayMessage(`Votre devis est prêt : <a href="${data.pdfLink}" target="_blank">Télécharger le PDF</a>`);
        } else {
            throw new Error('Erreur lors de la génération du PDF.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        displayMessage('Une erreur s\'est produite.');
    });
```

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conclusion</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 800px;
            margin: 50px auto;
            background: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h1 {
            text-align: center;
            color: #4CAF50;
        }
        p {
            font-size: 1.2em;
            margin: 20px 0;
        }
        .highlight {
            color: #4CAF50;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 1.1em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Merci d'utiliser notre chatbot à des fins d'optimisation.</h1>
        <p>
            Nous espérons que cette solution vous <span class="highlight">facilitera la vie</span> et <span class="highlight">améliorera l'expérience de vos utilisateurs</span>.
            Si vous avez des questions ou des suggestions, n'hésitez pas à nous contacter.
        </p>
        <div class="footer">
            Enjoy ! 🤖✨
        </div>
    </div>
</body>
</html>
