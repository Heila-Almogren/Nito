

$('document').ready(function () {



    // $("#emojiArea").on("input", function () {
    //     $("#emojiArea").val("")

    // });


    console.log("initiated")
    // first of all, create the table
    var preferencesExist = localStorage["preferences"];

    // case 1 : no existing table -> make the default one
    if (!preferencesExist) {
        $("#ScheduleDiv").load('default_table.html', initUI)
    } else {
        // case 2 : there is an existing atble, load it
        initExisting()
        updateScheduleData()
    }

    function initExisting() {

        savedPreferences = JSON.parse(localStorage["preferences"]);

        firstDay = savedPreferences.firstDay
        nDays = parseInt(savedPreferences.nDays)
        firstLectureHours = savedPreferences.firstLecture.firstLectureHours
        firstLectureMins = savedPreferences.firstLecture.firstLectureMins
        firstLecturePeriod = savedPreferences.firstLecture.firstLecturePeriod
        lastLectureHours = savedPreferences.lastLecture.firstLectureHours
        lastLectureMins = savedPreferences.lastLecture.firstLectureMins
        lastLecturePeriod = savedPreferences.lastLecture.firstLecturePeriod
        lectureDurationHours = savedPreferences.lectureDuration.lectureDurationHours
        lectureDurationMinutes = savedPreferences.lectureDuration.lectureDurationMinutes
        showEmoji = savedPreferences.visibleInfo.showEmoji
        showRoom = savedPreferences.visibleInfo.showRoom
        showLecturer = savedPreferences.visibleInfo.showLecturer
        timeTable = savedPreferences.timeTable


        // classes
        classes = {
            '8:00': 'hey'
        }

        // empty table
        embeded = ''


        embeded += '<table id="Schedule">'

        // add first row (days)
        embeded += '<tr>'
        embeded += '<td class="time"></td>'

        Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        orderedDays = []
        firstDayIndex = Days.indexOf(firstDay)
        init = firstDayIndex

        for (i = 0; i < nDays; i++) {
            index = init % 7
            embeded += '<td class="day">' + Days[index] + '</td>'

            //will use it later to insert data
            orderedDays[i] = Days[index]
            init++;
        }

        embeded += '</tr>'

        // time rows
        embeded += '<tr>'

        for (i = 0; i < timeTable.length; i++) {
            z = timeTable[i].toString()
            embeded += '<td class="time"><span>' + timeTable[i] + '</span></td>'
            for (j = 0; j < nDays; j++) {
                embeded += '<td class="lecture droppable">' + orderedDays[j] + '</td>'
            }
            embeded += '</tr>'
        }
        embeded += '</table>'
        $("#ScheduleDiv").append(embeded)

        initUI()


    }


    function updateScheduleData() {
        // schedule = $("#Schedule")
        $("#Schedule").rows[1].cells[1].html("hi")
    }

    // UI actions

    function initUI() {

        $(".draggable").draggable({
            revert: 'invalid'
        });

        $(".droppable").droppable({
            accept: function (item) {
                return $(this).data("color") == item.data("color");
            },
            drop: function (event, ui) {
                var $this = $(this);
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $this,
                    using: function (pos) {
                        $(this).animate(pos, 200, "linear");
                    }
                });
            },
            accept: function () {
                return ($(this).find('.lecDiv').length == 0)
            }
        });






        $('.settings').click(function () {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('options.html'));
            }

        })


        $('.lecture').hover(function () {
            if (!$(this).children().length > 0) {
                $(this).html('<div class="addButton"><div class="plus">+</div></div>')
                    .promise()
                    .done(function () {
                        $('.addButton').click(function () {

                            $('#add_pop').hide()
                            $('#add_pop').show()
                            start = $(this).parent().parent().find('span').html()
                            savedPreferences = JSON.parse(localStorage["preferences"]);
                            end = (start == savedPreferences.timeTable[timeTable.length - 1]) ?
                                savedPreferences.lastLecture.lastLectureHours + ":" + savedPreferences.lastLecture.lastLectureMins :
                                $(this).parent().parent().next().find('span').html()
                            // //JSON.parse(localStorage["preferences"]).timeTable[timeTable.indexOf(start)]
                            time = start + " - " + end
                            popup = '<div id="add_pop" style="display: block;"><table style="width:100%; height:100%; font-family: Avenir; font-size: 12px;"><tr><td colspan="2" style="border-bottom-color: #CECECE;border-bottom-style: solid;border-bottom-width: 1px; ;">' + time + '</td></tr><tr><td rowspan="2" id="trig"><input type="text" id="emojiArea" maxlength="1" disabled></input></td><td><input type="text" class="lectureInput" maxlength="12" placeholder="Class name"></td></tr><tr><td><input type="text" class="lectureInput" maxlength="12" placeholder="Room"></td></tr><tr><td colspan="2"><button class="addLectureButton">Add lecture</button></td></tr></table></div>'
                            $('#add_pop').html(popup).promise()
                                .done(function () {
                                    $("#emojiArea").emojiPicker({
                                        height: '300px',
                                        width: '100px',
                                        'button': false,
                                        onShow: function (picker, settings, isActive) {

                                        }
                                    });

                                    $('#trig').click(function () {
                                        $("#emojiArea").emojiPicker('toggle');
                                    })

                                    $(".addLectureButton").click(function () {


                                        //here store json
                                    })


                                })
                        })
                    })
            }

        },
            function () {
                if (!$(this).find('.lecDiv').length > 0) {
                    $(this).html('')
                }
            }
        );


    }

})

// $(document).mouseup(function (e) {
//     var container = $('#add_pop');

//     // if the target of the click isn't the container nor a descendant of the container
//     if (!container.is(e.target) && container.has(e.target).length === 0) {
//         container.hide();
//     }
// });

// function initDraggable() {
//     console.log("initiated")

// }