//Check if messages are loaded. I somehow was unable to make window.onload work for discord. Better ideas?
var checkIfLoaded = setInterval(function(){
	var messagesWrapper = document.getElementsByClassName('scroller messages');
	if (messagesWrapper.length!=0) {
		okSoWeReDoingIt(messagesWrapper);
		
	} else {
		console.log('nope!');
	}
},5000)

//iterating through messages and firing addButton function
var okSoWeReDoingIt = function(messagesWrapper){
	clearInterval(checkIfLoaded);
	var messages = messagesWrapper[0].children;
		for (var i=0; i<messages.length; ++i){
			//console.log(messages[i].innerHTML)
			if (messages[i]!==null){
				addButton(messages[i]);
			}
		}
}

//adds a button (need to work on that css to make it look pretty(ier?)). The button itself doesn't do much yet but I am able to pull message text if needed
var addButton=function(message) {
	var innerMessage = message.getElementsByClassName('message-text')[0];
	if (typeof innerMessage!=='undefined'){
		//console.log(innerMessage.innerHTML);
		var archiveButton = document.createElement('div');
		archiveButton.setAttribute('class','archiveButton');
		archiveButton.innerHTML='ARCHIVE!';
		innerMessage.appendChild(archiveButton);
	}
}
