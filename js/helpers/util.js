var EXELON = (function(r, $) {
  'use strict';

  r.dump = function(object) {
    try {
      RSKYBOX.log.local(JSON.stringify(object));
    } catch (e) {
      RSKYBOX.log.error(e, 'EXELON.dump');
    }
  };

  r.subtractDays = function(date, numOfDays) {
    var newDate = new Date(date.getTime() - (60 * 60 * 24 * numOfDays * 1000));
    return newDate;
  };

  r.daysInMonth = function(theDate)  {
      var currentMonth = theDate.getMonth();
      theDate.setMonth(currentMonth+1, 0);
      var days = theDate.getDate();
      return days;
  }


  // General status code handlers.
  // apiError: optional handler for API errors
  r.statusCodeHandlers = function(apiError) {
    var general = {
      304: function() {
        RSKYBOX.log.warn('304', 'EXELON.statusCodeHandlers');
      },
      401: function(jqXHR) {
        try {
          r.unauthorized();
          RSKYBOX.log.info('401 - unauthorized', 'EXELON.statusCodeHandlers');
        } catch (e) {
          RSKYBOX.log.warn(e, 'EXELON.statusCodeHandlers:general:401');
        }
      },
      404: function() {
        r.flash.error("Server error, contact tech support");
        RSKYBOX.log.warn('404 - not found', 'EXELON.statusCodeHandlers');
      },
      500: function() {
        RSKYBOX.log.warn('500 - server error', 'EXELON.statusCodeHandlers');
      }
    };

    try {
      if (apiError) {
        $.extend(general, { 422: apiError });
      }
      return general;
    } catch (e) {
      RSKYBOX.log.error(e, 'EXELON.statusCodeHandlers');
    }
  };

  r.flash = (function () {
    var display, flash = {}, key = 'rFlash';

    // type: string indicating type of message; 'error', 'notice', etc.
    // message: message to display
    // duration: time in seconds to leave flash on screen
    display = function (type, message, duration) {
      try {
        var element;

        $('.flash').remove();

        element = $('<div>', {
          class: 'flash ' + type,
          text: message
        }).hide();

        $.mobile.activePage.prepend(element);
        element.fadeIn().delay(duration * 1000).fadeOut(600);
        RSKYBOX.log.info(message, 'flash.display');
        flash.clear();
      } catch (e) {
        RSKYBOX.log.error(e, 'flash.display');
      }
    };

    flash.success = function (message, duration) {
      display('success', message, duration || 3);
    };

    flash.info = function (message, duration) {
      display('info', message, duration || 5);
    };

    flash.warning = function (message, duration) {
      display('warning', message, duration || 7);
    };

    flash.error = function (message, duration) {
      message = message || 'An unknown error occurred. Please reload the page to try again.';
      display('error', message, duration || 10);
    };

    flash.set = function (type, message, duration) {
      try {
        var value = { type: type, message: message, };
        RSKYBOX.log.info('entering', 'flash.set');

        if (duration) { value.duration = duration; }
        r.store.setItem(key, value);
      } catch (e) {
        RSKYBOX.log.error(e, 'flash.set');
      }
    };

    flash.check = function () {
      try {
        var value = r.store.getItem(key);
        RSKYBOX.log.info('entering', 'flash.check');

        if (!value) { return; }

        switch (value.type) {
        case 'success':
          flash.success(value.message, value.duration);
          break;
        case 'info':
          flash.info(value.message, value.duration);
          break;
        case 'warning':
          flash.warning(value.message, value.duration);
          break;
        case 'error':
          flash.error(value.message, value.duration);
          break;
        default:
          RSKYBOX.log.warn('unknown flash type', 'flash.check');
          break;
        }
      } catch (e) {
        RSKYBOX.log.error(e, 'flash.check');
      }
    };

    flash.clear = function () {
      try {
        r.store.removeItem(key);
      } catch (e) {
        RSKYBOX.log.error(e, 'flash.clear');
      }
    };

    return flash;
  }());

  r.format = {
    longDate: function(isoDate, showMilliseconds) {
      try {
        // var date = new Date(isoDate);  // IE 8 does NOT support iso 8601 date string in Date() constructor
        var date = new Date();
        date.setISO8601(isoDate);
        var formatStr = 'ddd, mmm d yyyy, HH:MM:ss';
        if (showMilliseconds) {
          formatStr = formatStr + '.l';
        }
        return window.dateFormat(date, formatStr);
      } catch (e) {
        RSKYBOX.log.error(e, 'format.longDate');
      }
    },
    compactDate: function(isoDate) {
      try {
        // var date = new Date(isoDate);  // IE 8 does NOT support iso 8601 date string in Date() constructor
        var date = new Date();
        date.setISO8601(isoDate);

        return window.dateFormat(date, 'yyyy/mm/dd HH:MM:ss.l');
      } catch (e) {
        RSKYBOX.log.error(e, 'format.compactDate');
      }
    },
    yearMonthDay: function(isoDate) {
      try {
        // var date = new Date(isoDate);  // IE 8 does NOT support iso 8601 date string in Date() constructor
        var date = new Date();
        date.setISO8601(isoDate);

        return window.dateFormat(date, 'yyyy-mm-dd');
      } catch (e) {
        RSKYBOX.log.error(e, 'format.compactDate');
      }
    },
    timeOnly: function(isoDate, showSeconds) {
      try {
        // var date = new Date(isoDate);  // IE 8 does NOT support iso 8601 date string in Date() constructor
        var date = new Date();
        date.setISO8601(isoDate);
        var formatStr = 'HH:MM';
        if (showSeconds) {
          formatStr = formatStr + ':ss';
        }

        return window.dateFormat(date, formatStr);
      } catch (e) {
        RSKYBOX.log.error(e, 'format.timeOnly');
      }
    },
    asTime: function(totalSecondsStr) {
      var totalSeconds = parseInt(totalSecondsStr);
      var hours = Math.floor(totalSeconds/3600);
      totalSeconds %= 3600;
      var minutes = Math.floor(totalSeconds/60);
      var seconds = totalSeconds % 60;
      var hoursStr = hours < 10 ? "0" + hours.toString() : hours.toString();
      var minutesStr = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
      var secondsStr = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
      return hoursStr + ":" + minutesStr + ":" + secondsStr;
    }
  };

  var APPROVER_USER = 'approverUser';

  // returns the complete, partially Base64 encoded authorization header ready to be inserted in the HTTP Authorication header
  r.getAuthorizationHeader = function() {
		// hard code token to one for joepwro@gmail.com
    var authHeader = 'Basic VEU5SFNVNWZWRmxRUlY5RFZWTlVUMDFGVWpwcWIyVndkM0p2UUdkdFlXbHNMbU52YlRwMWRHOHhNak09';
    return authHeader;
  };

  r.getUserName = function() {
    var userName = '';
    var user = r.store.getItem(APPROVER_USER);

    if(user) {
      if(user.firstname) {
        userName += user.firstname;
      }
      if(user.lastname)  {
        if(userName.length > 0) {userName += ' ';}
        userName += user.lastname;
      }
      if(userName.length == 0 && user.aduser) {
        userName = user.aduser;
      }
    }

    return userName;
  };

  r.deleteCookie = function(cookieName) {
    document.cookie = encodeURIComponent(cookieName) + "=deleted; expires=" + new Date(0).toUTCString();
  };

  r.deleteSessionCookie = function() {
    r.deleteCookie('JSESSIONID');
  }

  // Handle logging in
  // param user: a JavaScript object with the user attributes, not a Backbone model.
  r.logIn = function (user) {
    try {
      RSKYBOX.log.info('entering', 'EXELON.logIn');
      r.store.setItem(APPROVER_USER, user);
    } catch (e) {
      RSKYBOX.log.error(e, 'EXELON.logIn');
    }
  };

  r.logOut = function () {
    try {
      RSKYBOX.log.info('entering', 'EXELON.logOut');
      r.store.removeItem(APPROVER_USER);
    } catch (e) {
      RSKYBOX.log.error(e, 'EXELON.logOut');
    }
  };

  // Pull the apiStatus value out of an application error return
  r.getApiStatus = function(responseText) {
    try {
      return JSON.parse(responseText).apiStatus;
    } catch (e) {
      RSKYBOX.log.error(e, 'getApiStatus');
    }
  };

  r.displayPanel = function() {
    try {
      $('<div>').attr({'id':'leftPanel','data-role':'panel'}).appendTo($.mobile.activePage);
      $('<a>').attr({'id':'closePanelBtn','data-role':'button', 'data-shadow':'true'}).html('Click me').appendTo('#leftPanel');
      $('#closePanelBtn').button();
      $.mobile.activePage.find('#leftPanel').panel();
      $(document).on('click', '#closePanelBtn', function(){   
           $.mobile.activePage.find('#leftPanel').panel("close");       
      });  
      $("#leftPanel").trigger("updatelayout");
    } catch (e) {
      RSKYBOX.log.error(e, 'EXELON.displayPanel');
    }
  };

  r.Base64 = {
      // private property
      _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

      // public method for encoding
      encode: function(input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;

          input = r.Base64._utf8_encode(input);

          while (i < input.length) {
                  chr1 = input.charCodeAt(i++);
                  chr2 = input.charCodeAt(i++);
                  chr3 = input.charCodeAt(i++);

                  enc1 = chr1 >> 2;
                  enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                  enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                  enc4 = chr3 & 63;

                  if (isNaN(chr2)) {
                          enc3 = enc4 = 64;
                  } else if (isNaN(chr3)) {
                          enc4 = 64;
                  }
                  output = output + r.Base64._keyStr.charAt(enc1) + r.Base64._keyStr.charAt(enc2) + r.Base64._keyStr.charAt(enc3) + r.Base64._keyStr.charAt(enc4);
          }
          return output;
      },

      // public method for decoding
      decode: function(input) {
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;

          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

          while (i < input.length) {
                  enc1 = r.Base64._keyStr.indexOf(input.charAt(i++));
                  enc2 = r.Base64._keyStr.indexOf(input.charAt(i++));
                  enc3 = r.Base64._keyStr.indexOf(input.charAt(i++));
                  enc4 = r.Base64._keyStr.indexOf(input.charAt(i++));

                  chr1 = (enc1 << 2) | (enc2 >> 4);
                  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                  chr3 = ((enc3 & 3) << 6) | enc4;

                  output = output + String.fromCharCode(chr1);

                  if (enc3 != 64) {
                          output = output + String.fromCharCode(chr2);
                  }
                  if (enc4 != 64) {
                          output = output + String.fromCharCode(chr3);
                  }
          }

          output = r.Base64._utf8_decode(output);
          return output;
      },

      // private method for UTF-8 encoding
      _utf8_encode: function(string) {
          string = string.replace(/\r\n/g, "\n");
          var utftext = "";

          for (var n = 0; n < string.length; n++) {
                  var c = string.charCodeAt(n);
                  if (c < 128) {
                          utftext += String.fromCharCode(c);
                  } else if ((c > 127) && (c < 2048)) {
                          utftext += String.fromCharCode((c >> 6) | 192);
                          utftext += String.fromCharCode((c & 63) | 128);
                  } else {
                          utftext += String.fromCharCode((c >> 12) | 224);
                          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                          utftext += String.fromCharCode((c & 63) | 128);
                  }
          }
          return utftext;
      },

      // private method for UTF-8 decoding
      _utf8_decode: function(utftext) {
          var string = "";
          var i = 0;
          var c = 0, c1 = 0, c2 = 0, c3 = 0;

          while (i < utftext.length) {
                  c = utftext.charCodeAt(i);
                  if (c < 128) {
                          string += String.fromCharCode(c);
                          i++;
                  } else if ((c > 191) && (c < 224)) {
                          c2 = utftext.charCodeAt(i + 1);
                          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                          i += 2;
                  } else {
                          c2 = utftext.charCodeAt(i + 1);
                          c3 = utftext.charCodeAt(i + 2);
                          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                          i += 3;
                  }

          }
          return string;
      }
  };

  $(document).ajaxComplete(function (event, jqXHR, settings) {
    try {
      //if (settings.headers && settings.headers.Authorization) {
        //return;
      //}
      RSKYBOX.log.info(settings.url, 'ajaxComplete');
      $.mobile.hidePageLoadingMsg();
    } catch (e) {
      RSKYBOX.log.warn(e, 'ajaxComplete');
    }
  });


  return r;
}(EXELON || {}, jQuery));
