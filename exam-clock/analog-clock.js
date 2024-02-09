function generateHourNumbers() {
  const hoursNumber = document.querySelector(".hour-numbers");
  const numberElement = [];

  for (let i = 1; i <= 12; i++) {
    numberElement.push(`<span style="--index:${i};"><p>${i}</p></span>`);
  }
  hoursNumber.insertAdjacentHTML("afterbegin", numberElement.join(""));
}

function generateSecondBars() {
  const secondsBars = document.querySelector(".seconds-bars");
  const barElement = [];

  for (let i = 1; i <= 60; i++) {
    barElement.push(`<span style="--barIndex:${i};"><p></p></span>`);
  }
  secondsBars.insertAdjacentHTML("afterbegin", barElement.join(""));
}

generateHourNumbers();
generateSecondBars();

function getCurrentTime() {
  const currentDate = new Date();
  return {
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    seconds: currentDate.getSeconds(),
  };
}

function setClockHands() {
  const { hours, minutes, seconds } = getCurrentTime();

  const hourDegree = (hours / 12) * 360;
  const minDegree = (minutes / 60) * 360;
  const secDegree = (seconds / 60) * 360;

  const hourHand = document.querySelector(".hour-hand");
  const minuteHand = document.querySelector(".minute-hand");
  const secondHand = document.querySelector(".second-hand");

  hourHand.style.transform = `rotate(${hourDegree + minDegree / 12}deg)`;
  minuteHand.style.transform = `rotate(${minDegree + secDegree / 60}deg)`;
  secondHand.style.transform = `rotate(${secDegree}deg)`;
}

setInterval(setClockHands, 1000);
