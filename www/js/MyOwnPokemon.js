var captureImage = function(){
    navigator.camera.getPicture( imageCaptured, cameraError, { quality : 50,
        destinationType: Camera.DestinationType.DATA_URL    } );
}

var imageCaptured = function(imageData){
    ownImageData = ImageData;  
    $("#capturePokemonButton").html("Image loaded");
    var html = [];
    html.push(
        "<li>",
        "<a id='OwnPokemon'>",
        "<h2>",
        "OwnPokemon",
        "</h2>",
        "</a>",
        "</li>"
    );
    $("#PokeList").prepend(html.join());
}

var cameraError = function(err){
    
}

$("#capturePokemonButton").click(function(){
   captureImage(); 
});