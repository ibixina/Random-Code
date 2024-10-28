var fs = require("fs");
var obj = JSON.parse(fs.readFileSync("./response_ally.json", "utf8"));

async function send(senddata) {
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
        "eyJpdiI6IlhSUDFTcjhHMFhzakE2L25rb0ZpVUE9PSIsInZhbHVlIjoiOFIvUXNqMFgyZStkOXUzLy9nRlBYMVNjdHRTRWljVFB0a1RlcHZrcnVGSW0wSVJSZWVmSWR6WFpZU1YzVnl1aitKV1Bwbm1GS2pnRGhXcVVvYzFMMGljcGl2aVNPN296bzhwSFg4dHhGTGEzV1lMYk1kNTlxdy80RG91QURQVkQiLCJtYWMiOiJiZjdlODY1MGE4ZGM2NGQ2N2RmZTczZWE3YTkzZDhmY2U2OTJlMDE3ZmZmY2NiNDZjMGE2ZTAzNWIyYTljMzQ3IiwidGFnIjoiIn0%3D",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    referrer: "https://web.studentally.com/",
    body: senddata,
    method: "POST",
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        // If the response status is not OK, throw an error
        console.log(response.body);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the JSON from the response
    })
    .then((data) => {
      console.log("Response Data:", data); // Print the entire response data
      // If you want to access specific parts of the data:
      console.log("Questions:", data?.questions); // Safely accessing questions
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Log any errors
    });
}

let data = obj.data;
let send_data = {};

send_data["orientation_id"] = data.id;
let answers = [];

for (let question of data.questions) {
  let question_id = question.id;
  let answer_id = [];
  for (let answer of question.answers) {
    if (answer.is_correct_answer == 1) {
      console.log(answer);
      answer_id.push(answer.id);
    }
  }
  let answer_format = {
    question_id: question_id,
    answer_ids: answer_id,
  };
  answers.push(answer_format);
}

send_data["questions_answers"] = answers;
console.log(JSON.stringify(send_data));
