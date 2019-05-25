let $ = require("jquery");
let DurableGet = require("./jquery-durable-get")
let DurableGetService = DurableGet($);

let app = function() {
    let topStoriesUrl = "https://shaky-hacker-news.herokuapp.com/topstories";
    let getItemUrl = function (id) {
        return `https://shaky-hacker-news.herokuapp.com/item/${id}`;
    }

    // let state = {
    //     mainLoadingMessage : "",
    //     get mainLoadingMessage () {
    //         return this.mainLoadingMessage;
    //     },
    //     set mainLoadingMessage(val) {
    //         this.mainLoadingMessage = val;
    //         $("[main-loadingmessage]").text(val);
    //     },
    //     storyIds : [],
    //     get storyIds () {
    //         return this.storyIds
    //     },
    //     set storyIds (newArr) {
    //         $("[data-story-list]").empty();
    //         this.storyIds = newArr;
    //         for (let i = 0; i < newArr.length; i++) {
    //             $("[data-story-list]")
    //         }
    //     }
    // }
    
    // let updateView = function(state) {
    //     $("[data-story-list]")

    // }
    let storyIds = [];
    let stories = {};
    let loadButton = $("[data-load-button]");
    let domStoryList = $("[data-story-list]");

    

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

            DurableGetService.get({
                url : getItemUrl(val),
                dataType : "json"
            })
            .subscribe( (resp) => {
                if (resp.status == "SUCCESS") {
                    stories[val] = resp.data;
                    $(`[data-story-item='${val}']`).text(resp.data.title);
                }
            });
            
        });
    }

    function fetchStories () {
        DurableGetService.get({
            url : topStoriesUrl,
            dataType : "json"
        })
        .subscribe((val) => {
            if (val.status == "SUCCESS") {
                storyIds = val.data.slice(0,50);;
                setupDom();
                getAllItems();
            }
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