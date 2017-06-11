var subject = "";
window.onload = function(){
	var setButton = document.getElementById('submit');
	var subjectNode = document.getElementById('subject');
	setButton.addEventListener('click',function(){
		subject = subjectNode.value;
		/*chrome.runtime.sendMessage(subject, function(response) {
			console.log("done");
		});*/
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, subject, function(response) {
				console.log('done');
			});
		});
	});
}