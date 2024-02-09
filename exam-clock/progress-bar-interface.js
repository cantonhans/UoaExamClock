window.onload = function () {
  initialiseExamTimer();
};

function initialiseExamTimer() {
  setExamDuration();
  resetExam();
}

function setExamDuration() {
  const urlParams = new URLSearchParams(window.location.search);
  readingTimeDuration = urlParams.get("readingTime");
  writingTimeDuration = urlParams.get("writingTime");
  studentsMayLeaveStartTime = urlParams.get("studentsMayLeaveStartTime");
  studentsMayLeaveEndTime = urlParams.get("studentsMayLeaveEndTime");
}

function backButtonClick() {
  window.location = "home_page/home.html";
}

function resetTimerButtonClick() {
  openModalWindow(
    "Reset Exam",
    `Are you sure you want to reset the current exam?`
  );
}
function pauseButtonClick() {
  openModalWindow(
    isPaused ? "Resume Exam" : "Pause Exam",
    `Are you sure you want to ${
      isPaused ? "resume" : "pause"
    } the current exam?`
  );
}

function updateTimeDisplayElements() {
  updateTimeDisplay();
}

function startButtonClick() {
  startExam();
}

function resumeButtonClick() {
  validateInput();
  addTimeToExam(minutesToAdd);
  unpauseTimer();
}

function updateInputValue(timeIncrement) {
  let currentValue =
    parseInt(document.getElementById("time-to-add").value) || 0;
  minutesToAdd = Math.max(0, currentValue + timeIncrement);
  document.getElementById("time-to-add").value = minutesToAdd;
}

function validateInput() {
  document.getElementById("time-to-add").value = document
    .getElementById("time-to-add")
    .value.replace(/\D/g, "");

  // + is the Unary plus operator which converts string to numerical
  minutesToAdd = +document.getElementById("time-to-add").value;
}
