function getCalendarData(data){
	var appointments = data;

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
	  events: appointments,
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
	    $('#eventTitle').html(event.title);
	    $('#eventDescription').html(event.description);
	    $('#eventID').html(event._id);
	    $('#eventStart').html(moment(event.start).format('MMMM DD, YYYY: hh:mm A'));
	    $('#eventEnd').html(moment(event.end).format('hh:mm A'));
	    $('#eventPatient').html(event.bookedClients.bookedClient.name);
	    
	    $('#fullCalModalDescription').modal();
	  }
	});
}