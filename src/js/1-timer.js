import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const datePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('button[data-start]');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let countdownInterval = null;

function toggleStartButtonState(isEnabled) {
  startButton.disabled = !isEnabled;
  startButton.style.opacity = isEnabled ? '1' : '0.6';
  startButton.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
}

toggleStartButtonState(false);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      toggleStartButtonState(false);
      return;
    }

    userSelectedDate = selectedDate;
    toggleStartButtonState(true);
  },
};

flatpickr(datePicker, options);

function startCountdown() {
  const updateCountdown = () => {
    const currentTime = new Date();
    const remainingTime = userSelectedDate - currentTime;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      iziToast.success({ title: 'Completed', message: 'Countdown finished!' });
      toggleStartButtonState(false);
      datePicker.disabled = false;
      updateTimer(0);
      return;
    }

    updateTimer(remainingTime);
  };

  countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
  toggleStartButtonState(false);
  datePicker.disabled = true;
}

startButton.addEventListener('click', startCountdown);

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
