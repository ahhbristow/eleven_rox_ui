function Views() {


}


Views.prototype.timesheet_view = function(timesheet) {

	console.log("Rendering timesheet");

	this.clear_all();
	var html = '';


	// DEBUG: Show the raw JSON
	var debug = 1;
	if (debug) {
		
		// Add debug control separator to the DOM
		var timesheet_debug_separator = jQuery('<div class="separator"><a id="toggle_timesheet_debug" class="button">Show Debug</a></div>');
		jQuery('#content').append(timesheet_debug_separator);
		
		// Create toggle display function
		jQuery('#toggle_timesheet_debug').click(function() {
			console.log("Toggling timesheet debug");
			jQuery('#timesheet_debug').toggle();
		});

		var timesheet_debug = jQuery('<div id="timesheet_debug"></div>').hide();
		// Create inner HTML for debug
		debug_html = '';
		debug_html += val(timesheet.model);

		// Add debug object to DOM
		jQuery(timesheet_debug).append(debug_html);
		jQuery('#content').append(timesheet_debug);
	}


	// Projects are broken down into two groups
	var current_projects_html = '';
	var old_projects_html     = ''

	// Build up the assigment list HTML
	var projects = timesheet.projects;
	for (project_id in projects) {
		var project = projects[project_id];

		if(project.has_time_entries) {
			current_projects_html += this.play_project(project);
		} else {
			old_projects_html += this.play_project(project);
		}
	}
	
	jQuery('#content').append(current_projects_html);
	jQuery('#content').append('<div class="separator"></div>');
	jQuery('#content').append(old_projects_html);

	this.register_events();
};




Views.prototype.register_events = function() {
	// Register click events for the expand buttons
	
	jQuery(document).on('click','.project_expand',function() {
		console.log(this);
		jQuery(this).siblings('.assignments').toggle();
	});

	console.log("Registered events");
}


Views.prototype.play_separator = function(id, html) {

	var separator = jQuery('<div class="separator" id="' + id + '">' + html + '</div>');
	return separator;
}

// Clears the page, ready for a new view
Views.prototype.clear_all = function() {

	console.log("Clearing view");

	$('content').innerHTML = '';
};




Views.prototype.show_loading = function() {

	this.clear_all();

	var html = '<div class="loading_modal"></div>';

	jQuery('#content').append(html);
};




Views.prototype.play_project = function(project) {

	var html = '';
	html += '<div id="project_' + project.id + '" class="project clearfix">';
	html += '<a class="project_expand"><span>+<span></a>';
	html += '<input class="hidden_project_id" type="hidden" value="' + project.id + '" />';
	html += '<p class="project_id">Project ID: ' + project.id +'</p>';

	if (project.has_time_entries) {
		html += '<div class="assignments">';
	} else {
		html += '<div class="assignments hidden">';
	}

	// Build DOM for each assignment in this project
	var assignments = project.assignments;
	for (var i = 0; i < assignments.length; i++) {
		var assignment = assignments[i];
		html += this.play_assignment(assignment);
	}

	html += '</div>';  // end assignments
	html += '</div>';  // end project

	return html;
};


Views.prototype.play_assignment = function(assignment) {

	var html = '';
	html += '<div class="assignment clearfix">';
	html += '<p>Project ID: ' + assignment.project_id + '</p>';
	html += '<p class="name">Assignment Name: ' + assignment.assignment_name + '</p>';
	html += '<div class="time_entries">';
		
	// Play time entries
	var time_entries = assignment.timeentries;
	for (time_entry_key in time_entries) {
		var time_entry = time_entries[time_entry_key];
		html += this.play_time_entry(time_entry);
	}
	html += '</div>';
	html += '</div>';
	
	return html;
}

Views.prototype.play_time_entry = function(time_entry) {
	var html = '';
	html += '<div class="time_entry">';
	html += 'TIME ENTRY';
	html += '</div>';

	return html;
}
