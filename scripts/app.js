/* ===== CART DRAWER ===== */

const cartButton = document.querySelector(".cart-button");
const cartDrawer = document.querySelector(".cart-drawer");
const cartOverlay = document.querySelector(".cart-overlay");
const closeCartButton = document.querySelector(".cart-close");
const cartCatalogLink = cartDrawer.querySelector('a[href="#catalog"]');
const cartBackground = document.querySelectorAll(".site-header, main, .site-footer");

function openCart() {
    cartDrawer.classList.add("is-open");
    cartOverlay.classList.add("is-open");
    document.body.classList.add("cart-open");

    cartDrawer.inert = false;
    cartDrawer.removeAttribute("aria-hidden");
    cartButton.setAttribute("aria-expanded", "true");
    closeCartButton.focus();
    cartBackground.forEach((element) => { element.inert = true; });
}

function closeCart() {
    cartDrawer.classList.remove("is-open");
    cartOverlay.classList.remove("is-open");
    document.body.classList.remove("cart-open");

    cartBackground.forEach((element) => { element.inert = false; });
    cartButton.setAttribute("aria-expanded", "false");
    cartButton.focus({ preventScroll: true });
    cartDrawer.inert = true;
    cartDrawer.setAttribute("aria-hidden", "true");
}

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
cartCatalogLink.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
    if (!cartDrawer.classList.contains("is-open")) return;
    if (event.key === "Escape") {
        closeCart();
    }
    if (event.key === "Tab") {
        const items = [...cartDrawer.querySelectorAll("button:not(:disabled), a[href]")];
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});


/* ===== HASH SPA NAVIGATION ===== */

const views = {
    home: document.querySelector("#home-view"),
    catalog: document.querySelector("#catalog-view"),
    about: document.querySelector("#about-view")
};

const routeLinks = document.querySelectorAll("[data-route]");
const overview = document.querySelector("#catalog-overview");
const detail = document.querySelector("#category-detail");
const grid = document.querySelector("#category-grid");
const searchButton = document.querySelector(".search-button");
const categorySearch = document.querySelector("#category-search");
const clearSearch = document.querySelector("#clear-category-search");
const searchStatus = document.querySelector("#category-search-status");
const searchEmpty = document.querySelector("#category-search-empty");
const bestSellers = document.querySelector("#best-sellers");
let focusCategorySearch = false;

const categories = [
    { id: "toys", name: "Toys", description: "Chew, tug and fetch.", alt: "Dachshund tugging a rope toy indoors", photo: "playful-dachshund-tugging-a-rope-toy-indoors-31318382", position: "50% 57%" },
    { id: "food", name: "Food & Treats", description: "Everyday meals and little rewards.", alt: "Brown dog eating kibble from a white bowl", photo: "close-up-shot-of-a-dog-eating-6568950", position: "50% 60%" },
    { id: "walking", name: "Walking", description: "Leashes, collars and harnesses for daily walks.", alt: "Pomeranian on a leash on a sidewalk", photo: "dog-walking-on-a-leash-14979532", position: "50% 60%" },
    { id: "beds", name: "Beds & Houses", description: "A quiet spot to curl up.", alt: "Beagle puppy asleep on a cushioned dog bed", photo: "close-up-of-beagle-puppy-sleeping-on-dog-bed-11060023", position: "50% 52%" },
    { id: "feeding", name: "Feeding", description: "Bowls and accessories for the daily routine.", alt: "Dalmatian drinking from a stainless steel bowl", photo: "a-dog-drinking-water-5483413", position: "50% 62%" },
    { id: "grooming", name: "Grooming", description: "Brushes and supplies for bath day.", alt: "Groomer combing a Yorkshire terrier", photo: "close-up-photo-of-a-dog-being-groomed-6816850" },
    { id: "training", name: "Training", description: "Tools for practicing new skills together.", alt: "White dog offering its paw during training", photo: "dog-giving-paw-to-anonymous-person-4544877" },
    { id: "clothing", name: "Clothing", description: "Layers for chilly mornings and wet afternoons.", alt: "Dog wearing a sweater and bandana", photo: "close-up-of-a-clothed-dog-16620588", position: "50% 42%" },
    { id: "travel", name: "Travel", description: "Essentials for trips away from home.", alt: "Brown dog peeking out of a vintage car window", photo: "dog-inside-vehicle-2536231" }
].map((category) => ({
    ...category,
    image: `images/catalog/${category.id}.jpg`
}));

// Future product records: { id, categoryId, name, image, alt, priceCents }.
const products = [];

