var livePokemon = JSON.parse(window.localStorage.getItem(livePokemonKey));
var livePokemonAmount = 10;
var pokemonGenerateLng = 5.293565;
var PokemonGenerateLat = 51.690155;
var PokemonGenerateRad = 1000;
var pokeAmount = 721;
var catchRaduis = 10/111300; //10 meters

var myLat = 0;
var myLng = 0;



var startGenerateLivePokemon = function(){
    if(livePokemon == undefined){
        livePokemon = [];
        generateLivePokemon(livePokemonAmount);
    }
    else if(livePokemon.length < livePokemonAmount){
        generateLivePokemon(livePokemonAmount - livePokemon.length);
    }
}

var generateLivePokemon = function(amount){
    for(var i = 0; i < amount - 1; i++){
        var pos = generateLocation();
        var pokemon = new Object();
        
        pokemon.id = Math.floor(Math.random() * pokeAmount) + 1;
        pokemon.lat = pos[0];
        pokemon.lng = pos[1];
        livePokemon.push(pokemon);
    }
    
    //add one with standard values for testing
    var pokemon = new Object();
    pokemon.id = Math.floor(Math.random() * pokeAmount) + 1;
    pokemon.lat = 51.763326;
    pokemon.lng = 5.49619;
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

var getPokemonInRange = function(lat, lng){
    var pokemonInRange = undefined;
    livePokemon.forEach(function(pokemon) {
        //principle of a2 + b2 = c2
        var distance = Math.pow(lat - pokemon.lat, 2) + Math.pow(lng - pokemon.lng, 2);
        if(distance < Math.pow(catchRaduis, 2)){
            pokemonInRange =  pokemon;
        }
    }, this);
    return pokemonInRange;
}

var checkForPokemonCatch = function(position){
    $("#latSpan").html(position.coords.latitude);
    $("#lngSpan").html(position.coords.longitude);
    myLat = position.coords.latitude;
    myLng = position.coords.longitude;
    
    var pokemonInRange = getPokemonInRange(position.coords.latitude, position.coords.longitude);
    
    if(pokemonInRange != undefined){
        $("#CatchButton").attr("src", "img/catchButtonGreen.png");
    }
    else{
        $("#CatchButton").attr("src", "img/catchButtonGrey.png");
    }
}

var clearCatchPage = function(){
    $("#caughtPokeName").html("");
    $("#caughtPokeImg").attr("src", "img/pokeball-waiting.gif");
}

var saveCaughtPokemon = function(pokemon){
    var caughtPokemons = JSON.parse(window.localStorage.getItem(caughtKey));
        if(caughtPokemons == undefined){
            caughtPokemons = [];
        }
        
        var alreadyCaught = false;
        caughtPokemons.forEach(function(element) {
            if(element.id == pokemon.id){
                element.amount++;
                alreadyCaught = true;
            }
        }, this);
        if(!alreadyCaught){
            var newPokemon = new Object;
            newPokemon.id = pokemon.id;
            newPokemon.name = pokemon.name;
            newPokemon.amount = 1;
            caughtPokemons.push(newPokemon);
        }
        
        window.localStorage.setItem(caughtKey, JSON.stringify(caughtPokemons));
}

var setCatchValues = function(pokemon){
    $("#caughtPokeImg").attr("src", "img/pokeball-done.gif");
    setTimeout(function() {
        $("#caughtPokeName").html(pokemon.name);
        $("#caughtPokeImg").attr("src", pokemon.sprites.front_default);
        saveCaughtPokemon(pokemon);
        
    }, 1000);
}

var catchPokemon = function(pokemon){
    clearCatchPage();
    $.mobile.changePage("#catchPokePage");
    
    $.get(api + "pokemon/" + pokemon.id +  "/", function(data, success){
        var pokemon
        var pokeImage = new Image();
        pokeImage.onload = function(image){
            setCatchValues(data);
        }
        pokeImage.src = data.sprites.front_default;
    });    
    
    livePokemon.splice(livePokemon.indexOf(pokemon), 1);
    
    startGenerateLivePokemon();
}

$("#CatchButton").click(function(){
    if($("#CatchButton").attr("src") == "img/catchButtonGreen.png"){
        var pokemonInRange = getPokemonInRange(myLat, myLng);
        if(pokemonInRange != undefined){ 
            catchPokemon(pokemonInRange);
        }
    }
});


startGenerateLivePokemon();

navigator.geolocation.watchPosition(checkForPokemonCatch);