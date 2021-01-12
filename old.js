
function save_options() {

    firstDay = document.getElementById("firstDay").value;
    nDays = document.getElementById("nDays").value;

    firstLectureHours = document.getElementById("firstLectureHours").value,
        firstLectureMins = document.getElementById("firstLectureMins").value,
        firstLecturePeriod = document.getElementById("firstLecturePeriod").value,

        lectureDurationHours = document.getElementById("lectureDurationHours").value,
        lectureDurationMinutes = document.getElementById("lectureDurationMinutes").value,

        showEmoji = document.getElementById("showEmoji").checked,
        showRoom = document.getElementById("showRoom").checked,
        showLecturer = document.getElementById("showLecturer").checked,


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
            }
        };

    // Save options to localStorage.
    localStorage["preferences"] = JSON.stringify(preferences)
    console.log(JSON.stringify(preferences))

    // show save status to user
    // x = document.getElementById("status");
    // x.innerHTML = ''
    // setTimeout(function () {
    //     x.innerHTML = "";
    // }, 1500);

    $("#status").fadeIn();
    setTimeout(function () {
        $("#status").fadeOut();
    }, 1500);

}

// Restore saved data from localStorage.
function restore_options() {
    var preferencesExist = localStorage["preferences"];
    if (!preferencesExist) {
        alert("Nothing in storage")
        return;
    } else {
        alert("Data found in storage")
        savedPreferences = JSON.parse(localStorage["preferences"]);
        document.getElementById("firstDay").value = savedPreferences.firstDay
        document.getElementById("nDays").value = savedPreferences.nDays
        document.getElementById("firstLectureHours").value = savedPreferences.firstLecture.firstLectureHours
        document.getElementById("firstLectureMins").value = savedPreferences.firstLecture.firstLectureMins
        document.getElementById("firstLecturePeriod").value = savedPreferences.firstLecture.firstLecturePeriod
        document.getElementById("lectureDurationHours").value = savedPreferences.lectureDuration.lectureDurationHours
        document.getElementById("lectureDurationMinutes").value = savedPreferences.lectureDuration.lectureDurationMinutes
        document.getElementById("showEmoji").checked = savedPreferences.visibleInfo.showEmoji
        document.getElementById("showRoom").checked = savedPreferences.visibleInfo.showRoom
        document.getElementById("showLecturer").checked = savedPreferences.visibleInfo.showLecturer

    }

}
// document.getElementById("status").style.display = "none";
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);