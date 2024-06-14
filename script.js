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
    "À quelle date et à quelle heure est prévue l'arrivée pour le trajet retour ?"
];

function displayMessage(message, sender = 'bot', inputType = 'text') {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'bot' ? 'bot-message' : 'user-message';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);

    if (sender === 'bot') {
        const userInput = document.createElement('input');
        userInput.type = inputType;
        userInput.id = 'user-input';
        userInput.placeholder = 'Entrez votre réponse ici...';
        userInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        messagesContainer.appendChild(userInput);
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function nextStep(userResponse) {
    if (userResponse !== undefined) {
        displayMessage(userResponse, 'user');
        switch (step) {
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
        }
    }

    step++;

    if (step < questions.length) {
        displayMessage(questions[step], 'bot', step === 7 || step === 9 || step === 11 || step === 13 ? 'datetime-local' : 'text');
    } else {
        displayMessage('Merci pour vos réponses. Les données vont être envoyées.', 'bot');
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
            const messagesContainer = document.getElementById('chatbot-messages');
            const messageElement = document.createElement('div');
            messageElement.className = 'bot-message';
            messageElement.textContent = 'Le devis a bien été envoyé par e-mail.';
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Supprimer la barre de texte à la fin de la conversation
            const userInput = document.getElementById('user-input');
            userInput.style.display = 'none';
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
    displayMessage('Bonjour !', 'bot', 'text');
    setTimeout(() => {
        displayMessage('Nous avons besoin de quelques réponses pour établir votre devis.', 'bot', 'text');
        setTimeout(() => {
            displayMessage(questions[step], 'bot', 'text');
        }, 1000);
    }, 1000);
};
