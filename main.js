const GAME_TIME = 9; // game 시간을 상수로 설정하여 하드코딩 방지
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

const inputWord = document.querySelector('.input');
const changeWord = document.querySelector('.changeWord');
const scoreShow = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.loading');

init();

// 화면이 렌더링 되었을 때 바로 실행되는 초기값
function init() {
  buttonChange('게임로딩중');
  getWords();
  // eventListener 콜백함수로 checkMatch 함수 사용
  inputWord.addEventListener('input', checkMatch);
}

// 게임 실행 여부 확인
function checkStatus() {
  if (!isPlaying && time === 0) {
    buttonChange('다시시작'); // if 문을 만족할 경우 다시시작
    clearInterval(checkInterval);
  }
}

// 버튼 클릭 시 interval 실행 (게임실행)
function run() {
  if (isPlaying) {
    return; // 게임중인 경우 버튼을 눌러도 중복이 안되게
  }
  isPlaying = true;
  time = GAME_TIME;
  inputWord.focus(); // 마우스 포커스 이동
  scoreShow.innerText = 0; // 획득점수 초기화
  timeInterval = setInterval(countDown, 1000); // 1초마다 한번씩 countDown() 실행
  checkInterval = setInterval(checkStatus, 50); // 50ms 초마다 한번씩 checkStatus() 실행
  buttonChange('게임중');
}

// 단어장
function getWords() {
  axios
    .get('https://random-word-api.herokuapp.com/word?number=100')
    .then(function (response) {
      // 성공 핸들링

      response.data.forEach((newWord) => {
        if (newWord.length < 10) {
          words.push(newWord);
        }
      });
      console.log(words);

      buttonChange('게임시작');

      // words = response.data;
    })
    .catch(function (error) {
      // 에러 핸들링
      console.log(error);
    });
}

// 단어 일치 체크하고 점수 상향하기
function checkMatch() {
  if (inputWord.value.toLowerCase() === changeWord.innerText.toLowerCase()) {
    score++;
    if (!isPlaying) {
      return; // !isPlaying 를 만족하면 게임중단 (함수중단)
    }
    scoreShow.innerText = score;
    inputWord.value = ''; // 초기화
    time = GAME_TIME;

    // API 의 단어를 랜덤한 인덱스로 선별
    const randomIndex = Math.floor(Math.random() * words.length); // Math.floor 로 소수점 자르기
    changeWord.innerText = words[randomIndex];
  }
}

// 남은시간
function countDown() {
  time > 0 ? time-- : (isPlaying = false);
  if (!isPlaying) {
    clearInterval(timeInterval);
  }
  timeDisplay.innerHTML = time;
}

// 버튼 상태 변경
function buttonChange(text) {
  button.innerText = text;
  text === '게임시작'
    ? button.classList.remove('loading')
    : button.classList.add('loading');
}
