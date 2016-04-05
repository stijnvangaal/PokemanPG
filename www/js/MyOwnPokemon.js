var captureImage = function(){
    navigator.camera.getPicture( imageCaptured, cameraError, { quality : 50,
        destinationType: Camera.DestinationType.DATA_URL    } );
}

var imageCaptured = function(imageUrl){
    window.localStorage.setItem(ownPokemonKey, imageUrl);
    $("#capturePokemonButton").html(imageUrl);
    $("#capturePokemonImg").src = "data:image/jpeg;base64," + imageUrl;
}

var cameraError = function(err){
    
}

$("#capturePokemonButton").click(function(){
   captureImage(); 
});