let step = 0;
let formData = {
    civilite: '',
    nom: '',
    prenom: '',
    telephone: '',
    mail: '',
    societe: '',
    date_jour: new Date().toLocaleDateString('fr-FR'),
    nb_passagers: '',
    date_depart_aller: '',
    heure_depart_aller: '',
    adresse_depart_aller: '',
    date_arrivee_aller: '',
    heure_arrivee_aller: '',
    adresse_arrivee_aller: '',
    date_depart_retour: '',
    heure_depart_retour: '',
    adresse_depart_retour: '',
    date_arrivee_retour: '',
    heure_arrivee_retour: '',
    adresse_arrivee_retour: ''
};

const questions = [
    "Quelle est votre civilité ? (M./Mme/Mlle)",
    "Quel est votre nom ?",
    "Quel est votre prénom ?",
    "Quel est votre numéro de téléphone ?",
    "Quel est votre adresse e-mail ?",
    "Quelle est votre société ?",
    "Combien de passagers sont prévus pour ce voyage ?",
    "Pour le départ aller, à quelle date et à quelle heure est prévu le départ ?",
    "Quelle est l'adresse de départ pour le trajet aller ?",
    "À quelle date et à quelle heure est prévue l'arrivée pour le trajet aller ?",
    "Quelle est l'adresse d'arrivée pour le trajet aller ?",
    "Pour le départ retour, à quelle date et à quelle heure est prévu le départ ?",
    "Quelle est l'adresse de départ pour le trajet retour ?",
    "À quelle date et à quelle heure est prévue l'arrivée pour le trajet retour ?",
    "Quelle est l'adresse d'arrivée pour le trajet retour ?"
];

function displayMessage(message, sender = 'bot', buttons = []) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'bot' ? 'bot-message' : 'user-message';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);

    if (buttons.length > 0) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        buttons.forEach(buttonText => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = buttonText;
            buttonElement.onclick = () => {
                nextStep(buttonText);
                buttonsContainer.style.display = 'none'; // Masquer les boutons après clic
            };
            buttonsContainer.appendChild(buttonElement);
        });
        messagesContainer.appendChild(buttonsContainer);
    }

    scrollToBottom();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideInputAndButton() {
    const userInput = document.getElementById('user-input');
    userInput.style.display = 'none'; // Masquer la barre de texte
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.style.display = 'none'; // Masquer le bouton envoyer
    }
}

function displayDateTimeInput() {
    const userInput = document.getElementById('user-input');
    userInput.type = 'datetime-local';
    userInput.value = ''; // Réinitialiser la valeur de l'entrée de date/heure
}

function displayTextInput() {
    const userInput = document.getElementById('user-input');
    userInput.type = 'text';
    userInput.value = '';
}

function displayAddressInput() {
    const userInput = document.getElementById('user-input');
    userInput.type = 'text';
    userInput.placeholder = 'Entrez une adresse';

    // Retirer les suggestions précédentes s'il y en a
    const previousSuggestions = document.querySelector('.suggestions-container');
    if (previousSuggestions) {
        previousSuggestions.remove();
    }

    userInput.addEventListener('input', handleAddressAutocomplete);
}

function handleAddressAutocomplete() {
    const userInput = document.getElementById('user-input');
    const query = userInput.value;

    if (query.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=fr&q=${query}`)
            .then(response => response.json())
            .then(data => {
                const frenchAddresses = data.filter(place => place.address.country_code === 'fr');
                const suggestions = frenchAddresses.map(place => place.display_name);
                displayAddressSuggestions(suggestions);
            })
            .catch(error => console.error('Error fetching address suggestions:', error));
    }
}

function displayAddressSuggestions(suggestions) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.textContent = suggestion;
        suggestionElement.onclick = () => {
            const userInput = document.getElementById('user-input');
            userInput.value = suggestion;
            nextStep(suggestion);
            suggestionsContainer.remove(); // Supprimer les suggestions après sélection
        };
        suggestionsContainer.appendChild(suggestionElement);
    });

    messagesContainer.appendChild(suggestionsContainer);
    scrollToBottom();
}

function nextStep(userResponse) {
    if (userResponse !== undefined) {
        displayMessage(userResponse, 'user');
        switch (step - 1) {
            case 0:
                formData.civilite = userResponse;
                break;
            case 1:
                formData.nom = userResponse;
                break;
            case 2:
                formData.prenom = userResponse;
                break;
            case 3:
                formData.telephone = userResponse;
                break;
            case 4:
                formData.mail = userResponse;
                break;
            case 5:
                formData.societe = userResponse;
                break;
            case 6:
                formData.nb_passagers = userResponse;
                break;
            case 7:
                const [date_depart_aller, heure_depart_aller] = userResponse.split('T');
                formData.date_depart_aller = date_depart_aller;
                formData.heure_depart_aller = heure_depart_aller;
                break;
            case 8:
                formData.adresse_depart_aller = userResponse;
                break;
            case 9:
                const [date_arrivee_aller, heure_arrivee_aller] = userResponse.split('T');
                formData.date_arrivee_aller = date_arrivee_aller;
                formData.heure_arrivee_aller = heure_arrivee_aller;
                break;
            case 10:
                formData.adresse_arrivee_aller = userResponse;
                break;
            case 11:
                const [date_depart_retour, heure_depart_retour] = userResponse.split('T');
                formData.date_depart_retour = date_depart_retour;
                formData.heure_depart_retour = heure_depart_retour;
                break;
            case 12:
                formData.adresse_depart_retour = userResponse;
                break;
            case 13:
                const [date_arrivee_retour, heure_arrivee_retour] = userResponse.split('T');
                formData.date_arrivee_retour = date_arrivee_retour;
                formData.heure_arrivee_retour = heure_arrivee_retour;
                break;
            case 14:
                formData.adresse_arrivee_retour = userResponse;
                break;
        }
    }

    if (step < questions.length) {
        if (step === 0) {
            displayMessage(questions[step], 'bot', ['M.', 'Mme', 'Mlle']);
        } else if ([7, 9, 11, 13].includes(step)) {
            displayMessage(questions[step]);
            displayDateTimeInput();
        } else if ([8, 10, 12, 14].includes(step)) {
            displayMessage(questions[step]);
            displayAddressInput();
        } else {
            displayMessage(questions[step]);
            displayTextInput();
        }
        step++;
    } else {
        displayMessage('Merci pour vos réponses. Les données vont être envoyées.');
        sendFormData();
        hideInputAndButton();
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message !== '') {
        userInput.value = '';
        nextStep(message);
    }
    scrollToBottom(); // Faire défiler vers le bas après l'envoi du message
}

function sendFormData() {
    fetch('https://hook.eu2.make.com/k2uq4prk7wupnnpij8666sphqs4q11hm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            displayMessage('Les données ont été envoyées avec succès.');
        } else {
            throw new Error('Erreur lors de l\'envoi des données.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        displayMessage('Une erreur s\'est produite.');
    });
}

// Observateur pour détecter les changements dans le conteneur de messages
const messagesContainer = document.getElementById('chatbot-messages');
const observer = new MutationObserver(() => {
    scrollToBottom();
});
observer.observe(messagesContainer, { childList: true });

// Initialisation du chatbot
window.onload = function() {
    displayMessage('Bonjour !');
    setTimeout(() => displayMessage('Nous avons besoin de quelques réponses pour établir votre devis.'), 1000);
    setTimeout(nextStep, 2000);
};
