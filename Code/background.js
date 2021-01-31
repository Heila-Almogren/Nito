detected_schedule = {}

lectures = $(".eventBodyCalendar")
for (i = 2; i < lectures.length; i++) {
    lecture = $(lectures[i])
    z = $(lecture.find('[id^="Href"]').parent())
    if (z != "" && z.length != 0) {
        time_full = z.attr("id")
        hour = time_full.substring(3, time_full.indexOf("_", 3))
        day = time_full.substring(time_full.indexOf("_", 4) + 1, time_full.indexOf("_", 4) + 2)
        title = $(lecture.find('[id^="Href"]')).text()
        if (parseInt(hour) > 12) {
            hour = parseInt(hour) - 12
        }
        hour += ":00"
        if (detected_schedule[hour]) {
            if (!detected_schedule[hour][day]) {
                detected_schedule[hour][day] = {}
            }
            detected_schedule[hour][day]['title'] = title
            detected_schedule[hour][day]['color'] = "rgb(52, 152, 219)"
        } else {
            detected_schedule[hour] = {}
            detected_schedule[hour][day] = {}
            detected_schedule[hour][day]['title'] = title
            detected_schedule[hour][day]['color'] = "rgb(52, 152, 219)"

        }
    }
}
// z = JSON.stringify(detected_schedule)
// alert("zeeee" + z)

chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
    console.log('onMessage', msg);


    if (msg.greeting == "hello") {
        sendResponse({ 'detected_schedule': detected_schedule });

    } else {
        sendResponse({ farewell: "goodbye", DOM: "dn" });

    }
});

