// This file is for options page




function saveOptions() {

    /*
    Saves options into the local storage
    */

    // retrive values from form fields
    firstDay = document.getElementById("firstDay").value;
    nDays = document.getElementById("nDays").value;

    firstLectureHours = document.getElementById("firstLectureHours").value,
        firstLectureMins = document.getElementById("firstLectureMins").value,
        firstLecturePeriod = document.getElementById("firstLecturePeriod").value,

        lastLectureHours = document.getElementById("lastLectureHours").value,
        lastLectureMins = document.getElementById("lastLectureMins").value,
        lastLecturePeriod = document.getElementById("lastLecturePeriod").value,

        lectureDurationHours = document.getElementById("lectureDurationHours").value,
        lectureDurationMinutes = document.getElementById("lectureDurationMinutes").value,

        showEmoji = document.getElementById("showEmoji").checked,
        showRoom = document.getElementById("showRoom").checked,
        // showLecturer = document.getElementById("showLecturer").checked,
        timeTable = formTimeArray()


    // Collect all values data in one object
    preferences = {
        "firstDay": firstDay,
        "nDays": nDays,
        "firstLecture":
        {
            "firstLectureHours": firstLectureHours,
            "firstLectureMins": firstLectureMins,
            "firstLecturePeriod": firstLecturePeriod,
        },
        "lastLecture":
        {
            "lastLectureHours": lastLectureHours,
            "lastLectureMins": lastLectureMins,
            "lastLecturePeriod": lastLecturePeriod,
        },
        "lectureDuration":
        {
            "lectureDurationHours": lectureDurationHours,
            "lectureDurationMinutes": lectureDurationMinutes,
        },
        "visibleInfo":
        {
            "showEmoji": showEmoji,
            "showRoom": showRoom,
            // "showLecturer": showLecturer,
        },
        "timeTable": timeTable
    };

    // Save values to local storage as json.
    localStorage["preferences"] = JSON.stringify(preferences)
    console.log(JSON.stringify(preferences))



    $("#status").fadeIn();
    setTimeout(function () {
        $("#status").fadeOut();
    }, 1500);

}



function restoreOptions() {

    /*
    Restores saved data from localStorage.
    */

    var preferencesExist = localStorage["preferences"];
    if (!preferencesExist) {
        // nothing in the local storage
        return;
    } else {
        // get saved preferences as json
        savedPreferences = JSON.parse(localStorage["preferences"]);
        // set values in the input fields
        document.getElementById("firstDay").value = savedPreferences.firstDay
        document.getElementById("nDays").value = savedPreferences.nDays
        document.getElementById("firstLectureHours").value = savedPreferences.firstLecture.firstLectureHours
        document.getElementById("firstLectureMins").value = savedPreferences.firstLecture.firstLectureMins
        document.getElementById("firstLecturePeriod").value = savedPreferences.firstLecture.firstLecturePeriod
        document.getElementById("lastLectureHours").value = savedPreferences.lastLecture.lastLectureHours
        document.getElementById("lastLectureMins").value = savedPreferences.lastLecture.lastLectureMins
        document.getElementById("lastLecturePeriod").value = savedPreferences.lastLecture.lastLecturePeriod
        document.getElementById("lectureDurationHours").value = savedPreferences.lectureDuration.lectureDurationHours
        document.getElementById("lectureDurationMinutes").value = savedPreferences.lectureDuration.lectureDurationMinutes
        document.getElementById("showEmoji").checked = savedPreferences.visibleInfo.showEmoji
        document.getElementById("showRoom").checked = savedPreferences.visibleInfo.showRoom
        // document.getElementById("showLecturer").checked = savedPreferences.visibleInfo.showLecturer
    }
}

function clearStorage() {
    localStorage.clear();

}

function changeDaysSequence() {

    /*
    Changes the sequence of days based on the first day
    */

    firstRow = document.getElementById("Schedule").rows[0];
    newDay = document.getElementById("firstDay").value;

    Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    firstDay = Days.indexOf(newDay)
    init = firstDay
    len = firstRow.cells.length + 1

    for (i = 0; i < len; i++) {
        // potentional problem here
        index = init % 7
        firstRow.cells[i + 1].innerHTML = Days[index]
        init++
    }

}


