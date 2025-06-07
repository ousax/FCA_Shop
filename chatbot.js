document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotContainer = document.querySelector(".chatbot-container");
  const closeChatbot = document.getElementById("closeChatbot");
  const sendMessageBtn = document.getElementById("sendMessage");
  const userMessageInput = document.getElementById("userMessage");
  const chatbotMessages = document.getElementById("chatbotMessages");

  // Réponses prédéfinies
  const responses = {
    "salut": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    "contact": "Vous pouvez nous contacter par email à contact@fcashop.com ou via le formulaire de contact.",
    "livraison": "Nous livrons sous 2-3 jours ouvrés au Maroc. Les frais de livraison sont de 30 DH.",
    "paiement": "Nous acceptons les paiements par carte bancaire, PayPal et paiement à la livraison.",
    "retour": "Vous avez 14 jours pour retourner un article non utilisé. Consultez notre politique de retours.",
    "default": "Désolé, je n'ai pas compris. Voici ce que je peux vous dire :<br><br>- Questions sur les <strong>livraisons</strong><br>- Méthodes de <strong>paiement</strong><br>- Politique de <strong>retour</strong><br><br>Posez-moi une question plus précise !"
  };

  // Ouvrir/fermer le chatbot
  chatbotToggle.addEventListener("click", () => {
    chatbotContainer.classList.toggle("active");
  });

  closeChatbot.addEventListener("click", () => {
    chatbotContainer.classList.remove("active");
  });

  // Envoyer un message
  function sendMessage() {
    const message = userMessageInput.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    userMessageInput.value = "";

    // Réponse automatique après un court délai
    setTimeout(() => {
      const reply = generateReply(message.toLowerCase());
      addMessage(reply, "bot");
    }, 500);
  }

  // Gestion de l'envoi
  sendMessageBtn.addEventListener("click", sendMessage);
  userMessageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Ajouter un message au chat
  function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input; 
  return div.innerHTML;
}

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${sender}-message`);
  
  // Sanitize le texte avant l'affichage
  messageDiv.textContent = text;
  
  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

  // Générer une réponse
  function generateReply(message) {
    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }
    return responses["default"];
  }

  // Message de bienvenue
  setTimeout(() => {
    addMessage("Bonjour ! Je suis l'assistant virtuel de FCA Shop. Posez-moi vos questions sur les livraisons, paiements ou retours.", "bot");
  }, 1000);
});
