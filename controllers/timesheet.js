
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


// Handle the response from Tenrox with the timesheet details in
function get_timesheet_callback(_resp) {
	
	console.log("fn: get_time_handler");

	// run the html5 modeller (these are global)
	json = JSON.stringify(_resp);
	model = JSON.parse(json);


	// Build the timesheet
	var timesheet = new Timesheet(model);

	// Add assignments to timesheet
	var assignments = model.result.timesheet.assignments;
	for (assignment_key in assignments) {
		var assignment_obj = assignments[assignment_key];

		var assignment = new Assignment(assignment_obj);
		timesheet.add_assignment(assignment);


		// Add time entries that are linked to this assigment
		var time_entries = assignment_obj.timeentries;
		for (time_entry_key in time_entries) {
			var time_entry_obj = time_entries[time_entry_key];

			var time_entry = new TimeEntry(time_entry_obj);
			timesheet.add_time_entry(time_entry);
		}

	}

	view_player = new Views();
	//view_player.timesheet_view(timesheet);
	view_player.play_timesheet_template(timesheet);
};


// =======================================================

