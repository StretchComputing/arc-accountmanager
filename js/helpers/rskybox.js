
var RSKYBOX = (function (r, $) {
  'use strict';

  var
    logLevels = {
      off: 0,
      error: 5,
      warn: 10,
      info: 25,
      debug: 50,
      local: 75
    },


    // The URL for the REST call to create an rSkybox log.
    getUrl = function () {
      try {
        return 'rest/v1/logger';
      } catch (e) {
        window.console.error(e, 'RSKYBOX.log.getUrl');
      }
    },


    // AppActions that go along with a server log.
    appAction = {
      max: 20,
      first: 1,
      key: 'rAppAction',
      indexKey: 'rAppActionIndex',

      getIndex: function () {
        var index = +localStorage[this.indexKey] || this.first;

        if (index > this.max) {
          index = this.first;
        }
        localStorage[this.indexKey] = index + 1;
        return index;
      }
    },

    getAppActions = function () {
      var action, actions = [], i;

      for (i = appAction.first; i <= appAction.max; i += 1) {
        action = localStorage[appAction.key + i];
        if (action) {
          action = JSON.parse(action);
          action.timestamp = new Date(action.timestamp);
          actions.push(action);
        }
      }
      actions.sort(function (a1, a2) {
        if (a1.timestamp < a2.timestamp) {
          return -1;
        }
        if (a1.timestamp > a2.timestamp) {
          return 1;
        }
        return 0;
      });

      for (i = 0; i < actions.length - 1; i += 1) {
        actions[i + 1].duration = actions[i + 1].timestamp - actions[i].timestamp;
      }
      actions[0].duration = -1;

      return actions;
    },

    saveAppAction = function (name, message) {
      var
        key = appAction.key + appAction.getIndex();

      localStorage[key] = JSON.stringify({
        description: name + ': ' + message,
        timestamp: new Date()
      });
    },


    // Log information at the console object provided.
    local = function (console, level, message, name) {
      try {
        var output;

        // Need to do the appAction here because we may be returning just below if there is
        // no console logging enabled.
        if (level === 'info') {
          saveAppAction(name, message);
        }

        // Not defining the console turns off console logging.
        if (!console) { return; }

        // Error level calls usually have an error object in the message parameter.
        // If message is not a string, assume it's an error object. (If it's not
        // stack should be undefined and shouldn't cause a problem.)
        if (typeof message === 'string') {
          output = message + (name ? ' \t(' + name + ')' : '');
        } else {
          output = (name ? name + ' \t' : '') + message.stack;
        }

        switch (level) {
        case 'error':
          console.error(output);
          break;
        case 'warn':
          console.warn(output);
          break;
        case 'info':
          console.info(output);
          break;
        case 'debug':
          console.log('DEBUG ' + output);
          break;
        case 'local':
          console.log('LOCAL ' + output);
          break;
        default:
          console.log(output);
          break;
        }
      } catch (e) {
        window.console.error("Exception = " + e.message);
      }
    },

    // Send JavaScript error to server via API call
    server = function (level, message, name) {
      try {
        // Error level logs generall have an Error object as the message.
        if (level === 'error' && typeof message !== 'string') {
          message = message.stack.split('\n');
        }

        // add user info to the message so we know who is experiencing problems
        var messageHeader = "";
        message = messageHeader + message;

        var attrs = {
            message: message
          };

        $.ajax({
          type: 'POST',
          data: JSON.stringify(attrs),
          url: getUrl(),
          headers: { Authorization: EXELON.getAuthorizationHeader() }
        });
      } catch (e) {
        //window.console.error(e, 'RSKYBOX.log.server');
      }
    },


    // Traffic cop for determining where logs should go.
    base = function (level, message, name) {
      try {
        if (logLevels[level] <= r.log.getLevels().warn) {
          server(level, message, name);
        }

        if (logLevels[level] <= r.log.getLevels().local) {
          local(window.console, level, message, name);
        }
      } catch (e) {
        window.console.error(e, 'RSKYBOX.log.base');
      }
    };
  // end var definitions


  r.log = {
    // Access to the log levels allowing the client to set server/local levels.
    getLevels: function () {
      return logLevels;
    },

    // Externalized logging methods for client app use.

    error: function (e, name) {
      base('error', e, name);
    },

    warn: function (message, name) {
      base('warn', message, name);
    },

    info: function (message, name) {
      base('info', message, name);
    },

    debug: function (message, name) {
      base('debug', message, name);
    }

    //local: function (message, name) {
     // base('local', message, name);
    //},
  };


  return r;
}(RSKYBOX || {}, jQuery));
