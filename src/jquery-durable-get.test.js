// const DurableGet = require("./jquery-durable-get");
// const $ = require("jquery");

// const mock = {
//     get () {
//         console.log("$$$$$$$$$$");
//         //return $.get(...arguments);
//         return {
//             done (data, textStatus, jqXHR) {

//             },
//             fail (jqXHR, textStatus, errorThrown) {

//             }
//         }
//     }
// }

// let DurableGetService = DurableGet(mock);

// describe("jquery-durable-get", () => {

//     it("can start get", () => {
//         let obs = DurableGetService.get("http://www.google.com");
//         obs.subscribe((val)=> {
//             console.log(val);
//         });
//     });
// });