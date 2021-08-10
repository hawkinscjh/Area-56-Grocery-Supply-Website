function deleteContact(contactID){
    $.ajax({
        url: '/contacts/' + contactID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
