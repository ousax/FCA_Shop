// chatbot.js - Version complète avec intégration You.com AI
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    maxHistory: 3, // Nombre de messages à garder pour le contexte
    thinkingDelay: 300, // Délai avant affichage "typing"
    minResponseTime: 800 // Temps minimum d'attente pour éviter le clignotement
  };

  // Éléments UI
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotContainer = document.querySelector(".chatbot-container");
  const closeChatbot = document.getElementById("closeChatbot");
  const sendMessageBtn = document.getElementById("sendMessage");
  const userMessageInput = document.getElementById("userMessage");
  const chatbotMessages = document.getElementById("chatbotMessages");

  // État de la conversation
  let conversationHistory = [];
  let currentRequest = null;
  let isBotTyping = false;
  let lastMessageTime = 0;

  // Initialisation
  initChatbot();

  // Fonctions principales
  function initChatbot() {
    setupEventListeners();
    showWelcomeMessage();
  }

  function setupEventListeners() {
    chatbotToggle.addEventListener("click", toggleChatbot);
    closeChatbot.addEventListener("click", () => chatbotContainer.classList.remove("active"));
    sendMessageBtn.addEventListener("click", sendMessage);
    userMessageInput.addEventListener("keypress", (e) => e.key === "Enter" && sendMessage());

    // Auto-focus sur l'input quand le chat s'ouvre
    chatbotContainer.addEventListener("transitionend", () => {
      if (chatbotContainer.classList.contains("active")) {
        userMessageInput.focus();
      }
    });
  }

  function toggleChatbot() {
    chatbotContainer.classList.toggle("active");
  }

  async function sendMessage() {
    const message = userMessageInput.value.trim();
    if (!message || isBotTyping) return;

    // Préparation UI
    userMessageInput.value = "";
    addMessage(message, "user");
    const loadingId = showLoadingIndicator();
    isBotTyping = true;
    lastMessageTime = Date.now();

    // Historique de conversation
    conversationHistory.push(`User: ${message}`);
    if (conversationHistory.length > config.maxHistory) {
      conversationHistory.shift();
    }

    try {
      // Choix entre réponses statiques ou API
      const staticResponse = getStaticResponse(message);
      if (staticResponse) {
        simulateTyping(staticResponse, loadingId);
      } else {
        const apiResponse = await fetchYouChatResponse(message);
        simulateTyping(apiResponse, loadingId);
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage("Désolé, une erreur s'est produite. Réessayez plus tard.", "bot");
    } finally {
      isBotTyping = false;
    }
  }

  // Gestion des réponses
  function getStaticResponse(message) {
    const staticResponses = {
      "retour": "Nous acceptons les retours sous 14 jours. Pour initier un retour, veuillez...",
      "paiement": "Options de paiement: Carte bancaire, PayPal, ou cash à la livraison.",
      "livraison": "Délais: 2-3 jours au Maroc. Frais: 30 DH ou gratuit dès 300 DH d'achat.",
      "contact": "Email: contact@fcashop.com | Tél: +212 5 22 34 56 78"
    };

    const lowerMsg = message.toLowerCase();
    return staticResponses[lowerMsg] || null;
  }

  async function fetchYouChatResponse(prompt) {
    const youChatAPI = new YouChatAPI();
    let fullResponse = "";

    await new Promise((resolve) => {
      youChatAPI.getStreamingResponse(prompt, (chunk) => {
        fullResponse += chunk;
        updateMessage(fullResponse, loadingId);
      }, resolve);
    });

    return fullResponse;
  }

  // Helpers UI
  function showWelcomeMessage() {
    setTimeout(() => {
      addMessage(
        "Bonjour ! Je suis l'assistant de FCA Shop. Posez-moi vos questions sur nos produits, livraisons ou services.",
        "bot"
      );
    }, 1000);
  }

  function showLoadingIndicator() {
    const id = "loading-" + Date.now();
    addMessage(
      '<div class="loading-dots"><span></span><span></span><span></span></div>',
      "bot",
      id
    );
    return id;
  }

  function simulateTyping(text, loadingId) {
    const chars = text.split("");
    let displayedText = "";
    const messageElement = document.getElementById(loadingId);

    const typeNextChar = () => {
      if (chars.length > 0) {
        displayedText += chars.shift();
        messageElement.innerHTML = DOMPurify.sanitize(displayedText);
        setTimeout(typeNextChar, Math.random() * 30 + 10);
      }
    };

    // Respecte le temps minimum de réponse
    const elapsed = Date.now() - lastMessageTime;
    const delay = Math.max(0, config.minResponseTime - elapsed);

    setTimeout(typeNextChar, delay);
  }

  function addMessage(text, sender, id = null) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;
    if (id) messageDiv.id = id;
    messageDiv.innerHTML = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ['strong', 'em', 'a', 'br'],
      ALLOWED_ATTR: ['href']
    });
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return messageDiv;
  }

  // Classe pour l'API You.com
  class YouChatAPI {
    constructor() {
      this.baseUrl = 'https://you.com/api/streamingSearch';
      this.abortController = null;
    }

    async getStreamingResponse(prompt, updateCallback, completeCallback) {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      const params = new URLSearchParams({
        q: prompt,
        page: 1,
        count: 1,
        safeSearch: 'Moderate',
        mkt: 'fr-FR',
        responseFilter: 'WebPages,Translations,TimeZone,Computation,RelatedSearches',
        domain: 'youchat'
      });

      try {
        const response = await fetch(`${this.baseUrl}?${params}`, {
          signal: this.abortController.signal,
          headers: {
            'Accept': 'text/event-stream',
            'Accept-Language': 'fr-FR',
            'User-Agent': navigator.userAgent
          }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const reader = response.body.getReader();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += new TextDecoder().decode(value);
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const event of events) {
            const text = this.parseEvent(event);
            if (text) updateCallback(text);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('API Error:', error);
          updateCallback("Désolé, problème de connexion. Réessayez...");
        }
      } finally {
        completeCallback?.();
      }
    }

    parseEvent(event) {
      const lines = event.split('\n');
      let eventType = '';
      let data = '';

      for (const line of lines) {
        if (line.startsWith('event:')) eventType = line.substring(6).trim();
        else if (line.startsWith('data:')) data = line.substring(5).trim();
      }

      if (eventType === 'youChatToken' && data) {
        try {
          return JSON.parse(data).youChatToken || '';
        } catch {
          return '';
        }
      }
      return '';
    }
  }
});