function changeNumberOfDays() {

    /*
    Changes the number of days in the schedule (whether increase or decrease)
    */

    nRows = document.getElementById("Schedule").rows.length
    len = document.getElementById("Schedule").rows[0].cells.length - 1
    newLen = document.getElementById("nDays").value
    difference = Math.abs(newLen - len)

    for (i = 0; i < nRows; i++) {
        for (j = 0; j < difference; j++) {
            if (newLen < len) {
                document.getElementById("Schedule").rows[i].deleteCell(-1)
            } else {
                var newcell = document.getElementById("Schedule").rows[i].insertCell(-1)
                if (i == 0) {
                    newcell.className = "day";
                }
                else {
                    newcell.className = "lecture";
                }
            }
        }
    }

    // need to reset days sequence after change in the number of days
    changeDaysSequence()
}



function createLecturesTable() {

    /*
    Constructs the preview table
    */




    if (parseInt(document.getElementById("lectureDurationHours").value, 10) == 0 && parseInt(document.getElementById("lectureDurationMinutes").value, 10) == 0) {

        console.log("Validation: Wrong order detected")
        document.getElementById("Schedule").style.opacity = "40%"
        document.getElementById("errorMsg").style.display = "block"
        document.getElementById("errorTD").innerHTML = '<p> <b>Error:</b> <br>Lecture time cannot zero minutes!</p>'
        return

    } else {
        console.log("Validation: Correct order")
        document.getElementById("Schedule").style.opacity = "100%"
        document.getElementById("errorMsg").style.display = "none"
    };

    // Not after end date
    if (ValidateTime()) {

        // form the time array
        timeArray = formTimeArray()

        nRows = document.getElementById("Schedule").rows.length - 1
        newRows = timeArray.length
        difference = Math.abs(nRows - newRows)

        //delete unnecessary rows
        if (newRows < nRows) {
            console.log("New rows are less than existing rows. deleting last " + difference + " rows")
            for (k = 0; k < difference; k++) {
                document.getElementById("Schedule").deleteRow(-1)
            }
        }

        console.log("------- Started forming table -------")
        //iterate on rows
        for (i = 1; i <= timeArray.length; i++) {
            console.log(" - Row " + i + ":")
            if (i <= nRows) {
                console.log("   Existing row, inserted " + timeArray[i - 1])
                document.getElementById("Schedule").rows[i].cells[0].children[0].innerHTML = timeArray[i - 1];
            } else {
                console.log("   Non existing row, Added a new Row")
                newRow = document.getElementById("Schedule").insertRow(-1)
                nDays = document.getElementById("nDays").value
                // fixed this from < into <=
                for (j = 0; j <= nDays; j++) {
                    newCell = newRow.insertCell(j)
                    if (j == 0) {
                        console.log("   Added cell at row " + i + ", position " + j + ", Content: " + timeArray[i - 1])
                        newCell.className = 'time'
                        newCell.innerHTML = '<span>' + timeArray[i - 1] + '</span>'
                    } else {
                        newCell.className = 'lecture'

                    }
                }
            }
        }

    }
}


function ValidateTime() {

    // (just auto corrections, don't effect validation result)
    // Not more than 12 (am / pm system)
    if (parseInt(document.getElementById("firstLectureHours").value, 10) > 12) document.getElementById("firstLectureHours").value = '12';
    if (parseInt(document.getElementById("lastLectureHours").value, 10) > 12) document.getElementById("lastLectureHours").value = '12';

    // Correct format
    if (parseInt(this.value, 10) < 10) this.value = '0' + this.value;


    // Validation case => if lecture duration is zero (both hours and minutes)
    if (parseInt(document.getElementById("lectureDurationHours").value, 10) == 0 && parseInt(document.getElementById("lectureDurationMinutes").value, 10) == 0) {

        document.getElementById("Schedule").style.opacity = "40%"
        document.getElementById("errorMsg").style.display = "block"
        document.getElementById("errorTD").innerHTML = '<p> <b>Error:</b> <br>Lecture time cannot zero minutes!</p>'
        return false;
    }

    // calculating srta and end hours

    // start time
    sHours = document.getElementById("firstLectureHours").value
    sMins = document.getElementById("firstLectureMins").value
    startTime = moment(sHours + ":" + sMins, "hh:mm");

    // convert to 24h format => if pm add 12 hours
    if (document.getElementById("firstLecturePeriod").value == 'pm') {
        startTime.add({
            hours: 12,
        })
    }

    // end time
    eHours = document.getElementById("lastLectureHours").value
    eMins = document.getElementById("lastLectureMins").value
    endTime = moment(eHours + ":" + eMins, "hh:mm");

    // convert to 24h format => if pm add 12 hours
    if (document.getElementById("lastLecturePeriod").value == 'pm') {
        endTime.add({
            hours: 12,
        })
    }

    // Validation case => if start time is equal to end time

    if (endTime.isBefore(startTime)) {
        document.getElementById("Schedule").style.opacity = "40%"
        document.getElementById("errorMsg").style.display = "block"
        document.getElementById("errorTD").innerHTML = '<p> <b>Error:</b> <br>Lecture start time cannot be after end time!</p>'
        return false;
    }

    // Validation case => if start time is equal to end time

    if (endTime.isSame(startTime)) {
        document.getElementById("Schedule").style.opacity = "40%"
        document.getElementById("errorMsg").style.display = "block"
        document.getElementById("errorTD").innerHTML = '<p> <b>Error:</b> <br>Lecture start time cannot be the same as end time!</p>'
        return false;
    }

    // otherwise, it's correct! => return true

    document.getElementById("Schedule").style.opacity = "100%"
    document.getElementById("errorMsg").style.display = "none"

    return true




}



