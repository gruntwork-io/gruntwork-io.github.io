$(document).ready(function(){
    $('#newsletter-subscribe').click((e) => {
        let invalidForm = false;
        if ($('#email').val() === '') {
            invalidForm = true;
            $("#newsletter-success").modal('hide');
            return;
        }
        e.preventDefault();
        $("#newsletter-success").modal('show');
    });
});