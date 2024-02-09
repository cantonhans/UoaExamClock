const timeIndicatorBarAvgWidth = 2.5;
const intervalDuration = 5;
const elements = {
  progressBar: document.querySelector(".progress-bar-fill"),
  timeIndicatorBars: document.getElementById("time-indicator-bars"),
  startButton: document.getElementById("start-button"),
  resetButton: document.getElementById("reset-button"),
  pauseButton: document.getElementById("pause-button"),
  displayMessage: document.getElementById("display-message"),
  pausedDisplayMessage: document.getElementById("paused-display-message"),
  timeIndicatorBarsWithoutLast: document.querySelectorAll(
    ".time-indicator-bars div:not(:last-child)"
  ),
  progressBarFill: document.querySelector(".progress-bar-fill"),
  countdownTimeAndText: document.querySelector(".countdown-time-and-text"),
  countdownTime: document.querySelector(".bold-time"),
  examDurationText: document.getElementById("exam-duration-text"),
  examState: document.getElementById("exam-time-state-text"),
  addToRemainingBox: document.getElementById("add-to-remaining-box"),
  backButton: document.getElementById("back-button"),
};

function updateTimeDisplay() {
  updateCountdownDisplay();
  displayExamDurationText(+writingTimeDuration);
  if (currentExamState == ExamState.READING) {
    setProgressBar(readingTimeElapsed, minutesToMs(readingTimeDuration));
  } else if (
    currentExamState == ExamState.WRITING_CAN_LEAVE ||
    currentExamState == ExamState.WRITING_CANNOT_LEAVE
  ) {
    if (writingTimeElapsed == 0) {
      startWritingTimeState();
    }

    setProgressBar(writingTimeElapsed, minutesToMs(writingTimeDuration));
  }

  updateDisplayElementsByState();
}

function startWritingTimeState() {
  deleteTimeIndicatorBars();
  generateTimeIndicatorBars(writingTimeDuration, 15);
}

function calculateNumberOfBars(totalDurationInMinutes, intervalTime) {
  return Math.floor(totalDurationInMinutes / intervalTime) + 1;
}

function styleMiddleTimeIndicatorBar(timeIndicatorBar) {
  timeIndicatorBar.style.width = "3px";
  timeIndicatorBar.style.height = "47px";
  timeIndicatorBar.style.top = "-13px";
  timeIndicatorBar.style.fontWeight = "bold";
  timeIndicatorBar.style.fontsize = "28px";
  timeIndicatorBar.style.background = "black";
}

function setTimeIndicatorText(
  index,
  intervalTime,
  timeIndicatorBar,
  totalDurationInMinutes
) {
  const durationInMinutes = (index - 1) * intervalTime;
  let timeForIndicatorBar = "";
  if (totalDurationInMinutes >= 180) {
    timeForIndicatorBar =
      durationInMinutes % 30 === 0
        ? convertMsToStringHourMin(minutesToMs(durationInMinutes))
        : "";
  } else {
    timeForIndicatorBar = convertMsToStringHourMin(
      minutesToMs(durationInMinutes)
    );
  }
  timeIndicatorBar.setAttribute(
    "time-indicator-text-data",
    timeForIndicatorBar
  );
}

function generateTimeIndicatorBars(totalDurationInMinutes, intervalTime) {
  const numberOfBars = calculateNumberOfBars(
    totalDurationInMinutes,
    intervalTime
  );

  for (let i = 1; i <= numberOfBars; i++) {
    const timeIndicatorBar = document.createElement("div");
    setTimeIndicatorText(
      i,
      intervalTime,
      timeIndicatorBar,
      totalDurationInMinutes
    );
    elements.timeIndicatorBars.appendChild(timeIndicatorBar);
  }

  const middleTimeIndicatorBarIndex = Math.floor(numberOfBars / 2) + 1;

  const middleTimeIndicatorBar =
    elements.timeIndicatorBars.children[middleTimeIndicatorBarIndex - 1];

  styleMiddleTimeIndicatorBar(middleTimeIndicatorBar);
}

function deleteTimeIndicatorBars() {
  elements.timeIndicatorBars.replaceChildren();
}

function setProgressBar(elapsedTime, totalTime) {
  const progress = (elapsedTime / totalTime) * 100;
  elements.progressBarFill.style.width = progress + "%";

  elements.progressBarFill.style.backgroundColor =
    currentExamState === ExamState.READING
      ? "var(--color-secondary)"
      : "var(--color-primary)";
}