function formTimeArray() {

    //start time
    sHours = document.getElementById("firstLectureHours").value
    sMins = document.getElementById("firstLectureMins").value
    startTime = moment(sHours + ":" + sMins, "hh:mm");
    // 24h format
    if (document.getElementById("firstLecturePeriod").value == 'pm') {
        startTime.add({
            hours: 12,
        })
    }

    //end time
    eHours = document.getElementById("lastLectureHours").value
    eMins = document.getElementById("lastLectureMins").value
    endTime = moment(eHours + ":" + eMins, "hh:mm");
    // 24h format
    if (document.getElementById("lastLecturePeriod").value == 'pm') {
        endTime.add({
            hours: 12,
        })
    }

    //lecture duration
    durationHours = document.getElementById("lectureDurationHours").value
    durationMins = document.getElementById("lectureDurationMinutes").value
    lectureDuration = moment.duration({
        minutes: durationMins,
        hours: durationHours,
    });

    lectures = [];
    index = 0;
    current = startTime;

    while (!current.isAfter(endTime) && !current.isSame(endTime)) {
        lectures[index] = current.format("h:mm");
        current.add({
            minutes: durationMins,
            hours: durationHours,
        })

        index++;
    }

    console.log("Lectures table: " + lectures)
    return lectures;

}


function downloadData() {
    if (localStorage["lectures_data"]) {
        var blob = new Blob([localStorage["lectures_data"]], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url
        });
    } else {
        alert("no Data found.")
    }


}

function resetPreferences() {
    if (confirm("Are you sure that you want to reset all preferences?")) {
        localStorage.removeItem('preferences');
        location.reload();


    }
}

function resetData() {
    if (confirm("Are you sure that you want to reset all data?")) {
        localStorage.removeItem('lectures_data');
    }
}


document.getElementById("loadInput").addEventListener('change', function (evt) {
    var f = evt.target.files[0];
    if (f) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            localStorage["lectures_data"] = contents
            alert("Data imported.")
            /* Handle your document contents here */
            document.location.href = url_array; // My extension's logic
        }
        reader.readAsText(f);
    }
});

// var blob = new Blob(["array of", " parts of ", "text file"], {type: "text/plain"});
// var url = URL.createObjectURL(blob);
// chrome.downloads.download({
//   url: url // The object URL can be used as download URL
//   //...
// });



// document.getElementById("status").style.display = "none";
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);

// First day of the week change
document.getElementById("firstDay").addEventListener('change', changeDaysSequence);

// Number of days per week
document.getElementById("nDays").addEventListener('change', changeNumberOfDays);

// First lecture time
document.getElementById("firstLectureHours").addEventListener('change', createLecturesTable);
document.getElementById("firstLectureMins").addEventListener('change', createLecturesTable);
document.getElementById("firstLecturePeriod").addEventListener('change', createLecturesTable);

document.getElementById("lastLectureHours").addEventListener('change', createLecturesTable);
document.getElementById("lastLectureMins").addEventListener('change', createLecturesTable);
document.getElementById("lastLecturePeriod").addEventListener('change', createLecturesTable);

document.getElementById("lectureDurationHours").addEventListener('change', createLecturesTable);
document.getElementById("lectureDurationMinutes").addEventListener('change', createLecturesTable);

document.getElementById("DownloadDataButton").addEventListener('click', downloadData);
document.getElementById("resetDataButton").addEventListener('click', resetData);
document.getElementById("resetPrefButton").addEventListener('click', resetPreferences);

// Lecture duration
// document.getElementById("Schedule")

// visible info
// document.getElementById("Schedule")