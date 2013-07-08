var EXELON = (function (r, $) {
  'use strict';

  r.controller = {

    // Check if the user is logged in
    isLoggedIn: function (eventType, matchObj, ui, page, evt) {
      try {
        RSKYBOX.log.info('entering', 'main.js.isLoggedIn');

        // Theoretically, don't need to prevent default just to reroute a request, but could not get
        // this method to work without it.  Without it, it would just endlessly display loading indicator.
        evt.preventDefault();

        var authHeader = r.getAuthorizationHeader();
        if(authHeader.length > 0) {
          // token is valid, no need to log in, re-route to the home screen
          ui.toPage = $('#home');
        }

        // MUST be called when e.preventDefault() is called.
        ui.bCDeferred.resolve();

      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.isLoggedIn');
      }
    },

    // Login
    loginBeforeShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.loginBeforeShow');

        if (r.loginView) {
          r.loginView.undelegateEvents();
          delete r.loginView;
        }
        r.loginView = new r.LoginView({
          el: $('#loginForm'),
          model: new r.Login(),
        });
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.loginBeforeShow');
      }
    },

    loginShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.loginShow');
        r.loginView.render();
        r.flash.check();
      
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.loginShow');
      }
    },
    
    // Home Screen
    homeBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeBeforeCreate');
        r.attachPanel("home");
        /*put in the elements from the 'current customer' object*/
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeBeforeCreate');
      }
    },

    homeInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeInit');
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeInit');
      }
    },

    homeShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeShow');
        if(!r.merchantList)
<<<<<<< HEAD
          r.getMerchants();
        else
          r.writeMerchantList($('#merchantListCollapsible'), r.merchantList);
=======
        	r.getMerchants();
        else
        	r.writeMerchantList($('#merchantListCollapsible'), r.merchantList);
