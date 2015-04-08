// Current slide
var curSlide = 1;
var lastSlide = 0;

// Preload the slides and set the lastSlide number
function preloadSlide(number) {
    if (typeof number == 'undefined') {
      number = 1;
    }
    var img = new Image ();
    img.src = "slides/slide"+number+".svg";
    img.number = number;
    img.onload = function() {
        lastSlide = img.number
        preloadSlide(img.number+1);
    }
    img.onerror = function() {
        lastSlide = img.number - 1;
    }
}
preloadSlide(1);

// Get an unique pubnub id
var my_id = PUBNUB.uuid();

var pubnub_publish_key = 'demo'; // change this!
var pubnub_subscribe_key = 'demo'; // change this!

// Initialize with Publish & Subscribe Keys
var pubnub = PUBNUB.init({
    publish_key: pubnub_publish_key,
    subscribe_key: pubnub_subscribe_key,
    uuid: my_id
});

// Subscribe to a channel
pubnub.subscribe({
    channel: 'pubslides',
    presence: function(m){console.log(m)},
    message: parseMessage,
    heartbeat: 30,
    error: function (error) {
     // Handle error here
     console.log(JSON.stringify(error));
    }

});

// Parse messages received from PubNub platform
function parseMessage( message ) {
    if (typeof message.newSlide !== 'undefined') {
      newSlide(message.newSlide);
      // console.log(message.newSlide)
    } else {
      console.log(JSON.stringify(message))
    }
}

// Define a new slide
function newSlide(slideNumber){
    if ( typeof slideNumber == 'undefined') {
      slideNumber = 1;
    }
    if (slideNumber < 1 || slideNumber > lastSlide) {
      return;
    }
    curSlide = slideNumber;
    document.getElementById("slide").setAttribute("src", "slides/slide"+curSlide+".svg");
    resizeSlide(); // some slides can have different sizes
}

// change image aspect
function resizeSlide() {
  if (window.innerWidth > window.innerHeight) {
    var slide = document.getElementById("slide");
    slide.style.height = "100%";
    slide.style.width = "auto";
  } else {
    var slide = document.getElementById("slide");
    slide.style.height = "auto";
    slide.style.width = "100%";
  }
};

// Function to add a new event listener
var addEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};

// listen to changes into windows size
addEvent(window, "resize", resizeSlide);
