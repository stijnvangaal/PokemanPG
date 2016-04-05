var captureImage = function(){
    navigator.camera.getPicture( imageCaptured, cameraError, { quality : 50,
        destinationType: Camera.DestinationType.DATA_URL    } );
}

var imageCaptured = function(imageData){
    ownImageData = new Image();
    ownImageData.src = "data:image/jpeg;base64," + ImageData; 
    $("#capturePokemonImg").attr("src", ownImageData); 
    var html = [];
    html.push(
        "<li>",
        "<a id='OwnPokemon'>",
        "<h2>",
        "Own Pokemon",
        "</h2>",
        "</a>",
        "</li>"
    );
    $("#PokeList").prepend(html.join(""));
}

var cameraError = function(err){
    
}

$("#capturePokemonButton").click(function(){
   captureImage(); 
});