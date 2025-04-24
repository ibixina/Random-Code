function convertToHangul(str) {
  var hangulHalfWidth = "\uffa0";
  var hangulFullWidth = "\u3164";

  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    const binary = char.charCodeAt(0).toString(2).padStart(8, "0");
    result += binary
      .replace(/0/g, hangulHalfWidth)
      .replace(/1/g, hangulFullWidth);
  }
  return result;
}

const payload = `
console.log("Hello world");
`;

const obfuscatedPayload = convertToHangul(payload);

const trojanObj = {
  code: obfuscatedPayload,
};

function decodeHangul(str) {
  let result = str.replace(/\uffa0/g, "0").replace(/\u3164/g, "1");
  console.log(result);
  let decodedCode = "";
  for (let i = 0; i < result.length; i += 8) {
    const binary = result.slice(i, i + 8);
    decodedCode += String.fromCharCode(parseInt(binary, 2));
  }
  return decodedCode;
}

console.log(trojanObj);

console.log(decodeHangul(trojanObj.code));

eval(decodeHangul(trojanObj.code));
