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
  const inputDisplay = document.getElementById("inputDisplay");
  inputBox.value = "";
  inputDisplay.innerHTML = "";
  inputBox.disabled = false;
  inputBox.focus();
  startTime = new Date();
  document.getElementById("result").innerText = "";

  // 이벤트 등록은 여기서만
  inputBox.addEventListener("input", updateDisplay);
  inputBox.addEventListener("compositionend", checkForFinish);
}

function updateDisplay() {
  const inputBox = document.getElementById("inputBox");
  const inputDisplay = document.getElementById("inputDisplay");
  let highlighted = "";

  for (let i = 0; i < currentSentence.length; i++) {
    if (i < inputBox.value.length) {
      if (!isHangulComplete(inputBox.value[i])) {
        highlighted += `<span>${currentSentence[i]}</span>`;
      } else {
        if (inputBox.value[i] === currentSentence[i]) {
          highlighted += `<span style="color: black;">${currentSentence[i]}</span>`;
        } else {
          highlighted += `<span style="color: red;">${currentSentence[i]}</span>`;
        }
      }
    } else {
      highlighted += `<span>${currentSentence[i]}</span>`;
    }
  }
  inputDisplay.innerHTML = highlighted;
}

function checkForFinish() {
  const inputBox = document.getElementById("inputBox");
  if (inputBox.value.length === currentSentence.length && isAllHangulComplete(inputBox.value)) {
    finishTest();
  }
}

function isHangulComplete(char) {
  const code = char.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3;
}

function isAllHangulComplete(input) {
  for (let i = 0; i < input.length; i++) {
    if (!isHangulComplete(input[i]) && input[i] !== " " && input[i] !== "." && input[i] !== ",") {
      return false;
    }
  }
  return true;
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
