const Observable = require("./Observable.js");
module.exports = function($) {
    return {

        get : function(configObject) {
            const { numTries, url, dataType } = configObject;
            let self = this;
            let iteration = 0;
            let observable = new Observable((observer)=> {
                let attempt = function() {
                    if (iteration >= numTries) {
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
                        $.ajax(url, {
                            dataType: dataType
                        })
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