>>>>>>> master
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeShow');
      }
    },
    
    homeHide: function(){
<<<<<<< HEAD
      try{
        RSKYBOX.log.info('entering', 'main.js.homeHide');
        var toClear = $('#merchantListCollapsible');
        toClear.empty(); /*Remove all old html in the list*/
      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.homeHide');
      }
    },
    
    editMerchantShow: function(){
      try{
        RSKYBOX.log.info('entering', 'main.js.editMerchantShow');
        
        var merchant = r.merchantToEdit;
        
        /*Modify the Header*/
        var head = $('#editMerchantHead').text('Editing ' + merchant.Name);
        
        /*Modify the body*/
        var content = $('#editMerchantContent');
        
        merchant.pageIdPrefix = "editMerchant";//Used in the template call
        merchant.index = 0; //Also used in the template call
        var editMerchantTemplate = _.template($('#editMerchantForm').html());
        
        content.append(editMerchantTemplate(merchant));
      
        var addNewPoc = $('#pocAddNew');
        
        /*Register all the delete button handlers*/
        for(var i = 0; i < merchant.index; i++){
          r.registerDelete('editMerchant',i);
        };
        
        addNewPoc.bind('click', function(e){
          var pocTemplate = _.template($('#decisionMakerForm').html());
          $('#editMerchantPocList').append(pocTemplate({FirstName : "", LastName : "", 
                                      Phone : "", Position : "", eMail : "", index : merchant.index,
                                      pageIdPrefix : merchant.pageIdPrefix}));
          $('#editMerchantPocList').trigger('create');
          
          r.registerDelete('editMerchant',merchant.index);
          
        });
        
        var save = $('#editMerchantSave');

        save.bind('click', function(e){
          var form = $('#editMerchantList :input');
          var merchant = r.merchantToEdit;
          
          for(var i = 0; i < form.length; i++){//Update the regular properties
            
            if(form[i].type === 'checkbox'){
              merchant[form[i].name] = ( (form[i].value === 'on') ? true : false);
            }
            else{
              merchant[form[i].name] = form[i].value;
            }
            
          }
          var pocForm = $('div[formType]');//Select all with a custom attribute defined in the template
          var pocList = [];
          for(var i = 0; i < pocForm.length; i++){
            var inputs = $(':input',pocForm[i]);
            var poc = {};
            for(var j = 0; j < inputs.length; j++){
              poc[inputs[j].getAttribute('pocProp')] = inputs[j].value;
            }
            pocList.push(poc);
          }
          merchant.DecisionMakers = pocList;
          
          r.updateMerchant(merchant);//Send to server
          $.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
        });
        

        
        content.trigger('create');//Add jquery mobile styling to elements
        
      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.editMerchantShow');
      }
    },
    
    editMerchantHide: function(){
      try{
        RSKYBOX.log.info('entering', 'main.js.editMerchantHide');
        $('#editMerchantContent').empty();
        delete r.merchantToEdit.index;
        delete r.merchantToEdit.pageIdPrefix;
      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.editMerchantHide');
      }
    },

    createNewMerchantShow : function(){
      try{
        RSKYBOX.log.info('entering', 'main.js.createNewMerchantShow');

        var merchant = {};
        r.fixMerchants([merchant]);//create the necessary properties

        /*Modify the body*/
        var content = $('#createNewMerchantContent');

        merchant.pageIdPrefix = "createNewMerchant";//Used for template
        var editMerchantTemplate = _.template($('#editMerchantForm').html());
        
        
         merchant.pageIdPrefix = "createNewMerchant";//Used in the template call
         merchant.index = 0; //Also used in the template call
         var editMerchantTemplate = _.template($('#editMerchantForm').html());

         content.append(editMerchantTemplate(merchant));

         var addNewPoc = $('#pocAddNew');

         /*Register all the delete button handlers*/
         for(var i = 0; i < merchant.index; i++){
           r.registerDelete('createNewMerchant',i);
         };

         addNewPoc.bind('click', function(e){
           var pocTemplate = _.template($('#decisionMakerForm').html());
           $('#createNewMerchantPocList').append(pocTemplate({FirstName : "", LastName : "", 
             Phone : "", Position : "", eMail : "", index : merchant.index,
             pageIdPrefix : merchant.pageIdPrefix}));
           $('#createNewMerchantPocList').trigger('create');

           r.registerDelete('createNewMerchant',merchant.index);

         });
        
        var save = $('#createNewMerchantSave');

        save.bind('click', function(e){
          var form = $('#createNewMerchantList :input');
          for(var i = 0; i < form.length; i++){
            if(form[i].type === 'checkbox'){
              merchant[form[i].name] = ( (form[i].value === 'on') ? true : false);
            }
            else{
              merchant[form[i].name] = form[i].value;
            }
          }
          
          var pocForm = $('div[formType]');//Select all with a custom attribute defined in the template
          var pocList = [];
          for(var i = 0; i < pocForm.length; i++){
            var inputs = $(':input',pocForm[i]);
            var poc = {};
            for(var j = 0; j < inputs.length; j++){
              poc[inputs[j].getAttribute('pocProp')] = inputs[j].value;
            }
            pocList.push(poc);
          }
          merchant.DecisionMakers = pocList;

          r.createMerchant(merchant);
          r.merchantList.push(merchant);
          
          $.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
        });

        content.trigger('create');

      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.createNewMerchantShow');
      }
    },
    
    createNewMerchantHide: function(){
      try{
        RSKYBOX.log.info('entering', 'main.js.createNewMerchantHide');
        $('#createNewMerchantContent').empty();
      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.createNewMerchantHide');
      }
=======
    	try{
    		RSKYBOX.log.info('entering', 'main.js.homeHide');
    		var toClear = $('#merchantListCollapsible');
    		toClear.empty(); /*Remove all old html in the list*/
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.homeHide');
    	}
    },
    
    editMerchantShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantShow');
    		
    		var merchant = r.merchantToEdit;
    		
    		/*Modify the Header*/
    		var head = $('#editMerchantHead').text('Editing ' + merchant.Name);
    		
    		/*Modify the body*/
    		var content = $('#editMerchantContent');
    		
    		merchant.pageIdPrefix = "editMerchant";//Used in the template call
    		merchant.index = 0; //Also used in the template call
    		var editMerchantTemplate = _.template($('#editMerchantForm').html());
    		
    		content.append(editMerchantTemplate(merchant));
    	
    		var addNewPoc = $('#pocAddNew');
    		
    		/*Register all the delete button handlers*/
    		for(var i = 0; i < merchant.index; i++){
    			r.registerDelete('editMerchant',i);
    		};
    		
    		addNewPoc.bind('click', function(e){
    			var pocTemplate = _.template($('#decisionMakerForm').html());
    			$('#editMerchantPocList').append(pocTemplate({FirstName : "", LastName : "", 
			  	  	   										  Phone : "", Position : "", eMail : "", index : merchant.index,
			  	  	   										  pageIdPrefix : merchant.pageIdPrefix}));
    			$('#editMerchantPocList').trigger('create');
    			
    			r.registerDelete('editMerchant',merchant.index);
    			
    		});
    		
    		var save = $('#editMerchantSave');

    		save.bind('click', function(e){
    			var form = $('#editMerchantList :input');
    			var merchant = r.merchantToEdit;
    			
    			for(var i = 0; i < form.length; i++){//Update the regular properties
    				
    				if(form[i].type === 'checkbox'){
    					merchant[form[i].name] = ( (form[i].value === 'on') ? true : false);
    				}
    				else{
    					merchant[form[i].name] = form[i].value;
    				}
    				
    			}
    			var pocForm = $('div[formType]');//Select all with a custom attribute defined in the template
    			var pocList = [];
    			for(var i = 0; i < pocForm.length; i++){
    				var inputs = $(':input',pocForm[i]);
    				var poc = {};
    				for(var j = 0; j < inputs.length; j++){
    					poc[inputs[j].getAttribute('pocProp')] = inputs[j].value;
    				}
    				pocList.push(poc);
    			}
    			merchant.DecisionMakers = pocList;
    			
    			r.updateMerchant(merchant);//Send to server
    			$.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
    		});
    		

    		
    		content.trigger('create');//Add jquery mobile styling to elements
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantShow');
    	}
    },
    
    editMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantHide');
    		$('#editMerchantContent').empty();
    		delete r.merchantToEdit.index;
    		delete r.merchantToEdit.pageIdPrefix;
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantHide');
    	}
    },

    createNewMerchantShow : function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantShow');

    		var merchant = {};
    		r.fixMerchants([merchant]);//create the necessary properties

    		/*Modify the body*/
    		var content = $('#createNewMerchantContent');

    		merchant.pageIdPrefix = "createNewMerchant";//Used for template
    		var editMerchantTemplate = _.template($('#editMerchantForm').html());
    		
    		
    		 merchant.pageIdPrefix = "createNewMerchant";//Used in the template call
    		 merchant.index = 0; //Also used in the template call
    		 var editMerchantTemplate = _.template($('#editMerchantForm').html());

    		 content.append(editMerchantTemplate(merchant));

    		 var addNewPoc = $('#pocAddNew');

    		 /*Register all the delete button handlers*/
    		 for(var i = 0; i < merchant.index; i++){
    			 r.registerDelete('createNewMerchant',i);
    		 };

    		 addNewPoc.bind('click', function(e){
    			 var pocTemplate = _.template($('#decisionMakerForm').html());
    			 $('#createNewMerchantPocList').append(pocTemplate({FirstName : "", LastName : "", 
    				 Phone : "", Position : "", eMail : "", index : merchant.index,
    				 pageIdPrefix : merchant.pageIdPrefix}));
    			 $('#createNewMerchantPocList').trigger('create');

    			 r.registerDelete('createNewMerchant',merchant.index);

    		 });
    		
    		var save = $('#createNewMerchantSave');

    		save.bind('click', function(e){
    			var form = $('#createNewMerchantList :input');
    			for(var i = 0; i < form.length; i++){
    				if(form[i].type === 'checkbox'){
    					merchant[form[i].name] = ( (form[i].value === 'on') ? true : false);
    				}
    				else{
    					merchant[form[i].name] = form[i].value;
    				}
    			}
    			
    			var pocForm = $('div[formType]');//Select all with a custom attribute defined in the template
    			var pocList = [];
    			for(var i = 0; i < pocForm.length; i++){
    				var inputs = $(':input',pocForm[i]);
    				var poc = {};
    				for(var j = 0; j < inputs.length; j++){
    					poc[inputs[j].getAttribute('pocProp')] = inputs[j].value;
    				}
    				pocList.push(poc);
    			}
    			merchant.DecisionMakers = pocList;

    			r.createMerchant(merchant);
    			r.merchantList.push(merchant);
    			
    			$.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
    		});

    		content.trigger('create');

    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantShow');
    	}
    },
    
    createNewMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantHide');
    		$('#createNewMerchantContent').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantHide');
    	}
