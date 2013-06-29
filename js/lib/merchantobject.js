var MERCHANT = (function($){
	/*propNames correspond with the merchant object returned by calls to Merchant Create API*/
	return {merchantDisplay : [
		  { propName: "AcceptTerms",           displayText: "Accepted the terms and conditions?", inputType: "checkbox", required:true},
		  { propName: "EIN",                   displayText: "Company Employer ID Number",         inputType: "text",     required:true},
		  { propName: "Street",                displayText: "Street Address",                     inputType: "text",     required:true},
		  { propName: "City",                  displayText: "City",                               inputType: "text",     required:true},
		  { propName: "State",                 displayText: "State",                              inputType: "text",     required:true},
		  { propName: "ZipCode",               displayText: "Zip Code",                           inputType: "text",     required:true},
		  { propName: "Name",                  displayText: "Company Name",                       inputType: "text",     required:true},
		  { propName: "Password",              displayText: "Password",                           inputType: "text",     required:true},
		  { propName: "PaymentAccepted",       displayText: "Credit Cards Accepted",              inputType: "text",     required:true},
		  { propName: "TypeId",                displayText: "Merchant Classification",            inputType: "text",     required:true},
		  { propName:"InvoiceExpiration",      displayText: "Invoice Experation Time",            inputType: "text",     required:false},
		  { propName: "InvoiceExpirationUnit", displayText: "Invoice Experation Unit",            inputType: "text",     required:false},
		  { propName: "StartWorkHour",         displayText: "Restaurant Work Start",              inputType: "text",     required:true},
		  { propName: "EndWorkHour",           displayText: "Restaurant Work End",                inputType: "text",     required:true},
		  { propName: "POS",                   displayText: "POS Type",                           inputType: "select",   required:false, options: ["POS_MICROS", "POS_ISIS", "POS_ALOHA"]},
		  { propName: "eMail",                 displayText: "Email",                              inputType: "text",     required:true},
		  { propName: "TwitterHandler",        displayText: "Twitter Handler",                    inputType: "text",     required:false},
		  { propName: "FacebookHandler",       displayText: "Facebook Handler",                   inputType: "text",     required:false},
		  { propName: "DeviceId",              displayText: "DeviceId",                           inputType: "text",     required:false},
		  { propName: "PushType",              displayText:"Push Type",                           inputType: "text",     required:false},
		  { propName: "MinReviewThreshold",    displayText: "Minimum Review Threashold",          inputType: "text",     required:true},
		  { propName: "MaxReviewThreshold",    displayText: "Maximum Review Threashold",          inputType: "text",     required:true},
		  { propName: "CurrentCreditRate",     displayText: "Current Credit Rate",                inputType: "text",     required:false},
		  { propName: "CurrentCreditFee",      displayText: "Current Credit Fee",                 inputType: "text",     required:false}
  ]};
}(jQuery));