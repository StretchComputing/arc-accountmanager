var ARC = (function (r, $) {
  'use strict';


  r.store = {
    clear: function () {
      try {
        RSKYBOX.log.info('entering', 'store.clear');

        localStorage.clear();
      } catch (e) {
        RSKYBOX.log.error(e, 'store.setItem');
      }
    },

    setItem: function (item, value) {
      try {
        RSKYBOX.log.info(item, 'store.setItem');

        localStorage.setItem(item, JSON.stringify(value));
      } catch (e) {
        RSKYBOX.log.error(e, 'store.setItem');
      }
    },

    getItem: function (item, isLoggingDisabled) {
      try {
        var results;
        if(!isLoggingDisabled) RSKYBOX.log.info(item, 'store.getItem');

        results = JSON.parse(localStorage.getItem(item));
        if (!results || results === '') {
          return false;
        }
        return results;
      } catch (e) {
        if(!isLoggingDisabled) RSKYBOX.log.error(e, 'store.getItem');
      }
    },

    removeItem: function (item) {
      try {
        RSKYBOX.log.info(item, 'store.removeItem');
        localStorage.removeItem(item);
      } catch (e) {
        RSKYBOX.log.error(e, 'store.removeItem');
      }
    },
  };


  return r;
}(ARC || {}, jQuery));