>>>>>>> master
    },
    
    /*Merchant Display Screen (displays information about the active merchant*/
    merchantDisplayBeforeCreate: function (){
<<<<<<< HEAD
      try{
        RSKYBOX.log.info('entering', 'main.js.merchantDisplayBeforeCreate');
        r.attachPanel("merchantDisplay");
      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.merchantDisplayBeforeCreate');
      }
    },
    
    merchantDisplayShow: function(){
      try{
        RSKYBOX.log.info('entering', 'main.js.merchantDisplayShow');
        var content = $('#merchantDisplayContent');
        var template = _.template($('#merchantDisplayContentTemplate').html());
        
        content.append(template(r.activeMerchant));
        
        $('#merchantDisplayEdit').bind('click', function(e){
          r.merchantToEdit = r.activeMerchant;
          $.mobile.changePage("#editMerchant", { transition: "slideup", changeHash: true });
        });
        
        $('#merchantDisplayCommentSave').bind('click', function(e){
          var textArea = $('#merchantDisplayCommentTextArea');
          var newComment = { UserName : r.getUserName(),
             'Date' : (new Date()).toJSON(),
             Comment : textArea.prop('value') };
          r.activeMerchant.Comments.push(newComment);
          textArea.prop('value', "");
          $('#merchantDisplayCommentPopup').popup('close');
          
          var commentTemplate = _.template($('#commentDisplayTemplate').html())
          $('#merchantDisplayCommentsDisplay').prepend(commentTemplate(newComment));
          $('#merchantDisplayCommentsDisplay').trigger('create');
        });
        
        $('#merchantDisplayCommentCancel').bind('click', function(e){
          $('#merchantDisplayCommentTextArea').prop('value', "");
          $('#merchantDisplayCommentPopup').popup('close');
        });
        
        content.trigger('create');
        
      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.merchantDisplayShow');
      }
    },
    
    merchantDisplayHide: function(){
      try{
        RSKYBOX.log.info('entering', 'main.js.merchantDisplayHide');
        $('#merchantDisplayContent').empty();
      }
      catch(e){
        RSKYBOX.log.error(e, 'main.js.merchantDisplayHide');
      }
=======
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayBeforeCreate');
    		r.attachPanel("merchantDisplay");
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayBeforeCreate');
    	}
    },
    
    merchantDisplayShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayShow');
    		var content = $('#merchantDisplayContent');
    		var template = _.template($('#merchantDisplayContentTemplate').html());
    		
    		content.append(template(r.activeMerchant));
    		
    		$('#merchantDisplayEdit').bind('click', function(e){
    			r.merchantToEdit = r.activeMerchant;
    			$.mobile.changePage("#editMerchant", { transition: "slideup", changeHash: true });
    		});
    		
    		$('#merchantDisplayCommentSave').bind('click', function(e){
    			var textArea = $('#merchantDisplayCommentTextArea');
    			var newComment = { UserName : r.getUserName(),
						 'Date' : (new Date()).toJSON(),
						 Comment : textArea.prop('value') };
    			r.activeMerchant.Comments.push(newComment);
    			textArea.prop('value', "");
    			$('#merchantDisplayCommentPopup').popup('close');
    			
    			var commentTemplate = _.template($('#commentDisplayTemplate').html())
    			$('#merchantDisplayCommentsDisplay').prepend(commentTemplate(newComment));
    			$('#merchantDisplayCommentsDisplay').trigger('create');
    		});
    		
    		$('#merchantDisplayCommentCancel').bind('click', function(e){
    			$('#merchantDisplayCommentTextArea').prop('value', "");
    			$('#merchantDisplayCommentPopup').popup('close');
    		});
    		
    		content.trigger('create');
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayShow');
    	}
    },
    
    merchantDisplayHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayHide');
    		$('#merchantDisplayContent').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayHide');
    	}
