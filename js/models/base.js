var EXELON = (function(r, $) {
  'use strict';

  r.Base = {
    // The REST base portion of the URL, including the version.
    //restUrl: document.URL + 'v1',
    restUrl: 'rest/v1',

    // Sets the model's URL using a base REST url and the API url.
    // If there is an ID, set the urlRoot for use outside of a collection.
    setUrl: function() {
      try {
        var url;

        if (!this.apiUrl) {
          RSKYBOX.log.error('invalid apiUrl', 'r.Base.setUrl');
          this.url = '';
          return false;
        }

        url = this.restUrl + this.apiUrl;
        var theId = this.get('id');
        if (theId) {
          url = url + "/" + theId;
        } else {
          url = url;
        }
        this.url = url;
        RSKYBOX.log.debug("this.url = " + url);
        return true;
      } catch (e) {
        RSKYBOX.log.error(e, "Base.setUrl");
      }
    },

    setInstUrl: function(inst) {
      try {
        var url;

        if (!this.apiUrl || !inst) {
          RSKYBOX.log.error('invalid apiUrl (' + this.apiUrl + ') or inst (' + inst + ')', 'r.Base.setInstUrl');
          this.url = '';
          return false;
        }

        url = this.restUrl + "/" + inst + this.apiUrl;
        if (this.get('id')) {
          this.urlRoot = url;
        } else {
          this.url = url;
        }
        return true;
      } catch (e) {
        RSKYBOX.log.error(e, "Base.setInstUrl");
      }
    }
  };


  r.BaseModelExtended = Backbone.Model.extend(r.Base);


  r.BaseModel = r.BaseModelExtended.extend({
    constructor: function() {
      try {
        Backbone.Model.prototype.constructor.apply(this, arguments);

        // Partial updates are enabled by overriding toJSON. (see toJSON below)
        this.partial = (function() {
          try {
            var fields = {}, partial = {};

            partial.setField = function(field) {
              fields[field] = true;
            };

            partial.getFields = function() {
              return fields;
            };

            partial.clear = function() {
              this.fields = {};
            };

            partial.any = function() {
              try {
                return _.keys(fields).length > 0;
              } catch (e) {
                RSKYBOX.log.error(e, "Base.partial.any");
              }
            };

            // model: the model that's being saved
            // attrs: attributes to be partially updated
            // options: backbone save options, including ajax handlers
            // force: whether or not to proceed with update even if no changes were made
            partial.save = function(model, attrs, options, force) {
              try {
                var proceed = false;

                // Set the fields that have changed.
                _.keys(attrs).forEach(function(key) {
                  if (force || model.get(key) !== attrs[key]) {
                    partial.setField(key);
                    proceed = true;
                  }
                });

                if (proceed) {
                  model.save(attrs, options);
                }
                partial.clear();
              } catch (e) {
                RSKYBOX.log.error(e, "Base.partial.save");
              }
            };

            return partial;
          } catch (e) {
            RSKYBOX.log.error(e, "Base.partial");
          }
        }());
      } catch (e) {
        RSKYBOX.log.error(e, "Base.constructor");
      }
    },

    // Unsets all attributes that are undefined, null, '', or 0 in prepartion
    // for a new model to be saved.
    //
    // !!! This function should be used with caution !!!
    //
    prepareNewModel: function() {
      try {
        if (this.isNew()) {
          _.keys(this.attributes).forEach(function(key) {
            if (!this.get(key)) {
              this.unset(key, {silent: true});
            }
          }, this);
        }
        return this;
      } catch (e) {
        RSKYBOX.log.error(e, "Base.prepareNewModel");
      }
    },

    // Gets a mock object for use in HTML forms. Set up a 'fields' attribute in the model
    // that has all the form/model fields in order to use this method.
    getMock: function() {
      try {
        var field, mock = {};

        if (!this.fields) {
          RSKYBOX.log.error('No fields defined for model', 'BaseModel.getMock');
          return;
        }

        var that = this;
        $.each(this.fields, function(key, value) {
          var fieldValue = that.get(key);
          if (typeof fieldValue == 'undefined') {fieldValue == null;}
          mock[key] = fieldValue;
        });
//        _.keys(this.fields).forEach(function (field) {
//          mock[field] = this.get(field) || null;
//          }, this);

        return mock;
      } catch (e) {
        RSKYBOX.log.error(e, "Base.getMock");
      }
    },

    isFieldBeingUpdated: function(field) {
      try {
        return field && (!this.partial.any() || this.partial.getFields()[field]);
      } catch (e) {
        RSKYBOX.log.error(e, "Base.isFieldBeingUpdated");
      }
    },

    // Partial updates work because we intercept toJSON when we want to work with
    // a subset of fields from the model.
    toJSON: function() {
      try {
        var json = {};

        if (this.partial.any()) {
          _.keys(this.partial.getFields()).forEach(function(field) {
            json[field] = this.get(field);
          }, this);
          return json;
        }

        // This is the exact line from backbone's toJSON method.
        return _.clone(this.attributes);
      } catch (e) {
        RSKYBOX.log.error(e, "Base.toJSON");
      }
    }
  });


  r.BaseCollection = Backbone.Collection.extend(r.Base);


  return r;
}(EXELON || {}, jQuery));
