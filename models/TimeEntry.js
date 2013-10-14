// Builds a time entry from a JSON object
function TimeEntry(json) {
	for (element_key in json) {
		this[element_key] = json[element_key];
	}
}
