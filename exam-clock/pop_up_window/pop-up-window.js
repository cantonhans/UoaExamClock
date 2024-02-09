function openModalWindow(modalTitle, modalMessage) {
  document.getElementById("modal-title").textContent = modalTitle;
  document.getElementById("modal-message").textContent = modalMessage;
  document.getElementById("confirmation-modal").style.display = "block";
}

function closeModalWindow(modalResult) {
  document.getElementById("confirmation-modal").style.display = "none";

  if (modalResult) {
    if (document.getElementById("modal-title").textContent == "Reset Exam") {
      resetExam();
    } else {
      pauseTimer();
    }
  }
}