>>>>>>> master
    },

    // Configure Screen
    configureBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.configureBeforeCreate');
        r.attachPanel("configure");
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.configureBeforeCreate');
      }
    },

    configureInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.configureInit');
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.configureInit');
      }
    },

    configureShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.configureShow');
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.configureShow');
      }
    },

    flashCheck: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.flashCheck');
        r.flash.check();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.flashCheck');
      }
    }

  };

  r.refreshHome = function() {
      try {
        RSKYBOX.log.info('entering', 'main.js.refreshHome');

        $.mobile.showPageLoadingMsg();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.refreshHome');
      }
  };

  r.unauthorized = function() {
      try {
        RSKYBOX.log.info('entering', 'main.js.unauthorized');
        r.logOut();
        if($.mobile.activePage.is('#login')) {
          r.flash.error('Authentication failed, please try again');
          // clear the password field
          $('#password').val("");
        } else {
          r.flash.set('warning', 'Your session ended, please login');
          $.mobile.changePage( "#login", { transition: "slideup", changeHash: false });
        }
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.unauthorized');
      }
  };

  r.attachPanel = function(pageName) {
    try {
      RSKYBOX.log.info('entering', 'main.js.attachPanel');
      // attach panel -- built via template
      var template = _.template($('#leftPanelTemplate').html());
      var content = template({});
      
      // need to make panel ID unique for each JQM page
      content = content.replace("page_leftPanel", pageName+"_leftPanel");
      $('#'+pageName).append(content);

      // set the user name field on the panel
      $('.userName').html(r.getUserName());

    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.attachPanel');
    }
  };
  
  // Define event handlers for panel. Done here so it only happens one time -- when HTML page is loaded
  $(document).on('click', '.logOut', function(){
    try {
      r.logOut();
      $.mobile.changePage( "#login", { transition: "slideup", changeHash: true });
      return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.logOut');
    }
  });

  $(document).on('click', '.home', function(e){
    try {
      if($.mobile.activePage.is('#home')) {
        $('#home_leftPanel').panel("close");
      } else {
        $.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
      }
      return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.home');
    }
  });

  $(document).on('click', '.configure', function(e){
    try {
      if($.mobile.activePage.is('#configure')) {
        $('#configure_leftPanel').panel("close");
      } else {
        $.mobile.changePage( "#configure", { transition: "slideup", changeHash: true });
      }
      return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.configure');
    }
  });

  var devUrl = 'http://dev.dagher.mobi/rest/v1/';
  var prdUrl = 'https://arc.dagher.mobi/rest/v1/';
  r.getMerchants = function() {
    try {
      RSKYBOX.log.info('entering', 'main.js.getMerchants');
      var closeurl = devUrl + 'merchants/list';
      var jsonobj = {};

      $.ajax({
        type: 'search',
        data: JSON.stringify(jsonobj),
        datatype: 'json',
        contenttype: 'application/json',
        url: closeurl,
        statuscode: r.statusCodeHandlers(),
        headers: {'Authorization' : r.getAuthorizationHeader()},
        success: function(data, status, jqXHR) {
                    try {
<<<<<<< HEAD
                      r.merchantList = data.Results;
                      r.fixMerchants(r.merchantList);
                      r.writeMerchantList($('#merchantListCollapsible'), r.merchantList);
                      var jtest = 5;
=======
                    	r.merchantList = data.Results;
                    	r.fixMerchants(r.merchantList);
                    	r.writeMerchantList($('#merchantListCollapsible'), r.merchantList);
                    	var jtest = 5;
>>>>>>> master
                    } catch (e) {
                      RSKYBOX.log.error(e, 'getMerchants.success');
                    }
                  }
      });
    } catch (e) {
      RSKYBOX.log.error(e, 'getMerchants');
    }
  };
  
  /*Makes a call to Merchant Create*/
  r.createMerchant = function(merchant){
<<<<<<< HEAD
  try {
    RSKYBOX.log.info('entering', 'main.js.createMerchant');
    RSKYBOX.log.info('Currently stubbed off:', 'main.js.createMerchant');
    /*
    var closeurl = devUrl + 'merchants/new';
    var jsonobj = cleanMerchant(merchant);
    
    $.ajax({
      type: 'post',
      data: JSON.stringify(jsonobj),
      datatype: 'json',
      contenttype: 'application/json',
      url: closeurl,
      statuscode : r.statusCodeHandlers(),
      success: function(){
        RSKYBOX.log.info('finished', 'main.js.createMerchant');
      }
    });*/
  }  
  catch(e){
    RSKYBOX.log.error(e,'main.js.createMerchant');
  };
  };
  
  r.updateMerchant = function(merchant){
    try{
      RSKYBOX.log.info('entering', 'main.js.updateMerchant');
      RSKYBOX.log.info('Currently stubbed off:', 'main.js.updateMerchant');
      
      /*
      if(merchant.EIN)
        var closeurl = devUrl + merchants/update/ + merchant.EIN;
      else
        return; fail
      
      var jsonobj = cleanMerchant(merchant);
      
      $.ajax({
        type : 'put',
        data : JSON.stringify(jsonobj),
        contenttype : 'application/json',
        url : closeurl,
        statuscode : r.statusCodeHandlers(),
        success : function(){
          RSKYBOX.log.info('finished', 'main.js.updateMerchant');
        }
      });
      */
    }
    catch(e){
      RSKYBOX.log.error(e, 'main.js.updateMerchant');
    }
=======
	try {
		RSKYBOX.log.info('entering', 'main.js.createMerchant');
		RSKYBOX.log.info('Currently stubbed off:', 'main.js.createMerchant');
		/*
		var closeurl = devUrl + 'merchants/new';
		var jsonobj = cleanMerchant(merchant);
		
		$.ajax({
			type: 'post',
			data: JSON.stringify(jsonobj),
			datatype: 'json',
			contenttype: 'application/json',
			url: closeurl,
			statuscode : r.statusCodeHandlers(),
			success: function(){
				RSKYBOX.log.info('finished', 'main.js.createMerchant');
			}
		});*/
	}  
	catch(e){
		RSKYBOX.log.error(e,'main.js.createMerchant');
	};
  };
  
  r.updateMerchant = function(merchant){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.updateMerchant');
		  RSKYBOX.log.info('Currently stubbed off:', 'main.js.updateMerchant');
		  
		  /*
		  if(merchant.EIN)
			  var closeurl = devUrl + merchants/update/ + merchant.EIN;
		  else
			  return; fail
		  
		  var jsonobj = cleanMerchant(merchant);
		  
		  $.ajax({
			  type : 'put',
			  data : JSON.stringify(jsonobj),
			  contenttype : 'application/json',
			  url : closeurl,
			  statuscode : r.statusCodeHandlers(),
			  success : function(){
				  RSKYBOX.log.info('finished', 'main.js.updateMerchant');
			  }
		  });
		  */
	  }
	  catch(e){
		  RSKYBOX.log.error(e, 'main.js.updateMerchant');
	  }
