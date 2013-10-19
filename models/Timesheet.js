// Timesheet is a collection of assignments

function Timesheet(model) {


	// Store the raw JSON because it's useful
	this.model = model;

	// Private member variables
	this.assignments = [];
	this.projects = new Object();

	this.name = "TIMESHEET"

}



// ======== Getters/Setters ==============
Timesheet.prototype.get_assignments = function() {return this.assignments}


// ======== Methods =======================

Timesheet.prototype.get_timesheet = function(token) {

}

Timesheet.prototype.add_assignment = function(assignment) {

	var project_id = assignment.project_id;

	// If this project already exists, add this assignment to it
	
	var project;
	if(!this.projects[project_id]) {
		// Create new project
		project = new Object();
		project.assignments = [];
		project.id = project_id;
		project.has_time_entries = 0;

		this.projects[project_id] = project;
	} else {
		// Read existing project
		project = this.projects[project_id];
	}
	project.assignments.push(assignment);

	// Check if this project has a time entry
	if (assignment.has_time_entries) {
		project.has_time_entries = 1;
	}

	this.assignments.push(assignment);
}

Timesheet.prototype.add_time_entry = function(time_entry) {

}


// ========== View functions ===============

Timesheet.prototype.build_dom = function() {}
