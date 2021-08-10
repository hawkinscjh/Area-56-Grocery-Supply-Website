function deleteSalesRep(repID){
    $.ajax({
        url: '/sales_representatives/' + repID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