>>>>>>> master
  };
  
  /*Remove all forms equal to "" */
  r.cleanMerchant = function(merchant){
<<<<<<< HEAD
    var newMerchant = {};
    for(var i = 0; i < MERCHANT.merchantDisplay.length; i++){
      var prop = MERCHANT.merchantDisplay[i].propName;
      if(merchant[prop] === "" || merchant[prop] === undefined){
        continue;
      }
      else{
        newMerchant[prop] = merchant[prop];
      }
    }
    return newMerchant;
  };
  
  r.writeMerchantList = function(location, merchantList){
    try{
      RSKYBOX.log.info('entering', 'main.js.writeMerchantList');
      
      var merchantTemplate = _.template($('#collapsibleMercahntList').html());
      
      for(var i = 0; i < merchantList.length; i++){
        merchantList[i].Number = i.toString();
        location.append(merchantTemplate(merchantList[i]));
        delete merchantList[i].Number;
        
        var choose = $('#merchantChoose'+i,location);
        choose.bind('click', function(e){
          var name = $(this).attr('merchantName');
          r.activeMerchant = r.getMerchantByName(name);
          $.mobile.changePage("#merchantDisplay");
        });
        
        var edit = $('#merchantEdit' + i, location);
        edit.bind('click', function(e){
          var name = $(this).attr('merchantName');
          r.merchantToEdit = r.getMerchantByName(name);
          $.mobile.changePage( "#editMerchant", { transition: "slideup", changeHash: true });
        });
      }
      
      $('#homeContent').trigger('create');
    }
    catch(e){
      RSKYBOX.log.error(e,'main.js.writeMerchantList');
    }
  };
  
  r.getMerchantByName = function(name){
    for(var i = 0; i < r.merchantList.length; i++){
      if(name === r.merchantList[i].Name)
        return r.merchantList[i];
    }
  };
  
  r.fixMerchants = function(merchantList){
    var propList = MERCHANT.merchantDisplay;
    for(var merchIndex = 0; merchIndex < merchantList.length; merchIndex++){
      var merchant = merchantList[merchIndex];
      for(var propIndex = 0; propIndex < propList.length; propIndex++){
        var prop = propList[propIndex].propName
        if(merchant[prop] === undefined){
          merchant[prop] = "";
        }
      }
      var elm;
      if( !(merchantList[merchIndex].DecisionMakers))
        merchantList[merchIndex].DecisionMakers = [];
      if( !(merchantList[merchIndex].Comments))
        merchantList[merchIndex].Comments = [];
    }
=======
	  var newMerchant = {};
	  for(var i = 0; i < MERCHANT.merchantDisplay.length; i++){
		  var prop = MERCHANT.merchantDisplay[i].propName;
		  if(merchant[prop] === "" || merchant[prop] === undefined){
			  continue;
		  }
		  else{
			  newMerchant[prop] = merchant[prop];
		  }
	  }
	  return newMerchant;
  };
  
  r.writeMerchantList = function(location, merchantList){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.writeMerchantList');
		  
		  var merchantTemplate = _.template($('#collapsibleMercahntList').html());
		  
		  for(var i = 0; i < merchantList.length; i++){
			  merchantList[i].Number = i.toString();
			  location.append(merchantTemplate(merchantList[i]));
			  delete merchantList[i].Number;
			  
			  var choose = $('#merchantChoose'+i,location);
			  choose.bind('click', function(e){
				  var name = $(this).attr('merchantName');
				  r.activeMerchant = r.getMerchantByName(name);
				  $.mobile.changePage("#merchantDisplay");
			  });
			  
			  var edit = $('#merchantEdit' + i, location);
			  edit.bind('click', function(e){
				  var name = $(this).attr('merchantName');
				  r.merchantToEdit = r.getMerchantByName(name);
				  $.mobile.changePage( "#editMerchant", { transition: "slideup", changeHash: true });
			  });
		  }
		  
		  $('#homeContent').trigger('create');
	  }
	  catch(e){
		  RSKYBOX.log.error(e,'main.js.writeMerchantList');
	  }
  };
  
  r.getMerchantByName = function(name){
	  for(var i = 0; i < r.merchantList.length; i++){
		  if(name === r.merchantList[i].Name)
			  return r.merchantList[i];
	  }
  };
  
  r.fixMerchants = function(merchantList){
	  var propList = MERCHANT.merchantDisplay;
	  for(var merchIndex = 0; merchIndex < merchantList.length; merchIndex++){
		  var merchant = merchantList[merchIndex];
		  for(var propIndex = 0; propIndex < propList.length; propIndex++){
			  var prop = propList[propIndex].propName
			  if(merchant[prop] === undefined){
				  merchant[prop] = "";
			  }
		  }
		  var elm;
		  if( !(merchantList[merchIndex].DecisionMakers))
			  merchantList[merchIndex].DecisionMakers = [];
		  if( !(merchantList[merchIndex].Comments))
			  merchantList[merchIndex].Comments = [];
	  }
>>>>>>> master
  };
  

  // merchants param:  an array of merchant javascript objects to be displayed
  r.displayMerchants = function(merchants) {
    try {
      RSKYBOX.log.info('entering', 'main.js.displayMerchants');

      // Creates the template object from the index.html <script> definition
      var merchantEntryTemplate = _.template($('#merchantEntryTemplate').html());

      var listHtmlContent = "";
      for(var merIndex = 0; merIndex < merchants.length; merIndex++) {
        // Call the template passing the merchant object.  This is where the fields in the merchant object are
        // substituted into the  <%= xyzField  %> constructs in the template. The template returns HTML ready
        // to be placed into the Document Object Model (DOM)
        listHtmlContent += merchantEntryTemplate(merchants[merIndex]);
      }

      // ok, now put the concatenated HTML from the for loop above into the DOM
      $('#merchantList').html(listHtmlContent);
    } catch (e) {
      RSKYBOX.log.error(e, 'displayMerchants');
    }
  };
  
  /*Register handlers for the delete buttons for POC objects given prefix and index*/
  r.registerDelete = function(idPrefix, i){
<<<<<<< HEAD
    var del = $('#'+idPrefix + 'Delete' +i);
    del.bind('click', function(e){
      $('#pocForm'+i).remove();
    });
    $('#'+idPrefix + 'PocList').trigger('create');
=======
		var del = $('#'+idPrefix + 'Delete' +i);
		del.bind('click', function(e){
			$('#pocForm'+i).remove();
		});
		$('#'+idPrefix + 'PocList').trigger('create');
>>>>>>> master
  };

  try {
    r.router = new $.mobile.Router([
      { '.*':                    { handler: 'setupSession',        events: 'bs'  } },
//      { '.*':                    { handler: 'flashCheck',        events: 's'   } },
      { '#login':                { handler: 'isLoggedIn',        events: 'bC', step: 'page' } },
      { '#login':                { handler: 'loginBeforeShow',   events: 'bs'  } },
      { '#login':                { handler: 'loginShow',         events: 's'   } },
      { '#home':                 { handler: 'homeBeforeCreate',  events: 'bc'  } },
      { '#home':                 { handler: 'homeInit',    events: 'i'  } },
      { '#home':                 { handler: 'homeShow',    events: 's'   } },
      { '#home':                 { handler: 'homeHide',    events: 'h'   } },
      { '#editMerchant':         { handler: 'editMerchantShow',     events: 's'} },
      { '#editMerchant':         { handler: 'editMerchantHide',     events: 'h'} },
      { '#createNewMerchant':    { handler: 'createNewMerchantShow', events: 's' } },
      { '#createNewMerchant':    { handler: 'createNewMerchantHide', events: 'h' } },
<<<<<<< HEAD
      { '#merchantDisplay':    { handler: 'merchantDisplayBeforeCreate',  events: 'bc'} },
      { '#merchantDisplay':      { handler: 'merchantDisplayShow',      events: 's' } },
      { '#merchantDisplay':      { handler: 'merchantDisplayHide',      events: 'h' } },
=======
      { '#merchantDisplay':		 { handler: 'merchantDisplayBeforeCreate',  events: 'bc'} },
      { '#merchantDisplay':      { handler: 'merchantDisplayShow',			events: 's' } },
      { '#merchantDisplay':      { handler: 'merchantDisplayHide',			events: 'h' } },
>>>>>>> master
      { '#configure':            { handler: 'configureBeforeCreate',  events: 'bc'  } },
      { '#configure':            { handler: 'configureInit',    events: 'i'  } },
      { '#configure':            { handler: 'configureShow',    events: 's'   } }
    ], r.controller);
  } catch (e) {
    RSKYBOX.log.error(e, 'EXELON.main.router');
  }

  return r;
}(EXELON || {}, jQuery));
