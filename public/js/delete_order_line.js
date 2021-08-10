function deleteOrder(orderID,productID){
    $.ajax({
        url: '/order_product/' + orderID + '&' + productID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

