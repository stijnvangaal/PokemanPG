var livePokemon = JSON.parse(window.localStorage.getItem(livePokemonKey));
var livePokemonAmount = 10;
var pokemonGenerateLng = 5.293565;
var PokemonGenerateLat = 51.690155;
var PokemonGenerateRad = 1000;
var catchRaduis = 10/111300; //10 meters



var startGenerateLivePokemon = function(amount){
    if(totalPokeCount == 0){
        $.get("http://pokeapi.co/api/v2/pokemon/?limit=1&offset=0", function(data, success){
            totalPokeCount = data.count;
            generateLivePokemon(amount);
        });
    }
    else{
        generateLivePokemon(amount);
    }
}

var generateLivePokemon = function(amount){
    for(var i = 0; i < amount; i++){
        var pos = generateLocation();
        var pokemon = new Object();
        
        pokemon.id = Math.floor(Math.random() * totalPokeCount + 1);
        pokemon.lat = pos[0];
        pokemon.lng = pos[1];
        livePokemon.push(pokemon);
    }
    
    //add one with standard values for testing
    var pokemon = new Object();
    pokemon.id = 0;
    pokemon.lat = 51.763326;
    pokemon.lng = 5.496325;
    livePokemon.push(pokemon);
    
    window.localStorage.setItem(livePokemonKey, JSON.stringify(livePokemon));
}

var generateLocation = function(){
    var r = PokemonGenerateRad/111300 //distance in meters
    , y0 = PokemonGenerateLat
    , x0 = pokemonGenerateLng
    , u = Math.random()
    , v = Math.random()
    , w = r * Math.sqrt(u)
    , t = 2 * Math.PI * v
    , x = w * Math.cos(t)
    , y1 = w * Math.sin(t)
    , x1 = x / Math.cos(y0)

    newY = y0 + y1
    newX = x0 + x1
    return [newY, newX];
}

var checkForPokemonCatch = function(position){
    $("#latSpan").html("lat " + position.coords.latitude);
    $("#lngSpan").html("lng " + position.coords.longitude);
    
    var anyPokemonInRange = false;
    livePokemon.forEach(function(pokemon) {
        //principle of a2 + b2 = c2
        var distance = Math.pow(position.coords.latitude - pokemon.lat, 2) + Math.pow(position.coords.longitude - pokemon.lng, 2);
        if(distance < Math.pow(catchRaduis, 2)){
            anyPokemonInRange = true;
        }
    }, this);
    if(anyPokemonInRange){
        $("#CatchButton").attr("src", "img/catchButtonGreen.png");
    }
    else{
        $("#CatchButton").attr("src", "img/catchButtonGrey.png");
    }
}


if(livePokemon == undefined){
    livePokemon = [];
    startGenerateLivePokemon(livePokemonAmount);
}
else if(livePokemon.length < livePokemonAmount){
    startGenerateLivePokemon(livePokemonAmount - livePokemon.length);
}

navigator.geolocation.watchPosition(checkForPokemonCatch);