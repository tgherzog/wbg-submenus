
(function($) {
  var init;

  $.fn.submenu = function(_options) {
	var isTouch = 'ontouchstart' in document.documentElement;

	var options = $.extend({
	  // target: the selector for the menu's container object
	  target: 'ul.secondary-links',

	  // touchBehavior: 'limited' will remove submenus above level 2 for touch-screen devices. 'normal' will not
	  touchBehavior: 'normal'
	}, _options);
	
/*
	var qs = new Querystring();
	if( qs.get('touch') >= 1 ) isTouch = true;
	if( qs.get('touch') >= 2 ) options.touchBehavior = 'normal';
*/

	$('body').addClass(isTouch ? 'uitouch' : 'uimouse');
	if( ! init && isTouch ) {
	  $(document).click(function() {
		$('.open').removeClass('open');
	  });
	}
	init = true;

	var $target = $(options.target);
	$(this).children().each(function() {
	  var submenu = $(this).attr('submenu');
	  if( submenu ) {
	    submenu = $target.children().filter(submenu);
		if( submenu.size() == 1 ) {
		  $(this).addClass('submenu').removeAttr('submenu').appendTo(submenu);
		}
	  }
	});

	if( isTouch && options.touchBehavior == 'limited' )
	  $('.submenu .submenu', $target).remove();

	// Attach handlers and classes to configure submenus
	$('.submenu', $target).each(function() {
	  $(this).parent().addClass('submenu-parent');
	  $(this).parent().children('a:first').click(function(event) {
	    if( isTouch ) {
		  // For touch-screen interfaces, simulate hovers by toggling class attributes
		  var $menu = $(this).parent();
		  if( $menu.hasClass('open') ) {
			$menu.removeClass('open');
			$('.open', $menu).removeClass('open');
		  }
		  else {
			// close other open menus
			var $p = $menu.parents('.open');
			$('.open').filter(function(index) {
			  var t = this;
			  return $p.filter(function(index) { return t == this }).size() == 0;
			}).removeClass('open');

			$menu.addClass('open');
		  }
        }

		/* NB: the click handler overrides default behavior even for mouse interfaces, which means that clicking a link that has an
		   attached submenu will not work. For touch-screen interfaces, this makes sense, but we might want to make this configurable
		   for mouse interfaces
		*/
		event.preventDefault();
		event.stopPropagation();
	  });
	});

	return this;
  };

}(jQuery));
