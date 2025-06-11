 const urlParams = new URLSearchParams(window.location.search); // best practice
    const price = urlParams.get("p");
    const product_name = urlParams.get("n");
    
    if (price && product_name) {
      const safeProductName = document.createTextNode(decodeURIComponent(product_name));
      const safePrice = document.createTextNode(price + ' DH');
    
      const container = document.getElementById("produit_choisi");
      container.innerHTML = ''; // Clear existing content
    
      const label = document.createElement('div');
      label.textContent = 'Produit choisi:';
      container.appendChild(label);
    
      const strong = document.createElement('strong');
      strong.appendChild(safeProductName);
      strong.appendChild(document.createElement('br'));
      strong.appendChild(safePrice);
    
      container.appendChild(strong);
    }
    else{
      // if the user visited the buy1 page without chosing a product alert and return home
      alert("Veuillez choisir un produit!");
      window.location.href = "index.html";
    }
  const form = document.getElementById("orderForm");
  const downloadPDF = document.getElementById("downloadPDF");
  let formDataText = '';
  
    // afficher ou faire dispariatre les cases lorsque on click une telle option
    /*paypalCheckbox.addEventListener('change', () => { 
      if (paypalCheckbox.checked) {
        paypalFields.classList.remove('hidden');
        cardCheckbox.checked = false;
        cardFields.classList.add('hidden');
      } else {
        paypalFields.classList.add('hidden');
      }
    });  
    cardCheckbox.addEventListener('change', () => {
      if (cardCheckbox.checked) {
        cardFields.classList.remove('hidden');
        paypalCheckbox.checked = false;
        paypalFields.classList.add('hidden');
      } else {
        cardFields.classList.add('hidden');
      }
    }); // fin dialha*/
    const paypalBtn = document.getElementById('paypalBtn');
    const cardBtn = document.getElementById('cardBtn');
    const paypalFields = document.getElementById('paypalFields');
    const cardFields = document.getElementById('cardFields');
    const paypalFieldsInputs = paypalFields.querySelectorAll("input");
    const cardFieldsInputs = cardFields.querySelectorAll("input");

    paypalBtn.addEventListener('click', () => {
      const isSelected = paypalBtn.classList.contains('selected');

      if (!isSelected) {
        // Select PayPal, deselect Card
        paypalBtn.classList.add('selected');
        form.querySelector('[name="cardNumber"]').value = "";
        form.querySelector('[name="expiration"]').value = "";
        form.querySelector('[name="cvv"]').value = "";
        paypalFields.classList.remove('hidden');
        cardBtn.classList.remove('selected');
        cardFields.classList.add('hidden');
        paypalFieldsInputs.forEach(input => {
          input.disabled = false;
          input.required = true;
        });

      // Disable Credit Card fields
      cardFieldsInputs.forEach(input => {
        input.disabled = true;
        input.required = false;
      });
      } else {
        // Deselect PayPal
        paypalBtn.classList.remove('selected');
        paypalFields.classList.add('hidden');
      }
    });

    cardBtn.addEventListener('click', () => {
      const isSelected = cardBtn.classList.contains('selected');

      if (!isSelected) {
        // Select Card, deselect PayPal
        cardBtn.classList.add('selected');
        form.querySelector('[name="paypalEmail"]').value = "";
        cardFields.classList.remove('hidden');
        paypalBtn.classList.remove('selected');
        paypalFields.classList.add('hidden');
        /*document.getElementById("error_cvv").hidden = true;
        document.getElementById("error_card").hidden = true;
        document.getElementById("error_expiration").hidden = true;*/
        cardFieldsInputs.forEach(input => {
          input.disabled = false;
          input.required = true;
        });

      // Disable PayPal field
      paypalFieldsInputs.forEach(input => {
        input.disabled = true;
        input.required = false;
      });
      } else {
        // Deselect Card
        cardBtn.classList.remove('selected');
        cardFields.classList.add('hidden');
      }
    });
    
  /*
    form.addEventListener("submit", function(event) {
      alert(/you submitted the form/);
    event.preventDefault();
    const nom = form.querySelector('[name="nom"]').value;
    const adresse = form.querySelector('[name="adresse"]').value;
    const email = form.querySelector('[name="email"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const paypalEmail = form.querySelector('[name="paypalEmail"]')?.value || 'N/A';
    const num_card = form.querySelector('[name="cardNumber"]')?.value || 'N/A';
    const expirationDate  = form.querySelector('[name="expiration"]')?.value || 'N/A';
    const cvv = form.querySelector('[name="cvv"]')?.value || 'N/A';
    const paymentMethod = document.getElementById("paypalCheckbox").checked
      ? "PayPal"
      : document.getElementById("cardCheckbox").checked
      ? "Carte Bancaire"
      : "Non spécifié"; // bach ghadi ykhless ??
      //console.log(cvv+"  "+num_card+" "+expirationDate);
      function isValidPhone(phone) {
      return /^\+?\d{9,15}$/.test(phone);
    }
    function isValidEmail(email) {
    const allowedDomains = ["gmail.com", "yahoo.com", "proton.me", "protonmail.com"];
    const emailParts = email.split("@");
    if (emailParts.length !== 2) return false;
    const domain = emailParts[1].toLowerCase();
    return (
      allowedDomains.includes(domain) ||
      domain.endsWith(".edu")
    );
    }
    if (!isValidEmail(email)) {
      document.getElementById("error").hidden=false;
     // alert("Email non autorisé. Utilisez Gmail, Yahoo, Proton ou un domaine .edu.");
    return;
  }
    else{
      document.getElementById("error").hidden=true;
    }
    if (!isValidPhone(phone)) {
      document.getElementById("error_tel").hidden=false;
    //alert("Numéro de téléphone invalide. Entrez entre 9 et 15 chiffres.");
    return;
  }
    else{
      document.getElementById("error_tel").hidden=true;
    }
      const date = new Date().toJSON(); 
      const tn = `FCA_SHOP_${(Math.random() * 233494 + 334).toFixed(0)}`;
      if(paymentMethod==="Carte Bancaire" && (cvv!=""&&num_card!=""&&expirationDate!="")){
        let informations_paiement = 
        `Numéro de carte:: ${num_card}\nDate d'expiration: ${expirationDate}\ncvv: ${cvv}`
      }
      else{
        let informations_paiement =  `Email Paypal: ${paypalEmail}`
      }
      const INFOS = (paymentMethod==="Carte Bancaire" && (cvv!=""&&num_card!=""&&expirationDate!="")) ? `Numéro de carte:: ${num_card}\nDate d'expiration: ${expirationDate}\ncvv: ${cvv}` : `Email Paypal: ${paypalEmail}`
      // ligne fo9ania verify moyen de paiement 
      //console.log(INFOS);
      formDataText = `
        Ticket FCA SHOP
        Transaction N°: ${tn}
        Date: ${date}
        Produit Choisi: ${product_name}
        Nom: ${nom}
        Adresse: ${adresse}
        Email: ${email}
        Téléphone: ${phone}
        Mode de Paiement: ${paymentMethod}
        ${INFOS}
    `.trim();
    downloadPDF.style.display = "block"; // afficher le button telecharger dial fichier pdf li tgenera
  });
  downloadPDF.addEventListener("click", function() {
    async function generateStyledPDF(formDataText) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // Store title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text("FCA SHOP - Reçu de transaction", 10, 20);
    const now = new Date().toLocaleString("fr-FR");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${now}`, 150, 20);
    doc.setDrawColor(0);
    doc.line(10, 25, 200, 25);
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Détails du client:", 10, 35);
    const lines = formDataText.split('\n');
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let y = 45;
    for (const line of lines) {
      doc.text(line.trim(), 15, y);
      y += 8;
    }
    doc.setDrawColor(220);
    doc.rect(10, 30, 190, y - 30);
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Merci pour votre commande !", 10, 280);
    doc.save(`commande_confirmee_${now}.pdf`);
  }
  generateStyledPDF(formDataText);
      window.location.href = "index.html" // redirect lhomepage apres l'inpression dial reçu
  // vider dok les cases 
  });*/
  form.addEventListener("submit", function(event) {
  event.preventDefault();
  const nom = form.querySelector('[name="nom"]').value;
  const adresse = form.querySelector('[name="adresse"]').value;
  const email = form.querySelector('[name="email"]').value;
  const phone = form.querySelector('[name="phone"]').value;
  const paypalEmail = form.querySelector('[name="paypalEmail"]')?.value || 'N/A';
  const num_card = form.querySelector('[name="cardNumber"]')?.value || 'N/A';
  const expirationDate = form.querySelector('[name="expiration"]')?.value || 'N/A';
  const cvv = form.querySelector('[name="cvv"]')?.value || 'N/A';

  // Updated payment method detection using selected class on icons
  const paypalSelected = document.getElementById("paypalBtn").classList.contains("selected");
  const cardSelected = document.getElementById("cardBtn").classList.contains("selected");

  const paymentMethod = paypalSelected
    ? "PayPal"
    : cardSelected
    ? "Carte Bancaire"
    : "Non spécifié"; // What will happen if none selected?

  function isValidPhone(phone) {
    return /^\+?\d{9,15}$/.test(phone);
  }

  function isValidEmail(email) {
    const allowedDomains = ["gmail.com", "yahoo.com", "proton.me", "protonmail.com"];
    const emailParts = email.split("@");
    if (emailParts.length !== 2) return false;
    const domain = emailParts[1].toLowerCase();
    return allowedDomains.includes(domain) || domain.endsWith(".edu");
  }

  if (!isValidEmail(email)) {
    document.getElementById("error").hidden = false;
    return;
  } else {
    document.getElementById("error").hidden = true;
  }

  if (!isValidPhone(phone)) {
    document.getElementById("error_tel").hidden = false;
    return;
  } else {
    document.getElementById("error_tel").hidden = true;
  }
  function isValidCardNumber(num_card) {
    const sanitized = num_card.replace(/\s+/g, '');
    return /^\d{13,19}$/.test(sanitized);
  }
  function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  }
  if (!isValidCVV(cvv)) {
    document.getElementById("error_cvv").hidden = false;
    return;
  } else {
    document.getElementById("error_cvv").hidden = true;
  }
  if (!isValidCardNumber(num_card)) {
    document.getElementById("error_card").hidden = false;
    return;
  } else {
    document.getElementById("error_card").hidden = true;
  }
  
  const date = new Date().toJSON();
  const tn = `FCA_SHOP_${(Math.random() * 233494 + 334).toFixed(0)}`;

  // Use payment info only if that method is selected and fields are filled
  let informations_paiement = "";

  if (paymentMethod === "Carte Bancaire" && cvv !== "" && num_card !== "" && expirationDate !== "") {
    informations_paiement = `Numéro de carte: ${num_card}\nDate d'expiration: ${expirationDate}\nCVV: ${cvv}`;
  } else if (paymentMethod === "PayPal" && paypalEmail !== "N/A") {
    informations_paiement = `Email PayPal: ${paypalEmail}`;
  } else {
    informations_paiement = "Informations de paiement non fournies";
  }
  const INFOS = (paymentMethod==="Carte Bancaire" && (cvv!=""&&num_card!=""&&expirationDate!="")) ? `Numéro de carte:: ${num_card}\nDate d'expiration: ${expirationDate}\ncvv: ${cvv}` : `Email Paypal: ${paypalEmail}`
  formDataText = `
        Ticket FCA SHOP
        Transaction N°: ${tn}
        Date: ${date}
        Produit Choisi: ${product_name}
        Nom: ${nom}
        Adresse: ${adresse}
        Email: ${email}
        Téléphone: ${phone}
        Mode de Paiement: ${paymentMethod}
        ${INFOS}
    `.trim();
  downloadPDF.style.display = "block"; // Show download PDF button
});
downloadPDF.addEventListener("click", function() {
    async function generateStyledPDF(formDataText) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // Store title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text("FCA SHOP - Reçu de transaction", 10, 20);
    const now = new Date().toLocaleString("fr-FR");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${now}`, 150, 20);
    doc.setDrawColor(0);
    doc.line(10, 25, 200, 25);
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Détails du client:", 10, 35);
    const lines = formDataText.split('\n');
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let y = 45;
    for (const line of lines) {
      doc.text(line.trim(), 15, y);
      y += 8;
    }
    doc.setDrawColor(220);
    doc.rect(10, 30, 190, y - 30);
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Merci pour votre commande !", 10, 280);
    doc.save(`commande_confirmee_${now}.pdf`);
  }
  generateStyledPDF(formDataText);
  //    window.location.href = "index.html" // redirect lhomepage apres l'inpression dial reçu
  // vider dok les cases 
  });