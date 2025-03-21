const sentences = [
  "안녕하세요, 오늘도 좋은 하루입니다.",
  "타자 연습을 통해 실력을 키워보세요.",
  "프로그래밍은 연습이 중요합니다.",
  "이 문장을 빠르게 입력해보세요.",
];

let startTime;
let currentSentence;

function startTest() {
  currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
  document.getElementById("quote").innerText = currentSentence;
  const inputBox = document.getElementById("inputBox");
  inputBox.value = "";
  inputBox.disabled = false;
  inputBox.focus();
  startTime = new Date();
  document.getElementById("result").innerText = "";

  inputBox.removeEventListener("input", updateDisplay);
  inputBox.addEventListener("input", updateDisplay);
}

function disassembleHangul(str) {
  const chosung = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const jungsung = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const jongsung = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  const result = [];
  for (let char of str) {
    const code = char.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const base = code - 0xac00;
      const cho = Math.floor(base / (21 * 28));
      const jung = Math.floor((base % (21 * 28)) / 28);
      const jong = base % 28;
      result.push(chosung[cho], jungsung[jung]);
      if (jong !== 0) result.push(jongsung[jong]);
    } else {
      result.push(char);
    }
  }
  return result;
}

function updateDisplay() {
  const inputBox = document.getElementById("inputBox");
  const input = inputBox.value;

  let hasError = false;

  for (let i = 0; i < input.length; i++) {
    const inputChar = input[i];
    const targetChar = currentSentence[i] || "";

    const inputDis = disassembleHangul(inputChar);
    const targetDis = disassembleHangul(targetChar);

    for (let j = 0; j < inputDis.length; j++) {
      if (inputDis[j] !== targetDis[j]) {
        hasError = true;
        break;
      }
    }
    if (hasError) break;
  }

  if (hasError) {
    inputBox.style.color = "red";
  } else {
    inputBox.style.color = "black";
  }

  if (input.length === currentSentence.length) {
    finishTest();
  }
}

function finishTest() {
  const inputBox = document.getElementById("inputBox");
  const endTime = new Date();
  const timeTaken = (endTime - startTime) / 1000;
  const timeTakenMinutes = timeTaken / 60;

  const totalTaps = countJaso(currentSentence);
  const correctTaps = countJasoCorrect(inputBox.value, currentSentence);

  const realTasu = Math.round(correctTaps / timeTakenMinutes);
  const accuracy = (correctTaps / totalTaps) * 100;

  document.getElementById("result").innerText = `완료! 시간: ${timeTaken.toFixed(
    2
  )}초, 타수: ${realTasu}타, 정확도: ${accuracy.toFixed(2)}%`;
  inputBox.disabled = true;
}

function countJaso(str) {
  const regex = /[가-힣]/;
  let count = 0;
  for (let ch of str) {
    if (regex.test(ch)) {
      const code = ch.charCodeAt(0) - 0xac00;
      const jong = code % 28;
      count += jong === 0 ? 2 : 3;
    } else if (ch.trim() === "") {
      count += 1;
    } else {
      count += 1;
    }
  }
  return count;
}

function countJasoCorrect(input, target) {
  let correct = 0;
  for (let i = 0; i < target.length; i++) {
    if (input[i] === target[i]) {
      correct += countJaso(target[i]);
    }
  }
  return correct;
}
