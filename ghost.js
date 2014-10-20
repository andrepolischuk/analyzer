// Ghost © 2013-2014 Andrey Polischuk
// https://github.com/andrepolischuk/ghost

!function(undefined) {

  'use strict';

  /**
   * Ghost prototype
   */

  function Ghost(options) {

    /**
     * Request
     */

    var req = {};

    /**
     * Request array
     */

    req.array = {};

    /**
     * Request string
     */

    req.string = '';

    /**
     * Request path
     */

    req.path = options.path || '';

    /**
     * Request connector
     */

    req.connector = null;

    /**
     * Get url utm params
     * @return {Object}
     * @api private
     */

    var getVariables = function() {

      var i, len, hash;

      var params = {};
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

      for (i = 0, len = hashes.length, len; i < len; i++) {

        hash = hashes[i].split('=');

        if (/^utm/gi.test(hash[0])) {
          params[hash[0]] = hash[1];
        }

      }

      if (i in params) {
        return params;
      }

      return false;

    };

    /**
     * Get search machine query
     * @return {String}
     * @api private
     */

    var getSearch = function() {

      var ref = unescape(document.referrer);
      var hashes = ref.slice(ref.indexOf('?') + 1).split('&');
      var i, len, pn;

      var q = {
        'a.ua'            : 's',
        'akavita.by'      : 'z',
        'all.by'          : 'query',
        'aport.ru'        : 'r',
        'bigmir.net'      : 'q',
        'bing'            : 'q,',
        'gde.ru'          : 'keywords',
        'go.mail.ru'      : 'q',
        'gogo.ru'         : 'q',
        'google'          : 'q',
        'i.ua'            : 'q',
        'km.ru'           : 'sq',
        'liveinternet.ru' : 'ask',
        'lycos'           : 'q',
        'meta.ua'         : 'q,',
        'msn'             : 'q',
        'nigma.ru'        : 's',
        'online.ua'       : 'q',
        'poisk.ru'        : 'text',
        'quintura.ru'     : 'request',
        'rambler'         : 'query',
        'search.com.ua'   : 'q',
        'search.qip.ru'   : 'query,',
        'search.ua'       : 'query',
        'search.ukr.net'  : 'search_query',
        'tut.by'          : 'query',
        'ukr.net'         : 'search_query',
        'webalta.ru'      : 'q',
        'yahoo'           : 'p',
        'yandex'          : 'text'
      };

      if (ref.length <= 0) {
        return false;
      }

      for (i in q) {
        if (q.hasOwnProperty(i)) {
          var expr = new RegExp(i + '.*\\?', 'i');
          if (expr.test(ref)) {
            pn = q[i];
          }
        }
      }

      if (!pn) {
        return false;
      }

      for (i = 0, len = hashes.length, len; i < len; i+=1) {

        hash = hashes[i].split('=');

        if (hash[0] === pn) {
          return hash[1];
        }
      }

    };

    /**
     * Get visit date
     * @return {Array}
     * @api private
     */

    var getDate = function() {

      var dt = new Date();

      var date = (dt.getDate() < 10 ? '0' : '') + dt.getDate() +
        '.' + ((dt.getMonth() < 10) ? '0' : '') + (dt.getMonth() + 1) +
        '.' + dt.getFullYear();

      var time = (dt.getHours() < 10 ? '0' : '') + dt.getHours() +
        ':' + ((dt.getMinutes() < 10) ? '0' : '') + dt.getMinutes();

      // integer part
      var th = dt.getTimezoneOffset() / 60;

      // divisional part
      var tm = (dt.getTimezoneOffset() % 60) / 60;

      var timeZone = 'UTC' + (th > 0 ? '-' : '+') +
        ((th - tm) + (tm !== 0 ? (':' + (60 * tm)) : '')).replace(/-?/i, "");

      return [date, time, timeZone];

    };

    /**
     * Get user screen info
     * @return {String}
     * @api private
     */

    var getScreen = function() {

      var screenW = false;
      var screenH = false;

      if (parseInt(navigator.appVersion) > 3) {

        screenW = screen.width;
        screenH = screen.height;

      } else if (navigator.appName === 'Netscape' && parseInt(navigator.appVersion) === 3 && navigator.javaEnabled()) {

        var jToolkit = java.awt.Toolkit.getDefaultToolkit();
        var jScreenSize = jToolkit.getScreenSize();

        screenW = jScreenSize.width;
        screenH = jScreenSize.height;

      }

      return screenW + 'x' + screenH;

    };

    /**
     * Get system info
     * @return {Array}
     * @api private
     */

    var getOS = function() {

      var os;
      var ua = window.navigator.userAgent;

      var windows     = /Windows/i;
      var windows8    = /Windows\sNT\s6\.2/i;
      var windows7    = /Windows\sNT\s6\.1/i;
      var windowsV    = /Windows\sNT\s6\.0/i;
      var windows2003 = /Windows\sNT\s5\.2/i;
      var windowsXP   = /Windows\sNT\s5\.1/i;
      var windows2000 = /Windows\sNT\s5\.0/i;
      var windowsME   = /Win\s9x\s4\.90/i;
      var windows98   = /Win98/i;
      var windows95   = /Win95/i;
      var windowsNT   = /WinNT4\.0/i;
      var windows311  = /Win3\.11/i;
      var windowsCE   = /Windows.*CE/i;
      var windowsP    = /.*Windows\sPhone\sOS\s(\d\.\d).*/i;
      var windowsM    = /Windows\sMobile/i;
      var macOS       = /(Mac\sOS|Macintosh|Mac)/i;
      var macOSX      = /.*Mac\sOS\sX\s(\d+).(\d+).(\d*).*/i;
      var iOS         = /(iPhone|iPad|iPod)/i;
      var iOSV        = /.*OS\s(\d+).(\d+).(\d*).*/i;
      var android     = /Android/i;
      var androidV    = /.*Android\s(\d+).(\d+).(\d*).*/i;
      var bb          = /BlackBerry/i;
      var bbV         = /.*BlackBerry\s(\d+).*/i;
      var symbian     = /SymbOS/i;
      var linux       = /Linux/i;

      if (iOS.test(ua)) {

        os = iOSV.test(ua) ? ['iOS', ua.replace(iOSV, "$1.$2")] : ['iOS', 'undefined'];

      } else if (android.test(ua)) {

        os = androidV.test(ua) ? ['Android', ua.replace(androidV, "$1.$2")] : ['Android', 'undefined'];

      } else if (bb.test(ua)) {

        os = bbV.test(ua) ? ['BlackBerry', ua.replace(bbV, "$1")] : ['BlackBerry', 'undefined'];

      } else if (symbian.test(ua)) {

        os = ['Symbian OS', 'undefined'];

      } else if (windows.test(ua)) {

        if (windows8.test(ua)) {
          os = ['Windows', '8'];
        } else if (windows7.test(ua)) {
          os = ['Windows', '7'];
        } else if (windowsV.test(ua)) {
          os = ['Windows', 'Vista'];
        } else if (windows2003.test(ua)) {
          os = ['Windows', 'Server 2003'];
        } else if (windowsXP.test(ua)) {
          os = ['Windows', 'XP'];
        } else if (windows2000.test(ua)) {
          os = ['Windows', '2000'];
        } else if (windowsME.test(ua)) {
          os = ['Windows', 'ME'];
        } else if (windows98.test(ua)) {
          os = ['Windows', '98'];
        } else if (windows95.test(ua)) {
          os = ['Windows', '95'];
        } else if (windowsNT.test(ua)) {
          os = ['Windows', 'NT 4.0'];
        } else if (windows311.test(ua)) {
          os = ['Windows', '3.11'];
        } else if (windowsCE.test(ua)) {
          os = ['Windows', 'CE'];
        } else if (windowsP.test(ua)) {
          os = ['Windows', ua.replace(windowsP, "Phone $1")];
        } else if (windowsM.test(ua)) {
          os = ['Windows', 'Mobile'];
        } else {
          os = ['Windows', 'undefined'];
        }

      } else if (macOS.test(ua)) {

        os = macOSX.test(ua) ? ['Mac OS X', ua.replace(macOSX, "$1.$2")] : ['Mac OS', 'undefined'];

      } else if (linus.test(ua)) {

        os = ['Linux', 'undefined'];

      } else {

        os = ['undefined', 'undefined'];

      }

      return os;

    };

    /**
     * Get browser from userAgent string
     * @param  {Number} chrAfterPoint
     * @return {Array}
     * @api private
     */

    var getAppByNavigator = function(chrAfterPoint) {

      var outputData;
      var ua = window.navigator.userAgent;

      var OperaB   = /Opera[ \/]+\w+\.\w+/i;
      var OperaV   = /Version[ \/]+\w+\.\w+/i;
      var FirefoxB = /Firefox\/\w+\.\w+/i;
      var ChromeB  = /Chrome\/\w+\.\w+/i;
      var SafariB  = /Version\/\w+\.\w+/i;
      var IEB      = /MSIE *\d+\.\w+/i;
      var SafariV  = /Safari\/\w+\.\w+/i;

      var browser      = [];
      var browserSplit = /[ \/\.]/i;

      var Firefox = ua.match(FirefoxB);
      var Chrome  = ua.match(ChromeB);
      var Safari  = ua.match(SafariB);
      var IE      = ua.match(IEB);
      var Opera   = ua.match(OperaB);

      OperaV  = ua.match(OperaV);
      SafariV = ua.match(SafariV);

      if (Opera !== null && OperaV !== null) {
        browser.push(OperaV[0].replace(/Version/, "Opera"));
      } else if (Opera !== null) {
        browser.push(Opera[0]);
      } else if (IE !== null) {
        browser.push(IE[0]);
      } else if (Firefox !== null) {
        browser.push(Firefox[0]);
      } else if (Chrome !== null) {
        browser.push(Chrome[0]);
      } else if (Safari !== null && SafariV !== null) {
        browser.push(Safari[0].replace("Version", "Safari"));
      }

      if (browser[0] !== null) {
        outputData = browser[0].split(browserSplit);
      }

      if ((chrAfterPoint === null || chrAfterPoint === 0) && outputData !== null) {

        chrAfterPoint=outputData[2].length;
        outputData[2] = outputData[2].substring(0, chrAfterPoint);
        return outputData;

      } else if (chrAfterPoint !== null) {

        outputData[2] = outputData[2].substr(0, chrAfterPoint);
        return outputData;

      } else {
        return false;
      }

    };

    /**
     * Get browser from other params
     * @return {Array}
     * @api private
     */

    var getAppByJs = function() {

      var browser = [];

      if (window.opera) {
        browser.push('Opera');
        browser.push(window.opera.version());
      } else if (window.chrome) {
        browser.push('Chrome');
      } else if (window.sidebar) {
        browser.push('Firefox');
      } else if (!window.external && browser[0] !== 'Opera') {
        browser.push('Safari');
      } else if (window.ActiveXObject) {
        browser.push('MSIE');
        if (window.navigator.userProfile) {
          browser.push('6');
        } else if (window.Storage) {
          browser.push('8');
        } else if (!window.Storage && !window.navigator.userProfile) {
          browser.push('7');
        } else {
          browser.push('Unknown');
        }
      }

      if (!browser) {
        return false;
      } else {
        return browser;
      }

    };

    /**
     * Get browser aggregated info
     * @param  {Number} chrAfterPoint
     * @return {Array}
     * @api private
     */

    var getApp = function(chrAfterPoint) {

      var appNav = getAppByNavigator(chrAfterPoint);
      var appJS  = getAppByJs();

      if (appNav[0] === appJS[0]) {
        return appNav;
      } else if (appNav[0] !== appJS[0]) {
        return appJS;
      } else {
        return false;
      }

    };

    /**
     * Create ajax request
     * @return {Object}
     * @api private
     */

    var createRequest = function() {

      var req;

      if (window.XMLHttpRequest) {

        // normal browser
        req = new XMLHttpRequest();

      } else if (window.ActiveXObject) {

        // IE
        try {
          req = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {}

        try {
          req = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {}
      }

      return req;

    };

    /**
     * Send request
     * @param {String}   path
     * @param {Object}   params
     * @param {Function} callback
     * @api private
     */

    var send = function(path, params, callback) {

      // create request
      req.connector = req.connector || createRequest();

      if (req.connector) {

        // send request
        req.connector.open('GET', path + (/\?/.test(path) ? '&' : '?') + params, true);

        // header for POST request
        // req.connector.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        req.connector.onreadystatechange = function() {

          try {

            if (req.connector.readyState === 4) {

              if (req.connector.status === 200) {

                var rData = req.connector.responseText;
                var eData = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(rData.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + rData + ')');

                // json answer
                result = new Object(eData);

                if (typeof callback === 'function') {
                  callback(result);
                }

              } else {

                // no data return

              }
            }

          } catch(e) {}

        };

        // amp'ed string
        req.connector.send(null);

      } else {

        // no ajax support

      }
    };

    /**
     * Cookie functions
     *
     * regular cookie('example', 'foo');
     * cookie expired cookie('example', 'foo', { expires: 7 });
     * cookie with path cookie('example', 'foo', { path: '/admin' });
     * get cookie alert(cookie('example') );
     * cookie remove cookie('example', null);
     *
     * @param  {String} name
     * @param  {String} value
     * @param  {Object} options
     * @return {String}
     * @api private
     */

    var cookie = function(name, value, options) {

      if (typeof value !== 'undefined') {

        options = options || {};

        if (value === null) {
          value = '';
          options.expires = -1;
        }

        var expires = '';

        if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {

          var date;

          if (typeof options.expires === 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
          } else {
            date = options.expires;
          }

          expires = '; expires=' + date.toUTCString();

        }

        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';

        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');

      } else {

        var cookieValue = null;

        if (document.cookie && document.cookie !== '') {

          var cookies = document.cookie.split(';');

          for (var i = 0; i < cookies.length; i++) {

            var cookie = cookies[i].replace(/^(\s|\u00A0)+/g, '');

            if (cookie.substring(0, name.length + 1) === name + '=') {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }

          }

        }

        return cookieValue;

      }

    };

    /**
     * Make userdata shot
     * @api public
     */

    this.push = function() {

      var ref  = unescape(document.referrer) || null;
      var q    = getSearch() || null;
      var vars = getVariables() || null;
      var app  = getApp(1);
      var os   = getOS();
      var date = getDate();

      // parse params to request array
      req.array.pageUrl = unescape(window.location.href);

      // get referrer
      if (ref) {
        req.array.pageRef = ref;
      }

      // search machine query
      if (q) {
        req.array.pageQ = q;
      }

      // cookies
      if (document.cookie && document.cookie !== '') {
        req.array.pageCc = document.cookie.replace(/(\s|\u00A0)+/g, '');
      }

      // parsing url params
      if (vars) {
        for (var v in vars) {
          if (vars.hasOwnProperty(v)) {
            req.array.pageVars[v] = vars[v];
          }
        }
      }

      // browser name
      req.array.appName = app[0];

      // browser version
      req.array.appVers = (parseFloat(app[1] + '.' + app[2])) || 'undefined';

      // language
      req.array.appLang = (navigator.language || navigator.systemLanguage || navigator.userLanguage).substr(0, 2).toLowerCase();

      // OS name
      req.array.osName = os[0];

      // OS version
      req.array.osVers = os[1];

      // date & time
      req.array.t  = date[0] + ' ' + date[1];

      // time zone UTC+X
      req.array.tz = date[2];

      // screen resolution
      req.array.screen = getScreen();

      // site ID
      req.array.sid = options.sid || null;

      if (cookie('__ghostUserID')) {

        // user ID to self if defined
        req.array.uid = cookie('__ghostUserID');

      } else {

        // set new user ID session
        req.array.uid = [
          (new Date()).valueOf(),
          (Math.random() * 1000000000).toFixed()
        ].join('');

        cookie('__ghostUserID', req.array.uid, { path : window.location.pathname });

      }

      // create request string from array
      for (var e in req.array) {
        if (req.array.hasOwnProperty(e)) {
          req.str += (escape(e) + '=' + escape(req.array[e]) + '&');
        }
      }

      req.str = req.str.substr(0, req.str.length - 1);

      // set date & time cookies
      if (!cookie('__ghostFirstVisit')) {
        cookie('__ghostFirstVisit', req.array.t, { path : window.location.pathname });
      }
      cookie('__ghostLastVisit', req.array.t, { path : window.location.pathname });

      // send parsed params
      send(req.path, req.str);

    };

    /**
     * Push data with initialize
     */

    this.push();

  }

  /**
   * Example ghost creator
   */

  function Creator(options) {

    options = options || {};
    return new Ghost(options);

  }

  /**
   * Module exports
   */

  window.ghost = Creator;

}();
