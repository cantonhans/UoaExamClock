const timerUpdateInterval = 10;
let clockUpdateIntervalTimer;

const hoursToMinutes = 60;
const minutesToSeconds = 1;
const secondsToMs = 100;

let isPaused = false;
let totalPausedTime = 0;
let startPauseTime = 0;
let prevExamState;
let pauseInterval;

let minutesToAdd = 0;
let extraTime = 0;

let writingTimeElapsed = 0;
let writingTimeRemaining = 0;
let writingTimeStart = 0;
let writingTimeDuration = 120;

let readingTimeStart = 0;
let readingTimeElapsed = 0;
let readingTimeRemaining = 0;
let readingTimeDuration = 10;

let studentsMayLeaveStartTime = 60;
let studentsMayLeaveEndTime = 105;

let addedExtraTime = 0;

const ExamState = {
  PRE_EXAM: "before_exam",
  READING: "reading",
  WRITING_CAN_LEAVE: "writing_can_leave",
  WRITING_CANNOT_LEAVE: "writing_cannot_leave",
  POST_EXAM: "exam_over",
  PAUSED: "exam_paused",
};
let currentExamState = ExamState.PRE_EXAM;

function startExam() {
  resetExam();
  startReadingTime();
}

function resetExam() {
  setTimerInterval(false);
  isPaused = false;
  totalPausedTime = 0;
  extraTime = 0;

  writingTimeElapsed = 0;
  writingTimeRemaining = examTimeInMs();

  readingTimeRemaining = minutesToMs(readingTimeDuration);
  readingTimeElapsed = 0;

  currentExamState = ExamState.PRE_EXAM;

  updateTimeDisplayElements();
}

function updateClock() {
  if (readingTimeRemaining > 0) {
    readingTimeElapsed = Date.now() - readingTimeStart - totalPausedTime - extraTime;
    readingTimeRemaining =
      minutesToMs(readingTimeDuration) - readingTimeElapsed;
  } else if (currentExamState == ExamState.READING) {
    startWritingTime();
  } else if (writingTimeRemaining >= 0) {
    writingTimeElapsed = Date.now() - writingTimeStart - totalPausedTime - extraTime;
    writingTimeRemaining = examTimeInMs() - writingTimeElapsed;

    if (
      writingTimeElapsed > minutesToMs(studentsMayLeaveStartTime) &&
      writingTimeElapsed < minutesToMs(studentsMayLeaveEndTime)
    ) {
      currentExamState = ExamState.WRITING_CAN_LEAVE;
    } else {
      currentExamState = ExamState.WRITING_CANNOT_LEAVE;
    }
  } else {
    currentExamState = ExamState.POST_EXAM;
  }

  updateTimeDisplayElements();
}

function startReadingTime() {
  currentExamState = ExamState.READING;
  readingTimeStart = Date.now();
  setTimerInterval(true);
}

function startWritingTime() {
  currentExamState = ExamState.WRITING_CANNOT_LEAVE;
  writingTimeStart = Date.now();
  totalPausedTime = 0;
  extraTime = 0;
}

function examTimeInMs() {
  return minutesToMs(writingTimeDuration);
}

function minutesToMs(x) {
  return x * minutesToSeconds * secondsToMs;
}

function togglePause() {
  isPaused ? unpauseTimer() : pauseTimer();
}

function pauseTimer() {
  isPaused = true;
  prevExamState = currentExamState;
  currentExamState = ExamState.PAUSED;
  updateTimeDisplayElements();
  startPauseTime = Date.now();
  setTimerInterval(false);

  pauseInterval = setInterval(updateElapsedTimeDuringPause, secondsToMs);
}

function unpauseTimer() {
  isPaused = false;
  currentExamState = prevExamState;
  updateTimeDisplayElements();
  document.getElementById("pause-button").textContent = "Pause";
  totalPausedTime += Date.now() - startPauseTime;
  setTimerInterval(true);

  clearInterval(pauseInterval);
}

function updateElapsedTimeDuringPause() {
  const elapsedDuringPause = Date.now() - startPauseTime;

  document.getElementById("paused-time-elapsed").textContent =
    convertMsToTimeString(elapsedDuringPause);
}

function addTimeToExam(minutesToAdd) {
  extraTime += minutesToMs(minutesToAdd);
}

function setTimerInterval(doSetInterval) {
  if (doSetInterval) {
    clearInterval(clockUpdateIntervalTimer);
    clockUpdateIntervalTimer = setInterval(updateClock, timerUpdateInterval);
  } else {
    clearInterval(clockUpdateIntervalTimer);
  }
}

function convertMsToTimeString(milliseconds) {
  if (isNaN(milliseconds) || milliseconds < 0) {
    milliseconds = 0;
  }

  let totalSeconds = Math.floor(milliseconds / secondsToMs);
  let hours = Math.floor(totalSeconds / (hoursToMinutes * minutesToSeconds));
  let minutes = Math.floor(
    (totalSeconds % (hoursToMinutes * minutesToSeconds)) / minutesToSeconds
  );
  let remainingSeconds = totalSeconds % minutesToSeconds;

  let formattedTime =
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0");
  return formattedTime;
}

function convertMsToStringHourMin(milliseconds) {
  if (isNaN(milliseconds) || milliseconds < 0) {
    milliseconds = 0;
  }

  let hours = Math.floor(
    milliseconds / (secondsToMs * minutesToSeconds * hoursToMinutes)
  );
  let minutes = Math.floor(
    (milliseconds % (secondsToMs * minutesToSeconds * hoursToMinutes)) /
      (secondsToMs * minutesToSeconds)
  );

  let formattedString = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  return formattedString;
}

function convertMsToStringMinSec(milliseconds) {
  if (isNaN(milliseconds) || milliseconds < 0) {
    milliseconds = 0;
  }

  let totalSeconds = Math.floor(milliseconds / secondsToMs);
  let minutes = Math.floor(totalSeconds / minutesToSeconds);
  let seconds = totalSeconds % minutesToSeconds;

  let formattedString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return formattedString;
}
