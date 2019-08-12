$(document).ready(function (){
    $("h2").each(function(){
        $(this).nextUntil("h2").andSelf().wrapAll('<div class="card guide-card"></div>')
    })
});

