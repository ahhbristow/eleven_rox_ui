	// all of this taken from https://github.com/ServiceStack/ServiceStack/wiki/HTML5ReportFormat
	var doc = document, win = window,
		$ = function(id) { return doc.getElementById(id); },
		$$ = function(sel) { return doc.getElementsByTagName(sel); },
		$each = function(fn) { for (var i=0,len=this.length; i<len; i++) fn(i, this[i], this); },
		isIE = /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);

	$.each = function(arr, fn) { $each.call(arr, fn); };

	var splitCase = function(t) { return typeof t != 'string' ? t : t.replace(/([A-Z]|[0-9]+)/g, ' $1'); },
		uniqueKeys = function(m){ var h={}; for (var i=0,len=m.length; i<len; i++) for (var k in m[i]) if (show(k)) h[k] = k; return h; },
		keys = function(o){ var a=[]; for (var k in o) if (show(k)) a.push(k); return a; }
	var tbls = [];

	function val(m) {
	  if (m == null) return '';
	  if (typeof m == 'number') return num(m);
	  if (typeof m == 'string') return str(m);
	  if (typeof m == 'boolean') return m ? 'true' : 'false';
	  return m.length ? arr(m) : obj(m);
	}
	function num(m) { return m; }
	function str(m) {
	  return m.substr(0,6) == '/Date(' ? dmft(date(m)) : m;
	}
	function date(s) { return new Date(parseFloat(/Date\(([^)]+)\)/.exec(s)[1])); }
	function pad(d) { return d < 10 ? '0'+d : d; }
	function dmft(d) { return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()); }
	function show(k) { return typeof k != 'string' || k.substr(0,2) != '__'; }
	function obj(m) {
	  var sb = '<dl>';
	  for (var k in m) if (show(k)) sb += '<dt class="ib">' + splitCase(k) + '</dt><dd>' + val(m[k]) + '</dd>';
	  sb += '</dl>';
	  return sb;
	}
	function arr(m) {
	  if (typeof m[0] == 'string' || typeof m[0] == 'number') return m.join(', ');
	  var id=tbls.length, h=uniqueKeys(m);
	  var sb = '<table id="tbl-' + id + '"><caption></caption><thead><tr>';
	  tbls.push(m);
	  var i=0;
	  for (var k in h) sb += '<th id="h-' + id + '-' + (i++) + '"><b></b>' + splitCase(k) + '</th>';
	  sb += '</tr></thead><tbody>' + makeRows(h,m) + '</tbody></table>';
	  return sb;
	}

	function makeRows(h,m) {
	  var sb = '';
	  for (var r=0,len=m.length; r<len; r++) {
		sb += '<tr>';
		var row = m[r];
		for (var k in h) if (show(k)) sb += '<td>' + val(row[k]) + '</td>';
		sb += '</tr>';
	  }
	  return sb;
	}

	function showJson(){
		var txt = $$('TEXTAREA')[0];

		doc.body.className='show-json';
		txt.select();
		txt.focus();
	}

	doc.onclick = function(e) {
		e = e || window.event, el = e.target || e.srcElement, cls = el.className;
		if (el.tagName == 'B') el = el.parentNode;
		if (el.tagName != 'TH') return;
		el.className = cls == 'asc' ? 'desc' : (cls == 'desc' ? null : 'asc');
		$.each($$('TH'), function(i,th){ if (th == el) return; th.className = null; });
		clearSel();
		var ids=el.id.split('-'), tId=ids[1], cId=ids[2];
		if (!tbls[tId]) return;
		var tbl=tbls[tId].slice(0), h=uniqueKeys(tbl), col=keys(h)[cId], tbody=el.parentNode.parentNode.nextSibling;
		if (!el.className){ setTableBody(tbody, makeRows(h,tbls[tId])); return; }
		var d=el.className=='asc'?1:-1;
		tbl.sort(function(a,b){ return cmp(a[col],b[col]) * d; });
		setTableBody(tbody, makeRows(h,tbl));
	}

	function setTableBody(tbody, html) {
	  if (!isIE) { tbody.innerHTML = html; return; }
	  var temp = tbody.ownerDocument.createElement('div');
	  temp.innerHTML = '<table>' + html + '</table>';
	  tbody.parentNode.replaceChild(temp.firstChild.firstChild, tbody);
	}

	function clearSel() {
	  if (doc.selection && doc.selection.empty) doc.selection.empty();
	  else if(win.getSelection) {
		var sel=win.getSelection();
		if (sel && sel.removeAllRanges) sel.removeAllRanges();
	  }
	}

	function cmp(v1, v2){
	  var f1, f2, f1=parseFloat(v1), f2=parseFloat(v2);
	  if (!isNaN(f1) && !isNaN(f2)) v1=f1, v2=f2;
	  if (typeof v1 == 'string' && v1.substr(0,6) == '/Date(') v1=date(v1), v2=date(v2);
	  if (v1 == v2) return 0;
	  return v1 > v2 ? 1 : -1;
	}

	function enc(html) {
	  if (typeof html != 'string') return html;
	  return html.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
	}

