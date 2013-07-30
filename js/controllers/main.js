var baseUrl = 'http://dev.dagher.mobi/rest/v1/';  // dev environment
//var baseUrl = 'https://arc.dagher.mobi/rest/v1/';   // prod environment
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
          // token is valid, no need to log in, re-route to the selectMerchant screen
          ui.toPage = $('#selectMerchant');
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
    
    // selectMerchant Screen
    selectMerchantBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.selectMerchantBeforeCreate');
        r.attachMeeting("selectMerchant");
        
        /*Global operations*/
        $.mobile.popup.prototype.options.history = false;
        
        
        /*Operations specifically for the selectMerchant page*/
        var template = _.template($('#selectMerchantSidebarTemplate').html());
        
        $('#selectMerchant').append(template({UserName: r.getUserName(),
        									  versionNum : r.versionNum}));
        
        $("#selectMerchantSearch").bind('click', function(e){
        	$("#selectMerchantList").prev("form.ui-listview-filter").toggle();
        });
        
        var content =  $("#selectMerchantContent");
        
        content.on('click', '.selectMerchantLI', r.merchantSelectTap);
        content.on("swipeleft", '.selectMerchantLI', r.merchantSelectHorizontalSwipe);
        content.on("swiperight", '.selectMerchantLI', r.merchantSelectHorizontalSwipe);
        content.on("swipeleft", '.selectMerchantMenu', r.merchantSelectMenuBack);
        content.on("swiperight", '.selectMerchantMenu', r.merchantSelectMenuBack);

        $('#selectMerchantDeleteYes').bind('click', function(){
        	var merchant = r.merchantList[r.tempIndex];
        	r.deleteMerchant(merchant);
        	var loc = $('#selectMerchantList');
        	loc.empty();
        	r.writeMerchantList(loc, r.merchantList);
        	$('#selectMerchantConfirmDelete').popup('close');
        });
        
        $('#selectMerchantDeleteNo').bind('click', function(){
        	$('#selectMerchantConfirmDelete').popup('close');
        });
        
       content.on("click", ".editButton", function(e){
        	var index = $(this).attr("index");
        	r.merchantToEdit = r.merchantList[index];
        	$.mobile.changePage("#editMerchant", {transition : "slide"});
        });
        
        content.on("click", ".selectButton", function(e){
        	var index = $(this).attr("index");
        	r.activeMerchant = r.merchantList[index];
        	$.mobile.changePage("#merchantDisplay", {transition:"slide"});
        });
        
        content.on("click", ".deleteButton", function(e){	
        		r.tempIndex = $(this).attr("index");
        		$('#selectMerchantConfirmDelete').popup('open');
        	});
        
        content.on("click", ".backButton", r.merchantSelectMenuBack);
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.selectMerchantBeforeCreate');
      }
    },

    selectMerchantInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.selectMerchantInit');
        $("#selectMerchantList").prev("form.ui-listview-filter").hide();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.selectMerchantInit');
      }
    },

    selectMerchantShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.selectMerchantShow');
        r.handleMeetings("selectMerchant")
        
        if(!r.merchantList)
        	r.getMerchantsLoc(10);
        else
        	r.writeMerchantList($('#selectMerchantList'), r.merchantList);
        
        /*Sets the default location for the maps page*/
        if(r.currLoc)
        	r.mapsCenter = new google.maps.LatLng(r.currLoc.Latitude,
        										  r.currLoc.Longitude);
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.selectMerchantShow');
      }
    },
    
    selectMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.selectMerchantHide');
    		$('#selectMerchantList').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.selectMerchantHide');
    	}
    },
    
    editMerchantBeforeCreate : function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantBeforeCreate');
    		
    		$('#editMerchantContent').bind("swiperight", function(e){
    			$.mobile.back();
    		});
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantBeforeCreate');
    	}
    },
    
    editMerchantShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantShow');
    		
    		r.merchantForm("editMerchant", false);
    		
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
    		
    		//deregister event handler for save
    		$('#editMerchantSave').unbind('click');
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantHide');
    	}
    },
    
    createNewMerchantBeforeCreate : function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantBeforeCreate');
    		
    		$('#createNewMerchantContent').bind("swiperight", function(e){
    			$.mobile.back();
    		});
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantBeforeCreate');
    	}
    },

    createNewMerchantShow : function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantShow');
    		r.merchantForm("createNewMerchant", true);
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantShow');
    	}
    },
    
    createNewMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantHide');
    		$('#createNewMerchantContent').empty();
    		$('#createNewMerchantSave').unbind('click');
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantHide');
    	}
    },
    
    /*Merchant Display Screen (displays information about the active merchant*/
    merchantDisplayBeforeCreate: function (){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayBeforeCreate');
    		var page = $('#merchantDisplay');
    		
    		var noteSwipe = function(){
    			var index = $(this).attr('index');
    			$('#noteShow'+index).hide();
    			$('#noteMenu'+index).show();
    		};
    		
    		var noteBack = function(){
    			var index = $(this).attr('index')
    			$('#noteMenu'+index).hide();
    			$('#noteShow'+index).show();
    		};
    		
    		page.on('click', '#merchantDisplayMaps', function(){
    			var m = r.activeMerchant;
    			if(m.Latitude !== "" && m.Longitude !== "")
    				r.mapsCenter = new google.maps.LatLng(m.Latitude,
    												  m.Longitude);
    			$.mobile.changePage('#maps', {transition:'slide'});
    		});
    		
    		page.on('swipeleft', '.noteSwipe', noteSwipe);
    		page.on('swiperight', '.noteSwipe', noteSwipe);
    		
    		page.on('click', '.noteDelete', function(){
    			return; //No backend functionality yet?
    		});
    		
    		page.on('click', '.noteEdit', function(){
    			var index = $(this).attr('index');
    			var note = r.activeMerchant.Notes[index]
    			$('#noteMenu'+index).hide()
    			var disp = $('#noteEditField'+index);
    			disp.show();
    		});
    		
    		page.on('click', '.noteBack', noteBack);
    		page.on('swiperight', '.noteMenu', noteBack);
    		page.on('swipeleft', '.noteMenu', noteBack);
    		
    		page.on('click', '.editNoteSave', function(){
    			var index = $(this).attr('index');
    			var note = r.activeMerchant.Notes[index]
    			note.Note = $('#noteEditForm'+index).val();
    			note.LastUpdated = new Date();
    			note.LastUpdatedBy = r.getUserName();
    			
    			$('#noteEditField'+index).hide();
    			
    			r.updateNote(note.Id, {Note : note.Note});
    			
    			var disp = $('#noteShow'+index);
    			disp.empty();
    			var t = _.template($('#NoteShowInnerTemplate').html());
    			disp.append(t({n : note}));
    			
    			$('#merchantDisplayNotesDisplay').listview('refresh');
    			
    			disp.show();
    			
    		});
    		
    		page.on('click', '.editNoteBack', function(){
    			var index = $(this).attr('index');
    			$('#noteEditField'+index).hide();
    			$('#noteMenu'+index).show();
    		});
    		
    		var template = _.template($('#merchantDisplaySidebarTemplate').html());
    		$('#merchantDisplay').append(template({UserName:r.getUserName(),
    											   versionNum : r.versionNum}));
    		
    		$('#merchantDisplaySidebarEdit').bind('click', function(){
    			r.merchantToEdit = r.activeMerchant;
    			$.mobile.changePage('#editMerchant', {transition:'slide'});
    		});
    		
    		$('#merchantDisplayDeleteYes').bind('click', function(){
    			r.deleteMerchant(r.activeMerchant); //API Call
    			
    			$.mobile.changePage('#selectMerchant');
    		});
    		
    		$('#merchantDisplayDeleteNo').bind('click', function(){
    			$('#merchantDisplayConfirmDelete').popup('close');
    		});
    		
    		/*For the meetings popup*/
    		r.attachMeeting('merchantDisplay');
    		
    		page.on('click', '.meetingStartDeleteMember', function(){
    			$(this).parent().remove()
    		});
    		
    		 $('#meetingStartButton').bind('click', function(){
    			 if(!r.activeMeeting){
    				 r.activeMeeting = {Members : [],
    						            Notes : []};
    			 }
    			 r.activeMeeting.Merchant = r.activeMerchant;
    			 r.activeMeeting.Start = new Date();
    			 r.activeMeeting.About = $('#meetingStartAbout').val();
    			 
    			 var mem = $('#meetingStartAddMemberField').val();
    			 if(mem !== "")
    				 r.activeMeeting.Members.push(mem);
    			 $(':button', $('#meetingStartMembers')).each(function(){
    				 r.activeMeeting.Members.push(this.innerText);
    				 });
    			 
    			 $('#meetingStart').popup('close');
    			 $('#meetingStartButton').hide();
    			 r.handleMeetings('merchantDisplay');
    			 
    			 /*Cleaning up*/
    			 $('#meetingStartMembers').empty();
    			 $('#meetingStartAbout').val('');
    			 $('#meetingStartAddMemberField').val('');
    		 });
    		 
    		 $('#meetingStartCancel').bind('click', function(){
    			 if(r.activeMeeting)
    				 delete r.activeMeeting;
    			 $('#meetingStartMembers').empty();
    			 $('#meetingStartAbout').val('');
    			 $('#meetingStartAddMemberField').val('');
    		 });
    		 
    		 $('#meetingStartAddMember').bind('click', function(){
    			 var field = $('#meetingStartAddMemberField');
    			 if(field.val() === "")
    				 return;
    			$('#meetingStartMembers').append($('<button />', {
    				'data-icon' : 'delete',
    				'data-inline' : 'true',
    				'data-iconpos' : 'right',
    				'class' : 'meetingStartDeleteMember',
    				'text' : field.val()
    			}));
    			field.val('');
    			
    			$('#meetingStart').trigger('create');
    		 });
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayBeforeCreate');
    	}
    },
    
    merchantDisplayShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayShow');
    		
    		r.handleMeetings('merchantDisplay');
    		
    		var content = $('#merchantDisplayContent');
    		content.empty(); //just in case
    		
    		if(!r.activeMerchant.Notes){
    			r.getNotes(r.activeMerchant, true, r.writeNotes);//Notes will be displayed as part of the call back r.writeNotes
    		}
    		else{//Add the current Notes
    			r.writeNotes(r.activeMerchant);
    		}
    		
    		$('#merchantDisplayHead').text(r.activeMerchant.Name);
    		
    		var template = _.template($('#merchantDisplayContentTemplate').html());
    		
    		content.prepend(template(r.activeMerchant));
    		$(".collapsedListItem").each(function(){
    			$(this).hide();
    		});

    		$("#displayMerchantInfoCollapse").bind("click", function(e){
    			$(".collapsedListItem").each(function(){
    				$(this).toggle();
    			});

    			var li = $('#merchantDisplayBasicInfo')
    			if($(this).attr("status") === "up"){
    				$(this).attr("status", "down");
    				li.buttonMarkup({icon:"arrow-d"})
    			}
    			else{
    				$(this).attr("status", "up");
    				li.buttonMarkup({icon:"arrow-u"});
    			}

    		});

    		var spec = $("#merchantDisplayStatusSpecific");
    		spec.bind('swipeleft', function(){
    			/*A long if/elif chain based on the different statuses*/
    			$.mobile.changePage("#configure", {transition:"slide"});
    		});

    		spec.bind('swiperight', function(){
    			$.mobile.changePage('#selectMerchant', {transition:"slide",
    				reverse:true });
    		});

    		$('#merchantDisplayAddNote').bind("click", function(e){
    			$('#merchantDisplayAddNoteBox').toggle();
    		});

    		$('#merchantDisplayAddNoteSave').bind('click', function(e){
    			var textArea = $('#merchantDisplayNoteText');

    			if(textArea.prop('value') === ""){
    				return; //No need to save empty notes
    			}

    			var newNote = {  Type : "NOTE_SALES",
    					LastUpdatedBy : r.getUserName(),
    					LastUpdated : new Date(),
    					Note : textArea.prop('value') };
    			r.activeMerchant.Notes.push(newNote);
    			r.createNote(r.activeMerchant.Id, newNote);

    			textArea.prop('value', "");
    			$('#merchantDisplayAddNoteBox').hide();
    			/*Update the displays on this page*/

    			var NoteTemplate = _.template($('#NoteDisplayTemplate').html())
    			var notesDisplay = $('#merchantDisplayNotesDisplay');
    			notesDisplay.prepend(NoteTemplate({n:newNote, 
    				index:r.activeMerchant.Notes.length-1}));
    			notesDisplay.listview('refresh');
    			notesDisplay.trigger('create');

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
    		$('#merchantDisplayHead').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayHide');
    	}
    },
    
    mapsBeforeCreate: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.mapsBeforeCreate');
    		$('#maps').on('click', '.mapsMerchantDisplay', function(){
    			r.activeMerchant = r.getMerchantByName($(this).attr('merchantName'));
    			$.mobile.changePage('#merchantDisplay', {transition:'slide'});
    		});
    		
    		$('#maps').on('click', '.mapsMerchantSearchLI', function(){
    			var index = $(this).attr('index');
    			var merchant = r.merchantList[index];
    			r.map.setCenter( new google.maps.LatLng(merchant.Latitude,
    													merchant.Longitude));
    			r.mapsSelectMerchant(merchant);
    		});
    		
    		$('#mapsLocationSearchGo').bind('click', function(){
    			$('#mapsLocationFailText').hide()
    			var address = $('#mapsLocationSearchField').val();
    			r.getGeocode(address, function(results, status){
    				if(status !== google.maps.GeocoderStatus.OK){
    					$('#mapsLocationFailText').show()
    					return;
    				}
    				
    				r.map.setCenter(results[0].geometry.location);
    			});
    		});
    		
    		$("input[type='radio']", $('#mapsSearch')).bind('change', function(){
    			var buttonVal = $(this).val();
    			$('.searchTabContent', $('#mapsSearch')).each(function(){
    				if($(this).attr('id') !== buttonVal)
    					$(this).hide();
    				else
    					$(this).show();
    			});
    		});
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.mapsBeforeCreate');
    	}
    },
    
    mapsShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.mapsShow');
    		
    		/*populates the list for merchant search*/
    		var search = $('#mapsMerchantSearch');
    		search.empty();
    		var t = _.template($('#mapsMerchantSearchTemplate').html());
    		search.append(t(r));
    		search.trigger('create')
    		
    		var chartsURL = 'https://chart.googleapis.com/chart?chst='
    		
    		if(!r.mapsCenter)
    			r.mapsCenter = new google.maps.LatLng(41.8500, -87.6500);
    		
    		var mapOptions = {
    				center : r.mapsCenter,
    				zoom : 14,
    				mapTypeId : google.maps.MapTypeId.ROADMAP
    		};
    		
    		$('#mapCanvas').css({height: $(window).height() - $('#mapsHeader').height()});
    		var map = new google.maps.Map(document.getElementById("mapCanvas"),
    	            mapOptions);
    		r.map = map; //For access in pagewide registrations
    		
    		var markerClick = function(e){//Called when a marker is clicked
    			r.mapsSelectMerchant( r.merchantList[this.title]);
    		};
    		
    		for(var i = 0; i < r.merchantList.length; i++){
    			var LatLng = new google.maps.LatLng(r.merchantList[i].Latitude,
    												r.merchantList[i].Longitude);
    			var color = r.getColor(r.getPos(r.merchantList[i]));
    			var chld = 'chld=|'+color+'|'
    			var iconURL = chartsURL + 'd_map_pin_letter_withshadow&' + chld;
    			
    			var marker = new google.maps.Marker({
    				'position' : LatLng,
    				'map' : map,
    				'title' : i.toString(),
    				'icon' : iconURL
    			});
    			google.maps.event.addListener(marker, 'click', markerClick);
    		}
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.mapsShow');
    	}
    },

    // Configure Screen
    configureBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.configureBeforeCreate');
        //r.attachPanel("configure");
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
	r.setConfigurePage(r.merchantList);
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

  r.refreshselectMerchant = function() {
      try {
        RSKYBOX.log.info('entering', 'main.js.refreshselectMerchant');

        $.mobile.showPageLoadingMsg();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.refreshselectMerchant');
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

  /*Attempts to get the current location and then calls getMerchants*/
  r.getMerchantsLoc = function(numMerchants){
	  var success = function(location){
		  r.currLoc = { Longitude : location.coords.longitude,
				        Latitude : location.coords.latitude };
		  r.getMerchants(numMerchants);
	  }
	  var failure = function(){ r.getMerchants(numMerchants);};
	  navigator.geolocation.getCurrentPosition(success,failure);
  };
  
  r.getMerchants = function(numMerchants) {
    try {
      RSKYBOX.log.info('entering', 'main.js.getMerchants');
      var closeurl = baseUrl + 'merchants/list';
      var jsonobj = {Detailed : true, Config:true};
	  jsonobj.Top = numMerchants;
	  
      if(r.currLoc){
    	  jsonobj.Latitude = r.currLoc.Latitude;
    	  jsonobj.Longitude = r.currLoc.Longitude;
      }

      $.ajax({
        type: 'search',
        data: JSON.stringify(jsonobj),
        datatype: 'json',
        contentType: 'application/json',
        url: closeurl,
        statuscode: r.statusCodeHandlers(),
		headers: {'Authorization' : r.getAuthorizationHeader()},
        success: function(data, status, jqXHR) {
                    try {
                    	r.merchantList = data.Results;
                    	r.merchantList.numExpected = numMerchants;
                    	r.fixMerchants(r.merchantList);
                    	r.writeMerchantList($('#selectMerchantList'), r.merchantList);
                    } catch (e) {
                      RSKYBOX.log.error(e, 'getMerchants.success');
                    }
                  },
        error : function(error){
        	alert('Could not get merchants, error code: ' + error.status)
        }
      });
    } catch (e) {
      RSKYBOX.log.error(e, 'getMerchants');
    }
  };
  
  /*Makes a call to Merchant Create*/
  r.createMerchant = function(merchant, callback){
	try {
		RSKYBOX.log.info('entering', 'main.js.createMerchant');
		if(merchant.AcceptTerms === "")
			merchant.AcceptTerms = true;
		var closeurl = baseUrl + 'merchants/create';
		var jsonobj = JSON.stringify(r.cleanMerchant(merchant));
		var n;
		
		$.ajax({
			type: 'POST',
			datatype: 'json',
			data : jsonobj,
			contentType: 'application/json',
			url: closeurl,
			statuscode: r.statusCodeHandlers(),
			headers: {'Authorization' : r.getAuthorizationHeader()},
			success: function(data){
				RSKYBOX.log.info('finished', 'main.js.createMerchant');
				merchant.Id = data.Results.Id;
				if(callback){
					callback();
				}
			},
			error: function(error){
				alert('Could not create merchant error code: ' + error.status);
			}
		});
	}  
	catch(e){
		RSKYBOX.log.error(e,'main.js.createMerchant');
	};
  };
  
  r.updateMerchant = function(merchant){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.updateMerchant');
		  
		  if(!merchant.Id){
			RSKYBOX.log.info('failed due to no user id', 'main.js.updateMerchant');
			 return;
		  }
		  
		  var closeurl = baseUrl + 'merchants/update/' + merchant.Id;
		  
		  var jsonobj = JSON.stringify(r.cleanMerchant(merchant));
		  var n;
		  
		  $.ajax({
			  type : 'POST',
			  data : jsonobj,
			  contentType : 'application/json',
			  url : closeurl,
			  statuscode: r.statusCodeHandlers(),
		      headers: {'Authorization' : r.getAuthorizationHeader()},
			  success : function(){
				  RSKYBOX.log.info('finished', 'main.js.updateMerchant');
			  },
			  error : function(error){
				  alert('could not update merchant error code:' + error.status);
			  }
		  });
		  
	  }
	  catch(e){
		  RSKYBOX.log.error(e, 'main.js.updateMerchant');
	  }
  };
  
  r.deleteMerchant = function(merchant){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.deleteMerchant');
		  	if(!merchant.Id){
		  		return; //Can't delete if we don't know the id
		  	}
		  	
			var closeurl = baseUrl + 'merchants/delete/' + merchant.Id;
			var jsonobj = JSON.stringify({});
			$.ajax({
				type: 'DELETE',
				datatype: 'json',
				data : jsonobj,
				contentType: 'application/json',
				url: closeurl,
				statuscode: r.statusCodeHandlers(),
				headers: {'Authorization' : r.getAuthorizationHeader()},
				async: false,
				success: function(data){
					RSKYBOX.log.info('finished', 'main.js.createMerchant');
	    			for(var i = 0; i < r.merchantList.length; i++){
	    				if(r.merchantList[i] === merchant){
	    					r.merchantList.splice(i,1);
	    					break;
	    				}
	    			}
				},
				error: function(error){
					alert('could note delete merchant, error code ' + error.status);
				}
			});
	  }
	  catch(e){
		  RSKYBOX.log.error(e,'main.js.deleteMerchant');
	  }
  };
  
  r.getNotes = function(merchant, async, callback){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.getNotes');

		  var closeurl = baseUrl + 'merchants/notes/list';
		  var jsonobj = JSON.stringify({MerchantId : merchant.Id });
		  
		  $.ajax({
			  type: 'SEARCH',
			  datatype: 'json',
			  data : jsonobj,
			  contentType: 'application/json',
			  url: closeurl,
			  statuscode: r.statusCodeHandlers(),
			  headers: {'Authorization' : r.getAuthorizationHeader()},
			  'async' : async,
			  success: function(data){
				  var res = data.Results;
				  for(var i = 0; i < res.length; i++){//Change date format for easier use
					  res[i].LastUpdated = new Date(res[i].LastUpdated);
				  }
				  merchant.Notes = res;
				  callback(merchant);
				  
			  },
			  error : function(error, textStatus, errorThrown){
				  merchant.Notes = []; //No notes returned
				  if(error.status === 422){
					  var codes = JSON.parse(error.responseText);
					  if(codes.ErrorCodes[0].Code === 101)//no notes server side
						  return;
					  else
						  alert('Could not fetch notes, error code' + codes.ErrorCodes[0].Code);
				  }
				  alert('Could not fetch notes, error code' + error.status);
				  callback(merchant);
			  }
		  });
	  }
	  catch(e){
		  RSKYBOX.log.error(e,'main.js.getNotes');
	  }
  };
  
  r.createNote = function(Id, Note){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.createNote');
		  var closeurl = baseUrl + 'merchants/notes/create';
		  var jsonobj = JSON.stringify({MerchantId : Id,
			  							'Note' : Note.Note,
			  							'Type' : Note.Type,
			  							'ConfigurationStepId' : Note.ConfigurationStepId});
		  
		  $.ajax({
			  type: 'POST',
			  datatype: 'json',
			  data : jsonobj,
			  contentType: 'application/json',
			  url: closeurl,
			  statuscode: r.statusCodeHandlers(),
			  headers: {'Authorization' : r.getAuthorizationHeader()},
			  success: function(){
				  RSKYBOX.log.info('success', 'main.js.createNote');
			  },
		  });
	  }
	  catch(e){
		  RSKYBOX.log.error(e,'main.js.createNote');
	  }
  };

  r.updateNote = function(noteId,noteUpdate){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.updateNote');
		  var closeurl = baseUrl + 'merchants/notes/update/'+noteId;
		  var jsonobj = JSON.stringify(noteUpdate);
		  
		  $.ajax({
			  type: 'POST',
			  datatype: 'json',
			  data : jsonobj,
			  contentType: 'application/json',
			  url: closeurl,
			  statuscode: r.statusCodeHandlers(),
			  headers: {'Authorization' : r.getAuthorizationHeader()},
			  success: function(){
				  RSKYBOX.log.info('success', 'main.js.createNote');
			  },
			  error : function(){
				  alert('error could not updateNote, error code ' + error.status);
			  }
		  });
	  }
	  catch(e){
		  RSKYBOX.log.error(e,'main.js.createNote');
	  }
  };
  
  /*Makes a call to the google geocode API. Calls callback functions with the results*/
  r.getGeocode = function(address, callback){
	  try{
		  RSKYBOX.log.info('main.js.getGeocode');
		  var geocoder = new google.maps.Geocoder();
		  geocoder.geocode({"address" : address}, callback);
	  }
	  catch(e){
		  RSKYBOX.log.error(e,'main.js.getGeocode');
	  }
  }
  
  /*Remove all forms equal to "" */
  r.cleanMerchant = function(merchant){
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
		  
		  location.empty();
		  
		  var merchantTemplate = _.template($('#selectMerchantTemplate').html());
		  
		  var templateData = {};
		  
		  for(var i = 0; i < merchantList.length; i++){
			  var m = merchantList[i];
			  templateData.Name = m.Name;
			  templateData.Status = m.Status;
			  templateData.Street = m.Street;
			  templateData.City = m.City;
			  templateData.State = m.State;
			  templateData.ZipCode = m.ZipCode;
			  templateData.index = i.toString();
			
			  location.append(merchantTemplate(templateData));
		  }
		  
		  //i.e. if there are more to merchants to be recieved
		  if( merchantList.numExpected === merchantList.length){
			  var t = _.template($('#selectMerchantListMoreTemplate').html())
			  location.append(t());
			  
			  $('#selectMerchantListMore').bind('click', function(){
				  r.getMerchants(merchantList.numExpected+10);
			  });
		  }
		  
		  $('#selectMerchantContent').trigger('create');
		  location.listview('refresh');
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
	  return undefined;
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
		  if( !(merchantList[merchIndex].Activities))
			  merchantList[merchIndex].Activities = [];
	  }
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
  
  /*builds either the editMerchant or createNewMerchant page depending on the
   * given pageId and value of newMerchant (true for createNewMerchant, false for editMerhcant
   */
  r.merchantForm = function(pageId, newMerchant){

	  var merchant;
	  if(newMerchant){
		  merchant = {};
		  r.fixMerchants([merchant]);//create the necessary properties
		  //Do not modify the header
	  }
	  else{
		  merchant = r.merchantToEdit;
		  var head = $('#'+pageId+'Head').text('Editing ' + merchant.Name);//Modify the header
	  }

	  var start = new Date(); //measures the time it takes to fill out the form.

	  /*Modify the body*/
	  var content = $('#'+pageId+'Content');

	  merchant.pageIdPrefix = pageId;//Used for template
	  merchant.index = 0; //Also used in the template call
	  var editMerchantTemplate = _.template($('#editMerchantForm').html());

	  content.append(editMerchantTemplate(merchant));

	  $('#'+pageId+'POS').bind('change', function(){
		  if($(this).val() === 'Other'){ 
			  $('#'+pageId+'OtherPOSLI').show();
		  }
		  else{
			  $('#'+pageId+'OtherPOSLI').hide();
		  }
	  });
	  
	  $('#'+pageId+'GetLoc').bind('click', function(){
		  var success = function(position){
			  var lng = position.coords.longitude;
			  var lat = position.coords.latitude;
			  $('#'+pageId+'Longitude').val(lng);
			  $('#'+pageId+'Latitude').val(lat);
		  };
		  
		  var failure = function(){
			  alert('geolocation failed to fetch coordinates');
		  };
		  
		  navigator.geolocation.getCurrentPosition(success,failure);
	  });

	  var notesToAdd = [];
	  var activitiesToAdd = [];
	  
	  $('#'+pageId+'NoteSave').bind('click', function(e){
			var textArea = $('#'+pageId+'NoteTextArea');
			var newNote = {  Type : "NOTE_SALES",
							 LastUpdatedBy : r.getUserName(),
					 		 LastUpdated : new Date(),
					 		 Note : textArea.prop('value') };
			notesToAdd.push(newNote);
			textArea.prop('value', "");
			$('#'+pageId+'NotePopup').popup('close');
			
			var act = { 'Type' : 'Note',
					  'UserName' : r.getUserName(),
					  'Date' : newNote.LastUpdated,
					  'Note' : newNote.Note};
			activitiesToAdd.push(act);
	  });
	  
	  $('#'+pageId+'NoteCancel').bind('click', function(e){
			$('#'+pageId+'NoteTextArea').prop('value', "");
			$('#'+pageId+'NotePopup').popup('close');
		});
	  
	  $('#'+pageId+'Save').bind('click', function(e){
		  var form = $('#'+pageId+'Content :input');
		  var formsFilled = [];
		  
		  if(!newMerchant)
			  var updateObj = {};//fed to the updateMerchant API Call
		  
		  for(var i = 0; i < form.length; i++){
			  if(form[i].required && form[i].value === ""){
				  var pop = $('#'+pageId+'RequiredPopup');
				  pop.empty();
				  pop.append($('<h1 />', {text : "The " + form[i].name + " field is required."}));
				  pop.popup("open");
				  return;
			  }
			  
			  var fieldVal;
			  if(form[i].name === "POS"){
				  fieldVal = MERCHANT.POSAbreviations[form[i].value];
			  }
			  else
				  fieldVal = form[i].value;

			  if(!newMerchant){
				  if(fieldVal !== merchant[form[i].name]){
					  updateObj[form[i].name] = fieldVal;
				  }
			  }

			  merchant[form[i].name] = fieldVal;//Update local copy

			  if(fieldVal !== ""){//This field was actually filled out
				  formsFilled.push(form[i].name);
			  }
		  }
		  
		  if(merchant.POS !== 'POS_OTHER'){
			  merchant.OtherPOS = "";
			  if(!newMerchant)
				  updateObj.OtherPOS = "";
		  }
		  
		  merchant.Activities = merchant.Activities.concat(activitiesToAdd);
		  
		  if(newMerchant){//createNewMerchant
			  r.createMerchant(merchant, function(){
				  for(var i = 0; i < notesToAdd.length; i++){
					  r.createNote(merchant.Id, notesToAdd[i])
				  }
			  });
			  r.merchantList.push(merchant);
		  }
		  
		  else{//editMerchant
			  updateObj.Id = merchant.Id;
			  //r.updateMerchant(updateObj);
			  r.updateMerchant(merchant);
			  for(var i = 0; i < notesToAdd.length; i++){
				  r.createNote(merchant.Id, notesToAdd[i])
			  }
			  if(merchant.Notes !== undefined){
				  merchant.Notes = merchant.Notes.concat(notesToAdd);
			  }
		  }

		  /*Create the activity*/
		  var end = new Date();
		  var editTime = end.getTime() - start.getTime();
		  var activity;

		  if(newMerchant){
			  activity = {'Type' : 'MerchantCreate',
					  'Date' : end,
					  UserName : r.getUserName(),
					  FormsFilled : formsFilled,
					  EditTime : editTime
			  }
		  }
		  else{
			  activity = {'Type' : 'MerchantEdit',
					  'Date' : end,
					  UserName : r.getUserName(),
					  FormsFilled : formsFilled,
					  EditTime : editTime
			  }
		  }
		  merchant.Activities.push(activity);

		  if(newMerchant){//If its new, take to merchant info screen
			  r.activeMerchant = merchant;
			  $.mobile.changePage("#merchantDisplay", {transition:"slide"});
		  }
		  else{//If not, take back to where ever the editing was triggered
			  $.mobile.back({transition:"slide"});
		  }

	  });

	  content.trigger('create');
  };
  
  /* Makes a call to the geocode API to get the longitude and latitude from the address
   * Expects the longitude and latiude forms to write into and a properly formatted address
   * address should encode all spaces as +'s
   */
  r.fetchLngLat = function(lngObj, latObj, Address){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.fetchLngLat');
		  var geocodeURL = "http://maps.googleapis.com/maps/api/geocode/json?address="+ Address;
		  geocodeURL += '&sensor=false';
		  $.ajax({
			  dataType : 'json',
			  url : geocodeURL,
			  type : "GET",
			  success : function(data){
				  if(data.results.length >= 1){
					  var res = data.results[0];
					  lngObj.val(res.geometry.location.lng);
					  latObj.val(res.geometry.location.lat);
				  }
				  
			  }
		  });
	  }
	  catch(e){
		  RSKYBOX.log.info(e, 'main.js.fetchLngLat');
	  }
  };
  
  r.readyAddress = function(street,city,state,zip){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.readyAddress');
			var address = street.replace(/\s+/g, '+');//replace all white space with +
			address += ',+';
			address += city.replace(/\s+/g, '+');
			address += ',+';
			address += state.replace(/\s+/g, '+');
			address += ',+';
			address += zip.replace(/\s+/g, '+');
			return address;
	  }
	  catch(e){
		  RSKYBOX.log.info(e,'main.js.readyAddress');
	  }
  };
  
  /*Register handlers for the delete buttons for POC objects given prefix and index*/
  r.registerDelete = function(idPrefix, i){
		var del = $('#'+idPrefix + 'Delete' +i);
		del.bind('click', function(e){
			$('#pocForm'+i).remove();
		});
  };
  
  /*The event handler for selecting a merchant on the merchant select screen*/
  r.merchantSelectTap = function(){
	  var index = $(this).attr('index');
	  r.activeMerchant = r.merchantList[index];
	  $.mobile.changePage('#merchantDisplay', {changeHash:false, transition:"slide" } )
  };

  r.merchantSelectHorizontalSwipe = function(){
	  var index = $(this).attr('index');
	  $("#selectMerchantListElm"+index).hide();
	  $("#selectMerchantListSwipeMenuElm"+index).show();
  };
  
  r.merchantSelectMenuBack = function(){
	  var index = $(this).attr('index');
	  $("#selectMerchantListSwipeMenuElm"+index).hide();
	  $("#selectMerchantListElm"+index).show();
  };
  
  /*Writes the 'notes' protion into merchantDisplay*/
  r.writeNotes = function(merchant){
	  var t = _.template($('#merchantDisplayNotesTemplate').html());
	  $('#merchantDisplayContent').append(t(merchant));

		$('#merchantDisplayAddNoteCancel').bind('click', function(e){
			$('#merchantDisplayNoteText').prop('value', "");
			$('#merchantDisplayAddNoteBox').hide();
		});
		
		$('#merchantDisplayContent').trigger('create');
  };
  
  /*returns a letter (a,b,c,d, or e) based on the status field of a merchant*/
  r.getStatusTheme = function(Status){
	  return 'a';
  };
  
  r.handleMeetings = function(pageName){
	  if(r.activeMeeting !== undefined){
		  $('.meetingDetailsButton', $.mobile.activePage).show();
		  var meeting = $('#'+pageName+'_MeetingDetailsInner');
		  meeting.empty();
		  var t = _.template($('#meetingDetailsTemplate').html());
		  meeting.append(t(r.activeMeeting));
		  meeting.trigger('create');
	  }
	  else{
		  $('.meetingDetailsButton', $.mobile.activePage).hide();
	  }
  };
  
  r.attachMeeting = function(pageName){
	  $('#'+pageName).prepend($('<div />', {
		  'id' : pageName+'_MeetingDetails',
		  'data-role' : 'panel',
		  'class' : 'merchantDetails',
		  'data-position':"right",
		  'data-display' : "push",
		  'data-position-fixed' : true,
		  'data-dismissible' : false,
		  'data-theme' : 'a'
	  }));
	  
	  $('#'+pageName+'_MeetingDetails').append($('<div />', {
		  id : pageName+'_MeetingDetailsInner'
	  }));
  };
  
  r.getPos = function(merchant){
	  if(merchant.POS === "")
		  return "";
	  if(merchant.POS !== 'POS_OTHER')
		  return MERCHANT.POSNames[merchant.POS];
	  else
		  return merchant.OtherPOS;
  }
  
  r.versionNum = 0.1;//Change this value to set the version number

  /*-----------------Registering class-wide event handlers--------------------*/
  
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
  
  $(document).on('click', '.geoLocation', function(){
		try {
			navigator.geolocation.getCurrentPosition(r.displayGeoLocation, function(){alert("geo error")});
			return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.logOut');
    }
  });

  r.displayGeoLocation = function(position) {
    try {
      RSKYBOX.log.info('entering', 'main.js.displayGeoLocation');
		  var message = "latitude: " + position.coords.latitude + ", longitude: " + position.coords.longitude;
			alert(message);
    } catch (e) {
      RSKYBOX.log.error(e, 'displayGeoLocation');
    }
  };
  
  r.hashStringDJB2 = function(s) {
	  var hash = 0;
	  var char;
	  for(var i = 0; i < s.length; i++){
		  char = s.charCodeAt(i);
		  hash = ((hash<<5)-hash)+char;
		  hash |= 0;
	  }
	  return hash;
  };
  
  /*gets a (probably)unique color based on the name of the given POS
   * in the HSL format accepted by CSS*/
  r.getColor = function(PosName){
	  var hex = Math.abs(r.hashStringDJB2(PosName));
	  var H = hex % 255;
	  var L = (70 - (hex % 40)) *.01
	  var rgb = r.HSLToRGB(H, 1, L);
	  var col = ""
	  for(var i = 0; i < rgb.length;i++){
		  var str = rgb[i].toString(16);
		  if(str.length === 1)
			  col += '0' + str;
		  else
			  col += str;
	  }
	  return col;
  };
  
  r.HSLToRGB = function(H,S,L){
	  var C = (1 - Math.abs(2*L-1)) * S;
	  var HP = H/60;
	  var X = C * (1- Math.abs((HP % 2) - 1))
	  
	  var rgb;
	  if(HP < 1)
		  rgb = [C,X,0];
	  else if(HP < 2)
		  rgb = [X,C,0];
	  else if(HP < 3)
		  rgb = [0,C,X];
	  else if(HP < 4)
		  rgb = [0,X,C];
	  else if(HP < 5)
		  rgb = [X,0,C];
	  else
		  rgb = [C,0,X];
	  
	  var m = L - ( 0.5*C );
	  rgb[0] = Math.floor((rgb[0] + m) * 255);
	  rgb[1] = Math.floor((rgb[1] + m) * 255);
	  rgb[2] = Math.floor((rgb[2] + m) * 255);
	  
	  return rgb;
  };
  
  r.mapsSelectMerchant = function(merchant){
  	var content = $('#mapsMerchantSelect');
	content.empty();
	var t = _.template($('#mapsMerchantPopupTemplate').html());
	content.append(t(merchant));
	content.show();
	$('#mapsPanelList').listview('refresh');
	$('#mapsPanel').panel('open');
  };

  $(document).on('click', '.selectMerchant', function(e){
		try {
			if($.mobile.activePage.is('#selectMerchant')) {
				$('#selectMerchant_leftPanel').panel("close");
			} else {
				$.mobile.changePage( "#selectMerchant", { transition: "slideup", changeHash: true });
			}
			return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.selectMerchant');
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
  
  
  //Handlers for the meeting details popup
  $(document).on('click', '.meetingAddNote', function(e){
	  $('.meetingAddNoteLI', $.mobile.activePage).toggle();
  });
  
  $(document).on('click', '.meetingNoteSave', function(){
	  var noteContent = $('.meetingAddNoteField', $.mobile.activePage).val();
	  $('.meetingAddNoteField', $.mobile.activePage).val('')
	  var note = {
			  LastModifiedBy : r.getUserName(),
			  LastUpdated : new Date(),
	  		  Type : 'NOTE_MEETING',
	  		  Note : noteContent
	  };
	  
	  var noteList = $('.meetingNotesList', $.mobile.activePage);
	  var t = _.template($('#merchantDetailsNotesListTemplate').html());
	  
	  noteList.prepend(t({
		  i : r.activeMerchant.Notes.nextIndex,
		  Note : noteContent
		  }));
	  
	  r.activeMeeting.Notes.push(note);
	  r.activeMeeting.Notes.nextIndex++;
	  
	  noteList.trigger('create');
	  noteList.listview('refresh');
	  
  });
  
  $(document).on('click', '.meetingNoteEdit', function(){
	  $('.meetingDetailsNote').each(function(){
		 var mode = $(this).attr('deleteMode') === "true";
		 if(mode){
			 $(this).attr('deleteMode','false');
		 }
		 else{
			 $(this).attr('deleteMode','true');
		 }
		 
		 $('.ui-icon', $(this)).toggle();
		 
	  });
  });
  
  $(document).on('click', '.meetingDetailsNote', function(){
	  if($(this).attr('deleteMode') === "true"){
		  var index = $(this).attr('index');
		  delete r.activeMeeting.Notes[index];
		  $(this).remove();
	  }
  })
  
  $(document).on('click', '.meetingEnd', function(){
	 r.activeMeeting.End = new Date();
	 /*TODO: API Calls and such*/
	 r.activeMeeting = undefined;
	 $('.merchantDetails', $.mobile.activePage).panel('close');
	 $('.meetingDetailsButton', $.mobile.activePage).hide();
	 $('.meetingStartButton').each(function(){
		 $(this).show();
	 });
	 
  });

  r.setConfigurePage = function(merchants) {
      try{
	  RSKYBOX.log.info('entering','main.js.setConfigurePage');
	  
	  var configureMerchantListTemplate = _.template($('#ConfigureMerchantListTemplate').html());
	  var configureMerchantListHtml = "";
	  var nextMerchant;

	  for(var merIndex = 0; merIndex < merchants.length; merIndex++) {
	      nextMerchant = configureMerchantListTemplate(merchants[merIndex]);
	      nextMerchant = nextMerchant.replace("merchant_configSelect", "ConfigSelect" + merIndex);
	      configureMerchantListHtml += nextMerchant;
	  }

	  $('#ConfigureMerchantSelect').html(configureMerchantListHtml);

	  for(var merIndex = 0; merIndex < merchants.length; merIndex++) {
	      $('#' + 'ConfigSelect' + merIndex).attr('merNum',merIndex);
	      $('#' + 'ConfigSelect' + merIndex).click(function() {
		      var merIndex = $(this).attr('merNum');
		      $('#StartConfigure').attr("merchantId",merchants[merIndex].Id);
		      $('#StartConfigure>span').empty();
		      $('#StartConfigure>span').text("Start Configure: " + merchants[merIndex].Name);
		  });
	  }
	  
	  $('#StartConfigure').off();
	  $('#StartConfigure').click(function() {
		  var merchantId = $(this).attr('merchantId'); 
		  if(merchantId) {
		      r.getMerchantConfigurationInfo(merchantId);
		  }
	      });
	      
	  $('#ConfigureMerchantSelect').listview('refresh');
	  
      } catch (e) {
	  RSKYBOX.log.error(e, 'setConfigurePage');
      }
  };

  r.getMerchantConfigurationInfo = function(merchantID) {
      try{
	  RSKYBOX.log.info('entering','js.main.getMerchantConfigurationInfo');
	  
	  
	  var closeurl = baseUrl + 'merchants/list';
	  var jsonobj = {"Config":true,
	                 "Id": merchantID};
	  
	  $.ajax({
		  type: 'search',
		      data: JSON.stringify(jsonobj),
		      datatype: 'json',
		      contentType: 'application/json',
		      url: closeurl,
		      statuscode: r.statusCodeHandlers(),
		      headers: {'Authorization' : r.getAuthorizationHeader()},
		      success: function(data, status, jqXHR) {
		      try {
			  if(r.merchantBeingConfigured)
			      r.clearExistingConfigureStepsPages();
			  r.merchantBeingConfigured = data.Results[0];
			  r.currentNumberOfSteps = r.merchantBeingConfigured.Configuration[0].Steps.length;
			  if(!r.numberOfConfigureStepsPages)
			      r.numberOfConfigureStepsPages = 0;
			  r.fixMerchantBeingConfigured();
			  r.getMerchantConfigurationNotes(r.merchantBeingConfigured.Id);
			  var jtest = 5;
		      } catch (e) {
			  RSKYBOX.log.error(e, 'getMerchantConfigurationInfo.success');
		      }
		  }
	      });
      } catch (e) {
	  RSKYBOX.log.error(e, 'getMerchantConfigurationInfo');
      }
  };

  //Check to make sure all configure fields are provided. If not, fill in with dummy or empty values
  r.fixMerchantBeingConfigured = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.fixMerchantBeingConfigured');
	  
	  var confObj = r.merchantBeingConfigured.Configuration[0];
	  var confStep;
	  var confSubStep;

	  if(confObj.DateCompleted === undefined)
	      confObj.DateCompleted = null;

	  if(confObj.CurrentStep === undefined)
	      confObj.CurrentStep = 1;
	  
	  for(var stepIndex = 0; stepIndex < confObj.Steps.length; stepIndex++){
	      confStep = confObj.Steps[stepIndex];
	      
	      if(confStep.Title === undefined)
		  confStep.Title = "";
	      
	      if(confStep.Number === undefined)
		  confStep.Number = stepIndex + 1;

	      if(confStep.Instructions === undefined)
                  confStep.Instructions = "NO INSTRUCTIONS";

	      if(confStep.LastUpdated === undefined)
                  confStep.LastUpdated = null;

	      if(confStep.LastUpdatedBy === undefined)
                  confStep.LastUpdatedBy = "";

	      if(confStep.IsCompleted === undefined)
                  confStep.IsCompleted = false;

	      if(confStep.Screenshots === undefined)
                  confStep.Screenshots = [];

	      for(var ssIndex = 0; ssIndex < confStep.Screenshots.length; ssIndex++){
		  
		  if(confStep.Screenshots[ssIndex].Name === undefined)
		      ConfStep.Screenshots[ssIndex].Name = "";
		  
		  if(confStep.Screenshots[ssIndex].URL === undefined)
		      ConfStep.Screenshots[ssIndex].URL = "";
	      }

	      if(confStep.SubSteps === undefined)
                  confStep.SubSteps = [{}];

	      for(var subStepIndex = 0; subStepIndex < confStep.SubSteps.length; subStepIndex++) {
		  confSubStep = confStep.SubSteps[subStepIndex];

		  if(confSubStep.Number === undefined)
		      confSubStep.Number = subStepIndex + 1;

		  if(confSubStep.RequireInput === undefined){
		      if(confSubStep.Input === undefined)
			  confSubStep.RequireInput = "#NA";
		      else
			  confSubStep.RequireInput = false;
		  }
		  
		  if(confSubStep.Description === undefined)
                      confSubStep.Description = "NO DESCRIPTION";
		  
		  if(confSubStep.IsCompleted === undefined)
                      confSubStep.IsCompleted = false;

		  if(confSubStep.Input === undefined) {
		      if(confSubStep.RequireInput != "#NA")
			  confSubStep.Input = "";
		      else
			  confSubStep.Input = "#NA";
		  }  
	      }
	  }
      } catch (e) {
	  RSKYBOX.log.error(e,'fixMerchantBeingConfigured');
      }
  };

  r.clearExistingConfigureStepsPages = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.removeExistingConfigureStepsPages');

	  var cSteps = r.merchantBeingConfigured.Configuration[0].Steps;
	  for(var stepIndex = 0; stepIndex < cSteps.length; stepIndex++){
	      $('#ConfigureStep_' + (stepIndex + 1)).remove();
	      r.numberOfConfigureStepsPages = 0;
	  }

      } catch (e) {
	  RSKYBOX.log.error(e,'removeExistingConfigureStepsPages');
      }
  };

  r.writeEmptyConfigureStepsPages = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.writeEmptyConfigureStepsPages');
	  
	  var allStepsPagesEmptyHtml = "";
	  var currentStepEmpty;
	  var stepsLen = r.merchantBeingConfigured.Configuration[0].Steps.length;
	  
	  for(var stepIndex = 0; stepIndex < stepsLen; stepIndex++) {
	      if(stepIndex >= r.numberOfConfigureStepsPages) {
		  currentStepEmpty = '<div data-role="page" stepNumber="' + (stepIndex + 1) + '" id="ConfigureStep_' + (stepIndex + 1) + '"></div>';
		  r.numberOfConfigureStepsPages++;
		  allStepsPagesEmptyHtml += currentStepEmpty;
	      }
	  }
	  
	  if(allStepsPagesEmptyHtml)
	      $("#ConfigureStepsTemplate").before(allStepsPagesEmptyHtml);
	  
	  r.setConfigureStepsPages();
	  
      } catch (e) {
	  RSKYBOX.log.error(e,'writeEmptyConfigureStepsPages');
      }
  };
  
  r.getMerchantConfigurationNotes = function(merchantId) {
      try{
          RSKYBOX.log.info('entering','js.main.getMerchantConfigurationNotes');

          var closeurl = baseUrl + 'merchants/notes/list';
          var jsonobj = {};

          $.ajax({
                  type: 'search',
                      data: JSON.stringify(jsonobj),
                      datatype: 'json',
                      contentType: 'application/json',
                      url: closeurl,
                      statuscode: r.statusCodeHandlers(),
                      headers: {'Authorization' : r.getAuthorizationHeader()},
                      success: function(data, status, jqXHR) {
                      try {
                          r.merchantNotes1 = data.Results;
			  r.writeEmptyConfigureStepsPages();
                          var goToStep = $('#ConfigureStep_' + r.merchantBeingConfigured.Configuration[0].CurrentStep);
                          $.mobile.changePage(goToStep,{transition:'slide', changeHash:true});
			  
                          var jtest = 5;
                      } catch (e) {
                          RSKYBOX.log.error(e, 'getMerchantConfigurationNotes.success');
                      }
                  }
              });
      } catch (e) {
          RSKYBOX.log.error(e, 'getMerchantConfigurationNotes');
      }
      
  };

  r.insertConfigurationNotes = function(stepNumber) {
      try{
	  RSKYBOX.log.info('entering','main.js.insertConfigurationNotes');
	  
	  var configureInsertNoteTemplate = _.template($('#ConfigureInsertNoteTemplate').html());
	  var allNotesHtml = "";
	  var noteHtml;
	  var cNote;
	  
	  for(var noteIndex = 0; noteIndex < r.merchantNotes1.length; noteIndex++) {
	      cNote = r.merchantNotes1[noteIndex];
	      
	      if(cNote.Type == "NOTE_CONFIG") {
		  noteHtml = configureInsertNoteTemplate(cNote);
		  noteHtml = noteHtml.replace("ConfigureNote_Step_Id","ConfigureNote_" + stepNumber + "_" + cNote.Id);
		  allNotesHtml += noteHtml;
	      }
	  } 
	  
	  $('#ConfigurationInsertNotes_' + stepNumber).after(allNotesHtml);
   
      } catch(e) {
	  RSKYBOX.log.error(e,'insertConfigurationNotes');
      }
  };

	  
  r.setConfigureStepsPages = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.setConfigureStepsPages');
	  
	  var configureSubStepsTemplate = _.template($('#ConfigureSubStepsTemplate').html());
	  var configureStepsTemplate = _.template($('#ConfigureStepsTemplate').html());

	  var nextSubStepAdded;
	  var nextStepAdded;

	  for(var stepIndex = 0; stepIndex < r.merchantBeingConfigured.Configuration[0].Steps.length; stepIndex++) {
	      
	      var subStepsHtml = "";
	      var cStep = r.merchantBeingConfigured.Configuration[0].Steps[stepIndex];
	      
	      for(var subStepIndex = 0; subStepIndex < cStep.SubSteps.length; subStepIndex++) {
		  
		  var cSubStep = cStep.SubSteps[subStepIndex];

		  nextSubStepAdded = configureSubStepsTemplate(cSubStep);
		  nextSubStepAdded = nextSubStepAdded.replace("ConfigureCheck_Step_SubStep", "ConfigureCheck_" + cStep.Number + "_" + cSubStep.Number);
		  if(cSubStep.Input != '#NA'){
		      nextSubStepAdded = nextSubStepAdded.replace("ConfigureInput_Step_SubStep", "ConfigureInput_" + cStep.Number + "_" + cSubStep.Number);
		  }
		  subStepsHtml += nextSubStepAdded;
	      }

	      //fix Screenshot URL Images/... -> images/...
	      for(var screenshotIndex = 0; screenshotIndex < cStep.Screenshots.length; screenshotIndex++) {
		  cStep.Screenshots[screenshotIndex].URL = cStep.Screenshots[screenshotIndex].URL.replace('/Images','images');
		  cStep.Screenshots[screenshotIndex].URL = cStep.Screenshots[screenshotIndex].URL.replace('JPG','png');
	      }
	      // --- 
	      
	      nextStepAdded = configureStepsTemplate(cStep);
	      nextStepAdded = nextStepAdded.replace("SUBSTEPS", subStepsHtml);
	      nextStepAdded = nextStepAdded.replace("ConfigureSubSteps_Step","ConfigureSubSteps_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureStepBack_Number","ConfigureStepBack_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureStepForward_Number","ConfigureStepForward_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigurationNotesList_Step","ConfigurationNotesList_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigurationInsertNotes_Step","ConfigurationInsertNotes_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigurationNotesAdd_Step","ConfigurationNotesAdd_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureNewNoteOpen_Step","ConfigureNewNote_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureNewNote_Step","ConfigureNewNote_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureNewNoteContents_Step","ConfigureNewNoteContents_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureNewNoteSubmit_Step","ConfigureNewNoteSubmit_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureNewNoteCancel_Step","ConfigureNewNoteCancel_" + cStep.Number);
	      
	      $("#ConfigureStep_" + cStep.Number).append(nextStepAdded);
	      
	      r.insertConfigurationNotes(cStep.Number);
	  }
	  
	  //set the Check List up
	  $('#ConfigureCheckListContents').empty();
	  
	  var ConfigureListHtml = "";
	  var ConfigureListNextHtml;
	  var ConfigureCheckListContentTemplate = _.template($('#ConfigureCheckListContentTemplate').html());
	  
	  for(var stepIndex = 0; stepIndex < r.merchantBeingConfigured.Configuration[0].Steps.length; stepIndex++){
	      var cStep = r.merchantBeingConfigured.Configuration[0].Steps[stepIndex];
	      
	      for(var subStepIndex = 0; subStepIndex < cStep.SubSteps.length; subStepIndex++){
		  cSubStep = cStep.SubSteps[subStepIndex];
		  ConfigureListNextHtml = ConfigureCheckListContentTemplate(cSubStep);
		  ConfigureListNextHtml = ConfigureListNextHtml.replace('ConfigureListCheck_Step_SubStep','ConfigureListCheck_' + cStep.Number + '_' + cSubStep.Number);
		  if(cSubStep.Input != '#NA'){
		      ConfigureListNextHtml = ConfigureListNextHtml.replace('ConfigureListInput_Step_SubStep','ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number);
		  }
		  ConfigureListHtml += ConfigureListNextHtml;
	      }
	  }

	  $('#ConfigureCheckListContents').append(ConfigureListHtml);
	  if(r.configureListExists){
	      $('#ConfigureCheckList').trigger('create');
	  }
	  r.configureListExists = true;
	  // --- 
	  
	  for(var stepIndex = 0; stepIndex < r.merchantBeingConfigured.Configuration[0].Steps.length; stepIndex++){
	      
	      cStep = r.merchantBeingConfigured.Configuration[0].Steps[stepIndex];
	      
	      //set Navigation between Pages up
	      if(stepIndex == 0){
		  $("#ConfigureStepBack_" + cStep.Number).attr('href','#configure');
		  $("#ConfigureStep_" + cStep.Number).on('swiperight',function() {
			  $.mobile.changePage('#configure',{transition:'slide', reverse:true, changeHash:true});
		      });
	      } else { 
		  $("#ConfigureStepBack_" + cStep.Number).attr('href','#ConfigureStep_' + (cStep.Number - 1));
		  $("#ConfigureStep_" + cStep.Number).on('swiperight',function() {
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[Number($(this).attr('stepnumber')) - 1];
                          $.mobile.changePage('#ConfigureStep_' + (cStep.Number - 1), {transition:'slide', reverse:true, changeHash:true});
                      });
	      }

	      if(stepIndex == r.merchantBeingConfigured.Configuration[0].Steps.length - 1){
		  $("#ConfigureStepForward_" + cStep.Number).attr('href','#configure');
		  $("#ConfigureStep_" + cStep.Number).on('swipeleft',function() {
                          $.mobile.changePage('#configure',{transition:'slide', changeHash:true});
                      });
	      } else {
		  $("#ConfigureStepForward_" + cStep.Number).attr('href','#ConfigureStep_' + (cStep.Number + 1));
		  $("#ConfigureStep_" + cStep.Number).on('swipeleft',function() {
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[Number($(this).attr('stepnumber')) - 1];
                          $.mobile.changePage('#ConfigureStep_' + (cStep.Number + 1), {transition:'slide', changeHash:true});
                      });
	      }
	      // ---
	      
	      //set handlers for entering Notes
	      $('#ConfigureNewNoteSubmit_' + cStep.Number).attr('StepIndex',stepIndex);
	      $('#ConfigureNewNoteCancel_' + cStep.Number).attr('StepIndex',stepIndex);
	      //$('#ConfigurationNotesAdd_' + cStep.Number).on('click',function(){
	      //      $('#ConfigureNewNote_' + cStep.Number).popup('open',{transition:"slide", positionTo:"window"});
	      //	  });
	      $('#ConfigureNewNoteSubmit_' + cStep.Number).on('click',function(){
		      var cStep = r.merchantBeingConfigured.Configuration[0].Steps[$(this).attr('StepIndex')];
		      var configNoteNew = {MerchantId: r.merchantBeingConfigured.Id,
					   Note: $('#ConfigureNewNoteContents_' + cStep.Number).val(),
					   Type: 'NOTE_CONFIG',
					   MerchantConfigurationId: cStep.Id};
		      r.createConfigurationNote(configNoteNew,cStep.Number);
		      $('#ConfigureNewNoteContents_' + cStep.Number).val("");
		      $('#ConfigureNewNote_' + cStep.Number).popup('close');
		  });
	      $('#ConfigureNewNoteCancel_' + cStep.Number).on('click',function(){
		      var cStep = r.merchantBeingConfigured.Configuration[0].Steps[$(this).attr('StepIndex')];
		      $('#ConfigureNewNoteContents_' + cStep.Number).val("");
		      $('#ConfigureNewNote_' + cStep.Number).popup('close');
		  });
	      // ---

	      for(var subStepIndex = 0; subStepIndex < cStep.SubSteps.length; subStepIndex++) {
		  
		  cSubStep = cStep.SubSteps[subStepIndex];
		  
		  //Set handlers on checkboxes
		  $("#ConfigureCheck_" + cStep.Number + "_" + cSubStep.Number).click(function() {
			  var step_substep_pattern = /\d+/g;
			  var checkBoxId = $(this).attr('id');
			  var step_substep = checkBoxId.match(step_substep_pattern);
			  var isChecked = $(this).prop('checked');
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
			  var cSubStep = cStep.SubSteps[step_substep[1] - 1];
			  cSubStep.IsCompleted = isChecked;
			  r.setConfigureCheckBoxPair(cStep, cSubStep, true);
		      });
		  $("#ConfigureListCheck_" + cStep.Number + "_" + cSubStep.Number).click(function() {
                          var step_substep_pattern = /\d+/g;
                          var checkBoxId = $(this).attr('id');
                          var step_substep = checkBoxId.match(step_substep_pattern);
                          var isChecked = $(this).prop('checked');
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
			  var cSubStep = cStep.SubSteps[step_substep[1] - 1];
			  cSubStep.IsCompleted = isChecked;
			  r.setConfigureCheckBoxPair(cStep, cSubStep, true);
                      });
		  // ---
	      
		  //Initialize checkboxes
		  r.setConfigureCheckBoxPair(cStep, cSubStep,false);
		  // ---

		  //Initialize text Inputs
		  if(cSubStep.Input && cSubStep.Input != '#NA') {
		      if(cSubStep.IsCompleted){
			  $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
			  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
		      } else {
			  $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).attr('placeholder',cSubStep.Input);
			  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).attr('placeholder',cSubStep.Input);
		      }
		  }
		  // ---

		  //Set handlers for changes in Input
		  $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).change(function() {
			  var step_substep_pattern = /\d+/g;
                          var checkBoxId = $(this).attr('id');
                          var step_substep = checkBoxId.match(step_substep_pattern);
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
                          var cSubStep = cStep.SubSteps[step_substep[1] - 1];
			  cSubStep.Input = $(this).val();
			  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
			  r.configureUpdateSubStep(cSubStep);
		      });
		  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).change(function() {
			  var step_substep_pattern = /\d+/g;
                          var checkBoxId = $(this).attr('id');
                          var step_substep = checkBoxId.match(step_substep_pattern);
                          var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
                          var cSubStep = cStep.SubSteps[step_substep[1] - 1];
                          cSubStep.Input = $(this).val();
                          $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
			  r.configureUpdateSubStep(cSubStep);
		      });
		  // ---
	      }
	  }
      } catch (e) {
	  RSKYBOX.log.error(e, 'setConfigureStepsPages');
      }
  };
  
  r.setConfigureCheckBoxPair = function(step,substep,isUpdate) {
      try{  
	  RSKYBOX.log.info('entering','main.js.setConfigureCheckBoxPair');
	  
	  if(substep.IsCompleted) {
	      var isChecked = true;
	  } else {
	      var isChecked = false;
	  }
	  
	  if(isUpdate)
	      r.configureUpdateSubStep(substep);

	  var wizardCheck = $("#ConfigureCheck_" + step.Number + "_" + substep.Number);
	  var listCheck = $("#ConfigureListCheck_" + step.Number + "_" + substep.Number);

	  if(wizardCheck.parent().hasClass('ui-checkbox'))
	      wizardCheck.prop('checked',isChecked).checkboxradio('refresh');
	  else
	      wizardCheck.prop('checked',isChecked).checkboxradio();
	 
	  if(listCheck.parent().hasClass('ui-checkbox'))
	      listCheck.prop('checked',isChecked).checkboxradio('refresh');
	  else
	      listCheck.prop('checked',isChecked).checkboxradio();

      } catch (e) {
	  RSKYBOX.log.error(e,'setConfigureCheckBoxPair');
      }
  };

  //the ajax call for create configuration note
  r.createConfigurationNote = function(configNoteNew,stepnumber) {
      try{
          RSKYBOX.log.info('entering','main.js.createConfigurationNote');
	  
	  var closeurl = baseUrl + 'merchants/notes/create';
	  var jsonobj = JSON.stringify({MerchantId : configNoteNew.MerchantId,
					'Note' : configNoteNew.Note,
					'Type' : configNoteNew.Type,
					'MerchantConfigurationId' : configNoteNew.ConfigurationStepId});

	  $.ajax({
		  type: 'POST',
		      datatype: 'json',
		      data : jsonobj,
		      contentType: 'application/json',
		      url: closeurl,
		      statuscode: r.statusCodeHandlers(),
		      headers: {'Authorization' : r.getAuthorizationHeader()},
		      success: function(data){
                      try {
                          RSKYBOX.log.info('finished','createConfigurationNote');

			  var configureInsertNoteTemplate = _.template($('#ConfigureInsertNoteTemplate').html());
			  var noteHtml;

			  noteHtml = configureInsertNoteTemplate(data.Results[0]);
			  noteHtml = noteHtml.replace("ConfigureNote_Step_Id","ConfigureNote_" + stepnumber + "_" + data.Results[0].Id);
			  noteHtml = noteHtml.replace("ConfigureEditNote_Step_Id","ConfigureEditNote_" + stepnumber + "_" +  data.Results[0].Id);
							  
			  $('#ConfigurationInsertNotes_' + stepnumber).after(noteHtml);
			  $('#ConfigurationNotesList_' + stepnumber).listview('refresh');
                      } catch (e) {
                          RSKYBOX.log.error(e,'createConfigurationNote.success');
                      }},
                      error: function(error){
                      alert('Could not create new Configuration Note, error code:' + error.status);
                  }
              });
      } catch (e) {
          RSKYBOX.log.error(e, 'createConfigurationNote');
      }
  };

  //the ajax call for configuration update of a substep
  r.configureUpdateSubStep = function(subStep) {
      try{
          RSKYBOX.log.info('entering','main.js.configureUpdateSubStep');

          var closeurl = baseUrl + 'merchants/configuration/update';
          var jsonobj = JSON.stringify([{Id: subStep.Id,
					 Code: subStep.Code,
					 Input: subStep.Input,
					 IsCompleted: subStep.IsCompleted}]);

          $.ajax({
                  type: 'POST',
                      data: jsonobj,
                      datatype: 'json',
                      contentType: 'application/json',
                      url: closeurl,
                      statuscode: r.statusCodeHandlers(),
                      headers: {'Authorization' : r.getAuthorizationHeader()},
                      success: function(data, status, jqXHR) {
                      try {
			  RSKYBOX.log.info('finished','configureUpdateSubStep');
                      } catch (e) {
                          RSKYBOX.log.error(e,'configureUpdateSubStep.success');
                      }},  
		      error: function(error){
		      alert('Could not update merchant configuration process, error code:' + error.status);
		  }
              });
      } catch (e) {
          RSKYBOX.log.error(e, 'configureUpdateSubStep');
      }
  };
  
  try {
      r.router = new $.mobile.Router([
      { '.*':                    { handler: 'setupSession',        events: 'bs'  } },
      //      { '.*':                    { handler: 'flashCheck',        events: 's'   } },
      { '#login':                { handler: 'isLoggedIn',        events: 'bC', step: 'page' } },
      { '#login':                { handler: 'loginBeforeShow',   events: 'bs'  } },
      { '#login':                { handler: 'loginShow',         events: 's'   } },
      { '#selectMerchant':                 { handler: 'selectMerchantBeforeCreate',  events: 'bc'  } },
      { '#selectMerchant':                 { handler: 'selectMerchantInit',    events: 'i'  } },
      { '#selectMerchant':                 { handler: 'selectMerchantShow',    events: 's'   } },
      { '#selectMerchant':                 { handler: 'selectMerchantHide',    events: 'h'   } },
      { '#editMerchant':         { handler: 'editMerchantBeforeCreate',  events: 'bc' } },
      { '#editMerchant':         { handler: 'editMerchantShow',          events: 's'  } },
      { '#editMerchant':         { handler: 'editMerchantHide',          events: 'h'  } },
      { '#createNewMerchant':    { handler: 'createNewMerchantBeforeCreate', events: 'bc'} },
      { '#createNewMerchant':    { handler: 'createNewMerchantShow',         events: 's' } },
      { '#createNewMerchant':    { handler: 'createNewMerchantHide',         events: 'h' } },
      { '#merchantDisplay':		 { handler: 'merchantDisplayBeforeCreate',  events: 'bc'} },
      { '#merchantDisplay':      { handler: 'merchantDisplayShow',			events: 's' } },
      { '#merchantDisplay':      { handler: 'merchantDisplayHide',			events: 'h' } },
      { '#maps':                 { handler: 'mapsBeforeCreate',             events: 'bc'} },
      { '#maps':                 { handler: 'mapsShow',                     events: 's' } },
      { '#configure':            { handler: 'configureBeforeCreate',  events: 'bc'  } },
      { '#configure':            { handler: 'configureInit',    events: 'i'  } },
      { '#configure':            { handler: 'configureShow',    events: 's'   } }
    ], r.controller);
  } catch (e) {
    RSKYBOX.log.error(e, 'EXELON.main.router');
  }

  return r;
}(EXELON || {}, jQuery));
