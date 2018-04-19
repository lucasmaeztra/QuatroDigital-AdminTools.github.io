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

	// Tipos de ocorrências (tipo da linha / boleto)
	var occurrenceTypes = {
		'01': 'título não existe',
		'02': 'entrada tít. confirmada',
		'03': 'entrada tít. rejeitada',
		'06': 'liquidação',
		'07': 'liquidação por conta',
		'08': 'liquidação por saldo',
		'09': 'baixa automática',
		'10': 'tít. baix. conf. instrução ou por título protestado',
		'11': 'em ser',
		'12': 'abatimento concedido',
		'13': 'abatimento cancelado',
		'14': 'prorrogação de vencimento',
		'15': 'Enviado para Cartório',
		'16': 'tít. já baixado/liquidado',
		'17': 'liquidado em cartório',
		'21': 'Entrada em Cartório',
		'22': 'Retirado de cartório',
		'24': 'Custas de Cartório',
		'25': 'Protestar Título',
		'26': 'Sustar Protesto'
	};

	var Regex = /.{3}(\d{14}).{91}(.{2})(.{6})(.{10})(.{8}).{12}(.{6})(.{13}).{10}(.{13}).{65}(.{13}).{29}(.{6})(.{36}).{29}(.{13}).{21}/i;
	function renderTable(data, table) {
		var dtLine = data.split('\n');
		var data;
		var total = 0;
		for(var i = 0; i < dtLine.length; i++){
			data = dtLine[i].match(Regex);
			
			if(!data || data.length < 2)
				continue;
			
			var dt = {
				'CNPJ ou CPF': 						data[01],
				'Tipo ocorrência': 					data[02],
				'DO': 								data[03],
				'Seu número': 						data[04],
				'Nosso número': 					data[05],
				'DVB': 								data[06],
				'Valor do boleto': 					data[07],
				'tarifa': 							data[08],
				'Valor pago pelo sacado': 			data[09],
				'DEC': 								data[10],
				'Nome da empresa / pessoa': 		data[11],
				'Valor liquido a ser creditado': 	data[12]
			};

			total += parseInt(dt['Valor liquido a ser creditado'], 10);
			$('<tr></tr>')
				.append('<td class="nowrap" title="Nosso número">' + parseInt(dt['Nosso número'], 10) + '</td>')
				.append('<td class="nowrap" title="Seu número">' + dt['Seu número'] + '</td>')
				.append('<td class="nowrap" title="CNPJ ou CPF">' + dt['CNPJ ou CPF'] + '</td>')
				.append('<td class="" title="Nome da empresa / pessoa">' + dt['Nome da empresa / pessoa'] + '</td>')
				.append('<td class="nowrap" title="Valor do boleto">R$ ' + number_format(parseInt(dt['Valor do boleto'], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap" title="Valor pago pelo sacado">R$ ' + number_format(parseInt(dt['Valor pago pelo sacado'], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap boleto-value" title="Valor liquido a ser creditado">R$ ' + number_format(parseInt(dt['Valor liquido a ser creditado'], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap" title="Valor da tarifa cobrada">R$ ' + number_format(parseInt(dt['tarifa'], 10) / 100, 2, ',', '.') + '</td>')
				.append('<td class="nowrap" title="Data de vencimento do boleto">' + dt['DVB'].slice(0, 2) + '/' + dt['DVB'].slice(2, 4) + '/' + dt['DVB'].slice(4, 6) + '</td>')
				.append('<td class="nowrap" title="Data da ocorrência">' + dt['DO'].slice(0, 2) + '/' + dt['DO'].slice(2, 4) + '/' + dt['DO'].slice(4, 6) + '</td>')
				.append('<td class="nowrap" title="Data da efetivação do crédito">' + dt['DEC'].slice(0, 2) + '/' + dt['DEC'].slice(2, 4) + '/' + dt['DEC'].slice(4, 6) + '</td>')
				.append('<td class="" title="Tipo ocorrência">' + occurrenceTypes[dt['Tipo ocorrência']] + '</td>')
				.appendTo(table);
		}

		$('<tr></tr>')
			.append('<td colspan="6"></td>')
			.append('<td class="nowrap boleto-value">R$ ' + number_format(total / 100, 2, ',', '.') + '</td>')
			.append('<td colspan="5"></td>')
			.appendTo(table);
	}
});


// PHP's number_format in JavaScript - http://locutus.io/php/strings/number_format/
function number_format(b,c,d,e){b=(b+"").replace(/[^0-9+\-Ee.]/g,"");b=isFinite(+b)?+b:0;c=isFinite(+c)?Math.abs(c):0;e="undefined"===typeof e?",":e;d="undefined"===typeof d?".":d;var a="",a=function(a,b){var c=Math.pow(10,b);return""+(Math.round(a*c)/c).toFixed(b)},a=(c?a(b,c):""+Math.round(b)).split(".");3<a[0].length&&(a[0]=a[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,e));(a[1]||"").length<c&&(a[1]=a[1]||"",a[1]+=Array(c-a[1].length+1).join("0"));return a.join(d)};