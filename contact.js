// Dans script.js ou un nouveau fichier contact.js
document.addEventListener("DOMContentLoaded", () => {
  const messageTextarea = document.getElementById("message");
  
  messageTextarea.addEventListener("focus", () => {
    if (messageTextarea.value === "") {
      messageTextarea.value = "Bonjour,\n\nJe vous contacte concernant ";
    }
  });

  // Autocomplétion pour les sujets courants
  const commonSubjects = [
    "une commande passée le...",
    "un problème technique",
    "une question sur les livraisons",
    "un retour produit",
    "une suggestion d'amélioration"
  ];

  const subjectInput = document.getElementById("subject");
  const datalist = document.createElement("datalist");
  datalist.id = "subjectSuggestions";
  
  commonSubjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    datalist.appendChild(option);
  });

  subjectInput.setAttribute("list", "subjectSuggestions");
  subjectInput.parentNode.insertBefore(datalist, subjectInput.nextSibling);
});