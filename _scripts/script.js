/*------------------------------------------------------------------------------------------------*\
    Fall-Back Cookie Notice Pattern v0.1
    ------------------------------------

    To avoid any confusion, it's probably best to copy these settings to another file that you're
    concatenating and then make any changes to the defaults.
\*------------------------------------------------------------------------------------------------*/

var cookie_name                   = 'fallback_accept_cookies';
var cookie_expire_days            = 60;
var cookie_notice_id              = 'cookie_notice';
var cookie_button_id              = 'accept_cookies';
var cookie_notice_class           = 'cookie_notice';
var cookie_button_class           = '';
var cookie_close_class            = 'cookie_notice--close';
var cookie_notice_effect_duration = 1000;
var cookie_html                   =
'<div id="' + cookie_notice_id + '" class="' + cookie_notice_class + '">' + "\n" +
'<p class="cookie_notice__message">This site uses <a href="http://www.allaboutcookies.org/" rel="external noopener noreferrer" target="_blank">cookies</a> to improve user experience. By using this site you agree to our use of cookies.</p>' + "\n" +
'<span class="cookie_notice__action"><button id="' + cookie_button_id + '" class="' + cookie_button_class + '">Dismiss</button></span>' + "\n" +
'</div>';

/*
    Can't be totally sure what this is for, now...
    It'll come back to me...
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    var adjustJustifyContent = {
        run: function() {
            var containers = document.querySelectorAll('.js-adjust-me');
            Array.prototype.forEach.call(containers, function(container, i) {
                var item = container.querySelector('.js-adjust-me__reference');
                if (getComputedStyle(container)['height'] > getComputedStyle(item)['height']) {
                    container.style.justifyContent = 'center';
                } else {
                    container.style.justifyContent = 'space-between';
                }
            });
        }
    }



    ready(adjustJustifyContent.run);
    window.onresize = adjustJustifyContent.run;
})();

/*
    Object-git polyfill.
*/
(function() {
    if(('objectFit' in document.documentElement.style !== false) || !(navigator.userAgent.indexOf('UCBrowser') > -1)) {
        return;
    }

    // https://davidwalsh.name/javascript-debounce-function
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    var debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var compare_heights = function() {
        // Get all elements we want to apply this to:
        var elements = document.querySelectorAll('.js-image-cover');

        Array.prototype.forEach.call(elements, function(el, i) {

            var img = el.querySelector('img');

            // Get the container dimensions:
            var container_rect = el.getBoundingClientRect();

            // Get the image dimesions:
            var image_rect = img.getBoundingClientRect();
            console.log(container_rect.height, image_rect.height, img.height < container_rect.height);

            // Remove the style. Not the behavior here isn't ideal, but it's better than the image
            // getting stuck at a small size which can happen otherwise.
            img.removeAttribute('style');

            // If the image is not tall enough to fill the container, swap width/height styles:
            if (img.height <= container_rect.height) {

                img.style.width  = 'auto';
                img.style.height = '100%';
            }
        });
    };

    var polyfill = function() {
        // Run on page load...
        compare_heights();

        var checkresize = debounce(function() {
            compare_heights();
        }, 250);

        // .. and whenever the window resizes:
        window.addEventListener('resize', checkresize);
    };

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(polyfill);
})();
/*!
    Fall-Back Cookie Notice v1.1.0
    https://github.com/Fall-Back/Cookie-Notice
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    var createCookie = function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    var readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    var eraseCookie = function(name) {
        createCookie(name,"",-1);
    }
    
    var cookienotice = {

        init: function() {
            var accepted_cookies = readCookie(cookie_name);
            if (!accepted_cookies) {
                var body_el = document.getElementsByTagName('body')[0];
                body_el.insertAdjacentHTML('afterbegin', cookie_html);
                
                document.getElementById(cookie_button_id).onclick = function(){
                    createCookie(cookie_name, 'true', cookie_expire_days);
                    document.getElementById(cookie_notice_id).className += '  ' + cookie_close_class;
                    /*
                        Without CSS (or transition suport - IE9) the notice won't disappear, so wait until fade 
                        has finished then remove:
                    */
                    setTimeout(function(){
                        var c = document.getElementById(cookie_notice_id);
                        c.parentNode.removeChild(c);
                    }, cookie_notice_effect_duration);
                };
            }
        }
    }
    
    ready(cookienotice.init);
})();

