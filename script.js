let cart = [];
let total = 0;

// ✅ Charger les produits depuis Google Sheet
async function loadProducts() {
  const sheetUrl = "https://opensheet.elk.sh/146qi6q1Zhk1eEg3JI7tVFveMOEB2-8CCJ9yCjmmjKFQ/produits"; // 🔥 Mets ton lien ici
  const response = await fetch(sheetUrl);
  const products = await response.json();

  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  products.forEach(p => {
    productsContainer.innerHTML += `
      <div class="product-card">
        <img src="${p.Image}" alt="${p.Nom}">
        <h3>${p.Nom}</h3>
        <p>1kg - ${p.Prix} CFA</p>
        <button onclick="addToCart('${p.Nom}', ${p.Prix})">Ajouter au panier</button>
      </div>
    `;
  });
}

function addToCart(product, price) {
  cart.push({ product, price });
  total += price;
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    cartItems.innerHTML += `
      <li>
        ${item.product} - ${item.price} CFA
        <button onclick="removeFromCart(${index})">❌</button>
      </li>
    `;
  });
  document.getElementById("total").textContent = total;
}

function removeFromCart(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  renderCart();
}

function sendOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  let orderDetails = "🛒 Nouvelle commande :\n";
  orderDetails += "👤 Nom: " + name + "\n";
  orderDetails += "📞 Téléphone: " + phone + "\n";
  orderDetails += "🏠 Adresse: " + address + "\n\n";
  orderDetails += "📦 Produits commandés:\n";

  cart.forEach(item => {
    orderDetails += "- " + item.product + " : " + item.price + " CFA\n";
  });

  orderDetails += "\n💰 Total: " + total + " CFA";

  // ✅ Envoi WhatsApp
  let phoneNumber = "00221771168451"; // Mets ton numéro WhatsApp ici
  let whatsappUrl = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(orderDetails);

  window.open(whatsappUrl, "_blank");
}

// ✅ Charger automatiquement les produits au démarrage
loadProducts();
