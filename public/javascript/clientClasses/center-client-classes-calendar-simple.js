function getCalendarData(data){
	var classesItems    = data;

	// INITIALIZE FULL CALENDAR
	$('#calendar').fullCalendar({
	  // AVAILABLE HEADER TOOLBAR
	  header: {
	    left: 'title',
	    center: 'agendaDay,agendaWeek,listWeek,month',
	    right: 'prev,next today'
	  },
	  // SET HEADER BUTTON NAMES
	  views: {
	    listWeek: { buttonText: 'List' },
	    agendaDay: { buttonText: 'Days'},
	    agendaWeek: { buttonText: 'Weeks'},
	    month: { buttonText: 'Months'},
	  },
	  // SET HEADER BUTTON NAME
	  buttonText: {
	    today: 'Today'
	  },
	  // SET INITIAL CALENDAR VIEW
	  defaultView: 'month',
	  navLinks: true, // can click day/week names to navigate views
	  eventLimit: true, // allow "more" link when too many events
	  selectable: true,
	  forceEventDuration: false,
	  events: classesItems,
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
	  // FULL CALENDAR EVENT CLICK FUNCTION
	  eventClick:  function(event, jsEvent, view) {
	    let startTime = new Date(event.start);
	    let endTime   = new Date(event.end);
	    let minsdiff  = (endTime.getTime() - startTime.getTime()) / 3600000;

	    $('#classTitle').html(event.title);
	    $('#classDescription').html(event.description);
	    $('#classID').html(event._id);
	    $('#classDate').html(moment(event.start).format('MMMM Do'));
	    $('#classDateStart').html(moment(event.start).format('HH:mm'));
	    $('#classDateEnd').html(moment(event.end).format('HH:mm'));
	    $('#classPrice').html(event.price.toFixed(2)); 
	    $('#classWorkOutType').html(event.workoutType);
	    $('#classMaxClientPerBooking').html(event.maxClientPerBooking);
	    $('#classDuration').html(minsdiff + " Horas");
	    $('#bookedClientTotal').html("<strong>Clients </strong> [" + event.bookedClients.length + "/" + event.maxClientPerBooking + "]");
	    
	    // DRAW BOOKED CLIENTS TABLE
	    if(event.bookedClients.length !== 0){
	      $("#bookedClientTable").show("fast");
	      $('#bookedClientTable tbody').empty();

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
	        cell[5].innerHTML = "<a class='btn btn-primary btn-sm' href='/center/client-classes/booked-client/status/" + event._id + "/" + clients.bookedClient._id + "'>" + "Cambiar estado</a>";
	      });
	    } else {
	      $("#bookedClientTable").hide("fast")
	    }
	    
	    $('#fullCalModalDescription').modal();
	  }
	});
}