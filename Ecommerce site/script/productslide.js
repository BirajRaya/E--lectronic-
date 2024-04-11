import { filterProducts } from "./product.js";
import { createProductCard } from "./templates.js";

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



