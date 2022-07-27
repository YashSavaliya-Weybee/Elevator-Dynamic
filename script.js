do {
    floors = prompt("Enter number of floors!");
} while (floors == null || floors == "" || floors == 0);

do {
    Elevators = prompt("Enter number of Elevators!");
} while (Elevators == null || Elevators == "" || Elevators == 0);

let i = 1;
let floorsArr = [];
const allElevators = [];
let tempTop = (floors * 100) - 100;

const allEle = document.querySelector(`.elevators`);
const actionBtn = document.querySelector('.up-down-btns')
const buttons = document.getElementsByTagName('button');


function insertNewBlock() {
    const html = `<div class="singleEle">
                    <div id="elePath-${i}" class="ele-path">
                        <div id="ele-${i}" class="elevator">1</div>
                    </div>
                    <label class="OnOffbtn">
                        <div id="onoffbtn${i}" class="offbtn" onclick="onoffElevator(this)">
                            <div class="dot"></div>
                        </div>
                    </label>
                 </div>`
    allEle.insertAdjacentHTML("beforeend", html);
}

for (let j = 1; j <= Elevators; j++) {
    insertNewBlock();

    document.querySelectorAll(`.ele-path`)[j - 1].style.height = `${floors * 100}px`;
    document.querySelector(`.up-down-btns`).style.height = `${floors * 100}px`;
    document.querySelectorAll(`.elevator`)[j - 1].style.top = `${(floors * 100) - 100}px`;
    allElevators.push({
        id: i,
        liftPosition: document.getElementById(`ele-${i}`).textContent,
        isMaintenance: false
    })
    i++;
}

for (let j = 1; j <= floors; j++) {
    if (j === 1) {
        floorsArr.push(`<div class="btnupDown">
                            <div class="flore-no"><label>${j}</label></div>
                            <button id="${j}U" height="${tempTop}">
                                <i class="fa-solid fa-angle-up"></i>
                            </button>
                        </div>`)
    }
    else if (j == floors) {
        floorsArr.push(`<div class="btnupDown">
                            <div class="flore-no"><label>${j}</label></div>
                            <button id="${j}D" height="${tempTop}">
                                <i class="fa-solid fa-angle-down"></i>
                            </button>
                        </div>`)
    }
    else {
        floorsArr.push(`<div class="btnupDown">
                            <div class="flore-no"><label>${j}</label></div>
                            <button id="${j}U" height="${tempTop}">
                                <i class="fa-solid fa-angle-up"></i>
                            </button>
                            <button id="${j}D" height="${tempTop}">
                                <i class="fa-solid fa-angle-down"></i>
                            </button>
                        </div>`)
    }
    tempTop = tempTop - 100
}
floorsArr.forEach(j => actionBtn.insertAdjacentHTML("afterBegin", j));

function onoffElevator(btn) {
    let eleNo = btn.id.slice(8);
    let elevator = document.querySelector(`#ele-${eleNo}`);
    btn.classList.toggle('onbtn');

    if (!elevator.classList.contains('eleoff')) {
        elevator.style.top = `${(floors * 100) - 100}px`;
        elevator.classList.add('eleoff');
        elevator.textContent = 1

        allElevators[eleNo - 1].liftPosition = "1";
        allElevators[eleNo - 1].isMaintenance = true;
    } else {
        elevator.classList.remove('eleoff');
        allElevators[eleNo - 1].isMaintenance = false;
    }
}

for (let j of buttons) {
    j.addEventListener("click", function () {
        const requestedFloor = j.getAttribute('id').slice(0, -1);
        const height = j.getAttribute('height');
        checkFirstFloor();
        whichLiftToMove(height, requestedFloor);
    })
}

let onElevator;
let numberOfWorkingLifts;
let isFirstFloor = false;

function checkFirstFloor() {
    for (let j of allElevators) {
        if (j.liftPosition === '1') {
            isFirstFloor = true;
        } else {
            isFirstFloor = false;
            break;
        }
    }
}

function whichLiftToMove(height, requestedFloor) {
    onElevator = allElevators.filter(j => j.isMaintenance == false);
    numberOfWorkingLifts = onElevator.length;

    if (!allElevators[1].isMaintenance && isFirstFloor) {
        document.querySelector(`#ele-${2}`).style.top = `${height}px`;
        document.querySelector(`#ele-${2}`).style.transition = `${Math.abs(allElevators[1].liftPosition - requestedFloor) / 2}s linear`;
        allElevators[1].liftPosition = requestedFloor;
        document.querySelector(`#ele-${2}`).textContent = requestedFloor;

        isFirstFloor = false;
    }
    else {
        let minDisEle = Math.min(...onElevator.map(j => Math.abs(j.liftPosition - requestedFloor)));
        let min = [];
        onElevator.forEach(j => {
            if (Math.abs(j.liftPosition - requestedFloor) == minDisEle) {
                min.push(j);
            }
        });
        let elevatorTravel = min[Math.floor(Math.random() * min.length)].id;
        allElevators[elevatorTravel - 1].isRunning = true
        document.querySelector(`#ele-${elevatorTravel}`).style.top = `${height}px`;
        let a = onElevator.findIndex(x => x.id == `${elevatorTravel}`);
        document.querySelector(`#ele-${elevatorTravel}`).style.transition = `${Math.abs(onElevator[a].liftPosition - requestedFloor) / 2}s linear`;
        onElevator[a].liftPosition = requestedFloor;
        document.querySelector(`#ele-${elevatorTravel}`).textContent = requestedFloor;
    }
}