/*!
    Fall-Back Nav-Bar v2.0.0
    https://github.com/Fall-Back/Nav-Bar
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    
    var nav_bar_js_classname = 'js-nav-bar'; 

    var check_for_css = function(selector) {
        
        var rules;
        var haveRule = false;
        if (typeof document.styleSheets != "undefined") {// is this supported
            var cssSheets = document.styleSheets;
            
            // IE doesn't have document.location.origin, so fix that:
            if (!document.location.origin) {
                document.location.origin = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
            }
            var domain_regex  = RegExp('^' + document.location.origin);
            
            outerloop:
            for (var i = 0; i < cssSheets.length; i++) {
                var sheet = cssSheets[i];
                
                // Some browsers don't allow checking of rules if not on the same domain (CORS), so
                // checking for that here:
                if (sheet.href !== null && domain_regex.exec(sheet.href) === null) {
                    continue;
                }
                
                // Check for IE or standards:
                rules = (typeof sheet.cssRules != "undefined") ? sheet.cssRules : sheet.rules;
                for (var j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText == selector) {
                        haveRule = true;
                        break outerloop;
                    }
                }
            }
        }
        return haveRule;
    }
    
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

	var navbar = {

        init: function() {
            /*var nav_bar = document.querySelector('.nav-bar');
            
            // Note that `getComputedStyle` on pseudo elements doesn't work in Opera Mini, but in
            // this case I'm happy to serve only the un-enhanced version to Opera Mini.
            var css_is_loaded = (
                window.getComputedStyle(nav_bar, ':before')
                .getPropertyValue('content')
                .replace(/(\"|\')/g, '')
                == 'CSS Loaded'
            );*/

            if (css_is_loaded) {
                // Add the JS class names ...
                /*if (nav_bar.classList) {
                    nav_bar.classList.add(nav_bar_js_classname);
                } else {
                    nav_bar.className += ' ' + nav_bar_js_classname;
                }*/
                // ... and button actions:*/
                // CSS all good, add button actions:
                var buttons = document.querySelectorAll('[data-js="nav-bar__button"]');
                Array.prototype.forEach.call(buttons, function(button, i) {
                    var button_id = button.getAttribute('id');

                    button.setAttribute('aria-expanded', 'false');

                    // Main button:
                    button.addEventListener('click', function() {
                        // Switch the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Close any open submenu:
                        var expanded_buttons = document.querySelectorAll('[data-js="nav-bar__button"][aria-expanded="true"]');
                        Array.prototype.forEach.call(expanded_buttons, function(expanded_button, i) {
                            expanded_button.setAttribute('aria-expanded', 'false');
                        });

                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Set the focus to the first link if submenu newly opened:
                        if (!expanded) {
                            var first_link = document.querySelector('#' + button_id + '--target [data-js="nav-bar__focus-start"]');
                            if (first_link) {
                                first_link.focus();
                            }
                        }
                    });

                });
            }
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled Navbar:
    var css_is_loaded = check_for_css('.' + nav_bar_js_classname);
    
    if (css_is_loaded) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');
        
        if (html_el.classList) {
            html_el.classList.add(nav_bar_js_classname);
        } else {
            html_el.className += ' ' + nav_bar_js_classname;
        }
    }

	ready(navbar.init);
})();

