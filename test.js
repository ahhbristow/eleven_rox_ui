// contains logic specific to the test harness
var url = "/elevenRox";

function clear_all() {

	var txt = $$('textarea')[0];

	$('content').innerHTML = '';
	txt.innerHTML = '';
};

function reset() {

	clear_all();

	// hide the json link
	jQuery('#json_lnk').css('display','none');
	jQuery('#reset_lnk').css('display','none');

	// show all the input param forms again
	jQuery('#login_lnk').css('display','inline');
	jQuery('#get_time_lnk').css('display','inline');
	jQuery('#set_time_lnk').css('display','inline');
	jQuery('#complete_lnk').css('display','inline');

	jQuery('#top_param_forms').css('display','block');
	jQuery('#bottom_param_forms').css('display','block');
	jQuery('#bottom_lnks').css('display','block');
};

function test_login() {

	var request = {};

	request.method = "login";
	request.params = {};
	request.params.username = $('login.username').value;
	request.params.password = $('login.password').value;

	request.id = 1;

	send(request);
};

function test_get_time() {

	console.log("fn: test_get_time");
	var request = {};

	request.method = "get_time";
	request.params = {};
	request.params.token = $('get_time.token').value;
	request.params.start_date = $('get_time.start_date').value;
	request.id = 2;

	send(request,get_time_handler);
};

function test_set_time() {

	var request = {};

	request.method = "set_time";
	request.params = {};
	request.params.assignment_id   = $('set_time.assignment_id').value;
	request.params.entry_id        = $('set_time.entry_id').value;
	request.params.entry_date      = $('set_time.entry_date').value;
	request.params.time            = $('set_time.time').value;
	request.params.comment         = $('set_time.comment').value;
	request.params.comment_id      = $('set_time.comment_id').value;
	request.params.timesheet_token = $('set_time.timesheet_token').value;
	request.params.token           = $('set_time.token').value;

	// overwrite empty string with null
	if (request.params.comment_id == '') {
		request.params.comment_id = null;
	}

	// if any of these are empty string, we don't actually want to send them
	$.each(['overtime','double_ot','is_etc','enst'], function(i,v) {
		if (eval('$(\'set_time.' + v + '\').value') != '') {
			eval('request.params.' + v + '= v');
		}
	});

	request.id = 3;

	send(request);
};

function test_complete() {

	var request = {};

	request.method = "complete";
	request.params = {};
	request.params.timesheet_token = $('complete.timesheet_token').value;
	request.params.token           = $('complete.token').value;

	request.id = 4;

	send(request);
};


// Callback function
function handle(_resp) {

	console.log("fn: handle");
	var txt = $$('textarea')[0];

	// run the html5 modeller
	var json = JSON.stringify(_resp),
		model = JSON.parse(json);

	$('content').innerHTML = val(model);
	txt.innerHTML = enc(json);

	// show stuff
	jQuery('#reset_lnk').css('display','inline');
	jQuery('#json_lnk').css('display','inline');
	jQuery("body").removeClass('loading');

	// attempt to auto fill any dynamic fields on the page
	fill(_resp);
};


function get_time_handler(_resp) {

	console.log("fn: get_time_handler");
	
	var txt = $$('textarea')[0];

	// run the html5 modeller (these are global)
	json = JSON.stringify(_resp);
	model = JSON.parse(json);

	//$('content').innerHTML = val(model.result.timesheet.assignments);
	//txt.innerHTML = enc(json);
	
	//Actually display assignments
	var assignments = model.result.timesheet.assignments;
	for (var i = 0; i < assignments.length; i++) {
		var assignment = assignments[i];

		jQuery('#content').append('<p>' + assignment.project_id + ' : ' + assignment.project_name + ' : ' + assignment.assignment_name + '</p>');
	}
	

	// show stuff
	jQuery('#reset_lnk').css('display','inline');
	jQuery('#json_lnk').css('display','inline');
	jQuery("body").removeClass('loading');

	// attempt to auto fill any dynamic fields on the page
	fill(_resp);

}

