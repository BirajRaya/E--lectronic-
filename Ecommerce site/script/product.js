
export let products = await $.ajax({
    type: 'GET',
    url: '/script/json/product.json',
    success: function(data) {
        return data;
    }
});


export function filterProducts(category = null, offer = null, id_index = 0) {
    return products.filter(item =>
        (category === null ? true : item.category == category)
        && (offer === null ? true : item.offer == offer)
        && item.id > id_index
    );
}

export function filterProductById(id) {
    let row = products.filter(item => item.id == id);
    return row.length == 0 ? null : row[0];
}
