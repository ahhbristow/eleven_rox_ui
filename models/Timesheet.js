// Timesheet is a collection of TimeEntries

function Timesheet(json) {

	for (element_key in json) {
		this[element_key] = json[element_key];
	}

	this.intervals = this.build_intervals();
	//this.intervals = this.build_time_entries(this.timeentries, this.intervals);

}

// ======== Methods =======================


// This timesheet could have any number of days depending
// on the start_time and end_time.
//
// Returns an object that represents the intervals.  A single
// time entry can be linked to each one
Timesheet.prototype.build_intervals = function() {

	var timesheet_start_date = moment(this.start_date, 'DD-MM-YYYY');
	var timesheet_end_date   = moment(this.end_date, 'DD-MM-YYYY');

	var intervals = new Object();
	var current_date = timesheet_start_date;
	
	while (current_date.isBefore(timesheet_end_date)) {

		var interval = {
		   "day": "Day Name",
		   "interval_date": current_date.format("DD-MM-YYYY"),
		   "time_id": "1",
			 "time_entries": []
		};
		intervals[current_date.format("DD-MM-YYYY")] = interval;
		current_date.add('days', 1);
	}

	return intervals;

}

// Associate a set of time entries with an interval.
// Each interval can have multiple time entries
// 
// TODO: Is this passed by ref?  Just return anyway
Timesheet.prototype.build_time_entries = function(time_entries, intervals) {

	for (time_entry_key in time_entries) {
		var time_entry = time_entries[time_entry_key];
		var entry_date = time_entry['entry_date'];

		// If this date doesn't exist, create it
		if(!intervals[entry_date]) {

			// Create new interval
			var interval = {
			   "day": "Day Name",
			   "interval_date": entry_date,
				 "time_entries": []
			};

			// Add new interval
			intervals[entry_date] = interval;
		}
		
		// add time entry to this interval
		intervals[entry_date]['time_entries'].push(time_entry);
	}

	return intervals;
}

// Search for assignment
// Returns null if doesn't exist
Timesheet.prototype.get_assignment = function(assignment_id) {

	var assignments = this.assignments;
	for (var i = 0; i < assignments.length; i++) {
		if (assignments[i].assignment_id == assignment_id) {
			return assignment;
		}
	}
	
	return null;
}



// Returns all the time entries for a particular assignment_id
Timesheet.prototype.get_time_entries = function(assignment_id) {
	
	var assignment_time_entries = [];

	// Scan over the time entries
	var time_entries = this.timeentries;
	for (var i = 0; i < time_entries.length; i++) {
		var time_entry = time_entries[i];

		// Check if this is the assignment we want
		if (time_entry.assignment_id == assignment_id) {
			assignment_time_entries.push(time_entry);
		}
	}

	return assignment_time_entries;

}
