
function filterProducts(category = null, offer = null, id_index = 0) {
    return products.filter(item =>
        (category === null ? true : item.category == category)
        && (offer === null ? true : item.offer == offer)
        && item.id > id_index
    );
}

function createProductCard(product) {
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

var slideIndex = 0;
var totalSlides = document.querySelectorAll('.product-card').length;
var displaySlides = 4;

function showSlides(element, id, direction = 'forward') {
    var container = element.closest('.container').find('.card.products');
    var offer = container.closest('.container').attr('data-offer');
    var containerWidth = container.width();
    var css = getComputedStyle(container[0]);
    var totalCards = css.gridTemplateColumns.split(' ').length;

    let newProducts = [];

    if (direction == 'backward')
        newProducts = filterProducts(null, offer, 0);
    else
        newProducts = filterProducts(null, offer, id);

    if (newProducts.length > 0) {
        if (direction == 'forward') {
            container
                .animate({ 'left': `-${containerWidth}px`, 'opacity': 0 }, 200, 'swing', function () {
                    container.html('');
                    container.css({ 'left': `${containerWidth}px` });

                    $(newProducts).each(function (i, product) {
                        container.append(createProductCard(product));
                    });

                    container.animate({ 'left': 0, 'opacity': 1 }, 200);
                });
        }
        else {
            let productIndex = newProducts.map(x => x.id).indexOf(parseInt(id));
            newProducts = newProducts.slice(productIndex - totalCards, productIndex);

            if (newProducts.length > 0) {
                container
                    .animate({ 'left': `${containerWidth}px`, 'opacity': 0 }, 200, 'swing', function () {
                        container.html('');
                        container.css({ 'left': `-${containerWidth}px` });

                        $(newProducts).each(function (i, product) {
                            container.append(createProductCard(product));
                        });

                        container.animate({ 'left': 0, 'opacity': 1 }, 200);
                    });
            }
        }
    }


}

$(document).ready(function () {
    $('body').on('click', '.container_btn_a.prev', function () {
        var id = $(this).closest('.container').find('.card.products').find('.product-card:first').attr('data-id');
        showSlides($(this), id, 'backward');
    });

    $('body').on('click', '.container_btn_a.next', function () {
        var id = $(this).closest('.container').find('.card.products').find('.product-card:last').attr('data-id');
        showSlides($(this), id);
    });
});



