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
        	r.getMerchants();
        else
        	r.writeMerchantList($('#homeContent'), r.merchantList);
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeShow');
      }
    },
    
    homeHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.homeHide');
    		$('#homeContent').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.homeHide');
    	}
    },
    
    editMerchantShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantShow');
    		var content = $('#editMerchantContent');
    		var merchant;
    		
    		if(!r.merchantToEdit)
    			r.merchantToEdit = { newMerchant : true};
    		
    		merchant = r.merchantToEdit;
    		
    		var list = $('<ul />', { 'data-role' : "listview",
    								 'id' : 'editMerchantForm'});
    		for(var i = 0; i < MERCHANT.merchantDisplay.length; i++){
    			var input = MERCHANT.merchantDisplay[i];
    			var li = $('<li />');
    			var label = $('<label />', { 'for' : "editMerchant"+input.propName,
    										 'text' : input.displayText });
    			
    			var inputTag;
    			if(input.inputType === "select"){
    				inputTag = $('<select />',  { 'id' : "editMerchant" + input.propName });
    				for(var j = 0; j < input.options.length; j++){
    					var optOptions = {};
    					if(input.options[j] === merchant[input.propName]){
    						optOptions.selected = 'selected';
    					}
    					optOptions.text = input.options[j];
    					inputTag.append($('<option />', optOptions));
    				}
    			}
    			
    			else{
    				var inputOpts = {};
    				inputOpts.name = input.propName;
    				inputOpts.id = 'editMerchant' + input.propName;
    				inputOpts.type = input.inputType;
        			if(input.required)
        				inputOpts.required = 'required';
        			if(input.inputType === 'checkbox'){
        				if(merchant[input.propName])
        					 inputOpts.checked = 'checked';
        			}
        			else{
        				if(merchant[input.propName]){
        					inputOpts.value = merchant[input.propName];
        				}
        					
        			}
        			inputTag = $('<input />', inputOpts);
    			}
    			li.append(label);
    			li.append(inputTag);
    			list.append(li);
    		}
    		var li = $('<li />');
    		
    		var submit = $('<button />', {id : 'editMerchantSubmit',
    									  text : 'Submit'});
    		submit.bind('click', function(e){
    			var form = $('#editMerchantForm :input');
    			var merchant = r.merchantToEdit;
    			for(var i = 0; i < form.length; i++){
    				if(form[i].type === 'checkbox'){
    					merchant[form[i].name] = ( (form[i].value === 'on') ? true : false);
    				}
    				else{
    					merchant[form[i].name] = form[i].value;
    				}
    			}
    			if(merchant.newMerchant){
    				r.merchantList.push(merchant);
    				delete merchant.newMerchant;
    			}
    			//TODO:Send edit to server
    			$.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
    		});
    		li.append(submit);
    		
    		var cancel = $('<button />', {id : 'editMerchantCancel',
    									  text : 'Cancel'});
    		cancel.bind('click', function(){
    			$.mobile.changePage("#home", {transition: "slideup", changeHash : true});
    		});
    		li.append(cancel);
    		
    		list.append(li);
    		
    		content.append(list);
    		
    		content.trigger('create');
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantShow');
    	}
    },
    
    editMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantHide');
    		r.merchantToEdit = undefined;
    		$('#editMerchantContent').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantHide');
    	}
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
                    	var homeContent = $('#homeContent');
                    	r.merchantList = data.Results;
                    	r.writeMerchantList(homeContent, r.merchantList);
                    	var jtest = 5;
                    } catch (e) {
                      RSKYBOX.log.error(e, 'getMerchants.success');
                    }
                  }
      });
    } catch (e) {
      RSKYBOX.log.error(e, 'getMerchants');
    }
  };
  
  r.writeMerchantList = function(location, list){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.writeMerchantList');
		  var set = $('<ul />', { 'data-role' : "listview"});
		  for(var i = 0; i <list.length; i++){
			  var collapseli = $('<li />');

			  var col = $('<div />', { 'data-role' : "collapsible"});
			  collapseli.append(col);

			  col.prepend($('<h3 />', {text : list[i].Name}));

			  var ul = $('<ul />', { 'data-role' : "listview"});
			  col.append(ul);

			  var button = $('<button />', { 'text' : 'Choose',
				  'id'   : 'homeChoose' + list[i].Name,
				  'name' : list[i].Name });
			  /*Register event handler for this button*/
			  button.bind('click', function(e){
				  var name = $(this).attr('name');
				  r.activeMerchant = r.getMerchantByName(name);
				  /*Some page transition*/
			  });

			  ul.append(button);
			  button = $('<button />', { 'text' : 'Edit',
				  'id'   : 'homeEdit' + list[i].Name,
				  'name' : list[i].Name });
			  button.bind('click', function(e){
				  var name = $(this).attr('name');
				  r.merchantToEdit = r.getMerchantByName(name);
				  $.mobile.changePage( "#editMerchant", { transition: "slideup", changeHash: true });
			  });
			  ul.append(button);

			  ul.append($('<li />', { 'data-role' : "list-divider",
				  'text' : 'Information'}));

			  /*Add all the properties from list[i] to the list*/
			  for (var j=0; j < MERCHANT.merchantDisplay.length; j++){
				  var val;
				  if(!(val = list[i][MERCHANT.merchantDisplay[j].propName]))
					  val = "";
				  var li = $('<li />', {text : MERCHANT.merchantDisplay[j].displayText + ': ' + val});
				  ul.append(li);
			  }
			  set.append(collapseli);
		  }
		  var button = $('<button />', { 'text' : 'Add New',
			  'id'   : 'merchantListAddNew',
			  'name' : 'addNew'});
		  /*Add event handlers to button?*/
		  button.bind('click', function(){
			  $.mobile.changePage('#editMerchant', {transition: "slideup", changeHash: true});
		  });
		  
		  set.append(button);
		  location.append(set);
		  location.trigger('create');
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
      { '#configure':            { handler: 'configureBeforeCreate',  events: 'bc'  } },
      { '#configure':            { handler: 'configureInit',    events: 'i'  } },
      { '#configure':            { handler: 'configureShow',    events: 's'   } }
    ], r.controller);
  } catch (e) {
    RSKYBOX.log.error(e, 'EXELON.main.router');
  }

  return r;
}(EXELON || {}, jQuery));
