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
    "À quelle date et à quelle heure est prévue l'arrivée pour le trajet retour ?"
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
            buttonElement.onclick = () => nextStep(buttonText);
            buttonsContainer.appendChild(buttonElement);
        });
        messagesContainer.appendChild(buttonsContainer);
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function displayDateTimeInput() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'date-input';
    inputContainer.appendChild(dateInput);

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.id = 'time-input';
    inputContainer.appendChild(timeInput);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmer';
    confirmButton.onclick = () => {
        const dateValue = document.getElementById('date-input').value;
        const timeValue = document.getElementById('time-input').value;
        nextStep(`${dateValue} ${timeValue}`);
    };
    inputContainer.appendChild(confirmButton);

    messagesContainer.appendChild(inputContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function displayAddressInput() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const addressInput = document.createElement('input');
    addressInput.type = 'text';
    addressInput.id = 'address-input';
    addressInput.placeholder = 'Entrez une adresse';
    inputContainer.appendChild(addressInput);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmer';
    confirmButton.onclick = () => {
        const addressValue = document.getElementById('address-input').value;
        nextStep(addressValue);
    };
    inputContainer.appendChild(confirmButton);

    messagesContainer.appendChild(inputContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    initAutocomplete();
}

function initAutocomplete() {
    const addressInput = document.getElementById('address-input');
    const autocomplete = new google.maps.places.Autocomplete(addressInput);
    autocomplete.setFields(['address_components', 'formatted_address']);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        addressInput.value = place.formatted_address;
    });
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
                const [date_depart_aller, heure_depart_aller] = userResponse.split(' ');
                formData.date_depart_aller = date_depart_aller;
                formData.heure_depart_aller = heure_depart_aller;
                break;
            case 8:
                formData.adresse_depart_aller = userResponse;
                break;
            case 9:
                const [date_arrivee_aller, heure_arrivee_aller] = userResponse.split(' ');
                formData.date_arrivee_aller = date_arrivee_aller;
                formData.heure_arrivee_aller = heure_arrivee_aller;
                break;
            case 10:
                formData.adresse_arrivee_aller = userResponse;
                break;
            case 11:
                const [date_depart_retour, heure_depart_retour] = userResponse.split(' ');
                formData.date_depart_retour = date_depart_retour;
                formData.heure_depart_retour = heure_depart_retour;
                break;
            case 12:
                const [date_arrivee_retour, heure_arrivee_retour] = userResponse.split(' ');
                formData.date_arrivee_retour = date_arrivee_retour;
                formData.heure_arrivee_retour = heure_arrivee_retour;
                formData.adresse_arrivee_retour = "Adresse à définir"; // Ajuster si nécessaire
                break;
        }
    }

    if (step < questions.length) {
        if (step === 0) {
            displayMessage(questions[step], 'bot', ['M.', 'Mme', 'Mlle']);
        } else if (step === 7 || step === 9 || step === 11 || step === 13) {
            displayMessage(questions[step]);
            displayDateTimeInput();
        } else if (step === 8 || step === 10 || step === 12) {
            displayMessage(questions[step]);
            displayAddressInput();
        } else {
            displayMessage(questions[step]);
        }
        step++;
    } else {
        displayMessage('Merci pour vos réponses. Les données vont être envoyées.');
        sendFormData();
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message !== '') {
        userInput.value = '';
        nextStep(message);
    }
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

// Initialisation du chatbot
window.onload = function() {
    displayMessage('Bonjour !');
    setTimeout(() => displayMessage('Nous avons besoin de quelques réponses pour établir votre devis.'), 1000);
    setTimeout(nextStep, 2000);
};
