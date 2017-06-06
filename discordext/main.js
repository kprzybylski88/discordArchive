var addedChannels=[];
//Check if messages are loaded. I somehow was unable to make window.onload work for discord. Better ideas?
var checkIfLoadedFun = function(className, fun){
	var checkIfLoaded = setInterval(function(){
		var classTocheck = document.getElementsByClassName(className);
		if (classTocheck.length!=0) {
			clearInterval(checkIfLoaded);
			fun(classTocheck);	
		} else {
			console.log('nope!');
		}
	},1000);
}


//iterating through messages and firing addButton function
var okSoWeReDoingIt = function(messagesWrapper){
		
	//channelChange();

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

	var channelObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i = 0; i < mutation.addedNodes.length; i++) {
				channelChange();
			}
		});
	});
		
		channelObserver.observe(document.getElementsByClassName('scroller guild-channels')[0],{ attributes: true, childList: true, characterData: true });
}

//somehow I could not add MutationObserver for channel changing (it didn't fire) so I added click listener. Problem is the same needs to be done for unhiding and hiding channels. And for guild change ¯\_(ツ)_/¯
var channelChange = function() {
	var channelList = document.getElementsByClassName('channel channel-text');
	for (var i=0; i<channelList.length; ++i) {
		if (addedChannels.indexOf(channelList[i]) === -1) {
			channelList[i].addEventListener('click', function(){
				checkIfLoadedFun('scroller messages',okSoWeReDoingIt); //this fucks something up with intervals clearing. I countered it and all intervals are cleared in the end but still.
			});
			addedChannels.push(channelList[i]);
		}
	}
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

//gets the message with details like timestamp and person sending it, username of person archiving and channel name.
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

//stuff got too long so I am making several separate messages into one here
var joinMessages = function(messageFragments) {
	var messageJoined="";
	for(var i=0; i<messageFragments.length;++i){
		messageJoined += messageFragments[i].innerHTML+'\n';
	}
	messageJoined = cropBetweenStrings(messageJoined,'<!--','-->')
	return messageJoined.substring(0,messageJoined.length-1);
}

//utility function that removes text from between two strings
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


checkIfLoadedFun('scroller messages',okSoWeReDoingIt);