const burgerMenu = document.querySelector('.menu-burger');
const categories = document.querySelector('.filter-list');
const categoriesList = document.querySelectorAll('.filter-item');
const burgerIcon = document.querySelector('#burger-icon');
const cartIcon = document.querySelector('#cart-icon');
const overlay = document.querySelector('.div-overlay');
const header = document.querySelector('.header-container');
const cardsContainer = document.querySelector('.div-cards');
const cartContainer = document.querySelector('.cart-container');
const productsInCart = document.querySelector('.products-incart');
const buttonBuy = document.querySelector('.buy');
const buttonEmpty = document.querySelector('.empty');
const pageBody = document.getElementsByTagName('body')[0];
const buttonAddOne = document.querySelector('.add-one');
const buttonLessOne = document.querySelector('.less-one');
const totalValue = document.querySelector('#total-value');
const cartInMenu = document.querySelector('#cart-link');

const requestProduct = async (category) => {
    const url = `https://makeup-api.herokuapp.com/api/v1/products.json`;
    const urlCategory = `?product_category=${category}`;
    const baseUrl = url + urlCategory;
    // const baseUrl = url

    try {
        const fetchUrl = await fetch (baseUrl);
        data = await fetchUrl.json();

        return data;
    }

    catch (error) {
        console.log(error);
    }
}

/*Local Storage */


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveLocalStorage = productList => {
    localStorage.setItem("cart", JSON.stringify(cartList));
}

/*Menu Burger*/

clickOutMenu = e => {
    if(burgerMenu.classList.contains('open-menu')){
        burgerMenu.classList.remove('open-menu');
        overlay.classList.remove('show-overlay');
    }
    else if(cartContainer.classList.contains('open-cart')){
        cartContainer.classList.remove('open-cart');
        overlay.classList.remove('show-overlay');
    }
    if(pageBody.classList.contains('no-scroll')){
        pageBody.classList.remove('no-scroll')
    }
}

openCart = () => {
    cartContainer.classList.toggle('open-cart');
    if(burgerMenu.classList.contains('open-menu')){
        burgerMenu.classList.remove('open-menu');
        return;
    }
    overlay.classList.toggle('show-overlay');
    pageBody.classList.toggle('no-scroll');
    renderCart();
    btnDisable(buttonBuy);
    btnDisable(buttonEmpty);
}

openMenu = () => {
    burgerMenu.classList.toggle('open-menu');
    if(cartContainer.classList.contains('open-cart')){
        cartContainer.classList.remove('open-cart');
        return;
    }
    overlay.classList.toggle('show-overlay');
    pageBody.classList.toggle('no-scroll');
}

/* Render */

splitTitle = (title) => {
    // const title = title;
    if (title.length < 25) {
        return title;
    }
    else {
        return (title.slice(0,20) + '...');
    }
}

renderProduct = (product) => {
    const tags = product.tag_list;
    const tag = tags.map(tag => `<span>${tag}</span>`).join('<span> - </span>');
    const roundedPrice = Math.round(product.price * 10) / 10;
    const title = splitTitle(product.name);

    return `
    <div class="product-item">
        <div class="prod-text">
            <div class="div-tit">
                <h3 class="product-name">${title}</h3>
            </div>
            <p class="product-brand">${product.brand}</p>
            <div class="price-box"><span>${roundedPrice}</span><span> ARS</span></div>
            <div class="prod-tags">
                ${tag}
            </div>
        </div>
        <div class="div-pic">
        <img src=${product.image_link} class="prod-pic" onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png';">
        <div class="add-cart"
            data-id='${product.id}'
            data-title='${title}'
            data-brand='${product.brand}'
            data-price='${roundedPrice}'
            data-img='${product.image_link}'
        >
        Agregar</div>
        </div>
    </div>
    `
    //<img class="cart-plus" src="./assets/cart-plus_2.svg">
}

btnState = (e) => {
    const selectedFilter = e.target;
    categoriesList.forEach(category => {
        category.classList.remove('selectedCard');
    });
    selectedFilter.classList.add('selectedCard');
}

renderProducts = async (category) => {
    const fetchedProduct = await requestProduct(category);
    console.log(fetchedProduct);
    // overlay = `<div class="div-overlay"></div>`
    const renderedProducts = fetchedProduct.map(product => renderProduct(product)).join('');
    if(!renderedProducts.length){
        cardsContainer.innerHTML = `<p>Ups... No contamos con productos en stock.</p>`;
    } else {
        cardsContainer.innerHTML = renderedProducts;
    }
    //cardsContainer.innerHTML = fetchedProduct.map(product => renderProduct(product)).join('');
}

