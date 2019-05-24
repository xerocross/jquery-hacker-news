(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


let app = function() {
    let stories = {};
    let storyIds = [];
    let loadButton = $("[data-load-button]");
    let domStoryList = $("[data-story-list]");

    let topStoriesUrl = "https://shaky-hacker-news.herokuapp.com/topstories";
    let getItemUrl = function (id) {
        return `https://shaky-hacker-news.herokuapp.com/item/${id}`
    }

    function buildStoryHTMLElement (id) {
        let li = document.createElement("li");
        li.setAttribute("data-story-item",""+ id);
        return li;
    }

    function setupDom () {
        domStoryList.empty();

        for (let i = 0; i < storyIds.length; i++) {
            let id = storyIds[i];
            let elt = buildStoryHTMLElement(id);
            domStoryList.append(elt);
        }
        $("[data-story-item]").hide();
        $("[data-story-item]").addClass("list-group-item");

    }

    function getItem (id) {
        $.get(getItemUrl(id))
        .done((data, textStatus, jqXHR) => {
            console.log(data);
            stories = data;
            debugger;
        })
        .catch((jqXHR, textStatus, errorThrown) => {
            console.log("couldn't get list of ids");
        })
    }

    function getAllItems () {
        storyIds.forEach((val) => {
            $(`[data-story-item='${val}']`).text("loading");
            $(`[data-story-item='${val}']`).show();
            $.get(getItemUrl(val))
            .done((data, textStatus, jqXHR) => {
                debugger;
                stories[val] = JSON.parse(data);
                // domStoryList
                // let newElt = buildStoryHTMLElement();
                // newElt.append(document.createTextNode(stories[val].title));
                // domStoryList.append(newElt);
                $(`[data-story-item='${val}']`).text(stories[val].title);
                $(`[data-story-item='${val}']`).show();
            })
            .catch((jqXHR, textStatus, errorThrown) => {
                $(`[data-story-item='${val}']`).text("error: the server did not respond");
                console.log(jqXHR);
                console.log(`item ${val} failed`);
            })
        });
    }

    function fetchStories () {
        $.get(topStoriesUrl)
        .done((data, textStatus, jqXHR) => {
            debugger;
            storyIds = JSON.parse(data);
            setupDom();
            getAllItems();
        })
        .catch((jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR);
        })

    }

    function updateView () {

    }
    $(loadButton).on("click", function() {
        fetchStories();
    });

}

$(document).ready(function() {
     app();
 });
},{}]},{},[1]);
