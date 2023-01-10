var HRVTHEME = {
	Init : function(){
		HRVTHEME.Main.init();
		if(window.shop.template.indexOf('index') > -1){
			this.Index.init();
		}
		if(window.shop.template == 'collection'){
			this.Collection.init();
		}
		if(window.shop.template.indexOf('product') > -1){
			this.Product.init();
		}
		if(window.shop.template == 'blog'){
			this.Blog.init();
		}
		if(window.shop.template == 'article'){
			this.Article.init();
		}
		if(window.shop.template == 'search'){
			this.Search.init();
		}
		if(window.shop.template.indexOf('page') > -1){
			this.Page.init();
		}
	},
};
var timeOut_modalCart;
var viewout = true;
var check_show_modal = true;
var fixHeightResizeTimer = false,
		fixHeightResizeWindow = $(window).prop("innerWidth");
HRVTHEME.ALL = {
	fixHeightProduct: function(data_parent, data_target, data_image) {
		var box_height = 0;
		var box_image = 0;
		var boxtarget = data_parent + ' ' + data_target;
		var boximg = data_parent + ' ' + data_target + ' ' + data_image;
		jQuery(boximg).css('height', 'auto');
		jQuery($(boxtarget)).css('height', 'auto');
		jQuery($(boxtarget)).removeClass('fixheight');
		jQuery($(boxtarget)).each(function() {
			if (jQuery(this).find(data_image+' .lazyloaded').height() > box_image) {
				box_image = jQuery(this).find($(data_image)).height();
			}
		});
		if (box_image > 0) {
			jQuery(boximg).height(box_image);
		}
		jQuery($(boxtarget)).each(function() {
			if (jQuery(this).height() > box_height) {
				box_height = jQuery(this).height();
			}
		});
		jQuery($(boxtarget)).addClass('fixheight');
		if (box_height > 0) {
			jQuery($(boxtarget)).height(box_height);
		}
		try {
			fixheightcallback();
		} catch (ex) {}
	},
	getCartModal: function(){
		var cart = null;
		$('#cartform').hide();
		$('#myCart #exampleModalLabel').text("Giỏ hàng");
		$.getJSON('/cart.js', function(cart, textStatus) {
			if(cart) {
				$('#cartform').show();
				if($('#quickview-desktop.fade.in').length > 0){
					$("body").removeClass("modal-open");
					$('#quickview-desktop').modal('hide');
				}
				$('.line-item:not(.original)').remove();
				$.each(cart.items,function(i,item){
					var total_line = 0;
					var total_line = item.quantity * item.price;
					tr = $('.original').clone().removeClass('original').appendTo('table#cart-table tbody');
					if(item.image != null)
						tr.find('.item-image').html("<img src=" + Haravan.resizeImage(item.image,'small') + ">");
					else
						tr.find('.item-image').html("<img src='//theme.hstatic.net/1000208400/1000887145/14/no_image.jpg?v=303'>");
					vt = item.variant_options;
					if(vt.indexOf('Default Title') != -1)
						vt = '';
					tr.find('.item-title').children('a').html(item.product_title + '<br><span>' + vt + '</span>').attr('href', item.url);
					tr.find('.item-quantity').html("<input id='quantity1' name='updates[]' min='1' type='number' value=" + item.quantity + " class='' />");
					if ( typeof(window.shop.formatMoney) != 'undefined' ){
						tr.find('.item-price').html(Haravan.formatMoney(total_line, window.shop.formatMoney));
					}else {
						tr.find('.item-price').html(Haravan.formatMoney(total_line, ''));
					}
					tr.find('.item-delete').html("<a href='javascript:void(0);' onclick='HRVTHEME.ALL.deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
				});
				$('.item-total').html(Haravan.formatMoney(cart.total_price, window.shop.formatMoney));
				$('.modal-title').children('b').html(cart.item_count);
				$('.count-holder .count').html(cart.item_count );
				if(cart.item_count == 0){				
					$('#exampleModalLabel').html('Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng.');
					$('#cart-view').html('<tr><td class="mini_cart_header"><svg width="81" height="70" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" stroke="#2A7D2E" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg><p>Hiện chưa có sản phẩm</p></td></tr>');
					$('#cartform').hide();
				}
				else{			
					$('#exampleModalLabel').html('Bạn có ' + cart.item_count + ' sản phẩm trong giỏ hàng.');
					$('#cartform').removeClass('hidden');
					$('#cart-view').html('');
				}
				if ( $('#cart-pos-product').length > 0 ) {
					$('#cart-pos-product span').html(cart.item_count + ' sản phẩm');
				}
				$.each(cart.items,function(i,item){
					HRVTHEME.ALL.clone_item(item,i);
				});
				$('#total-view-cart').html(Haravan.formatMoney(cart.total_price, window.shop.formatMoney));
			} 
			else{
				$('#exampleModalLabel').html('Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng.');
				if ( $('#cart-pos-product').length > 0 ) {
					$('#cart-pos-product span').html(cart.item_count + ' sản phẩm');
				}
				$('#cart-view').html('<tr><td>Hiện chưa có sản phẩm</td></tr>');
				$('#cartform').hide();
			}
		});
		if($('#site-header').hasClass('hSticky')){
			setTimeout(function(){ 
				$('#site-nav-cart').parent('.header--icon').addClass('active');
				$('body').addClass('locked-scroll');
				if($(window).scrollTop() >= $('.main-header').height() + 100){
					$('#site-header').addClass('hSticky-nav').addClass('hSticky-up');
				}
			}, 300);
		}
		else{
			$('#site-nav-cart').parent('.header--icon').addClass('active');
			$('body').addClass('locked-scroll');
			jQuery('html, body').animate({
				scrollTop: 0			
			}, 600);
		}
	},
	addModalCart: function(id,quantity){
		if( check_show_modal ) {
			check_show_modal = false;
			timeOut_modalCart = setTimeout(function(){ 
				check_show_modal = true;
			}, 1000);
			var params = {
				type: 'POST',
				url: '/cart/add.js',
				async: true,
				data: 'quantity=' + quantity + '&id=' + id,
				dataType: 'json',
				success: function(line_item) {
					HRVTHEME.ALL.getCartModal();					
					//$('.add-to-cartProduct').removeClass('clicked_buy');
					//$('.add-to-cartProduct-quickview').removeClass('clicked_buy');
				},
				error: function(XMLHttpRequest, textStatus) {
					alert('Sản phẩm bạn vừa mua đã vượt quá tồn kho');
				}
			};
			$.ajax(params);
		}
	},
	clone_item: function(product,i){
		var item_product = $('#clone-item-cart').find('.list-item');
		if ( product.image == null ) {
			item_product.find('img').attr('src','//theme.hstatic.net/1000208400/1000887145/14/no_image.jpg?v=303').attr('alt', product.url);
		} 
		else {
			item_product.find('img').attr('src',Haravan.resizeImage(product.image,'small')).attr('alt', product.url);
		}
		item_product.find('a:not(.remove-cart)').attr('href', product.url).attr('title', product.url);
		item_product.find('.pro-title-view').html(product.title);
		item_product.find('.pro-quantity-view').html(product.quantity);
		item_product.find('.pro-price-view').html(Haravan.formatMoney(product.price, window.shop.formatMoney));
		item_product.find('.remove-cart').html("<a href='javascript:void(0);' onclick='HRVTHEME.ALL.deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
		var title = '';
		if(product.variant_options.indexOf('Default Title') == -1){
			$.each(product.variant_options,function(i,v){
				title = title + v + ' / ';
			});
			title = title + '@@';
			title = title.replace(' / @@','')
			item_product.find('.variant').html(title);
		}else {
			item_product.find('.variant').html('');
		}
		item_product.clone().removeClass('hidden').prependTo('#cart-view');
	},
	deleteCart: function(line){
		var params = {
			type: 'POST',
			url: '/cart/change.js',
			data: 'quantity=0&line=' + line,
			dataType: 'json',
			success: function(cart) {
				HRVTHEME.ALL.getCartModal();
			},
			error: function(XMLHttpRequest, textStatus) {
				Haravan.onError(XMLHttpRequest, textStatus);
			}
		};
		$.ajax(params);
	},
	updateCart: function(){
		$(document).on("click","#update-cart-modal",function(event){
			event.preventDefault();
			if ($('#cartform').serialize().length <= 5) return;
			$(this).html('Đang cập nhật');
			var params = {
				type: 'POST',
				url: '/cart/update.js',
				data: $('#cartform').serialize(),
				dataType: 'json',
				success: function(cart) {
					if ((typeof callback) === 'function') {
						callback(cart);
					} else {
						HRVTHEME.ALL.getCartModal();
					}
					$('#update-cart-modal').html('Cập nhật');
				},
				error: function(XMLHttpRequest, textStatus) {
					Haravan.onError(XMLHttpRequest, textStatus);
				}
			};
			$.ajax(params);
		});
	},
	plusQuantity: function(){
		if ( $('input[name="quantity"]').val() != undefined ) {
			var currentVal = parseInt($('input[name="quantity"]').val());
			if (!isNaN(currentVal)) {
				$('input[name="quantity"]').val(currentVal + 1);
			} else {
				$('input[name="quantity"]').val(1);
			}
		}
	},
	minusQuantity: function() {
		if ( $('input[name="quantity"]').val() != undefined ) {
			var currentVal = parseInt($('input[name="quantity"]').val());
			if (!isNaN(currentVal) && currentVal > 1) {
				$('input[name="quantity"]').val(currentVal - 1);
			}
		}
	},
	plusQuantity_Quickview: function(){
		if ( $('input[name="quantity_quickview"]').val() != undefined ) {
			var currentVal = parseInt($('input[name="quantity_quickview"]').val());
			if (!isNaN(currentVal)) {
				$('input[name="quantity_quickview"]').val(currentVal + 1);
			} else {
				$('input[name="quantity_quickview"]').val(1);
			}
		}
	},
	minusQuantity_Quickview: function(){
		if ( $('input[name="quantity_quickview"]').val() != undefined ) {
			var currentVal = parseInt($('input[name="quantity_quickview"]').val());
			if (!isNaN(currentVal) && currentVal > 1) {
				$('input[name="quantity_quickview"]').val(currentVal - 1);
			}
		}
	},
	boxAccount: function(type){
		$('.site_account .site_account_panel_list .site_account_panel').removeClass('is-selected');
		var newheight = $('.site_account .site_account_panel_list .site_account_panel#' + type).addClass('is-selected').height();
		if($('.site_account_panel').hasClass('is-selected')){
			$('.site_account_panel_list').css("height", newheight);
		}
	},
	buy_now: function(id) {
		var quantity = 1;
		var params = {
			type: 'POST',
			url: '/cart/add.js',
			data: 'quantity=' + quantity + '&id=' + id,
			dataType: 'json',
			success: function(line_item) {
				window.location = '/checkout';
			},
			error: function(XMLHttpRequest, textStatus) {
				Haravan.onError(XMLHttpRequest, textStatus);
			}
		};
		$.ajax(params);
	},
};
HRVTHEME.Main = {
	init: function(){
		this.btnAddToCart();
		this.stickyHeaderInit();
		this.btnQuickView();
		this.toggleHeaderAction();
		this.toggleSubMenuMobile();
		this.scrollBackToTop();
		this.triggerTabPopupAccount();
		this.inputFocusPopupAccount();
		this.searchAutoHeader();
		this.closeSearchAutoResults();
		this.addThisListSharing();
		this.submitFormLoginHeader();
		this.submitFormRecoverHeader();
		this.submitFormContactFooter();
	},
	btnAddToCart: function(){
		$(document).on("click", ".js-productBtnAddToCart", function(e){
			e.preventDefault();
			var variantID = parseInt($(this).attr("data-id"));
			var quantity = $("#quantity_quickview").val();
			HRVTHEME.ALL.addModalCart(variantID,quantity);
		});
	},
	btnQuickView: function(){
		$(document).on("click", ".btnProductQuickview", function(){
			var handle = $(this).attr("data-handle");
			$.ajax({ 
				url: '/products/' + handle + "?view=quickview",	
				async: true,
				success:function(data){
					$("#quickview-desktop .modal-body").html(data);
					$("#quickview-desktop").modal('show'); 
				}
			});
		});
	},
	stickyHeaderInit: function(){
		/* fixed header scroll */	
		var $parentHeader = $('.mainHeader--height');
		var parentHeight = $parentHeader.find('.main-header').outerHeight();
		var $header = $('.main-header');
		var offset_sticky_header = $header.outerHeight() + 100;
		var offset_sticky_down = 0;
		$parentHeader.css('min-height', parentHeight );	
		var resizeTimer = false,
				resizeWindow = $(window).prop("innerWidth");
		$(window).on("resize", function() {
			if (resizeTimer) {clearTimeout(resizeTimer)	}
			resizeTimer = setTimeout(function() {
				var newWidth = $(window).prop("innerWidth");
				if (resizeWindow != newWidth) {
					$header.removeClass('hSticky-up').removeClass('hSticky-nav').removeClass('hSticky');
					$parentHeader.css('min-height', '' );	
					resizeTimer = setTimeout(function() {
						parentHeight = $parentHeader.find('.main-header').outerHeight();
						$parentHeader.css('min-height', parentHeight );	
					}, 50);
					resizeWindow = newWidth
				}
			}, 200)
		});
		setTimeout(function() {
			$parentHeader.css('min-height', '' );		
			parentHeight = $parentHeader.find('.main-header').outerHeight();
			$parentHeader.css('min-height', parentHeight );	
			jQuery(window).scroll(function() {	
				/* scroll header */
				if(jQuery(window).scrollTop() > offset_sticky_header && jQuery(window).scrollTop() > offset_sticky_down) {		
					if(jQuery(window).width() > 991){		
						$('body').removeClass('locked-scroll');
						$('.header--icon').removeClass('active');
					}
					$header.addClass('hSticky');	
					if(jQuery(window).scrollTop() > offset_sticky_header + 150){
						$header.removeClass('hSticky-up').addClass('hSticky-nav');
						$('body').removeClass('scroll-body-up');
					}
				} 
				else {
					if(jQuery(window).scrollTop() > offset_sticky_header + 150 && (jQuery(window).scrollTop() - 150) + jQuery(window).height()  < $(document).height()) {
						$header.addClass('hSticky-up');	
						$('body').addClass('scroll-body-up');
					}
				}
				if (jQuery(window).scrollTop() <= offset_sticky_down && jQuery(window).scrollTop() <= offset_sticky_header ) {
					$header.removeClass('hSticky-up').removeClass('hSticky-nav').removeClass('hSticky');
					$('body').removeClass('scroll-body-up');
				}
				offset_sticky_down = jQuery(window).scrollTop();
			});	
		}, 300)
	},
	toggleHeaderAction: function(){
		$(document).on("click", ".header-site-nav", function(e){
			e.preventDefault();
			if($(this).parent().hasClass('active')){
				$(this).parent().removeClass('active');
				$('body').removeClass('locked-scroll');
			}
			else{
				$('body').addClass('locked-scroll');
				$('.header--icon').removeClass('active');
				$(this).parent().addClass('active');
			}
		});
		$('body').on('click', '#site-overlay', function(e){
			$('body').removeClass('locked-scroll');
			$('.header--icon').removeClass('active');
		});
	},
	toggleSubMenuMobile: function(){
		$('.list-root li a').click(function(e){
			if ($(this).find('i').length){
				e.preventDefault();
				var menu_child_id = $(this).parent().data('menu-root');
				$('.list-root').addClass('mm-subopened');
				$('#' + menu_child_id).addClass('mm-opened');
			} 
		});
		$('.list-child li:first-child a').click(function(){
			$(this).parents('.list-child').removeClass('mm-opened');
			$('.list-root').removeClass('mm-subopened');
		});
		$('.list-child li.level-2 a').click(function(e){
			if ($(this).find('i').length){
				e.preventDefault();
				var menu_sub_id = $(this).parent().data('menu-root');
				$('li.level-2').addClass('mm-subopened');
				$('#' + menu_sub_id).addClass('mm-sub');
			} 
		});
		$('.sub-child li:first-child a').click(function(){
			$(this).parents('.sub-child').removeClass('mm-sub');
			$('.list-child').removeClass('mm-subopened');
		});
		$(document).on("click",".sub-child li.level-3 a",function(e){
			if ($(this).find('i').length){
				e.preventDefault();
				var menu_subnav_id = $(this).parent().data('menu-root');
				$('li.level-3').addClass('mm-open-3');
				$('#' +  menu_subnav_id).addClass('mm-sub-3');
			} 
		});
		$(document).on("click",".sub-child-3 li:first-child a",function(e){
			$(this).parents('.sub-child-3').removeClass('mm-sub-3');
			$('.sub-child').removeClass('mm-open-3');
		});
	},
	scrollBackToTop: function(){
		$(document).on("click", ".back-to-top", function(){
			jQuery(this).removeClass('show');
			jQuery('html, body').animate({
				scrollTop: 0			
			}, 800);
		});
	},
	triggerTabPopupAccount: function(){
		$('body').on('click', '.js-link', function(e){
			e.preventDefault();
			HRVTHEME.ALL.boxAccount($(this).attr('aria-controls'));
		});
	},
	inputFocusPopupAccount: function(){
		$('.site_account input').blur(function(){
			var tmpval = $(this).val();
			if(tmpval == '') {
				$(this).removeClass('is-filled');
			} else {
				$(this).addClass('is-filled');
			}
		});
	},
	searchAutoHeader: function(){
		$('.ultimate-search').submit(function(e) {
			e.preventDefault();
			var q = $(this).find('input[name=q]').val();
			if(q.indexOf('script') > -1 || q.indexOf('>') > -1){
				alert('Từ khóa của bạn có chứa mã độc hại ! Vui lòng nhập lại key word khác');
				$(this).find('input[name=q]').val('');
			}else{
				var q_follow = 'product';
				var query = encodeURIComponent(q);
				if( !q ) {
					window.location = '/search?type='+ q_follow +'&q=';
					return;
				}	
				else {
					window.location = '/search?type=' + q_follow +'&q=' + query;
					return;
				}
			}
		});
		var $input = $('.ultimate-search input[type="text"]');
		$input.bind('keyup change paste propertychange', function() {
			var key = $(this).val(),
					$parent = $(this).parents('.wpo-wrapper-search'),
					$results = $(this).parents('.wpo-wrapper-search').find('.smart-search-wrapper');
			if(key.indexOf('script') > -1 || key.indexOf('>') > -1){
				alert('Từ khóa của bạn có chứa mã độc hại ! Vui lòng nhập lại key word khác');
				$(this).val('');
			}
			else{
				if(key.length > 0 ){
					$('.ultimate-search input[type="text"]').val($(this).val());
					$(this).attr('data-history', key);
					var q_follow = 'product',
							str = '';
					str = '/search?type=product&q='+ key + '&view=ultimate-product';
					$.ajax({
						url: str,
						type: 'GET',
						async: true,
						success: function(data){
							$results.find('.resultsContent').html(data);
						}
					})
					$(".search-below-mobile .ultimate-search").addClass("closetext");
					$results.fadeIn();
				}
				else{
					$('.ultimate-search input[type="text"]').val($(this).val());
					$(".search-below-mobile .ultimate-search").removeClass("closetext");
					$results.fadeOut();
				}
			}
		});
	},
	closeSearchAutoResults: function(){
		$('body').click(function(evt) {
			var target = evt.target;
			if (target.id !== 'ajaxSearchResults' && target.id !== 'inputSearchAuto') {
				$("#ajaxSearchResults").hide();
			}
			if (target.id !== 'ajaxSearchResults-mb' && target.id !== 'inputSearchAuto-mb') {
				$("#ajaxSearchResults-mb").hide();
			}
			if (target.id !== 'ajaxSearchResults-dk' && target.id !== 'inputSearchAuto-desktop') {
				$("#ajaxSearchResults-dk").hide();
			}
		});
		$('body').on('click', '.ultimate-search input[type="text"]', function() {
			if ($(this).is(":focus")) {
				if ($(this).val() != '') {
					$(".ajaxSearchResults").show();
				}
			} 
			else {}
		});
		$('body').on('click', '.ultimate-search input[id*="inputSearchAuto-"]', function() {
			$('.header--icon').removeClass('active');
			$('body').removeClass('locked-scroll');
		});
		$('body').on('click', '.ultimate-search .close-search', function(e) {
			e.preventDefault();
			$(".ajaxSearchResults").hide();
			$(".ultimate-search").removeClass("closetext");
			$(".ultimate-search").find('input[name=q]').val('');
		})
	},
	addThisListSharing: function(){
		if ($('.addThis_listSharing').length > 0){
			$(window).scroll(function(){
				if($(window).scrollTop() > 100 ) {
					$('.addThis_listSharing').addClass('is-show');
				} else {
					$('.addThis_listSharing').removeClass('is-show');
				}
			});
			$('.content_popupform form.contact-form').submit(function(e){
				var self = $(this);
				if($(this)[0].checkValidity() == true){
					e.preventDefault();
					grecaptcha.ready(function() {
						grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
							self.find('input[name="g-recaptcha-response"]').val(token);
							$.ajax({
								type: 'POST',
								url:'/contact',
								data: $('.content_popupform form.contact-form').serialize(),			 
								success:function(data){		
									if($(data).find('#success_popup_contactForm').length > 0){
										$('.content_popupform form.contact-form .error-popupformcontact').addClass('hidden').slideUp();
										$('.modal-contactform.fade.in').modal('hide');
										setTimeout(function(){ 				
											$('.modal-succes').modal('show');					
											setTimeout(function(){		
												$('.modal-succesform.fade.in').modal('hide');		
												location.reload();
											}, 5000);
										},300);
									}
									else{
										$('.content_popupform form.contact-form .error-popupformcontact').removeClass('hidden').slideDown('50');
									}
								},				
							})
						});
					});
				}
			});
			$(".modal-succesform").on('hidden.bs.modal', function(){
				location.reload();
			});
		}
		if ($(window).width() < 768 && $('.layoutProduct_scroll').length > 0 ) {
			var curScrollTop = 0;
			$(window).scroll(function(){	
				var scrollTop = $(window).scrollTop();
				if(scrollTop > curScrollTop  && scrollTop > 200 ) {
					$('.layoutProduct_scroll').removeClass('scroll-down').addClass('scroll-up');
				}
				else {
					if (scrollTop > 200 && scrollTop + $(window).height() + 150 < $(document).height()) {
						$('.layoutProduct_scroll').removeClass('scroll-up').addClass('scroll-down');	
					}
				}
				if(scrollTop < curScrollTop  && scrollTop < 200 ) {
					$('.layoutProduct_scroll').removeClass('scroll-up').removeClass('scroll-down');
				}
				curScrollTop = scrollTop;
			});
		}
	},
	submitFormLoginHeader: function(){
		if($('#header-login-panel').length > 0){
			$('#header-login-panel form#customer_login').submit(function(e) { 
				var self = $(this);
				if($(this)[0].checkValidity() == true){
					e.preventDefault();
					grecaptcha.ready(function() {
						grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
							self.find('input[name="g-recaptcha-response"]').val(token);
							self.unbind('submit').submit();
						}); 
					});
				}
			});
		}
	}, 
	submitFormRecoverHeader: function(){
		if($('#header-recover-panel').length > 0){
			$('#header-recover-panel form').submit(function(e) { 
				var self = $(this);
				if($(this)[0].checkValidity() == true){
					e.preventDefault();
					grecaptcha.ready(function() {
						grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
							self.find('input[name="g-recaptcha-response"]').val(token);
							self.unbind('submit').submit();
						}); 
					});
				}
			});
		}
	}, 
	submitFormContactFooter: function(){
		if($('#send_for_gmail').length > 0){
			$('#send_for_gmail form.contact-form').submit(function(e) { 
				var self = $(this);
				if($(this)[0].checkValidity() == true){
					e.preventDefault();
					grecaptcha.ready(function() {
						grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
							self.find('input[name="g-recaptcha-response"]').val(token);
							$.ajax({
								type: 'POST',
								url:'/account/contact',
								data: $('#send_for_gmail form.contact-form').serialize(),
								success:function(data){
									if($(data).find('#success_formFooter').length > 0){
										$('#send_for_gmail .succes-formFooter').addClass('success').html('Cảm ơn bạn đã đăng ký email theo dõi!');
										setTimeout(function(){ 
											location.reload();
										},1000);
									}
									else{
										$('#send_for_gmail .succes-formFooter').addClass('error').html('Địa chỉ email không hợp lệ');
									}
								}
							})
						}); 
					});
				}
			});
		}
	},
};
HRVTHEME.Index = {
	init: function(){
		this.homeSlider();
		this.homeListIconCollectionSlider();
		this.productCategorySlider();
		this.productHorizontalSlider();
		this.blogHomeSlider();
		this.fixHeightProduct_collection_one();	
	},
	homeSlider: function(){
		$('#home-slider').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 1500,
			dots: true,
			infinite: false,
			arrows: true,
			fade: false,
			lazyLoad: 'ondemand',
			prevArrow: '<button type="button" class="slick-prev" aria-label="prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8 c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712 L143.492,221.863z"/> </g> </g> </svg></button>',
			nextArrow: '<button type="button" class="slick-next" aria-label="next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M336.226,209.591l-204.8-204.8c-6.78-6.548-17.584-6.36-24.132,0.42c-6.388,6.614-6.388,17.099,0,23.712l192.734,192.734 L107.294,414.391c-6.663,6.664-6.663,17.468,0,24.132c6.665,6.663,17.468,6.663,24.132,0l204.8-204.8 C342.889,227.058,342.889,216.255,336.226,209.591z"/> </g> </g> </svg></button>',
			responsive: [
				{
					breakpoint: 768,
					settings: {
						arrows: false,
						dots: true
					}
				}
			]
		});
		$('#home-slider').on('lazyLoaded', function(event) {
			$(event.currentTarget).find('source').each(function(i, source) {
				let $source = $(source);
				$source.attr('srcset', $source.data('lazy-srcset'));
			});
		});
	},
	homeListIconCollectionSlider: function(){
		if($('#slide-home-list-icon').length > 0){
			$('#slide-home-list-icon').slick({
				slidesToShow: 6,
				slidesToScroll: 1,
				arrows: false,
				dots: false,
				infinite: false,
				focusOnSelect: false,
				pauseOnFocus: true,
				speed: 300,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3,
							dots: true
						}
					},
					{
						breakpoint: 992,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 1,
							dots: true
						}
					}
				]
			});
		}
	},
	productCategorySlider: function(){
		if($('.section-home-collection-spec').length > 0){
			$('.slider-spec').slick({
				slidesToShow: 3,
				slidesToScroll: 1,
				autoplay: false,
				autoplaySpeed: 1500,
				pauseOnDotsHover: false,
				dots: false,
				arrows: false,
				focusOnSelect: false,
				useCSS: true,
				infinite: true,
				useTransform: true,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1,
						}
					}
				]
			})
			$('.slide-slick-prev.my-controls-btns').click(function() {
				$('.slider-spec').slick('slickPrev');
			});
			$('.slide-slick-next.my-controls-btns').click(function() {
				$('.slider-spec').slick('slickNext');
			});
		}
	},
	productHorizontalSlider: function(){
		if($('#collection-three-slide').length > 0){
			$('#collection-three-slide').slick({
				rows: 3,
				slidesToShow: 4,
				slidesToScroll: 4,
				dots: false,
				arrows: false,
				prevArrow: '<button type="button" class="slick-prev" aria-label="prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8 c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712 L143.492,221.863z"/> </g> </g> </svg></button>',
				nextArrow: '<button type="button" class="slick-next" aria-label="next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M336.226,209.591l-204.8-204.8c-6.78-6.548-17.584-6.36-24.132,0.42c-6.388,6.614-6.388,17.099,0,23.712l192.734,192.734 L107.294,414.391c-6.663,6.664-6.663,17.468,0,24.132c6.665,6.663,17.468,6.663,24.132,0l204.8-204.8 C342.889,227.058,342.889,216.255,336.226,209.591z"/> </g> </g> </svg></button>',
				focusOnSelect: false,
				infinite: false,
				speed: 500,
				useCSS: true,
				useTransform: true,
				waitForAnimate: false,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							centerMode: true,
							centerPadding: '50px',
							arrows: true
						}
					},
					{
						breakpoint: 992,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
							arrows: true
						}
					}
				]
			});
		}
	},
	blogHomeSlider: function(){
		if($('#blog-slide').length > 0){
			$('#blog-slide').slick({
				swipeToSlide: false,
				slidesToShow: 3,
				slidesToScroll: 3,
				arrows: false,
				prevArrow: '<button type="button" class="slick-prev" aria-label="prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8 c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712 L143.492,221.863z"/> </g> </g> </svg></button>',
				nextArrow: '<button type="button" class="slick-next" aria-label="next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M336.226,209.591l-204.8-204.8c-6.78-6.548-17.584-6.36-24.132,0.42c-6.388,6.614-6.388,17.099,0,23.712l192.734,192.734 L107.294,414.391c-6.663,6.664-6.663,17.468,0,24.132c6.665,6.663,17.468,6.663,24.132,0l204.8-204.8 C342.889,227.058,342.889,216.255,336.226,209.591z"/> </g> </g> </svg></button>',
				dots: false,
				infinite: false,
				speed: 500,
				responsive: [
					{
						breakpoint: 481,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							centerMode: true,
							centerPadding: '50px',
							arrows: true
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
							arrows: true
						}
					}
				]
			});
		}
	},
	fixHeightProduct_collection_one: function(){
		document.addEventListener('lazyloaded', function(e){
			HRVTHEME.ALL.fixHeightProduct('.wrapper-collection-1', '.product-resize', '.image-resize');
			$(window).on("resize", function() {
				if (fixHeightResizeTimer) clearTimeout(fixHeightResizeTimer);
				fixHeightResizeTimer = setTimeout(function(){
					let newWidth = $(window).prop("innerWidth");
					if (fixHeightResizeTimer != newWidth) {
						HRVTHEME.ALL.fixHeightProduct('.wrapper-collection-1', '.product-resize', '.image-resize');
						fixHeightResizeWindow = newWidth
					}
				},200)
			});
		});
	},
};
HRVTHEME.Collection = {
	init: function(){
		this.fixHeightProductCollection();
		this.clickShowFilterMobile();
		HRVTHEME.Blog.init();
	},
	clickShowFilterMobile: function(){
		$(".filterTagFullwidthButton-desktop, .filterTagFullwidthButton-mobile").click(function(){
			$("body").addClass("open-filter");
		});
		$(document).on("click", "body.open-filter #site-overlay, .filterTagFullwidthClose", function(){
			$("body").removeClass("open-filter");
		});
	},
	fixHeightProductCollection: function(){
		document.addEventListener('lazyloaded', function(e){
			HRVTHEME.ALL.fixHeightProduct('.content-product-list', '.product-resize', '.image-resize');
			$(window).on("resize", function() {
				if (fixHeightResizeTimer) clearTimeout(fixHeightResizeTimer);
				fixHeightResizeTimer = setTimeout(function(){
					let newWidth = $(window).prop("innerWidth");
					if (fixHeightResizeTimer != newWidth) {
						HRVTHEME.ALL.fixHeightProduct('.content-product-list', '.product-resize', '.image-resize');
						fixHeightResizeWindow = newWidth
					}
				},200)
			});
		});
	},
}; 
HRVTHEME.Product = {
	init: function(){
		this.toggleTabDesc();
		this.productRelatedSlider();
		this.fixHeightProductRelated();
	},
	toggleTabDesc: function(){
		$(".proDetailInfo .tab-alignment a").click(function(){
			var tab = $(this).attr("data-tab");
			$(".proDetailInfo li").removeClass("active");
			$(this).parent().addClass("active");
			$(".tab-content .tab-pane").removeClass("active");
			$(".tab-content .tab-pane[id="+tab+"]").addClass("active");
		});
		if ($(window).width() < 768) {
			$('.show-tab-dropdown_mobile').click(function(e){
				e.preventDefault();
				$(this).toggleClass('active');
			});
			let textTabTitle = $('.product-nav-tabs li.active a').text();
			$('.show-tab-dropdown_mobile').html(textTabTitle);
			$('.product-nav-tabs li').click(function(e){
				e.preventDefault();
				$(this).parents('.product-description').find('.show-tab-dropdown_mobile').html($(this).text());
				$('.show-tab-dropdown_mobile').removeClass('active');
			});
		}
	},
	productRelatedSlider: function(){
		$('#slick-slider-ProductRelated').slick({
			slidesToShow: 5,
			slidesToScroll: 5,
			focusOnSelect: false,
			infinite: false,
			dots: false,
			arrows: true,
			prevArrow: '<button type="button" class="slick-prev" aria-label="prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8 c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712 L143.492,221.863z"/> </g> </g> </svg></button>',
			nextArrow: '<button type="button" class="slick-next" aria-label="next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 443.52 443.52" style="enable-background:new 0 0 443.52 443.52;" xml:space="preserve"> <g> <g> <path d="M336.226,209.591l-204.8-204.8c-6.78-6.548-17.584-6.36-24.132,0.42c-6.388,6.614-6.388,17.099,0,23.712l192.734,192.734 L107.294,414.391c-6.663,6.664-6.663,17.468,0,24.132c6.665,6.663,17.468,6.663,24.132,0l204.8-204.8 C342.889,227.058,342.889,216.255,336.226,209.591z"/> </g> </g> </svg></button>',
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4
					}
				},
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 5,
						slidesToScroll: 5
					}
				}
			]
		})
	},
	fixHeightProductRelated: function(){
		document.addEventListener('lazyloaded', function(e){
			HRVTHEME.ALL.fixHeightProduct('.list-productRelated .content-product-list', '.product-resize', '.image-resize');
			HRVTHEME.ALL.fixHeightProduct('.list-productReview .content-product-list', '.product-resize', '.image-resize');
			$(window).on("resize", function() {
				if (fixHeightResizeTimer) clearTimeout(fixHeightResizeTimer);
				fixHeightResizeTimer = setTimeout(function(){
					let newWidth = $(window).prop("innerWidth");
					if (fixHeightResizeTimer != newWidth) {
						HRVTHEME.ALL.fixHeightProduct('.list-productRelated .content-product-list', '.product-resize', '.image-resize');
						HRVTHEME.ALL.fixHeightProduct('.list-productReview .content-product-list', '.product-resize', '.image-resize');
						fixHeightResizeWindow = newWidth
					}
				},600)
			});
		});
	},
};
HRVTHEME.Blog = {
	init: function(){
		this.toggleSubMenu();
		this.toggleSideBar();
	},
	toggleSubMenu: function(){
		$('.plus-nClick1').click(function(e){
			e.preventDefault();
			$(this).parents('.level0').toggleClass('opened');
			$(this).parents('.level0').children('ul').slideToggle(200);
		});
		$('.plus-nClick2').click(function(e){
			e.preventDefault();
			$(this).parents('.level1').toggleClass('opened');
			$(this).parents('.level1').children('ul').slideToggle(200);
		});
	},
	toggleSideBar: function(){
		$('.title_block').click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).next().slideToggle('medium');
			}else{
				$(this).addClass('active');
				$(this).next().slideToggle('medium');
			}
		}); 
	},

};
HRVTHEME.Article = {
	init: function(){
		HRVTHEME.Blog.init();
	}
};
HRVTHEME.Search = {
	init: function(){
		HRVTHEME.Collection.fixHeightProductCollection();
	},
};
HRVTHEME.Page = {
	init: function(){
		HRVTHEME.Blog.init();
	},
};
jQuery(document).ready(function(){
	HRVTHEME.Init();
});
