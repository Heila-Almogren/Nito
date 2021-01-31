$('document').ready(function () {

    // process: Init Preferences > load data > inititate dynamic components
    initPreferences()


    function findExistingPreferences() {
        return localStorage["preferences"] ? true : false
    }


    function findExistingData() {
        return localStorage["lectures_data"] ? true : false
    }

    // --- Getters ---

    function getDefaultPreferences() {
        /*
        returns default preferences
        */

        return {
            firstDay: 'Sun',
            nDays: 5,
            'firstLecture': {
                firstLectureHours: '8',
                firstLectureMins: '00',
                firstLecturePeriod: 'am'
            },
            'lastLecture': {
                lastLectureHours: '4',
                lastLectureMins: '0',
                lastLecturePeriod: 'pm'
            },
            'lectureDuration': {
                lectureDurationHours: 60,
                lectureDurationMinutes: 0
            },
            'visibleInfo': {
                showEmoji: true,
                showRoom: true
            },
            timeTable: ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00']
        }
    }


    function getExistingPreferences() {
        /*
        returns existing preferences
        */
        savedPreferences = JSON.parse(localStorage["preferences"]);
        return {
            'firstDay': savedPreferences.firstDay,
            'nDays': parseInt(savedPreferences.nDays),
            'firstLecture': {
                'firstLectureHours': savedPreferences.firstLecture.firstLectureHours,
                'firstLectureMins': savedPreferences.firstLecture.firstLectureMins,
                'firstLecturePeriod': savedPreferences.firstLecture.firstLecturePeriod,
            },
            'lastLecture': {
                'lastLectureHours': savedPreferences.lastLecture.firstLectureHours,
                'lastLectureMins': savedPreferences.lastLecture.firstLectureMins,
                'lastLecturePeriod': savedPreferences.lastLecture.firstLecturePeriod,
            },
            'lectureDuration': {
                'lectureDurationHours': savedPreferences.lectureDuration.lectureDurationHours,
                'lectureDurationMinutes': savedPreferences.lectureDuration.lectureDurationMinutes,
            },
            'visibleInfo': {
                'showEmoji': savedPreferences.visibleInfo.showEmoji,
                'showRoom': savedPreferences.visibleInfo.showRoom,
            },
            'timeTable': savedPreferences.timeTable
        }
    }


    function getLighterColor(colorCode, amount) {

        /*
        returns lighter color (Used to get lighter color for lecture div comparing with color of room div color)
        code from stackoverflow answer (by Artur Brzozowski): https://stackoverflow.com/a/65608693/11443264
        */

        let usePound = false;

        if (colorCode[0] == "#") {
            colorCode = colorCode.slice(1);
            usePound = true;
        }
        const num = parseInt(colorCode, 16);
        let r = (num >> 16) + amount;

        if (r > 255) {
            r = 255;
        } else if (r < 0) {
            r = 0;
        }

        let b = ((num >> 8) & 0x00FF) + amount;

        if (b > 255) {
            b = 255;
        } else if (b < 0) {
            b = 0;
        }

        let g = (num & 0x0000FF) + amount;

        if (g > 255) {
            g = 255;
        } else if (g < 0) {
            g = 0;
        }
        let color = (g | (b << 8) | (r << 16)).toString(16);
        while (color.length < 6) {
            color = 0 + color;
        }
        return (usePound ? '#' : '') + color;
    }



    function initPreferences() {

        /*
        renders the table structure based on preferences
        */

        // case 1 : no existing table -> load the default one
        if (!findExistingPreferences()) {
            data = getDefaultPreferences()
        } else {
            // case 2 : there is an existing atble, load it
            data = getExistingPreferences()
        }


        // get default preferences

        timeTable = data.timeTable

        // create empty table to be embeded
        embeded = ''

        embeded += '<table id="Schedule">'

        // add first row (days)
        embeded += '<tr>'
        embeded += '<td class="time"></td>'

        Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        orderedDays = []
        firstDayIndex = Days.indexOf(data.firstDay)
        init = firstDayIndex

        for (i = 0; i < data.nDays; i++) {
            index = init % 7
            embeded += '<td class="day"><p>' + Days[index] + '</p></td>'

            //will use it later to insert data
            orderedDays[i] = Days[index]
            init++;
        }

        // highlighting today
        todaysIndex = new Date().getDay()
        today = Days[todaysIndex]
        RelIndex = orderedDays.indexOf(today)

        embeded += '</tr>'

        // time rows
        embeded += '<tr>'

        for (i = 0; i < timeTable.length; i++) {
            z = timeTable[i].toString()
            embeded += '<td class="time"><span>' + timeTable[i] + '</span></td>'
            for (j = 0; j < data.nDays; j++) {
                isToday = (j == RelIndex)
                todayClass = isToday ? "today" : ""
                embeded += '<td class="lecture droppable ' + todayClass + '"></td>'
            }
            embeded += '</tr>'
        }
        embeded += '</table>'

        // embed table
        $("#ScheduleDiv").append(embeded)

        //highlighting today
        tr = $($("#ScheduleDiv").find('tr')[0])
        td = $(tr.find('td')[RelIndex + 1])
        p = $(td.find('p')[0])
        p.addClass('today_label')

        loadScheduleData()
    }


    function loadScheduleData() {
        /*
        loads saved lecture data into the constructed schedule
        */

        // Only if there is saved data:
        if (findExistingData()) {

            // Get the data from local storage
            data = JSON.parse(localStorage["lectures_data"])

            // Get preferences
            preferences = findExistingPreferences() ? getExistingPreferences() : getDefaultPreferences()

            // Get the table
            table = document.getElementById("Schedule")

            // Get number of rows and days from local storage, if not availabe get default
            nRows = preferences.timeTable.length
            nDays = preferences.nDays

            // iterate over table rows (start from 1 to ignore first row because it's for days, not for lectures data)
            for (i = 1; i <= nRows; i++) {

                // Get the time interval of this row (e.g. 8:00)
                current_time = table.rows[i].cells[0].querySelector('span').innerHTML

                // Are there saved data for this time interval?
                if (data[current_time]) {

                    // If yes, iterate over the days (columns) along this row (e.g. 8:00 for sun, mon, tue.. etc)
                    // Start from 1 because first column is for time intervals not for lectures data
                    for (j = 1; j <= nDays; j++) {

                        // Are there saved data for the current time x day intersection?
                        if (data[current_time][j]) {

                            // If yes, create a lecture div
                            lecDiv = document.createElement('div');
                            lecDiv.classList.add("lecDiv", "draggable");

                            // Set the color
                            original_color = data[current_time][j]['color']
                            original_to_Hex = '#' + original_color.substr(4, original_color.indexOf(')') - 4).split(',').map((color) => String("0" + parseInt(color).toString(16)).slice(-2)).join('');
                            roomDivColor = getLighterColor(original_to_Hex, 20)
                            lecDiv.style.backgroundColor = roomDivColor

                            // Should emoji and room be visible? depend on 1. their existence in the data AND 2. selected user preferences
                            isEmoji = data[current_time][j]['emoji'] && data[current_time][j]['emoji'] != "" && Boolean(preferences.visibleInfo.showEmoji);
                            isRoom = data[current_time][j]['room'] && data[current_time][j]['room'] != "" && Boolean(preferences.visibleInfo.showRoom);

                            // The span of each component in the grid depends on the existence of other components

                            /*
                            title:
                            | Emoji + [room = no span]
                            | Emoji + no room = span
                            | no emoji + [room = no span]
                            | no emoji + no room = span
                            */

                            titleSpan = isRoom ? 'lecNameNoSpan' : 'lecNameSpan'
                            titleDiv = '<div class="lecInfo lecName ' + titleSpan + '">' + data[current_time][j]['title'] + '</div>'
                            emojiDiv = isEmoji ? '<div class="lecInfo emojiIcon">' + data[current_time][j]['emoji'] + '</div>' : ""
                            roomDiv = isRoom ? '<div class="lecInfo lecRoom"><p class="lecRoomp" style="background-color: ' + data[current_time][j]['color'] + '">' + data[current_time][j]['room'] + '</p></div>' : "";
                            actionsDiv = '<table class="lecInfo lectAct"><tr><td><i class="fas fa-times deleteIcon"></i> </td></tr><tr><td> <i class="fas fa-pen editIcon"></i></table>'

                            // lecture div consists of: title + emoji + room + actions (edit and delete)
                            lecDiv.innerHTML = titleDiv + emojiDiv + roomDiv + actionsDiv

                            // insert lecture div in the table cell
                            cell = table.rows[i].cells[j]
                            cell.appendChild(lecDiv);

                            trigger_drop($(lecDiv), $(cell));

                        }
                    }
                }
            }
        }
        initSyncUIElements()
    }

    function trigger_drop(draggable, droppable) {

        var droppableOffset = droppable.offset(),
            draggableOffset = draggable.offset(),
            dx = droppableOffset.left - draggableOffset.left,
            dy = droppableOffset.top - draggableOffset.top;

        draggable.simulate("drag", {
            dx: dx,
            dy: dy
        });

        return;
    }


    function initSyncUIElements() {

        /*
        Binds dynamic DOM elements with event listners
        */
        initDraggable()
        $('#scan_button').click(scan)
        $('#pref_button').click(optionsPage)
        $('.deleteIcon').click(deleteLecture)
        $('.editIcon').click(showEditLectureDialogue)
        $('.lecture').hover(function () {
            if (!$(this).children().length > 0) {
                $(this).html('<div class="addButton"><div class="plus">+</div></div>')
                    .promise()
                    .done(function () {
                        $('.addButton').click(showAddLectureDialogue)
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

    function scan() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            tab = tabs[0];
            console.log(tab.url, tab.title);
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendMessage(tab.id, { greeting: "hello" }, function (msg) {
                    result = JSON.stringify(msg.detected_schedule)
                    if (result == undefined) {
                        alert("Could not detect schedule. make sure that you're on your KSU schedule page, and refresh the page.");
                    } else {
                        if (confirm("Schedule detected! Are you sure you want to import it?")) {
                            localStorage["lectures_data"] = JSON.stringify(msg.detected_schedule)
                            loadScheduleData()
                        }
                    }
                });
            });
        });

    }

    function optionsPage() {

        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    }


    function addLecture(day, start) {

        var lectures = localStorage["lectures_data"] ? JSON.parse(localStorage["lectures_data"]) : {}

        if (lectures[start]) {
            if (!lectures[start][day]) {
                lectures[start][day] = {}
            }
            lectures[start][day]['title'] = $('#titleArea').val()
            lectures[start][day]['emoji'] = $('#emojiArea').val()
            lectures[start][day]['room'] = $('#roomArea').val()
            lectures[start][day]['color'] = $(".colorPickSelector").css("background-color");
        } else {
            lectures[start] = {}
            lectures[start][day] = {}
            lectures[start][day]['title'] = $('#titleArea').val()
            lectures[start][day]['emoji'] = $('#emojiArea').val()
            lectures[start][day]['room'] = $('#roomArea').val()
            lectures[start][day]['color'] = $(".colorPickSelector").css("background-color");

        }
        localStorage["lectures_data"] = JSON.stringify(lectures)
        $('#add_pop, #edit_pop').hide()

        loadScheduleData()
    }

    function deleteLecture() {
        time = $(this).parent().parent().parent().parent().parent().parent().parent().find('span').html()
        day = $(this).parent().parent().parent().parent().parent().parent().index()

        if (localStorage["lectures_data"]) {

            data = JSON.parse(localStorage["lectures_data"])
            delete data[time][day]
            newData = JSON.stringify(data)
            localStorage["lectures_data"] = newData
            $(this).parent().parent().parent().parent().parent().parent().html('')

        }
    }

    function showEditLectureDialogue() {
        $('#edit_pop').hide()
        $('#edit_pop').show()


        time = $(this).parents().eq(6).find('span').html()
        day = $(this).parents().eq(5).index()


        if (localStorage["lectures_data"]) {

            data = JSON.parse(localStorage["lectures_data"])
            title = data[time][day]['title']
            emoji = data[time][day]['emoji'] || ""
            room = data[time][day]['room'] || ""
            color = data[time][day]['color']
            popup = '<div id="edit_pop" style="display: block;"><table style="width:100%; height:100%; font-family: Avenir; font-size: 12px;"><tr><td colspan="2" style="border-bottom-color: #CECECE;border-bottom-style: solid;border-bottom-width: 1px; ;">' + time + '</td></tr><tr><td rowspan="2" id="trig"><input type="text" id="emojiArea" maxlength="1" value="' + emoji + '" readonly></input></td><td class="inputTD"><input type="text" maxlength="7" id="titleArea" class="lectureInput" placeholder="Class name" value=' + title + '></td></tr><tr><td class="inputTD" style="position:relative;"><input type="text" id="roomArea" maxlength="7" class="lectureInput" maxlength="12" placeholder="Room" value=' + room + '><div class="colorPickSelector" style="width: 20px; height: 20px; display:inline-block; position: absolute; clear: right; right:10"></div></td></tr><tr><td colspan="2"><button class="editLectureButton">Edit lecture</button></td></tr></table></div>'
            $('#edit_pop').html(popup).promise()
                .done(function () {

                    initPickers()

                    $(".colorPickSelector").css({ 'backgroundColor': color });

                    $(".editLectureButton").click(function () {
                        if ($('#titleArea').val()) {
                            delete data[time][day]
                            addLecture(day, time)
                        } else {
                            $('#titleArea').css('background-color', 'rgb(236, 163, 163)')
                        }
                    })
                })




        }
    }

    function showAddLectureDialogue() {
        $('#add_pop').hide()
        $('#add_pop').show()
        start = $(this).parent().parent().find('span').html()


        savedPreferences = localStorage["preferences"] ? JSON.parse(localStorage["preferences"]) : getDefaultPreferences()
        end = (start == savedPreferences.timeTable[timeTable.length - 1]) ?
            savedPreferences.lastLecture.lastLectureHours + ":" + savedPreferences.lastLecture.lastLectureMins :
            $(this).parent().parent().next().find('span').html()

        time = start + " - " + end
        day = $(this).parent().index();
        popup = '<div id="add_pop" style="display: block;"><table style="width:100%; height:100%; font-family: Avenir; font-size: 12px;"><tr><td colspan="2" style="border-bottom-color: #CECECE;border-bottom-style: solid;border-bottom-width: 1px; ;">' + time + '</td></tr><tr><td rowspan="2" id="trig"><input type="text" id="emojiArea" maxlength="1" readonly></input></td><td class="inputTD"><input type="text" maxlength="7" id="titleArea" class="lectureInput" placeholder="Class name"></td></tr><tr><td class="inputTD" style="position:relative;"><input type="text" id="roomArea" maxlength="7" class="lectureInput" maxlength="12" placeholder="Room"><div class="colorPickSelector" style="width: 20px; height: 20px; display:inline-block; position: absolute; clear: right; right:10"></div></td></tr><tr><td colspan="2"><button class="addLectureButton">Add lecture</button></td></tr></table></div>'
        $('#add_pop').html(popup).promise()
            .done(function () {

                initPickers()

                $(".addLectureButton").click(function () {
                    if ($('#titleArea').val()) {
                        addLecture(day, start)
                    } else {
                        $('#titleArea').css('background-color', 'rgb(236, 163, 163)')
                    }

                })
            })
    }



    function initPickers() {

        /*
        initiates pickers
        */

        $("#emojiArea").emojiPicker({
            width: '200px',
            height: '100px',
            'button': false,
        });

        $(".colorPickSelector").colorPick({
            'initialColor': '#3498db',
            'allowRecent': true,
            'recentMax': 5,
            'allowCustomColor': false,
            'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#FFB6C1", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
            'onColorSelected': function () {
                this.element.css({ 'backgroundColor': this.color, 'color': this.color });
            }
        });

        $('#trig').click(function () {
            $("#emojiArea").emojiPicker('toggle');
        })


        $("#emojiArea").on('input', function () {
            var splitter = new GraphemeSplitter();
            current_value = $("#emojiArea").val()
            value_list = splitter.splitGraphemes(current_value)
            len = value_list.length
            $("#emojiArea").val(value_list[len - 1])
        });
    }

    function initDraggable() {

        $(".draggable").draggable({
            revert: 'invalid'
        });
        $(".droppable").droppable({

            accept: function (draggable) {

                return !$(this).hasClass('has_lecture') || $(this).data('dropped') && $(this).data('dropped').is(draggable)
            },
            drag: function () {

                loadScheduleData()

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
                $this.addClass('has_lecture');
                $this.data('dropped', ui.draggable)
                source_time = ui.draggable.parent().parent().find('span').html()
                source_day = ui.draggable.parent().index()
                dest_time = $(event.target).parent().find('span').html()
                dest_day = $(event.target).index()

                if (localStorage["lectures_data"]) {
                    data = JSON.parse(localStorage["lectures_data"])
                    old_title = data[source_time][source_day]['title']
                    old_emoji = data[source_time][source_day]['emoji']
                    old_room = data[source_time][source_day]['room']
                    old_color = data[source_time][source_day]['color']
                    delete data[source_time][source_day]

                    if (!data[dest_time]) {
                        data[dest_time] = {}
                    }
                    data[dest_time][dest_day] = {
                        'title': old_title,
                        'emoji': old_emoji,
                        'room': old_room,
                        'color': old_color
                    }
                    newData = JSON.stringify(data)
                    localStorage["lectures_data"] = newData

                }
            },
            out: function () {
                $(this).removeClass('has_lecture');
                $(this).data('dropped', null);
            }
        });
        return;


    }


    $(document).mouseup(function (e) {
        var container = $('#add_pop, #edit_pop')
        var emBox = $('.emojiPicker');

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && !emBox.is(e.target) && container.has(e.target).length === 0 && emBox.has(e.target).length === 0) {
            container.hide();
        }
    });
})