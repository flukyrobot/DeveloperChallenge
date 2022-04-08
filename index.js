const PREAMBLE = "CAPTIVATION";
const PREAMBLE_BINARY = toBinary(PREAMBLE);
const MESSAGE_LENGTH = PREAMBLE_BINARY.length + 8 * 100;

let messageBuffer = "";
let outputCount = 0;
const messageBufferArray = [];
let chunkCounter = 0;

function main() {
  // process.stdin.on('data', test);
  process.stdin.on("end", () => reportMetrics());
  // process.stdin.on("data", handleChunkString);
  process.stdin.on("data", handleChunkStringNaive);
  // process.stdin.on("data", handleChunkArray);
  process.stdin.on("error", handleError);
}

// function handleChunk(chunk) {
//   messageBuffer += chunk.toString();
//   console.log(messageBuffer.indexOf(PREAMBLE_BINARY))
// }

function test(chunk) {
  all += chunk.toString();
}

function handleChunkArray(chunk) {
  messageBufferArray.push(...chunk.toString().split(""));
  if (messageBufferArray.length >= MESSAGE_LENGTH) {
    // console.log(test.length, messageBufferArray.length)

    while (messageBufferArray.length >= MESSAGE_LENGTH) {
      const test = messageBufferArray.slice(0, PREAMBLE_BINARY.length).join("");
      // console.log("message", message, PREAMBLE_BINARY);
      if (!PREAMBLE_BINARY.startsWith(test)) {
        messageBufferArray.splice(0, 1);
      } else {
        messageBufferArray.splice(0, PREAMBLE_BINARY.length);
        const message = messageBufferArray.slice(0, 800).join("");
        // console.log(decodeBinaryMessage(message));
      }
    }
  }
}

let currentIndex = 0,
  characters = [];
function handleChunkString(chunk) {
  messageBuffer += chunk.toString();
  const preambleIndex = messageBuffer.indexOf(PREAMBLE_BINARY);
  currentIndex = preambleIndex + PREAMBLE_BINARY.length - 1;
  while (currentIndex + 8 < messageBuffer.length) {
    console.log(currentIndex, characters.length);
    if (
      characters.length < 100 &&
      (preambleIndex > -1 || characters.length > 0)
    ) {
      characters.push(messageBuffer.substring(currentIndex, currentIndex + 8));
      currentIndex += 8;
    }
    if (characters.length === 100) {
      console.log("covnerting mesg");
      characters.forEach((character) =>
        process.stdout.write(decodeBinaryMessage(character))
      );
      characters.length = 0;
      messageBuffer = messageBuffer.slice(currentIndex);
      currentIndex = 0;
    }
  }
  console.log(characters.length);
}

function handleChunkStringNaive(chunk) {
  chunkCounter++;
  const parts = chunk.toString().split("");
  for (const char of parts) {
    // console.log('adding char', char, messageBuffer.length)
    messageBuffer += char;
    if (messageBuffer.length <= PREAMBLE_BINARY.length) {
      while (
        messageBuffer.length &&
        !PREAMBLE_BINARY.startsWith(messageBuffer)
      ) {
        messageBuffer = messageBuffer.slice(1);
      }
    } else if (messageBuffer.length === MESSAGE_LENGTH) {
      // console.log('foudn message', messageBuffer)
      // console.log('parts', messageBuffer.split(/\d{8}/))
      // console.log('ascii', String.fromCharCode(parseInt(messageBuffer, 2)))
      console.log(
        "message",
        decodeBinaryMessage(messageBuffer.slice(PREAMBLE_BINARY.length))
      );
      resetBuffer();
      // process.exit()
    }
  }
}

function decodeBinaryMessage(binaryMessage) {
  // console.log("binary message", binaryMessage);
  let message = "";
  for (let idx = 0; idx < binaryMessage.length; idx += 8) {
    message += String.fromCharCode(
      parseInt(binaryMessage.substring(idx, idx + 8), 2)
    );
  }
  return message;
}

function resetBuffer() {
  messageBuffer = "";
}

function toBinary(input) {
  return input
    .split("")
    .map((e) => e.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

function handleError(err) {
  process.exit();
}

function reportMetrics() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Split uses approximately ${Math.round(used * 100) / 100} MB`);
}

if (!module.parent) {
  main();
}

module.exports = { PREAMBLE, PREAMBLE_BINARY, MESSAGE_LENGTH, toBinary };
