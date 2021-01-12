
function save_options() {

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
        showLecturer = document.getElementById("showLecturer").checked,
        timeTable = formTimeArray()


    // Collect all options data in one object
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
            "showLecturer": showLecturer,
        },
        "timeTable": timeTable
    };

    // Save options to localStorage.
    localStorage["preferences"] = JSON.stringify(preferences)
    console.log(JSON.stringify(preferences))



    $("#status").fadeIn();
    setTimeout(function () {
        $("#status").fadeOut();
    }, 1500);

}

// Restore saved data from localStorage.
function restore_options() {
    var preferencesExist = localStorage["preferences"];
    if (!preferencesExist) {
        //alert("Nothing in storage")
        return;
    } else {
        //alert("Data found in storage")
        savedPreferences = JSON.parse(localStorage["preferences"]);
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
        document.getElementById("showLecturer").checked = savedPreferences.visibleInfo.showLecturer

    }

}


function renderTable() {

}



function changeFirstDay() {
    firstRow = document.getElementById("Schedule").rows[0];
    newDay = document.getElementById("firstDay").value;

    Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    firstDay = Days.indexOf(newDay)
    init = firstDay

    len = firstRow.cells.length + 1

    for (i = 0; i < len; i++) {

        index = init % 7
        console.log(index)
        firstRow.cells[i + 1].innerHTML = Days[index]
        init++
    }

}

function changeNDays() {
    nRows = document.getElementById("Schedule").rows.length
    console.log("Number of rows is " + nRows)

    len = document.getElementById("Schedule").rows[0].cells.length - 1
    console.log("len is " + len)

    newLen = document.getElementById("nDays").value
    console.log("new len is " + newLen)


    difference = Math.abs(newLen - len)
    console.log("difference" + difference)

    for (i = 0; i < nRows; i++) {
        console.log("Row " + i)
        for (j = 0; j < difference; j++) {
            if (newLen < len) {
                document.getElementById("Schedule").rows[i].deleteCell(-1)
                console.log("Deleted cell")
            } else {
                var newcell = document.getElementById("Schedule").rows[i].insertCell(-1)

                if (i == 0) {
                    console.log("added day cell")
                    newcell.className = "day";
                }
                else {
                    console.log("added lecture cell")
                    newcell.className = "lecture";
                }
                console.log("adding days")

            }
        }
    }
    changeFirstDay()
}

function formulateLectures() {

    console.log("inside formulateLectures")

    //correct format
    if (parseInt(this.value, 10) < 10) this.value = '0' + this.value;

    // Not more than 12
    if (parseInt(document.getElementById("firstLectureHours").value, 10) > 12) this.value = '12';
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
                for (j = 0; j < nDays - 1; j++) {
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



    if (endTime.isBefore(startTime)) {
        console.log("Validation: Wrong order detected")
        document.getElementById("Schedule").style.opacity = "40%"
        document.getElementById("errorMsg").style.display = "block"
        document.getElementById("errorTD").innerHTML = '<p> <b>Error:</b> <br>Lecture start time cannot be after end time!</p>'

    } else {
        console.log("Validation: Correct order")
        document.getElementById("Schedule").style.opacity = "100%"
        document.getElementById("errorMsg").style.display = "none"
        return true
    }



}



function formTimeArray() {
    //start time
    sHours = document.getElementById("firstLectureHours").value
    sMins = document.getElementById("firstLectureMins").value
    startTime = moment(sHours + ":" + sMins, "hh:mm");
    // 24h format
    if (document.getElementById("firstLecturePeriod").value == 'pm') {
        console.log("time in PM (" + document.getElementById("firstLecturePeriod").value + ") -> add 12")
        startTime.add({
            hours: 12,
        })
    }
    console.log("Start Time: " + startTime.format())

    //end time
    eHours = document.getElementById("lastLectureHours").value
    eMins = document.getElementById("lastLectureMins").value
    endTime = moment(eHours + ":" + eMins, "hh:mm");
    // 24h format
    if (document.getElementById("lastLecturePeriod").value == 'pm') {
        console.log("time in PM (" + document.getElementById("lastLecturePeriod").value + ") -> add 12")
        endTime.add({
            hours: 12,
        })
    }
    console.log("End Time: " + endTime.format())

    //lecture duration
    durationHours = document.getElementById("lectureDurationHours").value
    durationMins = document.getElementById("lectureDurationMinutes").value
    lectureDuration = moment.duration({
        minutes: durationMins,
        hours: durationHours,
    });
    console.log("Duration per lecture: " + lectureDuration.humanize())

    lectures = [];
    index = 0;
    current = startTime;

    while (!current.isAfter(endTime) && !current.isSame(endTime)) {
        console.log("--" + index + "--")
        lectures[index] = current.format("h:mm");
        console.log(current.format("h:mm") + " -> " + lectures)
        current.add({
            minutes: durationMins,
            hours: durationHours,
        })

        index++;
    }

    console.log("Lectures table: " + lectures)
    return lectures;

}


// for(var i = 0 ; i < )
// var row = document.getElementById("mr");
// var x = row.insertCell(4);
// x.innerHTML = "New cell";

// document.getElementById("status").style.display = "none";
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

// First day of the week change
document.getElementById("firstDay").addEventListener('change', changeFirstDay);

// Number of days per week
document.getElementById("nDays").addEventListener('change', changeNDays);

// First lecture time
document.getElementById("firstLectureHours").addEventListener('change', formulateLectures);
document.getElementById("firstLectureMins").addEventListener('change', formulateLectures);
document.getElementById("firstLecturePeriod").addEventListener('change', formulateLectures);

document.getElementById("lastLectureHours").addEventListener('change', formulateLectures);
document.getElementById("lastLectureMins").addEventListener('change', formulateLectures);
document.getElementById("lastLecturePeriod").addEventListener('change', formulateLectures);

document.getElementById("lectureDurationHours").addEventListener('change', formulateLectures);
document.getElementById("lectureDurationMinutes").addEventListener('change', formulateLectures);

// Lecture duration
// document.getElementById("Schedule")

// visible info
// document.getElementById("Schedule")