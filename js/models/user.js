var ARC = (function (r, $) {
  'use strict';


  r.User = r.BaseModel.extend({
    apiUrl: '/users',
    fields: {
      Id: null,
      eMail: null,
      ArcNumber: null
    },

    initialize: function () {
      try {
        this.setUrl();
      } catch (e) {
        RSKYBOX.log.error(e, 'User.initialize');
      }
    },

    isConfirmCodeValid: function (code) {
      try {
        var CODE_LEN = 3;

        return code && code.length === CODE_LEN;
      } catch (e) {
        RSKYBOX.log.error(e, 'User.isConfirmCodeValid');
      }
    },

    isPasswordValid: function (password) {
      try {
        var PASSWORD_MIN_LEN = 6;

        return password && password.length >= PASSWORD_MIN_LEN;
      } catch (e) {
        RSKYBOX.log.error(e, 'User.isPasswordValid');
      }
    },

    isPhoneValid: function (phone, carrier) {
      try {
        return r.isValidPhoneNumber(phone) && carrier;
      } catch (e) {
        RSKYBOX.log.error(e, 'User.isPhoneValid');
      }
    },

    isEmailValid: function (email) {
      try {
        return r.isValidEmailAddress(email);
      } catch (e) {
        RSKYBOX.log.error(e, 'User.isEmailValid');
      }
    },
  });


  return r;
}(ARC || {}, jQuery));
