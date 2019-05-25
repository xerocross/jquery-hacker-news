let $ = require("jquery");
let DurableGet = require("./jquery-durable-get")
let DurableGetService = DurableGet($);

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
            stories = data;
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
        DurableGetService.get(topStoriesUrl)
        .subscribe((val) => {
            console.log(val);
        });

        // $.get(topStoriesUrl)
        // .done((data, textStatus, jqXHR) => {
        //     debugger;
        //     storyIds = JSON.parse(data);
        //     setupDom();
        //     getAllItems();
        // })
        // .catch((jqXHR, textStatus, errorThrown) => {
        //     console.log(jqXHR);
        // })

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