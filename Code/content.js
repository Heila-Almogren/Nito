$('document').ready(function () {



    // first of all, create the table

    // check if saved preferences exist
    var preferencesExist = localStorage["preferences"];

    // case 1 : no existing table -> load the default one
    if (!preferencesExist) {
        initDefaultPreferences()
    } else {
        // case 2 : there is an existing atble, load it
        initExistingPreferences()
    }


    function findExistingData() {
        return localStorage["lectures_data"] ? true : false
    }

    function getDefaultData() {
        /*
        returns default data
        */
        return {
            firstDay: 'Sun',
            nDays: 5,
            firstLectureHours: '8',
            firstLectureMins: '00',
            firstLecturePeriod: 'am',
            lastLectureHours: '4',
            lastLectureMins: '0',
            lastLecturePeriod: 'pm',
            lectureDurationHours: 60,
            lectureDurationMinutes: 0,
            showEmoji: true,
            showRoom: true,
            timeTable: ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00']
        }
    }

    function getExistingData() {
        /*
        returns existing data
        */
        savedPreferences = JSON.parse(localStorage["preferences"]);
        return {
            'firstDay': savedPreferences.firstDay,
            'nDays': parseInt(savedPreferences.nDays),
            'firstLectureHours': savedPreferences.firstLecture.firstLectureHours,
            'firstLectureMins': savedPreferences.firstLecture.firstLectureMins,
            'firstLecturePeriod': savedPreferences.firstLecture.firstLecturePeriod,
            'lastLectureHours': savedPreferences.lastLecture.firstLectureHours,
            'lastLectureMins': savedPreferences.lastLecture.firstLectureMins,
            'lastLecturePeriod': savedPreferences.lastLecture.firstLecturePeriod,
            'lectureDurationHours': savedPreferences.lectureDuration.lectureDurationHours,
            'lectureDurationMinutes': savedPreferences.lectureDuration.lectureDurationMinutes,
            'showEmoji': savedPreferences.visibleInfo.showEmoji,
            'showRoom': savedPreferences.visibleInfo.showRoom,
            'timeTable': savedPreferences.timeTable
        }
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

    function loadScheduleData() {
        initDraggable()
        if (localStorage["lectures_data"]) {
            data = JSON.parse(localStorage["lectures_data"])

            table = document.getElementById("Schedule")
            nRows = localStorage["preferences"] ? JSON.parse(localStorage["preferences"]).timeTable.length : getDefaultData().timeTable.length
            nDays = localStorage["preferences"] ? JSON.parse(localStorage["preferences"]).nDays : getDefaultData().nDays
            for (i = 1; i <= nRows; i++) {
                current_time = table.rows[i].cells[0].querySelector('span').innerHTML
                if (data[current_time]) {
                    for (j = 1; j <= nDays; j++) {
                        if (data[current_time][j]) {

                            var lecDiv = document.createElement('div');
                            lecDiv.classList.add("lecDiv");
                            lecDiv.classList.add("draggable");
                            lecDiv.style.backgroundColor = data[current_time][j]['color']
                            isEmoji = localStorage["preferences"] ? Boolean(JSON.parse(localStorage["preferences"]).visibleInfo.showEmoji) : getDefaultData().showEmoji;
                            isRoom = localStorage["preferences"] ? Boolean(JSON.parse(localStorage["preferences"]).visibleInfo.showRoom) : getDefaultData().showRoom;

                            titleSpan = isEmoji && data[current_time][j]['emoji'] && !isRoom || !data[current_time][j]['room'] ? 'lecNameSpan' : 'lecNameNoSpan'
                            titleDiv = '<div class="lecInfo lecName ' + titleSpan + '">' + data[current_time][j]['title'] + '</div>'
                            EmojiSpan = isRoom && data[current_time][j]['room'] != "" ? 'emojiSpan' : 'emojiNoSpan'
                            emojiDiv = isEmoji && data[current_time][j]['emoji'] != "" ? '<div class="lecInfo ' + EmojiSpan + ' emoji">' + data[current_time][j]['emoji'] + '</div>' : ""
                            roomDiv = isRoom && data[current_time][j]['room'] != "" ? '<div class="lecInfo lecRoom">' + data[current_time][j]['room'] + '</div>' : "";
                            delDiv = '<div class="lecInfo lecDel"><i class="fas fa-minus-circle deleteIcon"></i></div>'
                            lecDiv.innerHTML = titleDiv + emojiDiv + roomDiv + delDiv
                            cell = table.rows[i].cells[j]
                            jCell = $(cell)
                            //jCell.addClass('has_lecture');
                            cell.appendChild(lecDiv);
                            initDeletion()
                            //

                            jlecDiv = $(lecDiv)

                            // to fix: this line is not working:
                            trigger_drop(jlecDiv, jCell);
                            // jCell.addClass('has_lecture');
                            // dx = cell.offsetLeft - lecDiv.offsetLeft;
                            // dy = cell.offsetLeft - lecDiv.offsetTop;

                            // jlecDiv.simulate("drag", {
                            //     dx: dx,
                            //     dy: dy
                            // })
                            //table.rows[i].cells[j].querySelectorAll('lecDiv')[0].attr('style', 'background-color: yellow')
                            //
                            // .then(function () {
                            //     

                            // })
                            //table.rows[i].cells[j].classList.add("has_lecture");
                        }
                    }
                }
            }
        }


    }

    function initDeletion() {

        $('.deleteIcon').click(function () {

            time = $(this).parent().parent().parent().parent().find('span').html()
            day = $(this).parent().parent().parent().index()
            // alert("time " + time)
            // alert("day " + day)
            if (localStorage["lectures_data"]) {

                data = JSON.parse(localStorage["lectures_data"])
                //alert(localStorage["lectures_data"])
                delete data[time][day]
                // alert('del')
                newData = JSON.stringify(data)
                localStorage["lectures_data"] = newData
                $(this).parent().parent().parent().html('')

            }


        })
    }

    function initDraggable() {
        $(function () {
            $(".draggable").draggable({
                revert: 'invalid'
            });
            $(".droppable").droppable({
                create: function (event, ui) {
                    var $this = $(this);
                    $this.addClass('has_lecture');
                    $this.data('dropped', ui.draggable)
                    // alert("create")
                },
                accept: function (draggable) {
                    return (!$(this).hasClass('has_lecture') || $(this).data('dropped') && $(this).data('dropped').is(draggable))
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
                    // alert("Dropped " + source_day + " " + source_time + " to " + dest_day + " " + dest_time);


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
                        // alert(newData)
                        localStorage["lectures_data"] = newData

                    }
                },
                out: function () {
                    $(this).removeClass('has_lecture');
                    $(this).data('dropped', null);
                }
            });
            return;
        })

    }

    function initDefaultPreferences() {
        /*
        renders the table structure based on default preferences
        */

        // get default preferences
        default_data = getDefaultData()
        timeTable = default_data.timeTable

        // create empty table to be embeded
        embeded = ''

        embeded += '<table id="Schedule">'

        // add first row (days)
        embeded += '<tr>'
        embeded += '<td class="time"></td>'

        Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        orderedDays = []
        firstDayIndex = Days.indexOf(default_data.firstDay)
        init = firstDayIndex

        for (i = 0; i < default_data.nDays; i++) {
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
            for (j = 0; j < default_data.nDays; j++) {
                embeded += '<td class="lecture droppable"></td>'
            }
            embeded += '</tr>'
        }
        embeded += '</table>'

        // embed table
        $("#ScheduleDiv").append(embeded)

        initSyncUIElements()
    }



    function initExistingPreferences() {

        /*
        Loades existing preferences and renders the table structure based on it
        */

        // load saved preferences
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
        timeTable = savedPreferences.timeTable

        // create empty table to be embeded
        embeded = ''

        embeded += '<table id="Schedule">'

        // add first row (days)
        embeded += '<tr>'
        embeded += '<td class="time"></td>'

        Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
                embeded += '<td class="lecture droppable"></td>'
            }
            embeded += '</tr>'
        }
        embeded += '</table>'

        // embed table
        $("#ScheduleDiv").append(embeded)

        initSyncUIElements()
    }


    function initSyncUIElements() {


        $(function () {
            $(".draggable").draggable({
                revert: 'invalid'
            });

            $(".droppable").droppable({
                accept: function (draggable) {
                    // new code: new accept clause, accept is not has_lecture OR if the element already dragged onto it is the one you are attempting to drag out
                    return (!$(this).hasClass('has_lecture') || $(this).data('dropped') && $(this).data('dropped').is(draggable))
                },
                drop: function (event, ui) {
                    var $this = $(this); // << your existing code
                    ui.draggable.position({ // << your existing code
                        my: "center", // << your existing code
                        at: "center", // << your existing code
                        of: $this, // << your existing code
                        using: function (pos) { // << your existing code
                            $(this).animate(pos, 200, "linear"); // << your existing code
                        } // << your existing code
                    }); // << your existing code

                    $this.addClass('has_lecture'); // << your existing code
                    // new code: store a reference to the dropped element on the drop zone
                    $this.data('dropped', ui.draggable)

                },
                out: function () {
                    $(this).removeClass('has_lecture'); // << your existing code
                    // new code: once you have moved it out, then delete the reference to it since your drop zone is now empty again
                    $(this).data('dropped', null);
                }
            });
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
                            savedPreferences = localStorage["preferences"] ? JSON.parse(localStorage["preferences"]) : getDefaultData()
                            end = (start == savedPreferences.timeTable[timeTable.length - 1]) ?
                                savedPreferences.lastLecture.lastLectureHours + ":" + savedPreferences.lastLecture.lastLectureMins :
                                $(this).parent().parent().next().find('span').html()
                            // //JSON.parse(localStorage["preferences"]).timeTable[timeTable.indexOf(start)]
                            time = start + " - " + end
                            day = $(this).parent().index();
                            popup = '<div id="add_pop" style="display: block;"><table style="width:100%; height:100%; font-family: Avenir; font-size: 12px;"><tr><td colspan="2" style="border-bottom-color: #CECECE;border-bottom-style: solid;border-bottom-width: 1px; ;">' + time + '</td></tr><tr><td rowspan="2" id="trig"><input type="text" id="emojiArea" maxlength="1" readonly></input></td><td class="inputTD"><input type="text" maxlength="7" id="titleArea" class="lectureInput" placeholder="Class name"></td></tr><tr><td class="inputTD" style="position:relative;"><input type="text" id="roomArea" maxlength="7" class="lectureInput" maxlength="12" placeholder="Room"><div class="colorPickSelector" style="width: 20px; height: 20px; display:inline-block; position: absolute; clear: right; right:10"></div></td></tr><tr><td colspan="2"><button class="addLectureButton">Add lecture</button></td></tr></table></div>'
                            $('#add_pop').html(popup).promise()
                                .done(function () {
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

                                    $(".addLectureButton").click(function () {
                                        if ($('#titleArea').val()) {
                                            addLecture(day, start)
                                        } else {
                                            $('#titleArea').css('background-color', 'rgb(236, 163, 163)')
                                            $('#titleArea').css('border', 'solid rgb(151, 60, 60)')
                                        }

                                    })

                                    $("#emojiArea").on('input', function () {
                                        var splitter = new GraphemeSplitter();
                                        current_value = $("#emojiArea").val()
                                        value_list = splitter.splitGraphemes(current_value)
                                        len = value_list.length
                                        $("#emojiArea").val(value_list[len - 1])
                                    });


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
        loadScheduleData()
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
        // alert(localStorage["lectures_data"])
        $('#add_pop').hide()
        loadScheduleData()
    }


    $(document).mouseup(function (e) {
        var container = $('#add_pop');
        var emBox = $('.emojiPicker');

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && !emBox.is(e.target) && container.has(e.target).length === 0 && emBox.has(e.target).length === 0) {
            container.hide();
        }
    });




})