// This function is always called
function refresh(action, token) {

	// Check if we have a token
	if (token == "") {
		return;
	}

	switch (action) {
		case 'go_timesheet':
			go_timesheet();
			break;
		default:
			go_timesheet();
	}
}

// Display the timesheet on the page
function go_timesheet() {

	console.log("fn: go_timesheet");
	get_timesheet();
}

function get_timesheet_template() {
	// We should show the loading screen whilst waiting
	view_player = new Views();
	view_player.play_timesheet_template();
}


function get_element(id) {
	var element = jQuery('#' + id);
}



// ====== Call to ElevenRox for timesheet =========

function get_timesheet() {

	console.log("fn: test_get_time");
	var request = {};

	request.method = "get_time";
	request.params = {};
	request.params.token = $('get_time.token').value;
	request.params.start_date = $('get_time.start_date').value;
	request.id = 2;

	send(request,get_timesheet_callback);

	// We should show the loading screen whilst waiting
	view_player = new Views();
	view_player.show_loading();
};


function get_timesheet_callback(_resp) {
	
	// Create Timesheet with time entries
	console.log("fn: get_time_handler");

	// run the html5 modeller (these are global)
	json = JSON.stringify(_resp);
	model = JSON.parse(json);
	var timesheet = new Timesheet(model.result.timesheet)

	var timesheet_data = bind_timesheet(timesheet);	

	console.log("fn: Playing timesheet: " + timesheet.toString());
	view_player = new Views();
	view_player.play_timesheet_template(timesheet_data);
}


// =======================================================
//

// Takes a timesheet object and builds a data site object
// that can be passed into the view.  This is a 'view' of
// the timesheet.
//
function bind_timesheet(timesheet) {

	var timesheet_obj = new Object();
	var time_entries  = timesheet.time_entries;
	var assignments   = timesheet.assignments;

	// Bind the intervals.  Used for displaying table headers
	timesheet_obj.intervals = timesheet.intervals;

	// Generate current projects
	var available_projects = new Object();
	var open_projects      = new Object();
	timesheet_obj.available_projects = available_projects;
	timesheet_obj.open_projects      = open_projects;

	// For each assignment, build projects, assignments and time entries
	for (var i = 0; i < assignments.length; i++) {
		
		// Bind up the information inside the assignment
		var assignment = bind_assignment(timesheet, assignments[i]);

		// If we haven't seen this project before, init it
		var project_id = assignment.project_id;
		var project = available_projects[project_id];

		if(!project) {
			project = {
				"project_id": project_id,
				"project_name": assignment.project_name,
			}
			project.assignments = new Object();
			available_projects[project_id] = project;
		}

		// Add this assignment to the project
		project.assignments[assignment.assignment_id] = assignment;

		// If this assignment has time entries, add to current project
		if (assignment.has_time) {
			open_projects[project_id] = project;
		}
	}

	return timesheet_obj;
}


// Takes an assignment and initialises the intervals
// and time entries
function bind_assignment(timesheet, assignment) {

	// Init the time entries to empty for this assignment
	assignment.time_entries = new Object();
	var intervals = timesheet.intervals;

	// Key is date string DD/MM/YYYY
	for (interval_key in intervals) {
		var interval = intervals[interval_key];

		assignment.time_entries[interval_key] = "";
	}
		
	// Check if we have any time entries to add
	var time_entries = timesheet.get_time_entries(assignment.assignment_id);
	for (var i = 0; i < time_entries.length; i++) {
		var time_entry = time_entries[i];
		assignment.time_entries[time_entry.entry_date] = time_entry;
		console.log("fn: bind_assignment - Adding time entry");
	}

	return assignment;
}
