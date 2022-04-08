const PREAMBLE = 'CAPTIVATION';
const PREAMBLE_BINARY = toBinary(PREAMBLE);
const MESSAGE_LENGTH = PREAMBLE_BINARY + 8 * 100;

console.log('preamble binary', PREAMBLE_BINARY)

let messageBuffer = '';
let failureBuffer = '';
let maxCorrect = ''
let maxLen;
let index = -1;

let all = ''
function main() {
console.log('looking for', PREAMBLE_BINARY)

  // process.stdin.on('data', test);
  // process.stdin.on('end', () => console.log(failureBuffer))
  process.stdin.on('data', handleChunk);
  process.stdin.on('error', handleError);
}

// function handleChunk(chunk) {
//   messageBuffer += chunk.toString();
//   console.log(messageBuffer.indexOf(PREAMBLE_BINARY))
// }

function test(chunk) {
  all += chunk.toString()
}

function handleChunk(chunk) {
  const parts = chunk.toString().split('');
  for(const char of parts) {
    index++;
    // console.log('adding char', char, messageBuffer.length)
      messageBuffer += char;
      failureBuffer += char;
    if(messageBuffer.length <= PREAMBLE_BINARY.length) {
      while(messageBuffer.length && !PREAMBLE_BINARY.startsWith(messageBuffer)) {
        console.log('\nresetting', messageBuffer, char, index)
        messageBuffer = messageBuffer.slice(1)
        console.log('aftereset', messageBuffer)
        // console.log('failureBuffer', failureBuffer)
        // console.log('resetting', messageBuffer, char, 'isnt', PREAMBLE_BINARY, messageBuffer.length, PREAMBLE_BINARY.length)
        // resetBuffer();
      }
    } else if(messageBuffer.length === MESSAGE_LENGTH) {
      console.log('foudn message', messageBuffer)
      console.log(messageBuffer.slice(PREAMBLE_BINARY.length))
      resetBuffer();
      process.exit()
    } 
  }  
}

function resetBuffer() {
  messageBuffer = '';
}

function toBinary(input) {
  return input.split('').map(e => e.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function handleError(err) {
  process.exit();
}

if(!module.parent) {
  main();
} 

module.exports = { PREAMBLE, PREAMBLE_BINARY, MESSAGE_LENGTH, toBinary }
