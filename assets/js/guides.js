$(document).ready(function () {
  
  //Toggle ToC children
  $('#toc .sectlevel1 li').click((e) => {
    // target click comes as <a> inside <li>, hence the parentNode
    $(e.target.parentNode).toggleClass('expanded');
  });

  //To enable fixed scrolling
  $(window).scroll(function () {
    const sidebar = $(".js-scroll-with-user");

    const scrollPosition = $(window).scrollTop();
    const navBarHeight = $('.navbar-default').innerHeight();

    const contentHeight = $('.guides-section-white').innerHeight();
    const sidebarHeight = sidebar.height();
    const sidebarBottomPos = sidebar.offset().top + sidebarHeight;

    console.log({sidebarBottomPos, contentHeight, sidebarHeight});
    //
    // if (sidebarBottomPos >= contentHeight) {
    //   sidebar.removeClass('fixed');
    //   const topPosition = contentHeight - sidebarHeight;
    //   console.log(`Would have set topPostion to ${topPosition}`);
    //   sidebar.css({top: `${topPosition}px`, position: 'relative'});
    // } else if (scrollPosition >= navBarHeight) {
    //   sidebar.addClass('fixed');
    //   sidebar.css({top: '', position: ''});
    // } else {
    //   sidebar.removeClass('fixed');
    //   sidebar.css({top: '', position: ''});
    // }

  });
});
