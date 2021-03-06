var captureImage = function(){
    navigator.camera.getPicture( imageCaptured, cameraError, { quality : 50,
        destinationType: Camera.DestinationType.DATA_URL } );
}

var names = [
    "Fjaggot",
    "Fjaggiemon",
    "Tyrannosaurus Fjag",
    "Pickufjag",
    "Penisaur",
    "Fjaggatar",
    "GangaFjag",
    "Digimon"
]

var getName = function(){
    return names[Math.floor(Math.random() * names.length)];
}

var imageCaptured = function(ImageData){
    $("#CreateAction").html("Hey! What's this? A new Pokemon!");
    $("#CreatedPokeName").html("");
    $("#CreatedPokeImg").attr("src", "img/pokeball-waiting.gif");
     $.mobile.changePage("#OwnPokemonPage");
    setTimeout(function() {
        $("#CreateAction").html("Yes we caught it. What would it be?");
        $("#CreatedPokeImg").attr("src", "img/pokeball-done.gif");
        setTimeout(function() {
            $("#CreateAction").html("It's a");
            $("#CreatedPokeName").html(getName);
            $("#CreatedPokeImg").attr("src", "data:image/jpeg;base64," + ImageData); 
        }, 2000);
    }, 3000);
}

var cameraError = function(err){
    
}

$("#capturePokemonButton").on("tap", function(){
   captureImage(); 
});