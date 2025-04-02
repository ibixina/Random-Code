const data = {
  name: "soemthing",
  list: ["a", "b"],
};

for (const key in data) {
  console.log(key);
}

for (const d of data.list) {
  console.log(d);
}

function wait(s) {
  return new Promise((resolve) => setTimeout(resolve, s));
}
