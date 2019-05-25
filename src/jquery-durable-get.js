const Observable = require("./Observable.js");
module.exports = function($) {
    return {
        numTries : 3,
        get : function(url) {
            let self = this;
            let iteration = 0;
            let observable = new Observable((observer)=> {
                let attempt = function() {
                    if (iteration >= self.numTries) {
                        observer.next({
                            status: "FAIL",
                            url: url
                        });
                    } else {
                        observer.next({
                            status: "ATTEMPTING",
                            data : {
                                attemptNum : iteration,
                                url : url
                            }
                        });
                        iteration++;
                        $.get(url)
                        .done((data, textStatus, response) => {
                            if (response.status == 200) {
                                observer.next({
                                    status: "SUCCESS",
                                    data : data,
                                    url : url
                                })
                            } else {
                                observer.next({
                                    status: "FAILED_ATTEMPT",
                                    statusCode : response.status,
                                    url : url
                                })
                                attempt();
                            }
                        })
                        .fail((jqXHR, textStatus, errorThrown) =>{
                            observer.next({
                                status: "FAILED_ATTEMPT",
                                statusCode : jqXHR.status,
                                error : errorThrown,
                                url : url
                            })
                            attempt();
                        })
                    }
                }
                attempt();
            })
            return observable;
        }
    }
}