const MINUTES_IN_HOUR = 60;
const MAX_WRITING_HOURS = 9;
const MAX_WRITING_MINUTES = 59;
const MAX_READING_MINUTES = 59;
const MIN_TIME = 0;
const MIN_REQUIRED_INPUTS = 1;

let elementsToHide = ["two-hour-text", "three-hour-text", "custom-hour-text", "reading-time-error", "writing-hours-error", "writing-minutes-error", "leave-start-time-hours-error", "leave-start-time-minutes-error", "leave-end-time-minutes-error", "leave-time-exceed-error"];

let readingTime = 0;
let writingTime = 0;
let leaveStartTime = 60;
let leaveEndTime = 105;

const ExamType = {
    TWO_HOUR: "2hr",
    THREE_HOUR: "3hr",
    CUSTOM: "custom",
};

const TimeInputElements = {
    readingTime: document.getElementById('reading-time'),
    writingHours: document.getElementById('writing-hours'),
    writingMinutes: document.getElementById('writing-minutes'),
    leaveStartHours: document.getElementById('leave-start-time-hours'),
    leaveStartMinutes: document.getElementById('leave-start-time-minutes'),
    leaveEndMinutes: document.getElementById('leave-end-time-minutes'),
};

const attachInputListeners = (inputElements, handler) => {
    Object.values(inputElements).forEach((inputElement) => {
        if (inputElement) {
            inputElement.oninput = function() {
                if (this === inputElements.writingHours || this === inputElements.leaveStartHours) {
                    validateHours(this);
                } else {
                    validateMinutes(this);
                }
                handler();
            };
        }
    });
};

function onClickHourButton(elementToShow) {
    hideElements(elementsToHide);
    showElement(elementToShow);
}

function hideElements(elements) {
    elements.forEach(function(elementId) {
        let element = document.getElementById(elementId);
        if (element) {
            element.style.display = "none";
        }
    });
}

function showElement(elementToShow) {
    let element = document.getElementById(elementToShow);
    if (element) {
        element.style.display = "block";
    }
}

function parseTimeInput(element) {
    return parseInt(element.value) || 0;
}

function isLeaveStartValid(totalLeaveStartTime, totalWritingTime) {
    return totalLeaveStartTime >= MIN_TIME && totalLeaveStartTime <= totalWritingTime;
}

function isLeaveEndValid(leaveEndMinutes, totalLeaveStartTime, totalWritingTime) {
    return leaveEndMinutes >= MIN_TIME && leaveEndMinutes <= 59 && totalLeaveStartTime + leaveEndMinutes <= totalWritingTime;
}

function isInputsValid(inputsFilled, readingTime, writingHours, writingMinutes, isLeaveStartValidResult, isLeaveEndValidResult) {
    return inputsFilled &&
        readingTime >= MIN_TIME && readingTime <= MAX_READING_MINUTES &&
        writingHours >= MIN_TIME && writingHours <= MAX_WRITING_HOURS &&
        writingMinutes >= MIN_TIME && writingMinutes <= MAX_WRITING_MINUTES &&
        isLeaveStartValidResult && isLeaveEndValidResult;
}

window.onload = function() {
    hideElements(elementsToHide);
    updateConfirmButtonState();
    attachInputListeners(TimeInputElements, updateConfirmButtonState);
};

function confirmExam(examType) {
  switch (examType) {
    case ExamType.TWO_HOUR:
      readingTime = 10;
      writingTime = 120;
      leaveStartTime = 60;
      leaveEndTime = 105;
      break;
    case ExamType.THREE_HOUR:
      readingTime = 10;
      writingTime = 180;
      leaveStartTime = 60;
      leaveEndTime = 165;
      break;
    case ExamType.CUSTOM:
      readingTime = +document.getElementById("reading-time").value;
      writingTime = +document.getElementById("writing-hours").value * 60;
      writingTime += +document.getElementById("writing-minutes").value;
      leaveStartTime =
        +document.getElementById("leave-start-time-hours").value *
        60;
      leaveStartTime += +document.getElementById(
        "leave-start-time-minutes"
      ).value;
      leaveEndTime = writingTime;
      leaveEndTime -= +document.getElementById(
        "leave-end-time-minutes"
      ).value;
      break;
  }

    window.location = generateNextPageURL();
}

