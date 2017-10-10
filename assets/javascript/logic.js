//Firebase
  
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDYuGVMxvg0yfh_QlEp4by3sOKaUymg5dU",
  authDomain: "bored-on-friday.firebaseapp.com",
  databaseURL: "https://bored-on-friday.firebaseio.com",
  projectId: "bored-on-friday",
  storageBucket: "bored-on-friday.appspot.com",
  messagingSenderId: "8099200900"
};
firebase.initializeApp(config);

var database = firebase.database();
var name = "";
var zipcode = "";



function welcome(showing) {
  if(showing === false) {
    $("#welcomeModal").modal({"show": "true", /*"backdrop": "static"*/});
    setTimeout(function() {
      $("#welcomeMessage").append("<br>Lets get started...")
    },0);
    setTimeout(function() {
      $("#welcomeModalBody").removeClass("invisible")
    },0);
    welcomeModal = true;

  }
  else {
    $("#welcomeModal").modal("show", "false");
    welcomeModal = false;
  }
}

// console.log($("#welcomeModal"));
var welcomeModal = false;
$(window).on("load", function() {
  welcome(welcomeModal);
  // setTimeout(welcome, 500);
  // setTimeout(function() {
  //   $("#welcomeMessage").append("<br>Lets get started...")
  // },2500);
  // setTimeout(function() {
  //   $("#welcomeModalBody").removeClass("invisible")
  // },4000);


  $("#launchModal").on("click", function() {
    welcome(welcomeModal);  
  });

  $("#deck").on("click", ".contentCard", function() {
    var card = $(this);
    console.log(card);
    var pop = $("#popover-temp").find('.popover').eq(0);
    pop.attr('data-name', card.attr('data-name'));
    pop.attr('data-image', card.attr('data-image'));
    pop.attr('data-url', card.attr('data-url'));
    console.log(pop);
    popYesBtn = pop.find('.yes').eq(0);
    popYesBtn.attr('href', card.attr('data-url'));

    var popTemp = $("#popover-temp").html();
    console.log(popTemp);
    var popContent = $("<div>");
    var popContentDes = $("<p>");
    popContent.empty();
    popContent.append("<p>"+"Date: " + card.attr('data-date')+"</p>");
    popContent.append("Time: " + card.attr('date-time')+"<br>");
    popContentDes.append("<p>"+"Description: " + card.attr('data-description')+ "</p>");
    popContent.append(popContentDes);
    
    console.log({popContent});
    $(this).popover({
      html: true,
      // template: ($("#popover-temp").find('.popover')[0]),
      template: popTemp,
      content: function() {
        console.log("hello I am popover");
        return popContent.html();
      },
    });

    $(this).popover("toggle");
    // console.log(card);
    
  })
});

//ticket master
$(".entertainmentBtn").on("click",function(event){
  
  event.preventDefault();
  // Hides modal after clicking
  $("#welcomeModal").modal('hide');
  $("#deck").empty();

  //console.log($("#name").val().trim());
  //console.log($("#zipcode").val().trim());

  var Url = "https://app.ticketmaster.com/discovery/v2/events.json?&sort=date,asc&";
  var apikey = "&apikey=JRiceOsMrH7LY3ePHpJNLPjE1ZgeFGAD"
  var zipcodeUrlPath = "&postalCode="; 
  zipcode = $("#zipcode").val().trim();
  name = $("#name").val().trim();
  var size = "size=" + 12;
  var date = "&onsalesEndDateTime=" + moment().format("YYYY-MM-DD");
  var queryUrl = Url + size + date + zipcodeUrlPath +zipcode + apikey;
  // console.log(date);
  // console.log(queryUrl);

// Ajax call
  $.ajax({
      url: queryUrl,
      method: "GET",
      error: function (request, status, error) {
                  alert("Your disconneted");
      },
  }).done(function(response) {
      
    // console.log(response);
    var results = response._embedded.events;
    // console.log(results);      

//iterate all events 

    for(var i = 0;i < results.length; i++){

      var cardDiv = $("<div>");
      cardDiv.addClass("col-xs-4");
      cardDiv.addClass("contentCard");
      cardDiv.attr("data-name", results[i].name);
      cardDiv.attr("data-title",results[i].name);
      cardDiv.attr("data-description",results[i].info);
      cardDiv.attr("data-date", results[i].dates.start.localDate);
      var localTime = results[i].dates.start.localTime;
      cardDiv.attr("data-time", moment(localTime, 'HH:mm').format('hh:mm a'));
      cardDiv.attr("data-url",results[i].url);
      cardDiv.attr("data-placement","auto right");
      cardDiv.attr("data-toggle","popover");
      // added by JWong
      cardDiv.attr("data-trigger", "manual");

      // console.log(localTime);
      // console.log(moment(localTime, 'HH:mm').format('hh:mm a'));

      var eventName = $("<p>");
      eventName.html(results[i].name);
      
      var eventPoster = $("<img>");
      //eventPoster.html(results[i].images[1].url);
      eventPoster.attr("src",results[i].images[1].url);
      eventPoster.attr("class","img-responsive");
      cardDiv.attr("data-image",results[i].images[1].url);
      
      cardDiv.append(eventName);
      cardDiv.prepend(eventPoster);

      $("#deck").append(cardDiv);
              
    }
  })
}); //End Ticket Master Button Listener


