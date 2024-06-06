let pnrNumber = '';
let selectedDate = '';

// Function to be called when the page loads
window.onload = function() {
    handleMessageOnLoad();
};

function handleMessageOnLoad() {
    // Automatically initiating the date change flow
    const responseDiv = document.getElementById("response");
    responseDiv.innerHTML = '';

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";
    messageDiv.innerHTML = "<span>How do I change my customer's flight date for one segment</span>";
    responseDiv.appendChild(messageDiv);

    setTimeout(() => {
        const commandDiv1 = document.createElement("div");
        commandDiv1.className = "message command";
        commandDiv1.innerHTML = "<span>Detected a date change request</span>";
        responseDiv.appendChild(commandDiv1);

        setTimeout(() => {
            const commandDiv2 = document.createElement("div");
            commandDiv2.className = "message command";
            commandDiv2.innerHTML = "<span>Initiating date change flow in 3 seconds</span>";
            responseDiv.appendChild(commandDiv2);

            setTimeout(() => {
                document.getElementById("mainPage").style.display = "none";
                document.getElementById("innerContainer").style.display = "flex";
                showPNRInputPage();
            }, 1500);
        }, 1500);
    }, 1500);
}
    function showPNRInputPage() {
        const innerContent = document.getElementById("innerContent");
        innerContent.innerHTML = '';

        const pnrInputDiv = document.createElement("div");
        pnrInputDiv.className = "pnr-input";
        pnrInputDiv.innerHTML = `
            <span>Enter PNR</span>
            <input type="text" id="pnrInput" placeholder="Enter PNR Number">
            <div class="submit-button"> 
            <button onclick="submitPNR()"></button></div>
        `;
        innerContent.appendChild(pnrInputDiv);
    }

    function submitPNR() {
        pnrNumber = document.getElementById("pnrInput").value;

        if (pnrNumber) {
            fetch('/submit-pnr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pnr: pnrNumber })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSegmentSelectionPage();
                } else {
                    alert("Error submitting PNR");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert("Please enter a valid PNR number.");
        }
    }


    function showSegmentSelectionPage() {
        const innerContent = document.getElementById("innerContent");
        innerContent.innerHTML = '<span>Select the segment/s for date change</span>';
         
        const segmentOptions = ["Delhi to London", "London to Mumbai", "Mumbai to delhi"];
        segmentOptions.forEach(option => {
            const segmentOptionDiv = document.createElement("div");
            segmentOptionDiv.className = "segment-option";
            segmentOptionDiv.innerHTML = `
            
                <input type="radio" name="segment" value="${option}">
                <span>${option}</span>
            `;
            innerContent.appendChild(segmentOptionDiv);
        });

        const navigationButtonsDiv = document.createElement("div");
        navigationButtonsDiv.className = "navigation-buttons";
        navigationButtonsDiv.innerHTML = `
            <button onclick="showPNRInputPage()">Back</button>
            <button onclick="submitSegmentSelection()">Next</button>
        `;
        innerContent.appendChild(navigationButtonsDiv);
    }

    function submitSegmentSelection() {
        const selectedSegment = document.querySelector('input[name="segment"]:checked');

        if (selectedSegment) {
            showDateSelectionPage();
        } else {
            alert("Please select a segment.");
        }
    }

    function showDateSelectionPage() {
        const innerContent = document.getElementById("innerContent");
        innerContent.innerHTML = '';

        const dateSelectionDiv = document.createElement("div");
        dateSelectionDiv.className = "date-picker";
        dateSelectionDiv.innerHTML = `
            <div class="calendar">
                <div class="calendar-header">
                    <button onclick="prevMonth()">Prev</button>
                    <span id="calendarMonth"></span>
                    <button onclick="nextMonth()">Next</button>
                </div>
                <div class="calendar-body" id="calendarBody">
                    <!-- Calendar days will be dynamically added here -->
                </div>
            </div>
            <div class="navigation-buttons">
                <button onclick="showSegmentSelectionPage()">Back</button>
                <button onclick="submitDateSelection()">Next</button>
            </div>
        `;
        innerContent.appendChild(dateSelectionDiv);
        generateCalendar(new Date());
    }

    function generateCalendar(date) {
        const calendarBody = document.getElementById("calendarBody");
        calendarBody.innerHTML = '';
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const calendarMonth = document.getElementById("calendarMonth");
        calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "calendar-day";
            calendarBody.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.className = "calendar-day";
            dayCell.textContent = day;
            dayCell.onclick = () => selectDate(day, currentMonth, currentYear);
            calendarBody.appendChild(dayCell);
        }
    }

    function selectDate(day, month, year) {
        selectedDate = new Date(year, month, day);
        const allDays = document.querySelectorAll(".calendar-day");
        allDays.forEach(dayCell => {
            dayCell.classList.remove("selected");
        });
        event.target.classList.add("selected");
    }

    function prevMonth() {
        const currentMonth = new Date(selectedDate).getMonth();
        const currentYear = new Date(selectedDate).getFullYear();
        const newDate = new Date(currentYear, currentMonth - 1, 1);
        generateCalendar(newDate);
    }

    function nextMonth() {
        const currentMonth = new Date(selectedDate).getMonth();
        const currentYear = new Date(selectedDate).getFullYear();
        const newDate = new Date(currentYear, currentMonth + 1, 1);
        generateCalendar(newDate);
    }

    function submitDateSelection() {
        if (selectedDate) {
            showClassChangePage();
        } else {
            alert("Please select a date.");
        }
    }

    function showClassChangePage() {
        const innerContent = document.getElementById("innerContent");
        innerContent.innerHTML = '';

        const classChangeDiv = document.createElement("div");
        classChangeDiv.className = "class-change-page";
        classChangeDiv.innerHTML = `
            <div class="question">Is there any class change?</div>
            <div class="radio-buttons">
                <input type="radio" name="classChange" value="yes"> Yes
                <input type="radio" name="classChange" value="no"> No
            </div>
            <div class="navigation-buttons">
                <button onclick="showDateSelectionPage()">Back</button>
                <button onclick="submitClassChange()">Next</button>
            </div>
        `;
        innerContent.appendChild(classChangeDiv);
    }

    function submitClassChange() {
        const classChange = document.querySelector('input[name="classChange"]:checked');

        if (classChange) {
            showStep1Page();
        } else {
            alert("Please select an option for class change.");
        }
    }

    function showStep1Page() {
        const innerContent = document.getElementById("innerContent");
        innerContent.innerHTML = '';

        const step1Div = document.createElement("div");
        step1Div.className = "step1-page";
        step1Div.innerHTML = `
            <div class="step-title">Step 1</div>
            <div class="step-description">Check with airline if it permits reissue or revalidation</div>
            <div class="step-description">Copy and enter the following command</div>
            <div class="command-box">
                <span>HE ETT TK</span>
                <button onclick="copyCommand()">Copy</button>
            </div>
            <div class="navigation-buttons">
                <button onclick="showClassChangePage()">Back</button>
                <button onclick="showStep2Page()">Next</button>
            </div>
        `;
        innerContent.appendChild(step1Div);
    }

    function copyCommand() {
        const commandText = document.querySelector('.command-box span').textContent;
        navigator.clipboard.writeText(commandText).then(() => {
            alert("Command copied to clipboard!");
        });
    }

    function showStep2Page() {
        const innerContent = document.getElementById("innerContent");
        innerContent.innerHTML = '';

        const step2Div = document.createElement("div");
        step2Div.className = "step2-page";
        step2Div.innerHTML = `
            <div class="step2-title">Step 2</div>
            <div class="step2-description">Check if airline has any change fee</div>
            <div class="step2-description">Copy and enter the following command</div>
            <div class="command2-box">
                <span>HE 2Y EK</span>
                <button onclick="copy2Command()">Copy</button>
            </div>
            <div class="navigation2-buttons">
                <button onclick="showStep1Page()">Back</button>
                <button onclick="showStep3Page() ">Next</button>
            </div>
        `;
        innerContent.appendChild(step2Div);
    }

    function copyCommand() {
        const commandText = document.querySelector('.command-box span').textContent;
        navigator.clipboard.writeText(commandText).then(() => {
            alert("Command copied to clipboard!");
        });
    }

    
    function copy2Command() {
        const commandText2 = document.querySelector('.command2-box span').textContent;
        navigator.clipboard.writeText(commandText2).then(() => {
            alert("Command copied to clipboard!");
        });
    }
     
    function showStep3Page() {
        const innerContent = document.getElementById("innerContent");
        innerContent.innerHTML = '';

        const step3Div = document.createElement("div");
        step3Div.className = "step3-page";
        step3Div.innerHTML = `
        <div>
        <div class="info">
        <p>PNR: ABC123</p>
        <p>Segment: Delhi to London</p></div>

        <div>
            <label for="pnr-input">Enter PNR</label>
            <div class="command3-box">
                <span>ABC123</span>
                <button onclick="copy3Command()">Copy</button>
             </div>
        </div>

        <div>
            <label for="price-input">Price the new ticket</label>
            <div class="command3-box">
                <span>EY98Y4</span>
                <button onclick="copy3Command()">Copy</button>
             </div>
        </div>
        
        
        
        <div>
            <label for="exchange-input">Exchange the ticket</label>
            <div class="command3-box">
                <span>W014EY</span>
                <button onclick="copy3Command()">Copy</button>
             </div>
        </div>
        
         </div>    
        `;
        innerContent.appendChild(step3Div);
    }
    
     
    function copy3Command() {
        const commandText3 = document.querySelector('.command3-box span').textContent;
        navigator.clipboard.writeText(commandText3).then(() => {
            alert("Command copied to clipboard!");
        });
    }

    function completeProcess() {
        alert("Process completed!");
        exitDateChangeFlow();
    }

    function exitDateChangeFlow() {
        document.getElementById("mainPage").style.display = "flex";
        document.getElementById("innerContainer").style.display = "none";
    }
