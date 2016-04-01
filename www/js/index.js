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
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var api = "http://pokeapi.co/api/v2/";
var pokemonListLimit = 20;
var nextPokemanUri = "";

var getJSON = function(url) {
    $.get(url, function(data, success){
        alert(data);
        alert(success);
        $("#PokeData").html(data);
    });
};

var getMorePokeman = function(){
    if(nextPokemanUri == ""){
       nextPokemanUri = api + "pokemon/?limit="+ pokemonListLimit;
    }
    
    $.get(nextPokemanUri, function(data, success){
        nextPokemanUri = data.next;
        data.results.forEach(function(element) {
            thumbName = "PokemonThumb" + element.name;
            
            var html = [];
            html.push(
                "<li>",
                "<a>",
                "<img src='img/imgBack.png' id='"+ thumbName +"'>",
                "<h2>",
                element.name,
                "</h2>",
                "</a>",
                "</li>"
            );
           
            getPokemonSprite(element.url, thumbName);
            
            $("#PokeList").append(html.join(""));
            $("#PokeList").listview("refresh");
        }, this);
    });
}

var getPokemonSprite = function(pokemanUrl, imgElement){
    $.get(pokemanUrl, function(data, success){
       $("#"+imgElement).attr("src", data.sprites.front_default); 
    });
}

$(document).on("scrollstop", function (e) {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        scrolled = $(window).scrollTop(),
        header = $(".ui-header", activePage).hasClass("ui-header-fixed") ? $(".ui-header", activePage).outerHeight() - 1 : $(".ui-header", activePage).outerHeight(),
        footer = $(".ui-footer", activePage).hasClass("ui-footer-fixed") ? $(".ui-footer", activePage).outerHeight() - 1 : $(".ui-footer", activePage).outerHeight(),
        scrollEnd = contentHeight - screenHeight + header + footer;
    $(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    $(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "pokemanListPage" && scrolled >= scrollEnd) {
        console.log("adding...");
        getMorePokeman();
    }
});

$(document).on('pageinit', function(){
    var testpokeman = getMorePokeman();
});
