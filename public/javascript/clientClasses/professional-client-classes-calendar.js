function getCalendarData(data){
  var monthNamesShort = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  var monthNames      = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre',
                        'Octubre','Noviembre','Diciembre'];
  var dateNamesShort  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var dateNames       = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  var classesItems    = data;
  var dateNow         = new Date();

  // INITIALIZE DATETIMEPICKER JQUERY
  $.datetimepicker.setLocale('es');

  // DATETIMEPICKER FOR CREATING NEW EVENT OR SESSION
  $('#rangeEventTimeStart input').datetimepicker({ datepicker:false, format:'H:i', step:5 });
  $('#rangeEventTimeEnd input').datetimepicker({ datepicker:false, format:'H:i', step:5 });

  $('#rangeEventDateStart input').datetimepicker(
    { i18n:{ es:{ months: monthNames, dayOfWeek: dateNames }}, 
      timepicker: false, useCurrent: false, 
      format: "Y/m/d" });
  $('#rangeEventDateEnd input').datetimepicker(
    { i18n:{ es:{ months: monthNames, dayOfWeek: dateNames }}, 
      timepicker: false, useCurrent: false, 
      format: "Y/m/d"
    });

  // DATETIMEPICKER FOR EDITING EXISITING EVENT
  $('#rangeEventTimeStartEdit input').datetimepicker({ datepicker:false, format:'H:i', step:5 });
  $('#rangeEventTimeEndEdit input').datetimepicker({ datepicker:false, format:'H:i', step:5 });

  $('#rangeEventDateStartEdit input').datetimepicker(
    { i18n:{ es:{ months: monthNames, dayOfWeek: dateNames }}, 
      timepicker: false, useCurrent: false, 
      format: "Y/m/d" });
  $('#rangeEventDateEndEdit input').datetimepicker(
    { i18n:{ es:{ months: monthNames, dayOfWeek: dateNames }}, 
      timepicker: false, useCurrent: false, 
      format: "Y/m/d" });

  // INITIALIZE FULL CALENDAR
  $('#calendar').fullCalendar({
    // SET DATE TO SPANISH
    monthNames: monthNames,
    monthNamesShort: monthNamesShort,
    dayNames: dateNames,
    dayNamesShort: dateNamesShort,
    // AVAILABLE HEADER TOOLBAR
    header: {
      left: 'title',
      center: 'agendaDay,agendaWeek,listWeek,month',
      right: 'prev,next today'
    },
    // SET HEADER BUTTON NAMES
    views: {
      listWeek: { buttonText: 'semanal lista' },
      agendaDay: { buttonText: 'día'},
      agendaWeek: { buttonText: 'semana'},
      month: { buttonText: 'mes'},
    },
    // SET HEADER BUTTON NAME
    buttonText: { today: 'hoy' },
    // SET INITIAL CALENDAR VIEW
    defaultView: 'month',
    navLinks: true, // can click day/week names to navigate views
    eventLimit: true, // allow "more" link when too many events
    selectable: true,
    forceEventDuration: false,
    // FULL CALENDAR ON SELECT FUNCTION
    select: function(start, end) {
      $('#rangeEventDateStart input').val(moment(start).format('YYYY/MM/DD'));
      $('#rangeEventDateEnd input').val(moment(end).format('YYYY/MM/DD'));
      
      $('#dow').val("");
      $('input[type=checkbox]').prop('checked', false);
      $('input[type=radio]').prop('checked', false);

      if(moment(start).format('YYYY/MM/DD') >= moment(dateNow).format('YYYY/MM/DD')){
        $('#fullCalendarModalInput').modal('show');
      }
    },
    // FOR RENDERING RECURRING EVENTS OR SESSION
    eventRender: function(event) {
      if (event.ranges) {
        return (event.ranges.filter(function(range) { // test event against all the ranges

          return (event.start.isBefore(range.end) &&
            event.end.isAfter(range.start));

        }).length) > 0; //if it isn't in one of the ranges, don't render it (by returning false)
      } else {
        return true;
      }
    },
    events: classesItems,
    // FULL CALENDAR EVENT CLICK FUNCTION
    eventClick:  function(event, jsEvent, view) {
      let startTime = new Date(event.start);
      let endTime   = new Date(event.end);
      let minsdiff  = (endTime.getTime() - startTime.getTime()) / 3600000;
      
      $('#dowEdit').val("");
      $('input[type=checkbox]').prop('checked', false);
      $('input[type=radio]').prop('checked', false);

      // FOR CREATE SESSION MODAL
      $('#classTitle').html(event.title);
      $('#classDescription').html(event.description);
      $('#classID').html(event._id);
      $('#classDate').html(moment(event.start).format('MMMM Do'));
      $('#classDateStart').html(moment(event.start).format('HH:mm'));
      $('#classDateEnd').html(moment(event.end).format('HH:mm'));
      $('#classPrice').html(event.price); //.toFixed(2));
      $('#classWorkOutType').html(event.workoutType);
      $('#classMaxClientPerBooking').html(event.maxClientPerBooking);
      $('#classDuration').html(minsdiff + " Horas");
      $('#bookedClientTotal').html("<strong>Clients </strong> [" + event.bookedClients.length + "/" + event.maxClientPerBooking + "]");

      // FOR BOOKING A CLIENT
      $('#classTitleBooking').html(event.title);
      $('#classDescriptionBooking').html(event.description);
      $('#classIDBooking').html(event._id);
      $('#classDateBooking').html(moment(event.start).format('MMMM Do'));
      $('#classScheduleBooking').html(moment(event.start).format('dddd') + ': ' 
        + moment(event.start).format('HH:mm') + ' a '
        + moment(event.end).format('HH:mm'));
      $('#classPriceBooking').html(event.price); //.toFixed(2));
      $('#classWorkOutTypeBooking').html(event.workoutType);
      $('#classMaxClientPerBookingBooking').html(event.maxClientPerBooking);
      $('#classDurationBooking').html(minsdiff + " Horas");

      $('#bookingIDData').val(event._id);
      $('#priceData').val(event.price);
      $('#durationData').val(minsdiff + " Horas");
      $('#scheduleTimeData').val(moment(event.start).format('dddd') + ': ' 
        + moment(event.start).format('HH:mm') + ' a '
        + moment(event.end).format('HH:mm'));

      // DRAW BOOKED CLIENTS TABLE
      if(event.bookedClients.length !== 0){
        $("#bookedClientTable").show("fast");
        $('#bookedClientTable tbody').empty();
        $("#bookedClientTableEmpty").hide("fast");

        event.bookedClients.forEach(function(clients, index){
          let table = document.getElementById("bookedClientTableRow");
          let row   = table.insertRow(index);
          let cell  = [];

          for(let i = 0; i < 6; i++){
            cell[i] = row.insertCell(i);
          }

          cell[0].innerHTML = clients.bookedClient.local != undefined ? clients.bookedClient.local.name : clients.bookedClient.facebook.name,
          cell[1].innerHTML = minsdiff + " Horas",
          cell[2].innerHTML = clients.schedule;
          cell[3].innerHTML = "¢" + event.price.toFixed(2);
          cell[4].innerHTML = clients.status;
          cell[5].innerHTML = "<a class='btn btn-primary btn-sm' href='/professional/client-classes/booked-client/status/" + event._id + "/" + clients.bookedClient._id + "'>" + "Cambiar estado</a>";
        });
      } else {
        $("#bookedClientTable").hide("fast");
        $("#bookedClientTableEmpty").show("fast");
      }

      // FOR EDITING EVENTS OR SESSION
      if (event.ranges) {
        let dowValue = $('[name="dowValuesEdit"]');
        let dowValueArray = "";

        $.each(event.dow, function(i, val){
          $("input[value='" + val + "']").prop('checked', true);
        });
        
        $("#dowEdit").val(getCheckboxValue(dowValue, dowValueArray));

        // IF REPEATING
        if(event.repeating === true){
          $('input[name=dowRadioValuesEdit][value="0"]').prop('checked',false);
          $('input[name=dowRadioValuesEdit][value="1"]').prop('checked',true);
          $("#dowCheckBoxEdit").show("fast");
        } else {
          $('input[name=dowRadioValuesEdit][value="0"]').prop('checked',true);
          $('input[name=dowRadioValuesEdit][value="1"]').prop('checked',false);
          $("#dowCheckBoxEdit").hide("fast");
        }
        
        // FOR EDIT SESSION MODAL
        $('#classIDEditValue').val(event._id);
        $('#eventTitleEdit').val(event.title);
        $('#descriptionEdit').val(event.description);
        $('#dowValuesEdit:checked').val(event.dow);

        $('#rangeTimeStartEdit').val(moment(event.start).format('HH:mm'));
        $('#rangeTimeEndEdit').val(moment(event.end).format('HH:mm'));
        $('#rangeEventStartEdit').val(moment(event.ranges[0].start).format('YYYY/MM/DD'));
        $('#rangeEventEndEdit').val(moment(event.ranges[0].end).subtract(1, "days").format('YYYY/MM/DD'));
        $('#priceEdit').val(event.price);
        $('#workoutTypeEdit').val(event.workoutType);
        $('#maxClientPerBookingEdit').val(event.maxClientPerBooking);
      } 
      
      $('#fullCalModalDescription').modal('show');
    }
  });

  // Create new event using the create session button
  $('#addEventButton').on('click', function(){
    $('#dow').val("");
    $('input[type=checkbox]').prop('checked', false);
    $('input[type=radio]').prop('checked', false);
    $('#fullCalendarModalInput').modal('show');
  });

  $('#bookClientButton, #bookClientButtonEmpty').on('click', function(){
    $('#fullCalModalDescription').modal('hide');
    $('#fullCalendarModalBooking').modal('show');
  });

  // populate value for dow (days of week)
  $("#dowCheckBox").on('click', function(){
    let dowValue      = $('[name="dowValues"]');
    let dowValueArray = "";

    $("#dow").val(getCheckboxValue(dowValue, dowValueArray));
  });

  // populate value for dow for edit (days of week)
  $("#dowCheckBoxEdit").on('click', function(){
    let dowValue      = $('[name="dowValuesEdit"]');
    let dowValueArray = "";

    $("#dowEdit").val("");
    $("#dowEdit").val(getCheckboxValue(dowValue, dowValueArray));
  });

  // After clicking edit session
  $('#editEventButton').on('click', function(e){
    $('#fullCalModalDescription').modal('hide');
    $('#fullCalendarModalEdit').modal('show');
  });

  // Submit edit selected session
  $('#submitButtonEdit').on('click', function(e){
    // We don't want this to act as a link so cancel the link action
    e.preventDefault();

    let idValueEdit = $('#classIDEditValue').val();

    $('#editForm').attr('action', '/professional/client-classes/edit/' + idValueEdit + '?_method=put');
    $('#editForm').submit();
  });

  // Submit booling form for the selected session
  $('#submitButtonBooking').on('click', function(e){
    // We don't want this to act as a link so cancel the link action
    e.preventDefault();

    let idValueEdit = $('#bookingIDData').val();

    $('#bookForm').attr('action', '/professional/client-classes/booking/' + idValueEdit);
    $('#bookForm').submit();
  });

  // For modal and body scroll
  $('#fullCalendarModalBooking, #fullCalendarModalEdit, #fullCalendarModalInput').on('hidden.bs.modal', function () {
    $("body").removeClass("disable-scroll");
    $("body").addClass("enable-scroll");
  });

  $('#fullCalendarModalBooking, #fullCalendarModalEdit, #fullCalendarModalInput').on('show.bs.modal', function () {
    $("body").removeClass("enable-scroll");
    $("body").addClass("disable-scroll");
  });

  $('#fullCalModalDescription').on('show.bs.modal', function () {
    $("body").removeClass("enable-scroll");
    $("body").addClass("disable-scroll");
  });

  $('#fullCalModalDescription').on('hide.bs.modal', function () {
    $("body").addClass("enable-scroll");
  });
}

// get checkbox value
function getCheckboxValue(checkBoxName, checkBoxNewValue){
  for (let i=0, n = checkBoxName.length; i < n; i++){
    if (checkBoxName[i].checked) checkBoxNewValue += "," + checkBoxName[i].value;
  } if (checkBoxNewValue) checkBoxNewValue = checkBoxNewValue.substring(1);

  return checkBoxNewValue
}