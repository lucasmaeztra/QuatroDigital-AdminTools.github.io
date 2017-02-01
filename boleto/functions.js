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

	function renderTable(data, table) {
		var dtLine = data.split('\n');
		var dataT, dataU;
		var total = 0;
		for(var i = 0; i < dtLine.length; i = i + 2){
			dataT = dtLine[i].match(/.{13}T.{26}(.{13})..{15}(.{8})(.{15}).{36}(.{15})(.{40}).{10}.{15}.{10}.{22}/i);
			
			if(!dataT || dataT.length < 2)
				continue;

			dataU = dtLine[i + 1].match(/.{13}U.{3}(.{15})(.{15})(.{15})(.{15})(.{15})(.{15})(.{15})(.{15})(.{8})(.{8}).{4}(.{8})(.{15}).{60}/i);

			total += parseInt(dataU[6], 10);
			$('<tr></tr>')
				.append('<td class="nowrap" title="Nosso número">' + parseInt(dataT[1], 10) + '</td>')
				.append('<td class="nowrap" title="CNPJ ou CPF">' + dataT[4] + '</td>')
				.append('<td class="" title="Nome da empresa / pessoa">' + dataT[5] + '</td>')
				.append('<td class="nowrap" title="Valor do boleto">R$ ' + number_format(parseInt(dataT[3], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap" title="Valor pago pelo sacado">R$ ' + number_format(parseInt(dataU[5], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap bg-success" title="Valor liquido a ser creditado">R$ ' + number_format(parseInt(dataU[6], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap" title="Data de vencimento do boleto">' + dataT[2].slice(0, 2) + '/' + dataT[2].slice(2, 4) + '/' + dataT[2].slice(4, 8) + '</td>')
				.append('<td class="nowrap" title="Data da ocorrência">' + dataU[9].slice(0, 2) + '/' + dataU[9].slice(2, 4) + '/' + dataU[9].slice(4, 8) + '</td>')
				.append('<td class="nowrap" title="Data da efetivação do crédito">' + dataU[10].slice(0, 2) + '/' + dataU[10].slice(2, 4) + '/' + dataU[10].slice(4, 8) + '</td>')
				.appendTo(table);
		}

		$('<tr></tr>')
			.append('<td colspan="5"></td>')
			.append('<td class="nowrap bg-success" colspan="4">R$ ' + number_format(total / 100, 2, ',', '.') + '</td>')
			.appendTo(table);
	}
});


// PHP's number_format in JavaScript - http://locutus.io/php/strings/number_format/
function number_format(b,c,d,e){b=(b+"").replace(/[^0-9+\-Ee.]/g,"");b=isFinite(+b)?+b:0;c=isFinite(+c)?Math.abs(c):0;e="undefined"===typeof e?",":e;d="undefined"===typeof d?".":d;var a="",a=function(a,b){var c=Math.pow(10,b);return""+(Math.round(a*c)/c).toFixed(b)},a=(c?a(b,c):""+Math.round(b)).split(".");3<a[0].length&&(a[0]=a[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,e));(a[1]||"").length<c&&(a[1]=a[1]||"",a[1]+=Array(c-a[1].length+1).join("0"));return a.join(d)};