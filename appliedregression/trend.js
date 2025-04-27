async function getData(query) {
  const params = new URLSearchParams({
    hl: "en-US",
    tz: "300",
    req: JSON.stringify({
      time: "2004-01-01 2025-04-27",
      resolution: "MONTH",
      locale: "en-US",
      comparisonItem: [
        {
          geo: { country: "US" },
          complexKeywordsRestriction: {
            keyword: [{ type: "BROAD", value: query }],
          },
        },
      ],
      requestOptions: {
        property: "",
        backend: "IZG",
        category: 0,
      },
      userConfig: {
        userType: "USER_TYPE_LEGIT_USER",
      },
    }),
    token: "APP6_UEAAAAAaA-iWXmDkXMxNc0TW0qlWZhrX-_-HpJQ",
    tz: "300",
  });

  const response = await fetch(
    `https://trends.google.com/trends/api/widgetdata/multiline?${params}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
      },
      referrer:
        "https://trends.google.com/trends/explore?date=all&geo=US&q=wwe&hl=en",
      method: "GET",
      mode: "cors",
    },
  );

  const text = await response.text();
  const cleaned = text.replace(/^\)\]\}',\s*/, ""); // remove the junk prefix
  const json = JSON.parse(cleaned);

  console.log(json);
}

getData("selena");