applyFilter = (e) => {
    const category = e.target.dataset.category;
    if(!category) {
        return;
    }
    else{
        renderProducts(category);
        btnState(e);
        //category.classList.add('selectedCard');
    }
}

/*Cart*/

// openCartMenu = () => {
//     cartContainer.classList.toggle('open-cart');
//     if(burgerMenu.classList.contains('open-menu')
// }

renderCartProduct = (cartProduct) => {
    return `
    <div class="product-incart">
        <div class="prod-text">
            <div class="div-tit">
                <h3 class="product-name">${cartProduct.title}</h3>
            </div>
            <p class="product-brand">${cartProduct.brand}</p>
            <div class="price-box"><span>${cartProduct.price}</span><span> ARS</span></div>
        </div>
        <div class="div-pic">
        <img src=${cartProduct.image_link} class="prod-pic" onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png';">
            <div class="add-products">
                <span class="quantity">${cartProduct.quantity}</span>
                <button class="button-cart less-one" data-id=${cartProduct.id}>-</button>
                <button class="button-cart add-one" data-id=${cartProduct.id}>+</button>
            </div>
        </div>
    </div>`
}

addOneUnit = (id) => {
    cart = cart.map(item => {
        return item.id === id ? {...item, quantity: item.quantity + 1} : item;
    })
}

lessOneUnit = (id) => {
    const targetQt = cart.filter(item => item.id === id)[0].quantity;
    if(targetQt === 1){
        cart = cart.filter(item => item.id !== id);
    }
    else {
        cart = cart.map(item => {
            return item.id === id ? {...item, quantity: item.quantity - 1} : item});
    }
}

addOrSubstractUnit = (e) => {
    if(e.target.classList.contains('add-one')) {
        addOneUnit(e.target.dataset.id);
        // console.log(e.target.dataset.id);
    }
    if(e.target.classList.contains('less-one')) {
        lessOneUnit(e.target.dataset.id);
    }
    checkCartState();
}

showTotal = () => {
    const total = cart.reduce((ac,cur) => ac + cur.price * cur.quantity,0);
    totalValue.innerHTML = Number(total).toFixed(2);   
}

renderCart = () => {
    if(!cart.length){
        return productsInCart.innerHTML = `<p class="text-noprod">No hay productos en el carro.</p>`;
    } else {
    return productsInCart.innerHTML = cart.map( product => renderCartProduct(product)).join('');
    //return productsInCart.innerHTML = `<p>Hola Rey</p>`
    }
}

btnDisable = (btn) => {
    if(!cart.length) {
        btn.classList.add('disabled');
    }
    else{
        btn.classList.remove('disabled');
    }
}

// totalSum =

const isAlreadyInCart = (product) => {
    return cart.find(item => item.id === product.id);
}

const addUnitToProduct = (product) => {
    cart = cart.map(item => {
            return item.id === product.id ? {...item, quantity: item.quantity + 1} : item });
    console.log('ya esta');
}

const newProductToCart = (product) => {
    // const newProduct = {...product, quantity: 1};
    cart = [...cart, { ...product, quantity: 1 }];
}

const addProduct = (e) => {
    if(!e.target.classList.contains('add-cart')) return;
    const newProduct = {id, title, brand, price, img} = e.target.dataset;
    const product = {...newProduct}
    if (isAlreadyInCart(product)){
        addUnitToProduct(product);
    }
    else{
        newProductToCart(product);
        //renderCart(cart);
        checkCartState();
    }
}

const emptyCart = () => {
    cart = [];
}

checkCartState = () => {
    renderCart();
    showTotal();
    btnDisable(buttonBuy);
    btnDisable(buttonEmpty);
}

const init = () => {
    overlay.addEventListener("click", clickOutMenu);
    categories.addEventListener("click", applyFilter);
    burgerIcon.addEventListener("click", openMenu);
    cartIcon.addEventListener("click", openCart);
    btnDisable(buttonBuy);
    btnDisable(buttonEmpty);
    document.addEventListener("DOMContentLoaded", renderCart);
    cardsContainer.addEventListener("click", addProduct);
    cartContainer.addEventListener("click", addOrSubstractUnit );
    cartInMenu.addEventListener("click", openCart);
}

init();