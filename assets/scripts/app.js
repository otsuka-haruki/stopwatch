////////// stopwatch //////////

let stopwatchId = 1;
let howManyStopwatchDeleted = 0;

class Stopwatch {
  constructor(id) {
    this.id = id;
    this.createNewStopwatch();
    this.createGlobal();
    this.addEventToStartStopButton();
    this.addEventToResetButton();
    this.addEventToOtherElements();
  }
  
  ////////// creating new stopwatch with template

  createNewStopwatch() {
      const stopwatchRow = document.querySelector('.stopwatch-row');
      const templateStopwatchBox = document.getElementById('template-stopwatch-box');
      let cloneTemplate = templateStopwatchBox.content.cloneNode(true);
      stopwatchRow.append(cloneTemplate);
  }

  ////////// getting DOM elements
  createGlobal() {
    this.stopwatchBoxAll = document.querySelectorAll('.stopwatch-box');
    this.stopwatchBox = this.stopwatchBoxAll[this.id - 1 - howManyStopwatchDeleted];
    this.secondSpan = this.stopwatchBox.querySelector('#second');
    this.minuteSpan = this.stopwatchBox.querySelector('#minute');
    this.hourSpan = this.stopwatchBox.querySelector('#hour');
    this.progressTimeBar = this.stopwatchBox.querySelector('#progress-time-bar');
    this.deleteButton = this.stopwatchBox.querySelector('#delete');
    this.startButton = this.stopwatchBox.querySelector('#start');
    this.resetButton = this.stopwatchBox.querySelector('#reset');
    this.goalHourPhrase = this.stopwatchBox.querySelector('#goal #hour');

    ////////// initializing values
    this.isStopwatchRunning = false;
    this.intervalId;
    this.secondNumber = 0;
    this.minuteNumber = 0;
    this.hourNumber = 0;
    this.enteredGoalNumber = null;
  }

  ////////// toggle start and stop

  addEventToStartStopButton() {
    this.startButton.addEventListener('click', toggleStopwatch.bind(this));

    function toggleStopwatch() {
      if (this.isStopwatchRunning) {
        this.isStopwatchRunning = false;
        clearInterval(this.intervalId);
        this.startButton.innerHTML = '<i class="fas fa-play"></i><p>Start</p>';
        this.stopwatchBox.querySelector('#stopwatch-body-p').classList.remove('zoom');
        return;
      } else {
        this.isStopwatchRunning = true;
        this.stopwatchBox.querySelector('#stopwatch-body-p').classList.add('zoom');
        this.startButton.innerHTML = '<i class="fas fa-pause"></i>Stop';
        this.intervalId = setInterval(() => {
          this.secondNumber++;
          if (this.secondNumber === 60) {
            this.secondNumber = 0;
            this.minuteNumber++;
          }
          if (this.minuteNumber === 60) {
            this.minuteNumber = 0;
            this.hourNumber++;
          }
          this.secondSpan.textContent = ('0' + this.secondNumber).slice(-2);
          this.minuteSpan.textContent = ('0' + this.minuteNumber).slice(-2);
          this.hourSpan.textContent = ('0' + this.hourNumber).slice(-2);

          if (this.enteredGoalNumber) {
            const goalSecond = this.enteredGoalNumber * 3600;
            const goalPercentage = this.secondNumber / goalSecond * 100;
            this.progressTimeBar.style.width = `${goalPercentage}%`;
          }
        }, 1000);
      }
    }
  }

  //////// reset stopwatch

  addEventToResetButton() {

    this.resetButton.addEventListener('click', resetStopwatch.bind(this));

    function resetStopwatch() {
      if (this.isStopwatchRunning) {
        return;
      }
      this.secondNumber = 0;
      this.minuteNumber = 0;
      this.hourNumber = 0;
      this.secondSpan.textContent = ('0' + this.secondNumber).slice(-2);
      this.minuteSpan.textContent = ('0' + this.minuteNumber).slice(-2);
      this.hourSpan.textContent = ('0' + this.hourNumber).slice(-2);
      this.title.textContent = 'Click here to enter title';
      this.startButton.querySelector('p').classList.add('vertical-bound');
      this.goalHourPhrase.textContent = 'Click here to set your goal (in hour)';
      this.progressTimeBar.style.width = 0;
    }
  }

  ////////// adding eventlistener to some DOM elements in stopwatch

  addEventToOtherElements() {
    
    ////////// click title to enter title

    const addEventToTitle = () => {
      const titleBox = this.stopwatchBox.querySelector('#title-box');
      this.title = titleBox.querySelector('h3');
      titleBox.addEventListener('click', () => {
        const enteredTitle = prompt('Enter title!');
        if (!enteredTitle) {
          return;
        }
        this.title.textContent = enteredTitle;
        this.title.classList.remove('vertical-bound');
      });
    }

    ////////// click goal phrase to set goal
    
    const addEventToGoal = () => {
      this.goalHourPhrase.addEventListener('click', () => {
        this.enteredGoalNumber = parseInt(prompt('How many hours will you work on it today?'));
        if (isNaN(this.enteredGoalNumber)) {
          alert('Invalid entry, try something else');
        } else if (this.enteredGoalNumber === 1) {
          this.goalHourPhrase.textContent = this.enteredGoalNumber + ' ' + 'hour';
        } else {
          this.goalHourPhrase.textContent = this.enteredGoalNumber + ' ' + 'hours';
        }
      });
    }
    
    ////////// click to delete stopwatch

    const addEventToDeleteButton = () => {
      this.deleteButton.addEventListener('click', () => {
        clearInterval(this.intervalId);
        this.stopwatchBox.remove();
        howManyStopwatchDeleted++;
        if (stopwatchId - howManyStopwatchDeleted < 2) {
          document.getElementById('add-stopwatch').style.display = 'inline';
        }
      })
    }

    addEventToTitle();
    addEventToGoal();
    addEventToDeleteButton();
  }
}

////////// starting app

class App {
  constructor() {
    new Stopwatch(stopwatchId);
    this.addEventToModeToggle();
    this.addEventToAddButton();
  }
  
  ////////// toggle dark mode and light mode
  
  addEventToModeToggle() {
    const modeButton = document.querySelector('#show-mode-toggle');
    modeButton.addEventListener('click', () => {
      const wholePage = document.querySelector('.stopwatch-page');
      if (wholePage.classList.contains('dark-mode')) {
        modeButton.innerHTML = '<i class="fas fa-adjust"></i>Dark Mode';
        wholePage.classList.remove('dark-mode');
      } else {
        modeButton.innerHTML = '<i class="fas fa-adjust"></i>Light Mode';
        wholePage.classList.add('dark-mode');
      }
    });
  }
  
  ////////// add more stopwatch
  
  addEventToAddButton() {
    document.getElementById('add-stopwatch').addEventListener('click', () => {
      if (stopwatchId - howManyStopwatchDeleted < 2) {
        stopwatchId++;
        new Stopwatch(stopwatchId);
        if (stopwatchId - howManyStopwatchDeleted === 2) {
          document.getElementById('add-stopwatch').style.display = 'none';
        }
      }
    });
  }
}

////////// firing app

new App();
