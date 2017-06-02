//Check if messages are loaded. I somehow was unable to make window.onload work for discord. Better ideas?
var checkIfLoadedFun = function(){
	var checkIfLoaded = setInterval(function(){
		//console.log('checking')
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
			checkIfLoadedFun(); //this fucks something up with intervals clearing. I countered it and all intervals are cleared in the end but still.
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

//adds a button (need to work on that css to make it look pretty(ier?)).
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

//gets the message (now embeded in all html gibberish) and username of person archivibg and channel name
var archiveMessage=function(buttonC) {
	//console.log('y');
	var allMessageInfo = buttonC.parentNode.parentNode.parentNode.parentNode;
	var message = joinMessages(allMessageInfo.getElementsByClassName('markup'));
	var messager = allMessageInfo.getElementsByClassName('user-name')[0].innerHTML;
	var timestamp = allMessageInfo.getElementsByClassName('timestamp')[0].innerHTML;
	var archiverUsername = document.getElementsByClassName('account-details')[0].getElementsByClassName('username')[0].innerHTML + cropBetweenStrings(document.getElementsByClassName('account-details')[0].getElementsByClassName('discriminator')[0].innerHTML,'<!--','-->');
	var channel = document.getElementsByClassName('title-wrap')[0].getElementsByClassName('channel-name')[0].innerHTML;
	console.log('messager: '+messager+'\ntimestamp: '+timestamp+'\nmessage: '+message+'\n\narchiver: '+archiverUsername+'\n\nchannel: '+channel);
}

var joinMessages = function(messageFragments) {
	var messageJoined="";
	for(var i=0; i<messageFragments.length;++i){
		messageJoined += messageFragments[i].innerHTML+'\n';
	}
	messageJoined = cropBetweenStrings(messageJoined,'<!--','-->')
	return messageJoined.substring(0,messageJoined.length-1);
}

var cropBetweenStrings = function(stringToCrop,startString,stopString) {
	croppedString = stringToCrop;
	stringStillThere=true;
	while(stringStillThere) {
		var positionStart = croppedString.indexOf(startString);
		var positionStop = croppedString.indexOf(stopString);
		//console.log(positionStart+" "+positionStop);
		if (positionStop === -1 || positionStart === -1) {
			stringStillThere = false;
		} else {
			croppedString = croppedString.substring(0,positionStart) + croppedString.substring(positionStop+stopString.length,croppedString.length);
		}
	}
	return croppedString;
}