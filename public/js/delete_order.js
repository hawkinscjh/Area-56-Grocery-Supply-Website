function deleteOrder(orderID){
    $.ajax({
        url: '/orders/' + orderID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
