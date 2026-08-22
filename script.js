"use strict";

const defaultListings = [

  {

    id: 1,

    name: "iPhone 15",

    price: 750,

    category: "مۆبایل",

    location: "هەولێر",

    icon: "📱",

    description: "مۆبایلی iPhone 15 بە دۆخی باش."

  },

  {

    id: 2,

    name: "MacBook Air",

    price: 1100,

    category: "کۆمپیوتەر",

    location: "سلێمانی",

    icon: "💻",

    description: "MacBook Air بۆ کار و خوێندن."

  },

  {

    id: 3,

    name: "Toyota Corolla",

    price: 12500,

    category: "ئۆتۆمبێل",

    location: "دهۆک",

    icon: "🚗",

    description: "ئۆتۆمبێلی Toyota Corolla."

  },

  {

    id: 4,

    name: "کۆرسی نوێ",

    price: 180,

    category: "ماڵ",

    location: "هەولێر",

    icon: "🏠",

    description: "کۆرسی بۆ ماڵ و ئۆفیس."

  },

  {

    id: 5,

    name: "جلی پیاوان",

    price: 45,

    category: "جل و بەرگ",

    location: "کەرکووک",

    icon: "👕",

    description: "جلی نوێی پیاوان."

  },

  {

    id: 6,

    name: "AirPods",

    price: 120,

    category: "ئەلیکترۆنیات",

    location: "سلێمانی",

    icon: "🎧",

    description: "AirPods بە کوالێتی باش."

  }

];

const savedListings =

  JSON.parse(localStorage.getItem("haobeshListings") || "[]");

let listings = [

  ...defaultListings,

  ...savedListings

];

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}

function formatNumber(value) {

  return new Intl.NumberFormat("en-US").format(value);

}

function renderListings(items = listings) {

  const container = $("listingsContainer");

  container.innerHTML = "";

  $("resultCount").textContent =

    `${items.length} کەلوپەل`;

  if (!items.length) {

    container.innerHTML = `

      <div style="

        grid-column:1/-1;

        text-align:center;

        padding:60px 20px;

        color:#9da5b1;

      ">

        <div style="font-size:50px">🔎</div>

        <h3 style="margin:15px 0">

          هیچ کەلوپەلێک نەدۆزرایەوە

        </h3>

        <p>وشەیەکی تر تاقی بکەرەوە.</p>

      </div>

    `;

    return;

  }

  items.forEach((item) => {

    const card = document.createElement("article");

    card.className = "listing";

    card.innerHTML = `

      <div class="listing-image">

        ${escapeHTML(item.icon)}

      </div>

      <div class="listing-body">

        <div class="listing-title">

          ${escapeHTML(item.name)}

        </div>

        <div class="listing-location">

          📍 ${escapeHTML(item.location)}

        </div>

        <div class="listing-category">

          ${escapeHTML(item.category)}

        </div>

        <div class="price">

          ${formatNumber(item.price)} €

        </div>

        <button

          class="btn btn-secondary"

          style="width:100%;margin-top:13px;padding:10px"

          data-product-id="${item.id}"

        >

          بینینی وردەکاری

        </button>

      </div>

    `;

    container.appendChild(card);

  });

}

function applyFilters() {

  const search =

    $("searchInput").value.trim().toLowerCase();

  const category =

    $("categoryFilter").value;

  const filtered = listings.filter((item) => {

    const text =

      `${item.name} ${item.location} ${item.category} ${item.description || ""}`

      .toLowerCase();

    const matchesSearch =

      !search || text.includes(search);

    const matchesCategory =

      category === "all" ||

      item.category === category;

    return matchesSearch && matchesCategory;

  });

  renderListings(filtered);

}

function showMessage(text) {

  const message = $("message");

  message.textContent = text;

  message.classList.add("show");

  clearTimeout(window.haobeshMessageTimer);

  window.haobeshMessageTimer =

    setTimeout(() => {

      message.classList.remove("show");

    }, 3000);

}

function scrollToSection(id) {

  const element = $(id);

  if (!element) return;

  element.scrollIntoView({

    behavior: "smooth"

  });

  $("navLinks").classList.remove("open");

}

