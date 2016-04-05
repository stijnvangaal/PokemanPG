var captureImage = function(){
    navigator.camera.getPicture( imageCaptured, cameraError, { quality : 50,
        destinationType: Camera.DestinationType.FILE_URI    } );
}

var imageCaptured = function(imageUrl){
    window.localStorage.setItem(ownPokemonKey, imageUrl);
    $("#capturePokemonButton").html(imageUrl);
    $("#capturePokemonImg").src = imageUrl;
}

var cameraError = function(err){
    
}

$("#capturePokemonButton").click(function(){
   captureImage(); 
});