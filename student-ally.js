var fs = require("fs");
var obj = JSON.parse(fs.readFileSync("./response_ally.json", "utf8"));


async function send(senddata) {
  let req = await fetch("https://app.studentally.com/api/finish-orientation", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.5",
      "content-type": "application/json",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Brave\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Linux\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "sec-gpc": "1",
      "x-xsrf-token": "eyJpdiI6IjY5UUxUSldqeFV6OHdkMmtFanRYYkE9PSIsInZhbHVlIjoiR0E0R1kxL2plTGlaZldwVVJBRDNUMUJ1VjRjN245bWtVUnRSdmtCK25XdllRdXVSUWc1dkhMUjhpampIMGVSeXJGandUNmZoQUtIWWsvQy8vVjlCTjI5RytPaGdrQ3BFaWNaeXV0a0NZRmFmVGNJUy9LQ0YvamcxZXFuSVlOOVgiLCJtYWMiOiI5ZjFjNmM0NjMwYmFlZGUyMTYxNDY4MmFjMTg1YjE3NDBmOTQxODkwY2UwMmFhYWY5YmNkY2VmMWY0NTcwNzkwIiwidGFnIjoiIn0="
    },
    "referrer": "https://web.studentally.com/",
    "body": senddata,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => {
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
console.log(JSON.stringify(send_data).replaceAll('"', '\\"'));