function categoryImage(category, loading) {
    return `<img src="${category.image}" alt="${category.alt}" loading="${loading}" decoding="async"
        style="object-position:${category.position || "center"}">`;
}

function populateCategoryGrid() {
    if (grid.childElementCount) return;

    grid.innerHTML = categories.map((category) => `
        <a class="category-card" href="#catalog/${category.id}">
            <div class="category-media" aria-hidden="true">${categoryImage(category, "eager")}</div>
            <h2>${category.name}</h2>
        </a>
    `).join("");
}

function filterCategories() {
    const terms = categorySearch.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    categories.forEach((category, index) => {
        const words = `${category.name} ${category.description}`.toLowerCase();
        const matches = terms.every((term) => words.includes(term));
        grid.children[index].hidden = !matches;
        if (matches) count += 1;
    });
    clearSearch.hidden = categorySearch.value === "";
    searchEmpty.hidden = count > 0;
    searchStatus.textContent = count === 1 ? "1 category found." : `${count} categories found.`;
}

categorySearch.addEventListener("input", filterCategories);
clearSearch.addEventListener("click", () => {
    categorySearch.value = "";
    filterCategories();
    categorySearch.focus();
});

searchButton.addEventListener("click", () => {
    if (location.hash === "#catalog") {
        categorySearch.focus();
        return;
    }
    focusCategorySearch = true;
    location.hash = "catalog";
});

function renderProducts(container, categoryId) {
    const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    for (const product of products.filter((item) => item.categoryId === categoryId)) {
        const card = document.createElement("article");
        card.className = "product-card";
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.alt;
        image.loading = "lazy";
        const name = document.createElement("h3");
        name.textContent = product.name;
        const amount = document.createElement("p");
        amount.className = "product-price";
        amount.textContent = price.format(product.priceCents / 100);
        card.append(image, name, amount);
        container.append(card);
    }
    return container.childElementCount;
}

function renderCategory(id) {
    overview.hidden = Boolean(id);
    detail.hidden = !id;
    if (!id) {
        populateCategoryGrid();
        return;
    }

    const category = categories.find((item) => item.id === id);
    detail.innerHTML = category ? `
        <nav class="category-breadcrumb" aria-label="Breadcrumb">
            <a href="#catalog">Catalog</a><span aria-hidden="true">/</span>
            <span aria-current="page">${category.name}</span>
        </nav>
        <header class="category-hero">
            <div><h1 tabindex="-1">${category.name}</h1><p>${category.description}</p></div>
            ${categoryImage(category, "eager")}
        </header>
        <section class="category-stock" aria-label="Products">
            <div id="catalog-products" class="category-products"></div>
            <div class="category-empty">
                <p>Products coming soon.</p>
            </div>
        </section>
        <p class="category-credit"><a href="https://www.pexels.com/photo/${category.photo}/">Photography via Pexels</a></p>
    ` : `
        <div class="category-empty">
            <h1 tabindex="-1">Category not found</h1>
            <p>The category you’re looking for is unavailable.</p>
            <a href="#catalog">Browse all categories</a>
        </div>
    `;
    if (category) {
        const count = renderProducts(detail.querySelector("#catalog-products"), category.id);
        detail.querySelector(".category-empty").hidden = count > 0;
    }
}

function renderPage(event) {
    const hash = window.location.hash || "#home";
    const categoryRoute = hash.startsWith("#catalog/");
    const activePage = hash === "#catalog" || categoryRoute
        ? "catalog"
        : hash === "#about" ? "about" : "home";

    if (!cartDrawer.inert) closeCart();

    if (activePage === "catalog") {
        renderCategory(categoryRoute ? hash.slice("#catalog/".length) || "/" : "");
    }

    for (const [name, element] of Object.entries(views)) {
        element.hidden = name !== activePage;
    }

    if (focusCategorySearch && hash === "#catalog") {
        categorySearch.focus({ preventScroll: true });
    } else if (event && hash !== "#best-sellers") {
        const activeView = activePage === "catalog" ? (categoryRoute ? detail : overview) : views[activePage];
        activeView.querySelector("h1").focus({ preventScroll: true });
    }
    focusCategorySearch = false;

    routeLinks.forEach((link) => {
        const isActive = link.dataset.route === activePage;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    if (hash === "#best-sellers") {
        requestAnimationFrame(() => {
            if (window.location.hash !== hash) return;
            if (event) bestSellers.querySelector("h2").focus({ preventScroll: true });
            bestSellers.scrollIntoView({ block: "start" });
        });
    } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
}

window.addEventListener("hashchange", renderPage);
renderPage();
