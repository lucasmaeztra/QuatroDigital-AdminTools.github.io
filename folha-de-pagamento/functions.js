$(function() {
	var reader = {};
	$('#fileupload').fileupload({autoUpload: false }).bind('fileuploadadd', function (e, data) {
		for(var i = 0; i < data.files.length; i++){
			var name = data.files[i].name;
			reader[name] = new FileReader();
			reader[name].onload = function(evt) {
				readFile(evt.target.result);
			};
			reader[name].readAsText(data.files[i], 'windows-1252');
		}
	});

	function readFile(fileContent) {
		var lines, newLines;

		// Removendo linhas em branco
		lines = fileContent.split('\n');
		newLines = [];
		for (var i in lines) {
			if (lines[i].trim().length)
				newLines.push(lines[i].trim());
		}
		fileContent = newLines.join('\n');
		log('Leitura e padronização do arquivo',  fileContent );

		// Obtendo o período ao qual corresponde os dados
		var date = fileContent.match(/Período de: (\d+)\/(\d+)\/(\d+)/i).splice(1, 3);

		// Removendo os cabeçalhos das páginas
		// var pageSeparator = '------------------------------------------------------------------------------------------------------------------------------';
		var pageHeaderRegex = /.-+\n.\+-+\+\n.\| Folha([^\n]+\n){5}.\+-+\+\n/ig;
		fileContent = fileContent.replace(pageHeaderRegex, '');
		// Remove topo e rodapé restante
		var headerRegex = /.\+-+\+\n.\| Folha([^\n]+\n){7}.\|\s+Anexos[^\n]+\n(.\+-+\+\n){2}/i
		fileContent = fileContent.replace(headerRegex, '');
		var footerSeparator = '+----------------------------------------------------------------------------------------------------------------------------+\n|----------------------------------------------------------------------------------------------------------------------------|\n|G';
		fileContent = fileContent.split(footerSeparator).shift();
		log('Apenas dados dos funcionários',  fileContent );

		// Separando os funcionários
		var separator = '+----------------------------------------------------------------------------------------------------------------------------+\n+----------------------------------------------------------------------------------------------------------------------------+'
		lines = fileContent.split(separator);
		newLines = [];
		for (var i in lines) {
			if (lines[i].indexOf('Cod: ') > -1)
				newLines.push(lines[i]);
		}
		var employees = newLines;
		var header = lines[0];
		fileContent = newLines.join('\n\n#NOVO REGISTRO#');
		log('Separando por funcionários',  fileContent );


		// Separando os dados de cada funcionário
		employeesProcessor(employees, date);
	}
	
	function employeesProcessor(employees, date) {
		var separator = '+----------------------------------------------------------------------------------------------------------------------------+';

		// Log
		log('Separando dados do funcionário',  employees[0].split(separator).join('\n\n#NOVO REGISTRO#') );

		// Regex
		var eProfRegexA = /Cod: (\d+)[^:]+:([\w\s]+)Funcao:([\w\s]+)Dep\.IR:/i;
		var eProfRegexB = /Admissão: ([\d\/]+).+Situação:([\wÀ-ÿ\s]+).+(Ocorrencia:.+)?Salario:\s*([\d\.,]+)/i;
		var statementRegexA = /([\d]+)(.+)\s+([\d\.,]+)\s+([\d\.,]+)$/i;
		var statementRegexB = /([\d]+)(.+)\s+([\d\.,]+)$/i;
		var summaryRegexA = /[\d\.]+,[\d]+/i;
		var summaryRegexB = /[\|0-9]?\s([A-ZÀ-Ý][^:]+)/i;

		// Processando os dados
		var employee;
		var row, tempData, temp, temp2;
		for(var e in employees){
			employee = employees[e].split(separator);

			// Dados do funcionário
			// Perfil
			tempData = employee[0].match(eProfRegexA);
			row = new tableRow([date.join('/').trim(), tempData[1].trim(), tempData[2].trim()]);
			row.add(null, 'Cargo', null, tempData[3].trim());
			tempData = employee[0].match(eProfRegexB);
			row.add(null, 'Admissão', null, tempData[1].trim());
			row.add(null, 'Situação', null, tempData[2].trim());
			row.add(null, 'Salário (header)', null, tempData[4].trim());
			// Extrato
			tempData = employee[1].split(/?\|/);
			newTempData = [];
			for(var td in tempData){
				temp = tempData[td].trim();
				if (!temp.length)
					continue;

				temp2 = temp.match(statementRegexA);
				if(temp2)
					row.add(temp2[1].trim(), temp2[2].trim(), temp2[3].trim(), temp2[4].trim());
				else{
					temp2 = temp.match(statementRegexB);
					if(temp2)
						row.add(temp2[1].trim(), temp2[2].trim(), null, temp2[3].trim());
				}
			}
			// Resumos
			tempData = employee[2].split(':');
			for(var td in tempData){
				temp = tempData[td].match(summaryRegexA);
				if (temp)
					row.add(null, tempData[td-1].match(summaryRegexB).pop(), null, temp[0]);
			}
		}

		// Gerando a impressão da tabela
		tablePrint();
	}

	// Gerando e processando a tabela com os dados
	var outTable = [];
	function tableRow(eBase) {
		this.rowBase = eBase.join('\t')
	}
	tableRow.prototype.add = function(columnA, columnB, columnC, columnD) {
		outTable.push(this.rowBase + '\t' + (columnA || '') + '\t' + (columnB || '') + '\t' + (columnC || '') + '\t' + (columnD || ''));
	}
	// Imprimindo a tabela
	function tablePrint() {
		$('.output-wrapper textarea').val(outTable.join('\n'));
	}

	// Log do processamento do arquivo
	var logTemplate = Handlebars.compile(document.getElementById("log-template").innerHTML);
	var logData = { items: []};
	var logCount = 0;
	function log(title, content) {
		logCount++;
		logData.items[logCount - 1] = {index:logCount, title: title, content: content };
		$('#log-data').html(logTemplate(logData));
	}
});