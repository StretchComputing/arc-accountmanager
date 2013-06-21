var EXELON = (function (r, $) {
  'use strict';


  var storage = {
    interval: 15 * 60 * 1000, // Fifteen minutes.

    reset: function () {
      try {
        RSKYBOX.log.info('entering', 'storage.reset');

        this.clear();
        sessionStorage.setItem('expires', JSON.stringify(new Date(Date.now() + this.interval)));
      } catch (e) {
        RSKYBOX.log.error(e, 'storage.reset');
      }
    },

    clear: function () {
      try {
        RSKYBOX.log.info('entering', 'storage.clear');

        sessionStorage.clear();
      } catch (e) {
        RSKYBOX.log.error(e, 'storage.clear');
      }
    },

    isStale: function () {
      try {
        var expires = Date.parse(JSON.parse(sessionStorage.getItem('expires')));

        if (Date.now() > expires) {
          RSKYBOX.log.info('session is stale', 'storage.isStale');
          this.reset();
          return true;
        }
        return false;
      } catch (e) {
        RSKYBOX.log.error(e, 'storage.isStale');
      }
    },

    setFetching: function (item) {
      try {
        RSKYBOX.log.info(item, 'storage.setFetching');

        sessionStorage.setItem(item, 'fetching');
      } catch (e) {
        RSKYBOX.log.error(e, 'storage.setFetching');
      }
    },

    isFetching: function (item) {
      try {
        RSKYBOX.log.info(item, 'storage.isFetching');

        return sessionStorage.getItem(item) === 'fetching';
      } catch (e) {
        RSKYBOX.log.error(e, 'storage.isFetching');
      }
    },

    setItem: function (item, value) {
      try {
        RSKYBOX.log.info(item, 'storage.setItem');

        this.isStale();
        sessionStorage.setItem(item, JSON.stringify(value));
      } catch (e) {
        RSKYBOX.log.error(e, 'storage.setItem');
      }
    },

    getItem: function (item) {
      try {
        var results;
        RSKYBOX.log.info(item, 'storage.getItem');

        if (this.isStale()) { return false; }

        results = JSON.parse(sessionStorage.getItem(item));
        if (!results || results === '' || results === 'fetching') {
          return false;
        }
        return results;
      } catch (e) {
        RSKYBOX.log.error(e, 'storage.getItem');
      }
    },
  };


  r.session = r.session || {
    keys: {
      applications: 'applications',
      currentUser: 'currentUser',
      mobileCarriers: 'mobileCarriers',
    },

    getEntity: function (key) {
      try {
        RSKYBOX.log.info(key, 'session.getEntity');

        if (storage.isFetching(key)) {
          return false;
        }

        return storage.getItem(key);
      } catch (e) {
        RSKYBOX.log.error(e, 'session.getEntity');
      }
    },

    getModel: function (key, model) {
      try {
        var cache;
        RSKYBOX.log.info(key, 'session.getModel');

        if (storage.isFetching(key)) {
          return model;
        }

        cache = storage.getItem(key);
        if (!cache) {
          storage.setFetching(key);
          model.fetch({
            success: function (fetched) {
              storage.setItem(key, fetched);
            },
            statusCode: r.statusCodeHandlers(),
          });
        } else {
          RSKYBOX.log.info('cacheHit', 'session.getModel');
          model.set(cache);
        }

        return model;
      } catch (e) {
        RSKYBOX.log.error(e, 'session.getModel');
      }
    },

    getCollection: function (key, collection) {
      try {
        var cache;
        RSKYBOX.log.info(key, 'session.getCollection');

        if (storage.isFetching(key)) {
          return collection;
        }

        cache = storage.getItem(key);
        if (!cache) {
          storage.setFetching(key);
          collection.reset();
          collection.fetch({
            success: function (fetched) {
              storage.setItem(key, fetched);
            },
            statusCode: r.statusCodeHandlers(),
          });
        } else {
          RSKYBOX.log.info('cacheHit', 'session.getCollection');
          collection.reset(cache);
        }

        return collection;
      } catch (e) {
        RSKYBOX.log.error(e, 'session.getCollection');
      }
    },

    reset: function () {
      try {
        RSKYBOX.log.info('entering', 'session.reset');

        storage.reset();
      } catch (e) {
        RSKYBOX.log.error(e, 'session.reset');
      }
    },
  };


  try {
    r.session.reset();

    return r;
  } catch (e) {
    RSKYBOX.log.error(e, 'EXELON.session.reset');
  }
}(EXELON || {}, jQuery));

