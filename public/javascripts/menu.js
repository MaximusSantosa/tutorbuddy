particlesJS.load('particles-js', './particlesjs-config.json', function() {
    console.log('callback - particles.js config loaded');
  });
$(document).ready(function(){
    var element = $('meta[name="active-menu"]').attr('content');
    $('#' + element).addClass('active');
});

jQuery(document).ready(function($){ //wait for the document to load
    $(window).hover(function() {
      $('body').each(function(){ //loop through each element with the .dynamic-height class      
          $(this).css({
            'margin-bottom': -($('#root').outerHeight()+50) + 'px' //adjust the css rule for margin-top to equal the element height - 10px and add the measurement unit "px" for valid CSS
        });
    });
    });
});

$(document).ready(function() {
    $(".menu").css("background", "transparent");
    $(".nav-link").css("color", "#22c1ba");
    $(".navbar-brand").css("color", "white");
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll > 40) {
        $(".menu").css("background", "#29E7CD");
        $(".nav-link").css("color", "white");
        $(".navbar-brand").css("color", "#1F375F");
      } else {
        $(".menu").css("background", "transparent");
        $(".nav-link").css("color", "#22c1ba");
        $(".navbar-brand").css("color", "white");
      }
    });
  });