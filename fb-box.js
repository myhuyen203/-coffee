function facebookShowPanelButton() {
  jQuery(document).ready(function ($) {
    $(".facebook-inbox-tab,#facebook-inbox-frame .f-close").click(function () {
      var isHiden = $("#facebook-inbox").attr("hiden");
      fbInboxHideBottom(isHiden);
    });
  });
}

function fbInboxHideBottom(isHiden) {
  jQuery(document).ready(function ($) {
    if (isHiden !== undefined && isHiden !== "false") {
      $("#facebook-inbox").attr("hiden", false);
      $('.facebook-inbox-tab').slideUp();
      setTimeout(function () {
        $("#facebook-inbox-frame").slideDown().find('.f-close').show();
      }, 500);
    } else {
      $('#facebook-inbox-frame .f-close').hide().parents("#facebook-inbox-frame").slideUp();
      setTimeout(function () {
        $('.facebook-inbox-tab').slideDown();
      }, 500);
      $("#facebook-inbox").attr("hiden", true);
    }
  });
}

function fbInboxFillPage(facebookPage, imageSrc, bgColor, bdColor, textColor, location, title, usestate, box_show) {

  if (facebookPage.indexOf("facebook.com/") <= -1) {
    facebookPage = "https://facebook.com/" + facebookPage;
  }
  jQuery(document).ready(function ($) {
    $("#facebook-inbox-frame .fb-page").attr("data-href", facebookPage);
    $("#facebook-inbox-frame .fb-page blockquote a").attr("href", facebookPage);
    if ($(window).width() < 480) {
      $("#facebook-inbox-frame .fb-page").attr("data-width", 220);
      $("#facebook-inbox-frame .fb-page").attr("data-height", 280);
    }
    $("#facebook-inbox-frame .fb-page blockquote").attr("cite", facebookPage);
    $("#facebook-inbox-frame .fb-page blockquote a").attr("href", facebookPage);
    $(".facebook-inbox-tab-icon").html("<img src='" + imageSrc + "'/>");
    $(".facebook-inbox-tab").css({"background-color": bgColor, "border-color": bdColor, "color": textColor});
    $(".facebook-inbox-tab .facebook-inbox-tab-title").html(title);
    $(".facebook-inbox-tab .facebook-inbox-tab-title").css('font-weight', 'bold');
    $('#facebook-inbox-frame .f-close').css({"background-color": bgColor});
    if (location == "0") {
      $("#facebook-inbox").css("right", "35px");
    }
    else {
      $("#facebook-inbox").css("left", "35px");
    }
    if (usestate == true)
      $("#facebook-inbox").show();

    $.ajaxSetup({
      cache: true
    });
    $.getScript('https://connect.facebook.net/vi_VN/sdk.js', function () {
      setTimeout(function () {
        FB.init({
          appId: '',
          version: 'v2.6'
        });
        setTimeout(function () {
          FB.XFBML.parse()     
        }, 100);
           
      }, 300);
    });
  });


  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function getCookie(name) {
    var name = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function checkCookie(box_show) {
    jQuery(document).ready(function ($) {
      if (box_show) {
        var status = getCookie(Haravan.shop + '_show_box');
        if (status) {
          if (status == 'show') {
            $("#facebook-inbox").attr("hiden", false);
            $('.facebook-inbox-tab').slideUp();
            setTimeout(function () {
              $("#facebook-inbox-frame").slideDown().find('.f-close').show();
            }, 500);
          }
        } else {
          $("#facebook-inbox").attr("hiden", false);
          $('.facebook-inbox-tab').slideUp();
          setTimeout(function () {
            $("#facebook-inbox-frame").slideDown().find('.f-close').show();
          }, 500);
          createCookie(Haravan.shop + '_show_box', 'show', 1);
        }
      }
    });
  }

  checkCookie(box_show);

}
function getCookie(name) {
  var name = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
jQuery(document).ready(function ($) {
  $('.f-close').click(function () {
    var status = getCookie(Haravan.shop + '_show_box');
    if (status == 'show') {
      document.cookie = Haravan.shop + '_show_box=hide';
    }
  })
});

