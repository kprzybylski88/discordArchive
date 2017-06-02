//Check if messages are loaded. I somehow was unable to make window.onload work for discord. Better ideas?
var checkIfLoadedFun = function(){
	var checkIfLoaded = setInterval(function(){
		console.log('checking')
		var messagesWrapper = document.getElementsByClassName('scroller messages');
		if (messagesWrapper.length!=0) {
			clearInterval(checkIfLoaded);
			okSoWeReDoingIt(messagesWrapper);
				
	} else {
		console.log('nope!');
	}
},1000);
}

checkIfLoadedFun();

//iterating through messages and firing addButton function
var okSoWeReDoingIt = function(messagesWrapper){
	
	//somehow I could not add MutationObserver for channel changing (it didn't fire) so I added click listener. Problem is the same needs to be done for unhiding and hiding channels. And for guild change ¯\_(ツ)_/¯
	var channelList = document.getElementsByClassName('channel channel-text');
	for (var i=0; i<channelList.length; ++i) {
		channelList[i].addEventListener('click', function(){
			checkIfLoadedFun(); //this fucks something up with intervals clearing.
		});
	}
	
	//initial iteration through messages to add archive button
	var messages = messagesWrapper[0].children;
	for (var i=0; i<messages.length; ++i){
		if (messages[i]!==null){
			addButton(messages[i]);
		}
	}
	//here we watch if new messages were loaded by scrolling
	var scrollObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i = 0; i < mutation.addedNodes.length; i++) {
				addButton(mutation.addedNodes[i]);
			}
		});
	});
	scrollObserver.observe(messagesWrapper[0], { attributes: true, childList: true, characterData: true });

}

//adds a button (need to work on that css to make it look pretty(ier?)). The button itself doesn't do much yet but I am able to pull message text if needed
var addButton=function(message) {
	doneButtons=true;
	var innerMessage = message.getElementsByClassName('message-text')[0];
	if (typeof innerMessage!=='undefined' && innerMessage.getElementsByClassName('archiveButton').length==0){
		//console.log(innerMessage.innerHTML);
		var archiveButton = document.createElement('div');
		archiveButton.setAttribute('class','archiveButton');
		archiveButton.innerHTML='ARCHIVE!';
		archiveButton.addEventListener('click',function(){archiveMessage(this)});
		innerMessage.appendChild(archiveButton);
	}
}

var archiveMessage=function(buttonC) {
	console.log(buttonC.parentNode.parentNode.innerHTML);
}