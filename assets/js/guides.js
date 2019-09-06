$(document).ready(function () {

  //Dismiss cta on guides page
  $('.dismiss-cta').on('click', (e) => {
    e.preventDefault();
    $('.guides-cta-card').hide();
  })

  //Validate email
  let validateEmail = (email) => {
    let re = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(email);
  }

  $('#email').focus(() => {
    $('#newsletter-form input').css("border", "none");
  })

  //Submiting only when subscribe input field not empty. 
  $('#newsletter-subscribe').click((e) => {
    let invalidForm = false;
    let email = $("#email").val();
    if (!email) {
      invalidForm = true;

      $("#newsletter-success").modal('hide');
      return false;
    } else if (!validateEmail(email)) {

      invalidForm = true;

      $('#newsletter-form input').css("border", "1px solid red");
      $("#newsletter-success").modal('hide');

      return false;
    } else {

      e.preventDefault();
      $("#newsletter-success").modal('show');
    }
  });

  //To enable fixed scrolling
  $(window).scroll(function () {
    let sidebarTop = $('.navbar-default').innerHeight();
    let contentHeight = $('.guides-section-white').innerHeight();
    let sidebarHeight = $('#toc').height();
    let sidebarBottomPos = contentHeight - sidebarHeight;
    let trigger = $(window).scrollTop() - sidebarTop;

    if ($(window).scrollTop() >= sidebarTop) {
      $('#toc').addClass('fixed');
    } else {
      $('#toc').removeClass('fixed');
    }

    if (trigger >= sidebarBottomPos) {
      $('#toc').addClass('bottom');
    } else {
      $('#toc').removeClass('bottom');
    }
  });

  //Toggle ToC children
  $('#toc .sectlevel1 li').click((e) => {
    // target click comes as <a> inside <li>, hence the parentNode
    $(e.target.parentNode).toggleClass('expanded');
  });

});
