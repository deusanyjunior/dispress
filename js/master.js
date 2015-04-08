/*
 master
*/

var div_timer = null
var img_slide = null
var img_previous_slide = null
var img_next_slide = null

// start the main variables
function initAll() {
  img_slide = document.getElementById("slide");
  img_previous_slide = document.getElementById("previous_slide");
  img_next_slide = document.getElementById("next_slide");
  div_timer = document.getElementById("timer");
  resizeAll();
  newSlide(1);
}

// Current slide
var curSlide = 1;
var lastSlide = 0;

// Preload the slides and set the lastSlide number
function preloadSlide(number) {
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

// PubNub

// Get an unique pubnub id
var my_id = PUBNUB.uuid();

// Initialize with Publish & Subscribe Keys
var pubnub = PUBNUB.init({
    publish_key: 'demo',
    subscribe_key: 'demo',
    uuid: my_id
});

// Subscribe to a channel
pubnub.subscribe({
    channel: 'pubslides',
    presence: function(m){console.log(m)},
    message: parseMessage,
    error: function (error) {
     // Handle error here
     console.log(JSON.stringify(error));
    }
});

// Parse messages received from PubNub platform
function parseMessage( message ) {
    // ignore my messages
    if (message.my_id === my_id) {
      // console.log('my message: ' + JSON.stringify(message))
      return;
    }
    if (typeof message.newSlide !== 'undefined') {
      newSlide(message.newSlide);
      // console.log(message.newSlide)
    } else {
      console.log(JSON.stringify(message))
    }
}

// Define a new slide
function newSlide(slideNumber){
    if (slideNumber < 1 || slideNumber > lastSlide) {
      return;
    }
    curSlide = slideNumber;
    img_slide.setAttribute("src", "slides/slide"+curSlide+".svg");

    if (curSlide == 1) {
      img_previous_slide.setAttribute("src", "images/pubslidesfirst.svg");
    } else {
      img_previous_slide.setAttribute("src", "slides/slide"+(curSlide-1)+".svg");
    }

    console.log(curSlide+" "+lastSlide);
    if (curSlide == lastSlide) {
      img_next_slide.setAttribute("src", "images/pubslideslast.svg");
    } else {
      img_next_slide.setAttribute("src", "slides/slide"+(curSlide+1)+".svg");
    }
}

// Go to previous slide
function prevSlide(){
    if (curSlide === 1) {
      return;
    }

    img_next_slide.setAttribute("src", "slides/slide"+curSlide+".svg");
    curSlide = curSlide - 1;
    img_slide.setAttribute("src", "slides/slide"+curSlide+".svg");
    if (curSlide === 1) {
      img_previous_slide.setAttribute("src", "images/pubslidesfirst.svg");
    } else {
      img_previous_slide.setAttribute("src", "slides/slide"+(curSlide-1)+".svg");
    }

    pubnub.publish({
          channel: 'pubslides',
          message: {"newSlide": curSlide, "my_id": my_id}
    });
}

// Go to next slide
function nextSlide(){
    if (curSlide === lastSlide) {
        return;
    }

    img_previous_slide.setAttribute("src", "slides/slide"+curSlide+".svg");
    curSlide = curSlide + 1;
    img_slide.setAttribute("src", "slides/slide"+curSlide+".svg");
    if (curSlide === lastSlide) {
      img_next_slide.setAttribute("src", "images/pubslideslast.svg");
    } else {
      img_next_slide.setAttribute("src", "slides/slide"+(curSlide+1)+".svg");
    }

    pubnub.publish({
          channel: 'pubslides',
          message: {"newSlide": curSlide, "my_id": my_id}
    });
    resizeAll();
}


// Timer

var timer_paused = true;
var m = 0;
var s = 0;

// add zero in front of seconds < 10
function checkSeconds(i) {
    if (i<10) {i = "0" + i};
    return i;
}

// update the time second by second
function timerUpdate() {
  if (timer_paused) return;
  if (s == 59) {
    s = 0;
    m = m + 1;
  } else {
    s = s + 1;
  }
  div_timer.innerHTML = m+":"+checkSeconds(s);
  var t = setTimeout(function(){timerUpdate()},1000);
}

// start the timer
function timerPlay() {
  timer_paused = false;
  newSlide(curSlide);
  timerUpdate();
}

// pause de timer
function timerPause() {
  timer_paused = true;
}

// stop the timer
function timerStop() {
  timer_paused = true;
  m = 0;
  s = 0;
  div_timer.innerHTML = m+":"+checkSeconds(s);
}


// Control

// receive the object clicked and run its specific function
function replyClick(clicked_id) {
  switch(clicked_id) {
    case 'previous':
    case 'btn_previous':
      prevSlide();
      break;
    case 'btn_stop':
        timerStop();
        break;
    case 'btn_play':
      timerPlay();
      break;
    case 'btn_pause':
      timerPause();
      break;
    case 'btn_next':
    case 'next':
      nextSlide();
      break;
    default:
      break;
  }
}


// Events

// Verify key pressed and do some action
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode === 39) {
      nextSlide();
    } else if (e.keyCode === 37) {
      prevSlide();
    }
}

// resize all items depending on the size of the screen
function resizeAll() {
    if (window.innerWidth > window.innerHeight) {
      img_slide.style.width = "auto";
      img_slide.style.height = "100%";
      img_previous_slide.style.width = "auto";
      img_previous_slide.style.height = "100%";
      img_next_slide.style.width = "auto";
      img_next_slide.style.height = "100%";
    } else {
      img_slide.style.width = "100%";
      img_slide.style.height = "auto";
      img_previous_slide.style.width = "100%";
      img_previous_slide.style.height = "auto";
      img_next_slide.style.width = "100%";
      img_next_slide.style.height = "auto";
    }
    div_timer.style.fontSize = div_timer.offsetHeight+"px";
}

// Function to configure a new event listener
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

// listen to keys pressed
addEvent(document, "keydown", checkKey);

// listen to changes in windows size
addEvent(window, "resize", resizeAll);
