var ARC = (function (r, $) {
  'use strict';

  r.Login = r.BaseModel.extend({
    apiUrl: '/customers/token',

    initialize: function () {
      try {
        this.setUrl();
      } catch (e) {
        RSKYBOX.log.error(e, 'Login.initialize');
      }
    },

    fields: {
      Login: null,
      Password: null
    },

    getQueryObject: function () {
      try {
        return {
          Login: this.get('Login') || '',
          Password: this.get('Password')
        };
      } catch (e) {
        RSKYBOX.log.error(e, 'Login.getQueryObject');
      }
    },

    validate: function (attrs) {
      try {
        return;
      } catch (e) {
        RSKYBOX.log.error(e, 'Login.validate');
      }
    }
  });

  return r;
}(ARC || {}, jQuery));
