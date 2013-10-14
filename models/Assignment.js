function Assignment(json) {
	for (element_key in json) {
		this[element_key] = json[element_key];
	}

	this.has_time_entries = 0;
	this.build_time_entries();
}


// Need to iterate over all the time entries and
// build TimeEntry objects from them.
// Replace timeentries once done
Assignment.prototype.build_time_entries = function() {

	var time_entries = new Object();
	for (time_entry_key in this.timeentries) {
		this.has_time_entries = 1;
		var time_entry_obj = this.timeentries[time_entry_key];
		var time_entry = new TimeEntry(time_entry_obj);

		time_entries[time_entry_key] = time_entry;
	}
	this.timeentries = time_entries;

}

Assignment.prototype.get_project_id = function() {return this.project_id}
Assignment.prototype.get_name       = function() {return this.name}
