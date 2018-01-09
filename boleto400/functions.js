$(function() {
	var reader = {};
	var filesQueue = [];
	var currentFile;
	var tableBase = $('.table-base table');
	$('#fileupload').fileupload({autoUpload: false }).bind('fileuploadadd', function (e, data) {
		for(var i = 0; i < data.files.length; i++){
			var name = data.files[i].name;
			reader[name] = new FileReader();
			reader[name].onload = function(evt) {
				$('[rel="' + name + '"]').remove();
				var table = tableBase.clone().appendTo('.tables-wrapper').wrap('<div rel="' + name + '"></div>');
				renderTable(evt.target.result, table.find('tbody'));
				table.before('<h3>' + name + '</h3>');
				// table.after('<hr />');
			};
			reader[name].readAsText(data.files[i]);
		}
	});

	var Regex = /.{3}(.{14}).{93}(.{6})(.{10})(.{8}).{12}(.{6})(.{13}).{88}(.{13}).{29}(.{6})(.{36}).{29}(.{13}).{21}/i;
	function renderTable(data, table) {
		var dtLine = data.split('\n');
		var data;
		var total = 0;
		for(var i = 0; i < dtLine.length; i++){
			data = dtLine[i].match(Regex);
			
			if(!data || data.length < 2)
				continue;

			total += parseInt(data[10], 10);
			$('<tr></tr>')
				.append('<td class="nowrap" title="Nosso número">' + parseInt(data[4], 10) + '</td>')
				.append('<td class="nowrap" title="Seu número">' + data[3] + '</td>')
				.append('<td class="nowrap" title="CNPJ ou CPF">' + data[1] + '</td>')
				.append('<td class="" title="Nome da empresa / pessoa">' + data[9] + '</td>')
				.append('<td class="nowrap" title="Valor do boleto">R$ ' + number_format(parseInt(data[6], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap" title="Valor pago pelo sacado">R$ ' + number_format(parseInt(data[7], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap bg-success" title="Valor liquido a ser creditado">R$ ' + number_format(parseInt(data[10], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap" title="Data de vencimento do boleto">' + data[5].slice(0, 2) + '/' + data[5].slice(2, 4) + '/' + data[5].slice(4, 6) + '</td>')
				.append('<td class="nowrap" title="Data da ocorrência">' + data[2].slice(0, 2) + '/' + data[2].slice(2, 4) + '/' + data[2].slice(4, 6) + '</td>')
				.append('<td class="nowrap" title="Data da efetivação do crédito">' + data[8].slice(0, 2) + '/' + data[8].slice(2, 4) + '/' + data[8].slice(4, 6) + '</td>')
				.appendTo(table);
		}

		$('<tr></tr>')
			.append('<td colspan="6"></td>')
			.append('<td class="nowrap bg-success">R$ ' + number_format(total / 100, 2, ',', '.') + '</td>')
			.append('<td colspan="3"></td>')
			.appendTo(table);
	}
});


// PHP's number_format in JavaScript - http://locutus.io/php/strings/number_format/
function number_format(b,c,d,e){b=(b+"").replace(/[^0-9+\-Ee.]/g,"");b=isFinite(+b)?+b:0;c=isFinite(+c)?Math.abs(c):0;e="undefined"===typeof e?",":e;d="undefined"===typeof d?".":d;var a="",a=function(a,b){var c=Math.pow(10,b);return""+(Math.round(a*c)/c).toFixed(b)},a=(c?a(b,c):""+Math.round(b)).split(".");3<a[0].length&&(a[0]=a[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,e));(a[1]||"").length<c&&(a[1]=a[1]||"",a[1]+=Array(c-a[1].length+1).join("0"));return a.join(d)};