function showProduct(id) {

  const item =

    listings.find((product) => product.id === id);

  if (!item) return;

  $("modalTitle").textContent = item.name;

  $("modalContent").innerHTML = `

    <div style="

      text-align:center;

      font-size:80px;

      margin:15px 0;

    ">

      ${escapeHTML(item.icon)}

    </div>

    <div style="

      color:#f5c542;

      font-size:25px;

      font-weight:900;

      margin-bottom:15px;

    ">

      ${formatNumber(item.price)} €

    </div>

    <p style="color:#9da5b1;margin-bottom:10px">

      📍 ${escapeHTML(item.location)}

    </p>

    <p style="color:#9da5b1;margin-bottom:20px">

      ${escapeHTML(item.description || "وەسف نییە.")}

    </p>

    <button

      id="contactSeller"

      class="btn btn-primary"

      style="width:100%"

    >

      پەیوەندی بە فرۆشیار

    </button>

  `;

  $("modal").classList.add("active");

  $("contactSeller").addEventListener("click", () => {

    showMessage(

      "ئەم بەشە لە وەشانی داهاتوودا چالاک دەکرێت."

    );

  });

}

function openLogin() {

  $("modalTitle").textContent =

    "چوونەژوورەوە";

  $("modalContent").innerHTML = `

    <form id="loginForm" class="modal-form">

      <input

        class="input"

        type="email"

        id="loginEmail"

        required

        placeholder="ئیمەیڵ"

      >

      <input

        class="input"

        type="password"

        id="loginPassword"

        required

        placeholder="وشەی نهێنی"

      >

      <button

        class="btn btn-primary"

        type="submit"

      >

        چوونەژوورەوە

      </button>

    </form>

  `;

  $("modal").classList.add("active");

  $("loginForm").addEventListener("submit", (event) => {

    event.preventDefault();

    closeModal();

    showMessage(

      "چوونەژوورەوە لە دۆخی نموونەیی چالاکە."

    );

  });

}

function closeModal() {

  $("modal").classList.remove("active");

}

$("searchInput").addEventListener(

  "input",

  applyFilters

);

$("searchButton").addEventListener(

  "click",

  applyFilters

);

$("categoryFilter").addEventListener(

  "change",

  applyFilters

);

document.querySelectorAll("[data-scroll]")

  .forEach((button) => {

    button.addEventListener("click", () => {

      scrollToSection(button.dataset.scroll);

    });

  });

document.querySelectorAll(".category")

  .forEach((button) => {

    button.addEventListener("click", () => {

      $("categoryFilter").value =

        button.dataset.category;

      scrollToSection("listings");

      applyFilters();

    });

  });

$("menuButton").addEventListener(

  "click",

  () => {

    $("navLinks").classList.toggle("open");

  }

);

$("loginButton").addEventListener(

  "click",

  openLogin

);

$("closeModal").addEventListener(

  "click",

  closeModal

);

$("modal").addEventListener(

  "click",

  (event) => {

    if (event.target === $("modal")) {

      closeModal();

    }

  }

);

$("listingsContainer").addEventListener(

  "click",

  (event) => {

    const button =

      event.target.closest("[data-product-id]");

    if (!button) return;

    showProduct(

      Number(button.dataset.productId)

    );

  }

);

$("sellForm").addEventListener(

  "submit",

  (event) => {

    event.preventDefault();

    const name =

      $("productName").value.trim();

    const price =

      Number($("productPrice").value);

    const category =

      $("productCategory").value;

    const location =

      $("productLocation").value.trim();

    const description =

      $("productDescription").value.trim();

    if (

      !name ||

      !price ||

      !category ||

      !location

    ) {

      showMessage(

        "تکایە هەموو خانە پێویستەکان پڕبکەرەوە."

      );

      return;

    }

    const icons = {

      "مۆبایل": "📱",

      "کۆمپیوتەر": "💻",

      "ئۆتۆمبێل": "🚗",

      "ماڵ": "🏠",

      "جل و بەرگ": "👕",

      "ئەلیکترۆنیات": "🎧"

    };

    const newListing = {

      id: Date.now(),

      name,

      price,

      category,

      location,

      description,

      icon: icons[category] || "📦"

    };

    savedListings.unshift(newListing);

    localStorage.setItem(

      "haobeshListings",

      JSON.stringify(savedListings)

    );

    listings = [

      ...defaultListings,

      ...savedListings

    ];

    event.target.reset();

    renderListings();

    showMessage(

      "کەلوپەلەکەت بە سەرکەوتوویی زیادکرا."

    );

    scrollToSection("listings");

  }

);

renderListings();

/* Service Worker */

if ("serviceWorker" in navigator) {

  window.addEventListener(

    "load",

    () => {

      navigator.serviceWorker

        .register("./sw.js")

        .then(() => {

          console.log(

            "HAOBESH Service Worker registered"

          );

        })

        .catch((error) => {

          console.error(

            "HAOBESH Service Worker error:",

            error

          );

        });

    }

  );

}