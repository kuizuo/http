import axios from 'axios';
import * as zlib from 'zlib';

function wrap(str, num = 76) {
  let newStr = '';
  let index = 0;
  while (index < str.length) {
    newStr += str.slice(index, (index += num)) + '\r\n';
  }
  return newStr;
}

let k = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '*',
  '!',
];

function encode(str) {
  let base64 = Buffer.from(str).toString('base64');
  base64 = wrap(base64);

  let base64Arr = base64.split('');

  let result = 'x';
  for (let i = 0; i < base64Arr.length; i++) {
    let c = base64Arr[i].charCodeAt(0);
    result += c + k[i % k.length].charCodeAt(0);
    result += '_';
  }
  result = result.substring(0, result.length - 1);
  //console.log(result);
  result += 'y';
  return result;
}

function compress(bytes) {
  return zlib.gzipSync(bytes);
}

function unzip(bytes) {
  return zlib.unzipSync(bytes);
}

function decode(str) {
  if (str == null) {
    return null;
  }
  if (!str.startsWith('x') || !str.endsWith('y')) {
    return '';
  }

  str = str.substring(1, str.length - 1);

  let split = str.split('_');
  let result = '';
  for (let i = 0; i < split.length; i++) {
    result += String.fromCharCode(split[i] - k[i % k.length].charCodeAt(0));
  }

  result = Buffer.from(result, 'base64').toString('utf-8');

  result = JSON.stringify(JSON.parse(result));
  return result;
}

function login() {
  let data = { appid: '2', username: '15212345678', password: 'a123456', cpsId: 'tg001lxx', imei: 'cec79d0a-b26e-4879-b231-ebaf43299cec' };

  let encodeStr = encode(JSON.stringify(data));
  let bytes = compress(Buffer.from(encodeStr));

  axios
    .post('http://sdk.zhibaowan.cn/cdcloud2/user/login', bytes, {
      responseType: 'arraybuffer',
    })
    .then((res) => {
      let bytes = unzip(res.data);
      let result = decode(bytes.toString());
      console.log(result);
    });
}

login();