//EventBrite
$(".eventsBtn").on("click",function(){

    event.preventDefault();
      // Hides modal after clicking
    $("#welcomeModal").modal('hide');
    $("#deck").empty();
    
    console.log($("#name").val().trim());
    console.log($("#zipcode").val().trim());
    name = $("#name").val().trim();
    var url= "https://www.eventbriteapi.com/v3/events/search/?date_modified.keyword=today&";
    var zipcodeUrlPath = "location.address=";
    zipcode = $("#zipcode").val().trim();
    var token = "&token=VHOSAZQCRGKLWAAH7UX2" 
    var queryUrl = url + zipcodeUrlPath+ zipcode + token;
    console.log(queryUrl);

  // Ajax call
  $.ajax({
    url: queryUrl,
    method: "GET",
    error: function (request, status, error)
     {
        alert("Your disconneted!!!");
     },
  }).done(function(response) {
        
    console.log(response);

    var results = response.events;
    console.log(results);      

//iterate all events 

    for(var i = 0;i < 12; i++){

      var cardDiv = $("<div>");
      cardDiv.addClass("col-xs-4");        
      cardDiv.addClass("contentCard");
      cardDiv.attr("data-url",results[i].url);
      cardDiv.attr("data-name",results[i].name.text);
      cardDiv.attr("data-description", results[i].description.text);
      cardDiv.attr("data-placement","auto right");
      cardDiv.attr("data-title",results[i].name.text);
      cardDiv.attr("data-toggle","popover");
      // added by JWong
      cardDiv.attr("data-trigger", "manual");
      

      //attribute for data-date
      var localTime = results[i].start.local;
      var dateSplit = localTime.split("T");
      var dateArray = dateSplit[0];
      // localTime.split("T")
      cardDiv.attr("data-date",dateArray);
      //attribute for data-time
      var timeArray = dateSplit[1];
      cardDiv.attr("date-time", timeArray);

      var eventName = $("<p>");
      eventName.html(results[i].name.text);
      
      var eventPoster = $("<img>");
      cardDiv.attr("data-image", results[i].logo.url);
      // eventPoster.html(results[i].images[1].url);
      eventPoster.attr("src",results[i].logo.url);
      eventPoster.attr("class","img-responsive");
      
      cardDiv.append(eventName);
      cardDiv.prepend(eventPoster);

      $("#deck").append(cardDiv);
              
    }

    })
    
}); //end eventBrite Button Listener