function updateDisplayElementsByState() {
  const {
    displayMessage,
    pausedDisplayMessage,
    pauseButton,
    resetButton,
    startButton,
    addToRemainingBox,
    examState,
    backButton,
  } = elements;

  switch (currentExamState) {
    case ExamState.PRE_EXAM:
      deleteTimeIndicatorBars();
      generateTimeIndicatorBars(readingTimeDuration, 5);
      setProgressBar(readingTimeElapsed, minutesToMs(readingTimeDuration));
      displayMessage.style.display = "none";
      pausedDisplayMessage.style.display = "none";
      pauseButton.style.display = "none";
      resetButton.style.display = "none";
      startButton.style.display = "block";
      addToRemainingBox.style.display = "none";
      backButton.style.display = "block";
      examState.innerHTML = "Reading Time";
      examState.style.color = "#009AC7";

      break;

    case ExamState.READING:
      pausedDisplayMessage.style.display = "none";
      backButton.style.display = "none";

      pauseButton.style.display = "block";
      resetButton.style.display = "block";

      startButton.style.display = "none";

      addToRemainingBox.style.display = "none";
      examState.innerHTML = "Reading Time";
      examState.style.color = "#009AC7";

      displayMessage.style.display = "block";
      displayMessage.innerHTML =
        "Pens down. Reading time only. You may not write anything.";
      displayMessage.style.color = "#00467F";
      displayMessage.style.backgroundColor = "#E6EFF5";

      break;

    case ExamState.WRITING_CANNOT_LEAVE:
      pausedDisplayMessage.style.display = "none";
      backButton.style.display = "none";

      pauseButton.style.display = "block";
      resetButton.style.display = "block";

      addToRemainingBox.style.display = "none";
      examState.innerHTML = "Writing Time";
      examState.style.color = "#00467F";

      displayMessage.style.display = "block";
      displayMessage.innerHTML =
        "Students may NOT leave the room without permission";
      displayMessage.style.color = "red";
      displayMessage.style.backgroundColor = "#FFE5E5";

      break;

    case ExamState.WRITING_CAN_LEAVE:
      pausedDisplayMessage.style.display = "none";
      backButton.style.display = "none";

      pauseButton.style.display = "block";
      resetButton.style.display = "block";

      displayMessage.style.display = "block";
      displayMessage.innerHTML = "Students may leave the room with permission";
      displayMessage.style.color = "green";
      displayMessage.style.backgroundColor = "#E4FFDF";

      addToRemainingBox.style.display = "none";
      examState.innerHTML = "Writing Time";
      examState.style.color = "#00467F";

      break;

    case ExamState.POST_EXAM:
      window.location = "exam_finished_page/exam-finished-page.html";
      resetExam();
      break;

    case ExamState.PAUSED:
      pauseButton.style.display = "none";
      resetButton.style.display = "none";
      backButton.style.display = "none";
      pausedDisplayMessage.style.display = "block";
      addToRemainingBox.style.display = "block";
      displayMessage.style.display = "none";
      break;

    default:
      displayMessage.innerHTML = "";
      break;
  }
}

function displayExamDurationText(examDurationInMinutes) {
  if (examDurationInMinutes === 120) {
    elements.examDurationText.innerHTML = "Two-Hour Exam";
  } else if (examDurationInMinutes === 180) {
    elements.examDurationText.innerHTML = "Three-Hour Exam";
  } else {
    elements.examDurationText.innerHTML = "Custom Exam";
  }
}

function updateCountdownDisplay() {
  const { countdownTimeAndText, countdownTime } = elements;

  switch (currentExamState) {
    case ExamState.PRE_EXAM:
      updateCountdownText(
        "black",
        convertMsToStringMinSec(readingTimeRemaining)
      );
      break;

    case ExamState.READING:
      updateCountdownText(
        "black",
        convertMsToStringMinSec(readingTimeRemaining)
      );
      break;

    case ExamState.WRITING_CAN_LEAVE:
    case ExamState.WRITING_CANNOT_LEAVE:
      const textColor = writingTimeRemaining < minutesToMs(5) ? "red" : "black";
      updateCountdownText(
        textColor,
        convertMsToTimeString(writingTimeRemaining)
      );
      break;

    default:
      break;
  }

  function updateCountdownText(color, content) {
    countdownTimeAndText.style.color = color;
    countdownTime.innerHTML = content;
  }
}
