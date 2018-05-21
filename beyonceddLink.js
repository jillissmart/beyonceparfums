 * Main Expandable navigation menu.
 */

(function ($, Drupal) {
  var GLOBAL_EASING = 'easeInOutExpo';

  var opacitySupport = $.support.opacity; //this is so we can do something else besides fades in IE cuz of it's abysmal handling of fading pngs

  var beyonceNav = function (opts) {
    var surrogate = this;
    this.defaults = {
      navRef: null,
      dur: 400,
      easingMethod: GLOBAL_EASING
    };
    this.nav = $('.byn-main-nav');
    this.dds = this.nav.find('.dd');
    this.ddLs = this.dds.parent();
    this.drawer = $('.desktop-overlay');
    //this.drawer = $('<div id="ddDrawer"></div>');
    this.indicatorTrack = $('<div class="indicatorTrack"></div>');
    this.indicator = $('<div class="indicator"></div>');


    this.options = $.extend(this.defaults, opts);

    this.isDrawerDown = false;
    this.isOverLink = false;

    // MAIN SETUP
    this.indicatorTrack.append(this.indicator);
    this.drawer.append(this.indicatorTrack).insertAfter("#global-nav");

    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || navigator.userAgent.match(/webOS/i) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPad/i))) {
      this.drawer.bind('mouseleave, touchEnd', function () {
        if (!this.isOverLink) {
          surrogate.hideDrawer();
        }
      });
    } else {
      this.drawer.bind('mouseleave', function () {
        if (!this.isOverLink) {
          surrogate.hideDrawer();
        }
      });
    }

    // DD SETUPS
    var hoverConfig = {
      interval: this.options.dur / 2,
      timeout: this.options.dur,
      over: function () {
        ddOver(this);
      },
      out: function () {
        ddOff(this);
      }
    };


    var ddOver = function (elem) {
      elem = $(elem);
      /*remove var*/
      var theDD = $(elem).children('.dd');
      var theA = elem.children('a:first-child');
      var drawerMode = surrogate.isDrawerDown === true ? 'fade' : 'slide';
      if (!opacitySupport) { //Why IE?? WHY ARE YOU SO BAD AT ALPHA TRANSPARENCY??
        drawerMode = 'ie';
      }

      surrogate.showDropDown(theDD, {
        mode: drawerMode
      });
      var theHeight = theDD.children().outerHeight();

      var targX = theA.outerWidth() / 2 + elem.position().left + 4;
      surrogate.showDrawer(theHeight, targX);
    };

    var ddOff = function (elem) {
      surrogate.hideDropDown($(elem).children('.dd'));
      if (!surrogate.isOverLink) {
        surrogate.hideDrawer();
      }
    };

    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || navigator.userAgent.match(/webOS/i) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPad/i))) {
      this.ddLs.each(function () {
        $(this).hoverIntent(hoverConfig);
      }).addClass('ddLink').bind("mouseenter, click", function () {
        surrogate.isOverLink = true;
      }).bind("mouseleave, touchCancel, touchEnd", function () {
        surrogate.isOverLink = false;
      });

    } else {
      this.ddLs.each(function () {
        $(this).hoverIntent(hoverConfig);
      }).addClass('ddLink').bind("mouseenter", function () {
        surrogate.isOverLink = true;
      }).bind("mouseleave", function () {
        surrogate.isOverLink = false;
      });
    }

    this.dds.each(function () {
      var t = $(this);
      t.css({
        visibility: 'visible'
      }).children().css({
        marginTop: -t.height()
      });
    });

  };
  beyonceNav.prototype.showDropDown = function (dd, opts) {
    var surrogate = this;
    var defaults = {
      mode: 'slide'
    };
    var opts = $.extend(defaults, opts);
    var theCont = dd.children();
    var theArrow = dd.parent();

    if (opts.mode == 'fade') {
      this.dds.children().not(theCont).each(function () {
        var t = $(this);
        t.fadeTo(surrogate.options.dur / 3, 0, function () {
          t.hide();
        });
      });
      theCont.hide().delay(surrogate.options.dur).css({
        marginTop: 0
      }).fadeTo(surrogate.options.dur / 2, 1).addClass('active');
    } else if (opts.mode == "ie") { //sigh...
      this.dds.children().not(theCont).each(function () {
        var t = $(this);
        //hide the siblings do something- then hide the siblings
        var c = theCont.html();
        t.animate({
          marginTop: -t.outerHeight()
        }, {
          duration: surrogate.options.dur,
          easing: surrogate.options.easingMethod,
          complete: function () {
            t.hide();
          }
        });
      });
      theCont.show().css({
        marginTop: -theCont.outerHeight()
      }).animate({
        marginTop: 0
      }, {
        duration: surrogate.options.dur,
        easing: surrogate.options.easingMethod
      }).addClass('active');
    } else {
      theCont.show().fadeTo(0, 1).css({
        marginTop: -theCont.outerHeight()
      }).animate({
        marginTop: 0
      }, {
        duration: surrogate.options.dur,
        easing: surrogate.options.easingMethod
      }).addClass('active');
    }

    // TODO:fix bg arrow for IE
    if (opts.mode != "ie") {
      dd.siblings('a').animate({
        backgroundPosition: '50% 50px'
      }, {
        duration: surrogate.options.dur / 2,
        easing: surrogate.options.easingMethod
      });
    }

    theArrow.toggleClass("on");
  };

  beyonceNav.prototype.hideDropDown = function (dd, opts) {
    var surrogate = this;
    var defaults = {
      mode: 'slide'
    };
    opts = $.extend(defaults, opts);
    /*remove var*/
    var theArrow = dd.parent();

    theArrow.toggleClass("on");
    // TODO:fix bg for IE
    if (opacitySupport) {
      dd.siblings('a').stop().delay(surrogate.options.dur / 2).animate({
        backgroundPosition: '50% 36px'
      }, {
        duration: surrogate.options.dur / 2,
        easing: surrogate.options.easingMethod
      });
    }
  };
  beyonceNav.prototype.showDrawer = function (ht, indicatorX) {
    var surrogate = this;
    if (!this.isDrawerDown) {
      this.indicator.css({
        top: -10,
        left: indicatorX
      });
    }
    this.indicator.animate({
      top: 0,
      left: indicatorX
    }, {
      duration: surrogate.options.dur / 1.5,
      easing: surrogate.options.easingMethod
    });
    this.drawer.stop().animate({
      height: ht
    }, {
      duration: surrogate.options.dur,
      easing: surrogate.options.easingMethod,
      complete: function () {
        surrogate.isDrawerDown = true;
      }
    });
  };
  beyonceNav.prototype.hideDrawer = function () {
    var surrogate = this;
    this.indicator.stop().animate({
      top: -10
    }, {
      duration: surrogate.options.dur / 1.5,
      easing: surrogate.options.easingMethod
    });
    this.drawer.stop().animate({
      height: 0
    }, {
      duration: surrogate.options.dur,
      easing: surrogate.options.easingMethod,
      complete: function () {
        surrogate.isDrawerDown = false;
      }
    });
    this.dds.children().each(function () {
      $(this).animate({
        marginTop: -$(this).outerHeight()
      }, {
        duration: surrogate.options.dur,
        easing: surrogate.options.easingMethod,
        queue: false
      });
    });
  };

  // Init the menu.
  Drupal.behaviors.byn_core_nav = {
    attach: function (context, settings) {
      // Expanded main menu.
      $('body', context).once("expandable-menu", function () {

        var nav = new beyonceNav();

        $('li.ddLink > a').click(function (e) {
          e.preventDefault();
        });

        if ($(".webform-client-form .error").length > 0) {
          // Expand if errors.
          (function () {
            elem = $('li.byn-main-menu-subscribe');
            surrogate = nav;
            var theDD = $(elem).children('.dd');
            var theA = elem.children('a:first-child');
            var drawerMode = surrogate.isDrawerDown === true ? 'fade' : 'slide';
            if (!opacitySupport) {
              drawerMode = 'ie';
            }

            surrogate.showDropDown(theDD, {
              mode: drawerMode
            });
            var theHeight = theDD.children().outerHeight();

            var targX = theA.outerWidth() / 2 + elem.position().left + 4;
            surrogate.showDrawer(theHeight, targX);
          })();

        }
      });
    }
  };

})(jQuery, Drupal);