// hide stuff
function set_loading() {

	jQuery('#json_lnk').css('display','none');
	jQuery('#top_param_forms').css('display','none');
	jQuery('#bottom_param_forms').css('display','none');
	jQuery('#bottom_lnks').css('display','none');
	jQuery('#login_lnk').css('display','none');
	jQuery('#get_time_lnk').css('display','none');
	jQuery('#set_time_lnk').css('display','none');
	jQuery('#complete_lnk').css('display','none');
	jQuery('#content').addClass('loading');
};


function send(_req, callback_fn) {

	if (!callback_fn) {
		callback_fn = handle;
	}

	//clear_all();

	//set_loading();

	// make the request
	jQuery.post(url, JSON.stringify(_req), callback_fn, "json");
};


function fill(_resp) {

	var token,
	    timesheet_token,
	    assignment_id,
	    entry_id,
	    entry_date,
	    idx,
	    timeentry,
	    note;

	if (_resp && _resp.result && _resp.result !== undefined) {

		// token
		if (_resp.result.token !== undefined) {
			token = _resp.result.token;
		}

		// timesheet token
		if (_resp.result.timesheet_token !== undefined) {
			timesheet_token = _resp.result.timesheet_token;
		}

		// first let's see if we've got some timeentries to play with
		// in this case we can modify existing entries rather than adding new ones
		if (
		    _resp.result.timesheet !== undefined &&
		    _resp.result.timesheet.timeentries !== undefined
		) {

			// let's try to find something with a comment
			$.each(_resp.result.timesheet.timeentries, function(i,t) {
				if (t.notes !== undefined && t.notes.length) {
					timeentry = t;
					note = timeentry.notes[0];
					return;
				}
			});

			// if we didn't find a timeentry with a comment, pick a random
			if (!timeentry) {
				idx = _get_random(0,_resp.result.timesheet.timeentries.length);
				timeentry = _resp.result.timesheet.timeentries[idx];
			}

			assignment_id = timeentry.assignment_attribute_id;
			entry_id = timeentry.entry_id;
			entry_date = _format_date(timeentry.entry_date);
		}

		// if we've not got anything yet, pick an assignment at random, this will be a new entry
		if (!assignment_id &&
			_resp.result.timesheet !== undefined &&
			_resp.result.timesheet.assignments !== undefined
		) {
			idx = _get_random(0,_resp.result.timesheet.assignments.length);
			assignment_id = _resp.result.timesheet.assignments[idx].assignment_attribute_id;
			entry_date = _current();
		}
	}

	if (token) {
		$('get_time.token').value = token;
		//$('set_time.token').value = token;
		//$('complete.token').value = token;
	}

	if (timesheet_token) {
		$('set_time.timesheet_token').value = timesheet_token;
		$('complete.timesheet_token').value = timesheet_token;
	}

	if (entry_id) {
		$('set_time.entry_id').value = entry_id;
	}

	if (assignment_id) {
		$('set_time.assignment_id').value = assignment_id;
	}

	if (entry_date) {
		$('set_time.entry_date').value = entry_date;
	}

	if (note) {
		$('set_time.comment').value = note.d;
		$('set_time.comment_id').value = note.uid;
	}
};

// return today DD/MM/YYYY
function _current() {

	var current = new Date()
	    d = current.getDate(),
	    m = current.getMonth() + 1,
	    y = current.getFullYear();

	// format with leading 0
	if (d < 10) {
		d = '0' + d;
	}

	if (m < 10) {
		m = '0' + m;
	}

	formatted = d + '/' + m + '/' + y;

	return formatted;
};

// turn MM/DD/YYYY into DD/MM/YYYY
function _format_date(date) {

	var fn = '_format_date: ',
	    date_arr = date.split('/'),
	    formatted;

	if (date_arr.length != 3) {
		console.log(fn + 'invalid date - ' + date);
		return date;
	}

	formatted = date_arr[1] + '/' + date_arr[0] + '/' +  date_arr[2];

	return formatted;
};

// return a random integer between start and end
function _get_random(start,end) {

	var r = end;

	while (r >= end) {
		r = Math.random() * 10;
	}

	return Math.floor(r);
};