/*!
    Fall-Back Over-Panel v2.0.0
    https://github.com/Fall-Back/Over-Panel
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {

    var over_panel_js_classname           = 'js-over-panel';
    var over_panel_control_js_classname   = 'js-over-panel-control';
    var over_panel_is_open_classname      = 'js-over-panel_is-open';
    var over_panel_is_animating_classname = 'js-over-panel_is-animating';

    var check_for_css = function(selector) {
        
        var rules;
        var haveRule = false;
        if (typeof document.styleSheets != "undefined") {// is this supported
            var cssSheets = document.styleSheets;
            
            // IE doesn't have document.location.origin, so fix that:
            if (!document.location.origin) {
                document.location.origin = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
            }
            var domain_regex  = RegExp('^' + document.location.origin);
            
            outerloop:
            for (var i = 0; i < cssSheets.length; i++) {
                var sheet = cssSheets[i];
                
                // Some browsers don't allow checking of rules if not on the same domain (CORS), so
                // checking for that here:
                if (sheet.href !== null && domain_regex.exec(sheet.href) === null) {
                    continue;
                }
                
                // Check for IE or standards:
                rules = (typeof sheet.cssRules != "undefined") ? sheet.cssRules : sheet.rules;
                for (var j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText == selector) {
                        haveRule = true;
                        break outerloop;
                    }
                }
            }
        }
        return haveRule;
    }

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }


    /* From Modernizr */
    var whichTransitionEvent = function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

	var over_panel = {

        init: function() {

            if (css_is_loaded) {
                // Add the JS class name ...
                /*
                var html_el = document.querySelector('html');

                if (html_el.classList) {
                    html_el.classList.add(over_panel_js_classname);
                } else {
                    html_el.className += ' ' + over_panel_js_classname;
                }
                */

                var over_panels = document.querySelectorAll('[data-js="over-panel"]');
                /*var over_panel_js_classname           = 'js-over-panel';
                var over_panel_control_js_classname   = 'js-over-panel-control';
                var over_panel_is_open_classname      = 'js-over-panel_is-open';
                var over_panel_is_animating_classname = 'js-over-panel_is-animating';*/

                var transitionEvent = whichTransitionEvent();

                // Note that `getComputedStyle` on psuedo elements doesn't work in Opera Mini, but in
                // this case I'm happy to serve only the unenhanced version to Opera Mini.
                /*var css_is_loaded = (
                    window.getComputedStyle(over_panels[0], ':before')
                    .getPropertyValue('content')
                    .replace(/(\"|\')/g, '')
                    == 'CSS Loaded'
                );*/


                Array.prototype.forEach.call(over_panels, function(over_panel, i) {


                    // Find corresponding controls:
                    var over_panel_id = over_panel.getAttribute('id');
                    var over_panel_control = document.querySelector('[aria-controls="' + over_panel_id + '"]');
                    var over_panel_overlay = over_panel.querySelector('[data-js="over-panel__overlay"]');

                    // Check we've got a corresponding control. If not we can't proceed so skip:
                    if (!over_panel_control) {
                        return;
                    }

                    // Add the JS class names ...
                    // ... to the panel: ...
                    if (over_panel.classList) {
                        over_panel.classList.add(over_panel_js_classname);
                    } else {
                        over_panel.className += ' ' + over_panel_js_classname;
                    }
                    // ... and the control:
                    if (over_panel_control.classList) {
                        over_panel_control.classList.add(over_panel_control_js_classname);
                    } else {
                        over_panel_control.className += ' ' + over_panel_control_js_classname;
                    }

                    // Main toggle button:
                    over_panel_control.addEventListener('click', function() {

                        if (over_panel.classList) {
                            over_panel.classList.add(over_panel_is_animating_classname);
                        } else {
                            over_panel.className += ' ' + over_panel_is_animating_classname;
                        }

                        // Invert the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Close any open panels:
                        var expanded_buttons = document.querySelectorAll('[data-js="overpanel__control"][aria-expanded="true"]');
                        Array.prototype.forEach.call(expanded_buttons, function(expanded_button, i) {
                            //expanded_button.setAttribute('aria-expanded', 'false');
                            expanded_button.click();
                        });

                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Toggle the `is_open` class:
                        if (!expanded) {
                            if (over_panel.classList) {
                                over_panel.classList.add(over_panel_is_open_classname);
                            } else {
                                over_panel.className += ' ' + over_panel_is_open_classname;
                            }
                        } else {
                            if (over_panel.classList) {
                                over_panel.classList.remove(over_panel_is_open_classname);
                            } else {
                                over_panel.className = over_panel.className.replace(new RegExp('(^|\\b)' + over_panel_is_open_classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                            }
                        }
                    });

					// Overlay click action:
					over_panel_overlay.addEventListener('click', function() {
						over_panel_control.click()
					});

                    // Remove `animating` class at transition end.
                    transitionEvent && over_panel.addEventListener(transitionEvent, function() {
                        if (over_panel.classList) {
                            over_panel.classList.remove(over_panel_is_animating_classname);
                        } else {
                            console.log('Animation ended');
                            over_panel.className = over_panel.className.replace(new RegExp('(^|\\b)' + over_panel_is_animating_classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                        }
                    });

                    // Focus trap inspired by:
					// http://heydonworks.com/practical_aria_examples/progressive-hamburger.html
                    var over_panel_contents = over_panel.querySelector('[data-js="over-panel__contents"]');
                    var focusables          = over_panel_contents.querySelectorAll('a, button, input, select, textarea');
                    var first_focusable     = focusables[0];
                    var last_focusable      = focusables[focusables.length - 1];

                    // At end of navigation block, return focus to navigation menu button
                    last_focusable.addEventListener('keydown', function(e) {
                        if (over_panel_control.getAttribute('aria-expanded') == 'true' && e.keyCode === 9 && !e.shiftKey) {
							e.preventDefault();
							over_panel_control.focus();
                        }
                    });

                    // At start of navigation block, refocus close button on SHIFT+TAB
                    over_panel_control.addEventListener('keydown', function(e) {
                        if (over_panel_control.getAttribute('aria-expanded') == 'true' && e.keyCode === 9 && e.shiftKey) {
                            e.preventDefault();
                            last_focusable.focus();
                        }
                    });
                });
            }
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled OverPanel:
    var css_is_loaded = check_for_css('.' + over_panel_js_classname);
    
    if (css_is_loaded) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');
        
        if (html_el.classList) {
            html_el.classList.add(over_panel_js_classname);
        } else {
            html_el.className += ' ' + over_panel_js_classname;
        }
    }

	ready(over_panel.init);
})();

/*!
    Fall-Back Dropdown v1.0.0
    https://github.com/Fall-Back/Dropdown
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {

    var dropdown_js_classname = 'js-dropdown';

    var check_for_css = function(selector) {

        var rules;
        var haveRule = false;
        if (typeof document.styleSheets != "undefined") {// is this supported
            var cssSheets = document.styleSheets;

            // IE doesn't have document.location.origin, so fix that:
            if (!document.location.origin) {
                document.location.origin = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
            }
            var domain_regex  = RegExp('^' + document.location.origin);

            outerloop:
            for (var i = 0; i < cssSheets.length; i++) {
                var sheet = cssSheets[i];

                // Some browsers don't allow checking of rules if not on the same domain (CORS), so
                // checking for that here:
                if (sheet.href !== null && domain_regex.exec(sheet.href) === null) {
                    continue;
                }

                // Check for IE or standards:
                rules = (typeof sheet.cssRules != "undefined") ? sheet.cssRules : sheet.rules;
                for (var j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText == selector) {
                        haveRule = true;
                        break outerloop;
                    }
                }
            }
        }
        return haveRule;
    }

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

	var dropdown = {

        init: function() {
            var dropdowns = document.querySelectorAll('.dropdown');
            /*var dropdown_js_classname = 'js-dropdown';
            // Note that `getComputedStyle` on pseudo elements doesn't work in Opera Mini, but in
            // this case I'm happy to serve only the un-enhanced version to Opera Mini.
            var css_is_loaded = (
                window.getComputedStyle(dropdown, ':before')
                .getPropertyValue('content')
                .replace(/(\"|\')/g, '')
                == 'CSS Loaded'
            );*/

            if (css_is_loaded) {
                Array.prototype.forEach.call(dropdowns, function(dropdown, i) {
                    // Add the JS class names ...
                    if (dropdown.classList) {
                        dropdown.classList.add(dropdown_js_classname);
                    } else {
                        dropdown.className += ' ' + dropdown_js_classname;
                    }
                });
                
                // ... and button actions:
                var buttons = document.querySelectorAll('[data-js="dropdown__button"]');
                Array.prototype.forEach.call(buttons, function(button, i) {
                    var button_id = button.getAttribute('id');

                    button.setAttribute('aria-expanded', 'false');

                    // Main button:
                    button.addEventListener('click', function() {
                        // Switch the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Close any open dropdown:
                        var expanded_buttons = document.querySelectorAll('[data-js="dropdown__button"][aria-expanded="true"]');
                        Array.prototype.forEach.call(expanded_buttons, function(expanded_button, i) {
                            expanded_button.setAttribute('aria-expanded', 'false');
                        });
                        
                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Set the focus to the first link if submenu newly opened:
                        if (!expanded) {
                            var first_link = document.querySelector('#' + button_id + '--target [data-js="dropdown__focus-start"]');
                            if (first_link) {
                                first_link.focus();
                            }
                        }
                    });
                });
                
            }
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled Dropdown:
    var css_is_loaded = check_for_css('.' + dropdown_js_classname);

    if (css_is_loaded) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');

        if (html_el.classList) {
            html_el.classList.add(dropdown_js_classname);
        } else {
            html_el.className += ' ' + dropdown_js_classname;
        }
    }

	ready(dropdown.init);
})();
