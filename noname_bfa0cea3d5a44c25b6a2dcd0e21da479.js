var script = document.createElement('script');
script.onload = function () {
    fbInboxFillPage('https://www.facebook.com/ddkaffee','https://facebookinbox-omni-onapp.haravan.com/facebookinbox/static/images/fb-icon-2.png','#cfb464','#cfb464','#FFFFFF','0','Liên hệ để đặt hàng!',true,true),facebookShowPanelButton();
};
script.src = "https://facebookinbox-omni-onapp.haravan.com/facebookinbox/static/javascripts/fb-box.js?v=1606365744908";
document.getElementsByTagName('head')[0].appendChild(script);