// JavaScript Document bestbetbasic.js
// Springshare API usage may be subject to Springshare license agreement
// LibGuides API v1.1
// Returns "Best Bets" database results for chosen subject(s)

$(function(){
	
	// subject name
	var subjects = ['xxxxxxxxxx']; // add one or more subjects - example: ['art','art history']
	
	// api variables
	var apiSite = 'xxxxxxxxxx'; // your libguide api site_id
	var apiKey = 'xxxxxxxxxx'; // your libguide api key
	
	// build json url
	var jsonURL = 'https://lgapi.libapps.com/1.1/assets?site_id=' + apiSite + '&key=' + apiKey + '&asset_types=10&expand=subjects';
	
	// get json data
	$.getJSON(jsonURL, function(data) {
	
		// convert subjects to lowercase
		var subjectArray = $.map(subjects, function(str){return str.toLowerCase();});
	
		// get asset id:url:name
		var objectArray = [];
		$.each(data, function(indexAsset, asset){
			
			// get best bet assets matching subject
			var idArray = [];
			if (!$.isEmptyObject(asset.subjects)){
				
				$.each(asset.subjects, function(indexSubject, subject) {
					
					if ($.inArray(subject.name.toLowerCase(), subjectArray) >= 0 && subject.featured == '1'){
						
						idArray.push(asset.id);
						
					}
					
				});
				
			}
			
			// get unique asset id:url:name
			idArray = $.unique(idArray);
			if ($.inArray(asset.id, idArray) >= 0) {
				
				assetObject = {}
				assetObject ["id"] = asset.id;
				assetObject ["name"] = asset.name;
				assetObject ["url"] = asset.url;
				
				objectArray.push(assetObject);
			}
			
		});
		
		// sort assets alphabetically by name
		objectArray.sort(function(a, b) {
			
			return a.name.localeCompare(b.name);
			
		});
		
		// append each asset link to html
		$.each(objectArray, function(objectIndex, object) {
			
			// modify based on local needs
			$('body').append('<a href="' + object.url + '">' + object.name + '</a>');
			$('body').append('<br>');
			
		});
		
	});
	
});