function generateNextPageURL() {
    const params = new URLSearchParams(window.location.search);

    params.set("readingTime", readingTime);
    params.set("writingTime", writingTime);
    params.set("leaveStartTime", leaveStartTime);
    params.set("leaveEndTime", leaveEndTime);

    const updatedQueryString = params.toString();

    return `${"../exam-clock-with-progress-bar.html"}?${updatedQueryString}`;
}

function updateConfirmButtonState() {

    const readingTime = parseTimeInput(TimeInputElements.readingTime);
    
    const writingHours = parseTimeInput(TimeInputElements.writingHours);
    const writingMinutes = parseTimeInput(TimeInputElements.writingMinutes);
    const leaveStartHours = parseTimeInput(TimeInputElements.leaveStartHours);
    const leaveStartMinutes = parseTimeInput(TimeInputElements.leaveStartMinutes);
    const leaveEndMinutes = parseTimeInput(TimeInputElements.leaveEndMinutes);

    const totalWritingTime = writingHours * MINUTES_IN_HOUR + writingMinutes;
    const totalLeaveStartTime = leaveStartHours * MINUTES_IN_HOUR + leaveStartMinutes;

    const isLeaveStartValidResult = isLeaveStartValid(totalLeaveStartTime, totalWritingTime);
    const isLeaveEndValidResult = isLeaveEndValid(leaveEndMinutes, totalLeaveStartTime, totalWritingTime);

    const requiredInputs = [TimeInputElements.writingMinutes, TimeInputElements.writingHours];

    const filledAndValidInputsCount = requiredInputs.filter(isInputFilled).length;

    const inputsFilled = filledAndValidInputsCount >= MIN_REQUIRED_INPUTS;

    const allValid = isInputsValid(inputsFilled, readingTime, writingHours, writingMinutes, isLeaveStartValidResult, isLeaveEndValidResult);

    updateConfirmButtonErrorMessage(allValid);
    
    document.getElementById('custom-confirm-button').disabled = !allValid;

}

function updateConfirmButtonErrorMessage(allInputs) {

  const errorMessage = document.getElementById('confirm-button-error');

  if (allInputs) {

    errorMessage.style.display = 'none';

} else {

    errorMessage.style.display = 'block';

}

}

function isNumeric(value) {
    return !isNaN(Number(value)) && Number(value) >= 0;
}

function isInputFilled(input) {
    return input.value.trim() !== '' && isNumeric(input.value);
}

function normalizeInputValue(inputElement) {
    let normalizedValue = inputElement.value.replace(/[^0-9]/g, '').replace(/^(0{2,})$/);
    normalizedValue = normalizedValue.replace(/^0$/, '');
    inputElement.value = normalizedValue;
    return normalizedValue;
}

function validateInput(inputElement, minValue, maxValue) {
    const normalizedValue = normalizeInputValue(inputElement);
    const isValid = normalizedValue >= minValue && normalizedValue <= maxValue;

    const writingHours = parseTimeInput(TimeInputElements.writingHours);
    const writingMinutes = parseTimeInput(TimeInputElements.writingMinutes);
    const leaveStartHours = parseTimeInput(TimeInputElements.leaveStartHours);
    const leaveStartMinutes = parseTimeInput(TimeInputElements.leaveStartMinutes);
    const leaveEndMinutes = parseTimeInput(TimeInputElements.leaveEndMinutes);

    const totalWritingTime = writingHours * MINUTES_IN_HOUR + writingMinutes;
    const totalLeaveStartTime = leaveStartHours * MINUTES_IN_HOUR + leaveStartMinutes;

    const isLeaveStartValidResult = isLeaveStartValid(totalLeaveStartTime, totalWritingTime);
    const isLeaveEndValidResult = isLeaveEndValid(leaveEndMinutes, totalLeaveStartTime, totalWritingTime);

    const errorElementId = inputElement.id + "-error";
    const errorElement = document.getElementById(errorElementId);

    const exceedErrorElement = document.getElementById("leave-time-exceed-error");
    if (isLeaveStartValidResult && isLeaveEndValidResult) {
        exceedErrorElement.style.display = 'none';
    } else {
        exceedErrorElement.style.display = 'block';
    }

    if (isValid) {
        inputElement.style.border = '';
        errorElement.style.display = 'none';
    } else {
        inputElement.style.border = '2px solid red';
        errorElement.style.display = 'block';
    }

}


function validateMinutes(inputElement) {
    validateInput(inputElement, MIN_TIME, MAX_WRITING_MINUTES);
}

function validateHours(inputElement) {
    validateInput(inputElement, MIN_TIME, MAX_WRITING_HOURS);
}