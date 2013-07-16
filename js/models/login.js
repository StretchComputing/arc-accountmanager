var EXELON = (function (r, $) {
  'use strict';


  r.Login = r.BaseModel.extend({
    // TODO: for now, the 'inst' is hard coded into the URL -- base class has a setInstUrl() method for setting inst when needed ...
    apiUrl: '/customers/token',

    initialize: function () {
      try {
        this.setUrl();
      } catch (e) {
        RSKYBOX.log.error(e, 'Login.initialize');
      }
    },

    fields: {
      aduser: null,
      password: null
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

    // TODO:: not sure this password validation is useful -- maybe remove it??
    validate: function (attrs) {
      try {
        var password, PASSWORD_MIN_LEN = 6;

        password = attrs.password;
        if ((password && password.length >= PASSWORD_MIN_LEN)) {
          RSKYBOX.log.info('credentials are valid', 'Login.validate');
          return;
        }
        return 'Please use your Active Directory login and password';
      } catch (e) {
        RSKYBOX.log.error(e, 'Login.validate');
      }
    }
  });

  return r;
}(EXELON || {}, jQuery));
