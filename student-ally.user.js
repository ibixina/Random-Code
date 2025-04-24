// ==UserScript==
// @name         student-ally
// @namespace    student-ally.zero.nao
// @version      0.1
// @description  try to tke over the world!
// @author       nao [2669774]
// @match        https://web.studentally.com/#/orientation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// ==/UserScript==

let api = "";
let url = window.location.href;
let rfc = getRFC();

function getRFC() {
  var rfc = $.cookie("rfc_v");
  if (!rfc) {
    var cookies = document.cookie.split("; ");
    for (var i in cookies) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == "rfc_v") {
        return cookie[1];
      }
    }
  }
  return rfc;
}
async function check() {
  let req = await fetch("https://app.studentally.com/api/finish-orientation", {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "Sec-GPC": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-site",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN":
        "eyJpdiI6InRHdXRhQU5HMDNOek5kcVJwZ2o5ZEE9PSIsInZhbHVlIjoiVG5VcGNEQ0xSM0xXNGZwQ0ZZcGVKL1hLb1JnUXdldGEwM0FrOERVcFNnTVp2Y2p0Y0JQajJwSTk4bkprYUZGb1pZYWNOZ2NCSE4vTFk1d3hpS25EeHNkK0hmdjFFUG1OTGtYQXZEcTErZU5QZ01EWUdOOGpKMzZNT253MFNHM1MiLCJtYWMiOiJiODIzODU2NmI1MDc5MTg2OGRmYTU3OGMxYTQ3Y2JkZDY1YTZhZjU3OWZkMGIxMmQzYzE3OWUzNzA0ZjhlOWQwIiwidGFnIjoiIn0=",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    referrer: "https://web.studentally.com/",
    body: `{"orientation_id":56,"questions_answers":[{"question_id":346,"answer_ids":[1304]},{"question_id":343,"answer_ids":[1301]},{"question_id":344,"answer_ids":[1296]},{"question_id":345,"answer_ids":[1299]}]}`,
    method: "POST",
    mode: "cors",
  });
}

let quiz_id = 56;

let response = `
{"data":{"id":59566,"is_passed":0,"is_force_passed":0,"score":16.67,"questions_answers":[{"answers":[{"answer":"A. Listen better and speak better.","answer_id":1304,"is_correct_answer":1}],"question":"The two secrets to great communication are...","question_id":346},{"answers":[],"question":"Misunderstanding is...","question_id":347},{"answers":[],"question":"Which of the following can help reduce how often and how badly I'm misunderstood?","question_id":348},{"answers":[],"question":"The most common reason we misunderstand people is...","question_id":349},{"answers":[],"question":"What was the hijacker's name in the airplane scene?","question_id":350},{"answers":[],"question":"When deciding between hurting someone's feelings and a potentially dangerous misunderstanding....","question_id":351}],"gained_coins":1,"created_at":"2024-10-27T22:36:06.000000Z","updated_at":"2024-10-27T22:36:06.000000Z"}}
`;

const { fetch: origFetch } = window;
window.fetch = async (...args) => {
  //  console.log("fetch called with args:", args);

  const response = await origFetch(...args);

  /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */

  if (
    response.url.includes(
      "https://app.studentally.com/api/orientations/56?include=schools,questions,questions.answers",
    )
  ) {
    //  console.log("REsponseL : "+response);

    response
      .clone()
      .json()
      .then(function (body) {
        console.log(body);
      })
      .catch((err) => console.error(err));
  }
  return response;
};
