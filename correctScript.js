// asking user for number of lifts & user must have to enter number of Lifts <OR> user can not move on
do {
    floors = prompt("How many floors in your Building");
}while(floors == null || floors == "" || floors == 0);

// ------------------------------ Variable Declaration ------------------------------
const noOfLifts = floors/2;
let floorsArr = [];
let workingLifts;
let numberOfWorkingLifts;
let intoMaintenance = [];
let isFirstFloor = false;
let l = 1;
const upDownBtns  = document.querySelector(`.up-down-btns`);
const allLifts = document.querySelector(`.all-lifts`);



// ------------------------------ HTML for One Lift Block ------------------------------
function insertNewBlock() {
    const html =`
    <div class="div">
        <div class="lift-block flex" id="block-${l}">
            <div class="numbers flex" id="numbers-${l}">
            </div>
            <div class="lift" id="lift-${l}">
                <p class="lift-pos hidden" id="lift-pos-${l}">1</p>
            </div>
        </div>
        <label class="switch">
            <input type="checkbox" name="cb" id="check-${l}" onclick="checkForMaintenance(event)">
            <span class="slider round" id="span-${l}"></span>
        </label>
    </div>
    `

    allLifts.insertAdjacentHTML("beforeend", html);
}


// ------------------------------ Insert Lifts Dynamically ------------------------------
for(let i=0; i<noOfLifts; i++) {
    insertNewBlock();
    const numbers = document.querySelector(`#numbers-${l}`);
    const liftBlock = document.querySelector(`#block-${l}`).style.height = `${floors*100}px`;
    for(let a=floors; a>=1; a--) {
        const p = document.createElement("p");
        numbers.appendChild(p);
        p.textContent = a;
    }
    l++;
}


// ------------------------------ Check for Maintenance ------------------------------
// Check -> into Maintenance
// Uncheck -> Working
function checkForMaintenance(event) {
    const idNumber = event.target.id.split('-')[1];
    const cBox = document.querySelector(`#check-${idNumber}`);
    const liftBox = document.querySelector(`#lift-${idNumber}`);
    if(cBox.checked) {
        liftBox.style.bottom = "0px";
        liftBox.style.border = "1px solid red";

        intoMaintenance.push(liftBox.id);

        liftObj[idNumber-1].liftPosition = "1";
        liftObj[idNumber-1].isMaintenance = true;
    }
    else if(!cBox.checked) {
        liftBox.classList.add("lift-tempo");
        liftBox.style.border = "none";

        const popElement = intoMaintenance.indexOf(document.querySelector(`#lift-${idNumber}`).id);
        intoMaintenance.splice(popElement, 1);
        liftObj[idNumber-1].isMaintenance = false;
         
    }
}


// ------------------------------ Add lift Controls OR Buttons ------------------------------
for(let i = 1; i<=floors; i++) {
    if(i===1) {
        floorsArr.push(`
        <div class="btns flex">
            <p class="single-btn">${i}</p>
            <p class="single-btn ud-btn" id="up-${i}" onclick="moveLift(this.id)"><img src="caret-arrow-up.png" alt=""></p>
        </div>
        `)
    }
    else if(i==floors) {
        floorsArr.push(`
        <div class="btns flex">
            <p class="single-btn">${i}</p>
            <p class="single-btn ud-btn" id="down-${i}" onclick="moveLift(this.id)"><img src="down-filled-triangular-arrow.png" alt=""></p>
        </div>
        `)
    }
    else {
        floorsArr.push(`
        <div class="btns flex">
            <p class="single-btn">${i}</p>
            <p class="single-btn ud-btn" onclick="moveLift(this.id)" id="up-${i}"><img src="caret-arrow-up.png"alt="" id="up-${i}"></p>
            <p class="single-btn ud-btn" onclick="moveLift(this.id)" id="down-${i}"><img src="down-filled-triangular-arrow.png" alt=""></p>
        </div>
        `)
    }
}
floorsArr.forEach(i => upDownBtns.insertAdjacentHTML("afterBegin", i));


// ------------------------------ Move Lift to the Requested Floor ------------------------------
const lifts = document.querySelectorAll(`.lift`);
let liftObj = [];

lifts.forEach(i => {
    const obj = {
        liftNumber: i.id.split('-')[1],
        liftId: i.id,
        liftPosition: i.querySelector(`.lift-pos`).textContent,
        isMaintenance: false,
    }
    liftObj.push(obj);
})

function moveLift(a) {
    const requestedFloor = a.split('-')[1];
    const height = (a.split('-')[1]-1)*100;
    checkFirstFloor();
    whichLiftToMove(a,height,requestedFloor);
}

// Check wether all lift are at first floor
function checkFirstFloor() {
    for(let i of liftObj) {
        if(i.liftPosition === '1') {
            isFirstFloor = true;
        }else {
            isFirstFloor = false;
            break;
        }
    }
}

// Calculate that which lift should be move to requested floor
function whichLiftToMove(a,height,requestedFloor) {
    let FirstPriorityLift = 2;
    workingLifts = liftObj.filter(i => i.isMaintenance == false);
    numberOfWorkingLifts = workingLifts.length;
    const randomLift = Math.floor(Math.random()*numberOfWorkingLifts)+1;

    if(!liftObj[1].isMaintenance && isFirstFloor) {
        document.querySelector(`#lift-${2}`).style.bottom = `${height}px`;
        document.querySelector(`#lift-${2}`).style.transition = `${Math.abs(liftObj[1].liftPosition - requestedFloor)/2}s linear`;
        liftObj[1].liftPosition = requestedFloor;
        document.querySelector(`#lift-pos-${2}`).textContent = requestedFloor;

        isFirstFloor = false;
    }
    else {
        let minimum = Math.min(...workingLifts.map(i => Math.abs(i.liftPosition - requestedFloor)));
        let fArr = [];
        workingLifts.forEach(i=> {
            if(Math.abs(i.liftPosition - requestedFloor) == minimum) {
                fArr.push(i);
            }
        });
        let liftThatWillMove = fArr[Math.floor(Math.random()*fArr.length)].liftNumber;
        document.querySelector(`#lift-${liftThatWillMove}`).style.bottom = `${height}px`;
        let a = workingLifts.findIndex(x => x.liftId === `lift-${liftThatWillMove}`);
        document.querySelector(`#lift-${liftThatWillMove}`).style.transition = `${Math.abs(workingLifts[a].liftPosition - requestedFloor)/2}s linear`;
        workingLifts[a].liftPosition = requestedFloor;
        document.querySelector(`#lift-pos-${liftThatWillMove}`).textContent = requestedFloor;
    }
}