// JWong version
$("#deck").on("click", ".popover-footer .yes", function() {
  $(this).parents(".popover").popover('destroy');
  var thisDiv = $(this);
  var thisPop = thisDiv.parents('.popover').eq(0);
  console.log({thisDiv});
  console.log({thisPop});
  var eventName = thisPop.data("name");
  var eventPoster = thisPop.data("image");
  var eventUrl = thisPop.data("url");
  var newEvent = database.ref().push();

  console.log({name});
  console.log({zipcode});
  console.log("event name" + eventName);
  console.log("event poster" + eventPoster);
  console.log("new Event" + newEvent);

  newEvent.set({
    nameFB: name,
    zipcodeFB: zipcode,
    eventNameFB: eventName,
    eventPosterFB: eventPoster,
    eventURLFB: eventUrl,
  });
}); //end yes button listeners

$("#deck").on("click", ".popover-footer .no", function() {
  $(this).parents(".popover").popover('destroy');
});
database.ref().on("child_added", function(childSnapShot) {

  console.log(childSnapShot.val());

  var bannerName = childSnapShot.val().nameFB;
  var bannerEventName = childSnapShot.val().eventNameFB;
  var bannerEventPoster = childSnapShot.val().eventPosterFB;
  var bannerUrl = childSnapShot.val().eventURLFB

  console.log(bannerName);
  console.log(bannerEventPoster);
  console.log(bannerEventName);

  var bannerContainer = $("<div>");
  var bannerInnerDiv = $("<span>");
  // For the banner-josh
  var bannerInnerLink = $("<a>");
  bannerInnerLink.attr("href", bannerUrl);
  bannerInnerLink.attr("target","_blank")
  bannerInnerDiv.addClass("bannerCardContent");
  bannerInnerDiv.attr("src", bannerEventPoster);
  bannerInnerDiv.addClass("mySlides w3-animate-right")
  // bannerInnerImg.css("style", "100%" )
  var bannerInnerP = $("<p>");
  bannerInnerP.html(bannerName);
  var bannerInnerImg = $("<img>");
  bannerInnerImg.attr("src",bannerEventPoster);
  // Josh addition
  bannerInnerImg.attr("width", "300px");

  bannerInnerDiv.append(bannerInnerP);
  bannerInnerLink.append(bannerInnerImg);
  bannerInnerDiv.append(bannerInnerLink);
  bannerContainer.append(bannerInnerDiv);

  // $(".slick-track").append(bannerContainer);
$('#banner').slick('slickAdd',bannerContainer);

  
  // carousel();
 
});


$("#zipcode").focusout(function(){
  var zipcode =$(this).val();
  galoreUrl = "http://api.zippopotam.us/us/";

  var queryUrl = galoreUrl + zipcode;
  console.log(queryUrl);

  $.ajax ({
    url: queryUrl,
    method: "GET"
  }).done(function(response){

    console.log(response);
    $("#welcomeModalBody").find('.interest-btn').prop("disabled", false);
    // if (Object.keys(response).length === 0){
    //   console.log("not a good zipcode")
    // }
    // else {
    //   console.log(response + "this is good");
    // }
    console.log("good zip code");

  }).fail(function(response) {

    console.log("bad zip");
    $("#zipcode").addClass('animated shake')
    .one('webkitAnimationEnd oanimationend animationend', function() {
      $("#zipcode").removeClass('animated shake');
    });
    $("#welcomeModalBody").find('.interest-btn').prop("disabled", true);
  })

});


  $("#banner").slick({
    // setting-name: setting-value
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  });

    
  
//   myIndex ++;

//   myIndex = 0;
// function carousel(){
//   var bannerSlides = $(".bannerCardContent");
//   var displayNone = "none";
//   var displayBlock = "block";

//   for ( var i = 0; i < bannerSlides.length; i++){
//     console.log(bannerSlides[i]);
//     bannerSlides[i].style = displayBlock
//   }


//   //  for ( var i = 0; i < x.length; i++) { 
//   //   x[i].style.display = "none";
//   // }
//   // console.log()
  
//   // myIndex ++;

//   // if(myIndex > x.length) {
//   //   myIndex = 1
//   // }
//   // console.log(x[myIndex-1]);
//   // x[myIndex-1].style.display = "block";
//   // setTimeout(carousel, 4000);
// }


// // for (var i = 0; i < x.length;; i++){
// //   x[i].
// // }





