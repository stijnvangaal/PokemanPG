/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
    // Application Constructor
    initialize: function(){
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function(){
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function(){
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id){
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var api = "http://pokeapi.co/api/v2/";
var caughtKey = "MyCaughtPokemon";
var livePokemonKey = "AllLivePokemon";
var generationDateKey = "LastGeneratedPokemon";
var pokemonListLimit = 20;
var totalPokeCount = 0;
var currentPokeCount = 0;
var nextPokemanUri = "";
var runningLoader = "<li class='RunningLoader'> <img src='img/runningLoader.gif'></li>";
var isLoading = false;


var getMorePokeman = function(){
    isLoading = true;

    if (nextPokemanUri == ""){
        nextPokemanUri = api + "pokemon/?limit=" + pokemonListLimit;
    }

    $.get(nextPokemanUri, function(data, success){
        nextPokemanUri = data.next;
        totalPokeCount = data.count;
        currentPokeCount += data.results.length;

        data.results.forEach(function(element){
            pokemonIdLink = element.url;
            thumbName = "PokemonThumb" + element.name;

            var html = [];
            html.push(
                "<li>",
                "<a id='" + pokemonIdLink + "'>",
                "<img src='img/imgBack.png' id='" + thumbName + "'>",
                "<h2>",
                element.name,
                "</h2>",
                "</a>",
                "</li>"
            );
            $("#PokeList").append(html.join(""));

        }, this);

        isLoading = false;
        $(".RunningLoader").remove();
        if (currentPokeCount < totalPokeCount){
            $("#PokeList").append(runningLoader);
        }
        $("#PokeList").listview("refresh");
    });
}

var getPokemonSprite = function(pokemanUrl, imgElement){
    $.get(pokemanUrl, function(data, success){
        $("#" + imgElement).attr("src", data.sprites.front_default);
    });
}

$("#PokeList").on('click', 'a', function(e){
    e.preventDefault();
    var url = $(this).attr('id');
    clearDetailPage();
    $.get(url, setDetailPage);
    $.mobile.changePage("#pokemanDetail");
});

var clearDetailPage = function(){
    $("#DetailPokemonName").html("");
    $("#DetailPokemonImg").attr("src", "img/spinner.gif");
}

var setDetailPage = function(pokemon){
    $("#DetailPokemonName").html(pokemon.name);
    $("#DetailPokemonImg").attr("src", pokemon.sprites.front_default);
}

var getMyPokeman = function(){
    var myPokeman = JSON.parse(window.localStorage.getItem(caughtKey));
    if (myPokeman != undefined){
        myPokeman.forEach(function(element){
            pokemonIdLink = element.url;
            thumbName = "PokemonThumb" + element.name;

            var html = [];
            html.push(
                "<li>",
                "<a id='" + pokemonIdLink + "'>",
                "<img src='img/imgBack.png' id='" + thumbName + "'>",
                "<h2>",
                element.name,
                "</h2>",
                "<h2 class='ui-li-count'>",
                element.amount,
                "</h2>",
                "</a>",
                "</li>"
            );
            $("#MyPokeList").append(html.join(""));

            getPokemonSprite(api + "pokemon/" + element.id + "/", thumbName);
        }, this);
    }
    $("#MyPokeList .RunningLoader").remove();
    $("#MyPokeList").listview("refresh");
}

$(document).on("scrollstop", function(e){
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        scrolled = $(window).scrollTop(),
        header = $(".ui-header", activePage).hasClass("ui-header-fixed") ? $(".ui-header", activePage).outerHeight() - 1 : $(".ui-header", activePage).outerHeight(),
        footer = $(".ui-footer", activePage).hasClass("ui-footer-fixed") ? $(".ui-footer", activePage).outerHeight() - 1 : $(".ui-footer", activePage).outerHeight(),
        scrollEnd = contentHeight - screenHeight + header + footer;
    $(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    $(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "pokemanListPage" && scrolled >= scrollEnd && !isLoading){
        console.log("adding...");
        getMorePokeman();
    }
});

$("#pokemanListPage").on('pageinit', function(){
    $("#PokeList").append(runningLoader);
    $("#PokeList").listview("refresh");
    var testpokeman = getMorePokeman();
});

$("#MyPokemanPage").on('pagebeforeshow', function(){
    $("#MyPokeList").html("");
    $("#MyPokeList").append(runningLoader);
    $("#MyPokeList").listview("refresh");
    getMyPokeman();
});