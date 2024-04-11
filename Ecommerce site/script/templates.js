
export function createProductCard(product) {
    let productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.dataset.id = product.id;
    productCard.innerHTML = `
    ${product.offer_discount == 0 ? '' : `<div class="badge1">${product.offer_discount}% off</div>`}
    <div class="product-body">
        <div class="product-thumb">
            <img src="${product.image1}" alt="${product.name}" >
        </div>
        <div class="product-details">
            <span class="product-category">${product.brand}</span>
            <h4><a class="product_name">${product.name}</a></h4>
            <p>${product.description}</p>
            
        </div>
    </div>
    <div class="product-footer">
        <div class="product-bottom-details">
            ${product.offer_discount == 0 ? `<div class="product-price">$${product.price}.00</div>` :
            `<div class="product-price"><small>$${product.price}.00</small>$${(product.price * (1 - product.offer_discount / 100)).toFixed(2)}</div>`}
        </div>
        <div class="product-links">
            <a href=""><i class="fa fa-shopping-cart add_cart"></i></a>
        </div>
    </div>
    `;

    return productCard;
}