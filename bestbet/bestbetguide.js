// JavaScript Document  bestbetguide.js
// LibGuides API v1.1
// Returns "Best Bets" database results for default subject(s) and guide subject(s)

$(function(){
	
	// default subjects
	var defaultArray = []; // add one or more default subjects - example: ['art','art history']
	
	// api variables
	var apiSite = 'xxxxxxxxxx'; // your libguide api site_id
	var apiKey = 'xxxxxxxxxx'; // your libguide api key
	
	// empty undefined null check
	function isEmpty(str) {
		
		return typeof str == 'string' && !str.trim() || typeof str == 'undefined' || str === null;
		
	}
	
	function getSubject(){
		
		return new Promise(function (resolve, reject) {
			
			// get metadata
			var metaURL = $('meta[name="DC.Identifier"]').attr("content");
			
			// get login link
			var loginLink = $("#s-lib-footer-login-link").html();
			
			// get guide id
			var guideID = '';
			if (!isEmpty(metaURL)){
				
				var search = metaURL.search(/g=(\d*)/);
				if (search > -1){
					
					guideID = metaURL.match(/g=(\d*)/).pop();
					
				}
				
			}
			else if (!isEmpty(loginLink)){
				
				var search = loginLink.search(/g.\d*[A-Z](\d*)/);
				if (search > -1){
					
					guideID = login_link.match(/g.\d*[A-Z](\d*)/).pop();
					
				}
				
			}
			
			if (!isEmpty(guideID)){
				
				// build json guide url
				var guideURL = 'https://lgapi.libapps.com/1.1/guides/' + guideID + '?site_id=' + apiSite + '&key=' + apiKey + '&expand=subjects';
				
				// get json data
				$.getJSON(guideURL, function(data) {
					
					// get subject id:name
					var guideArray = [];
					$.each(data, function(indexGuide, guide){
						
						var guideSubject = guide.subjects;
						if (!isEmpty(guideSubject)){
							
							$.each(guide.subjects, function(index_subject, subject){
								
								guideArray.push(subject.name);
								
							});
							
						}
						
					});
					
					var mergeArray = $.merge(guideArray, defaultArray);
					if (!$.isEmptyObject(mergeArray)){
						
						resolve(mergeArray);
						
					}
					else{
						
						reject(guideID);
						
					}
					
				});
				
			}
			else if (!$.isEmptyObject(defaultArray)){
				
				resolve(defaultArray);
				
			} else {
				
				reject(guideID);
				
			}
			
		})
		
	}
	
	getSubject().then(function(subjectResult) {
		
		// build json asset url
		var assetURL = 'https://lgapi.libapps.com/1.1/assets?site_id=' + apiSite + '&key=' + apiKey + '&asset_types=10&expand=subjects';
		
		// get subjects
		if (!$.isEmptyObject(subjectResult)){
			
			// get json data
			$.getJSON(assetURL, function(data) {
				
				// convert subjects to lowercase
				var subjectArray = $.map(subjectResult, function(str){return str.toLowerCase();});
				
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
			
		}
		
	}).catch(function(error) {
		
		$('body').append('No subjects are available.');
		
	})
	
});
