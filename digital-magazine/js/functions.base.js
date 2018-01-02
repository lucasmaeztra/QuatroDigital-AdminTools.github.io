"function"!==typeof String.prototype.replaceSpecialChars&&(String.prototype.replaceSpecialChars=function(){var b={"\u00e7":"c","\u00e6":"ae","\u0153":"oe","\u00e1":"a","\u00e9":"e","\u00ed":"i","\u00f3":"o","\u00fa":"u","\u00e0":"a","\u00e8":"e","\u00ec":"i","\u00f2":"o","\u00f9":"u","\u00e4":"a","\u00eb":"e","\u00ef":"i","\u00f6":"o","\u00fc":"u","\u00ff":"y","\u00e2":"a","\u00ea":"e","\u00ee":"i","\u00f4":"o","\u00fb":"u","\u00e5":"a","\u00e3":"a","\u00f8":"o","\u00f5":"o",u:"u","\u00c1":"A","\u00c9":"E", "\u00cd":"I","\u00d3":"O","\u00da":"U","\u00ca":"E","\u00d4":"O","\u00dc":"U","\u00c3":"A","\u00d5":"O","\u00c0":"A","\u00c7":"C"};return this.replace(/[\u00e0-\u00fa]/ig,function(a){return"undefined"!=typeof b[a]?b[a]:a})});
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});

var updateHeight;
(function(qdWindow, $){
	"use strict";
	var allowExec = true;
	// Redirecionando caso esteja dentro de um iframe
	try{
		if(window.parent.location.href != window.location.href)
			window.location.href = window.parent.location.href;
	}
	catch(e){
		allowExec = false;
		console.error(e);
	}
	if(!allowExec)
		return false;

	$(function(){
        var tabIndex = 1;
        var messagesExchaged;
        var mappedIImgs = [];
        mappedIImgs['iframe1'] = {};
        var generateTab, generateTabContent, generateFinalCode, setTabsDraggable, initRemoveBtn;
        
        // Inicia ação de DragNDrop
        setTabsDraggable = function() {
            new Sortable(document.getElementById("tab-list"),{
                draggable: ".draggable",
                onEnd: function(evt) {
                    $(window).trigger('QD_orderChanged');
                }
            });
        };

        // Gera nova tab
        generateTab = function(elem) {
            var li = $(elem).closest('li');
            var newTab = li.clone().addClass('draggable');
            var newTabId = tabIndex++;

            newTab.attr('data-index', newTabId);
            newTab.find('a').attr({
                'href': '#imagem' + newTabId,
                'aria-controls': 'imagem' + newTabId,
                'role': 'tab',
                'data-toggle': 'tab'
            }).text('Imagem ' + newTabId).attr('id', '').append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
            newTab.insertBefore(li);

            $('#tab-list li').removeClass('active');

            $('a[data-toggle="tab"] span').removeClass('removeTab');
            newTab.addClass('active').find('span').addClass('removeTab');
            $(window).trigger('QD_orderChanged');

            newTab.on('shown.bs.tab', function (e) {
                $('a[data-toggle="tab"] span').removeClass('removeTab').unbind('click');
                $(e.target).find('span').addClass('removeTab');
                initRemoveBtn();
            });
            initRemoveBtn();
        };

        // Gera conteúdo da tab
        generateTabContent = function(elem) {
            $('.qd-loading').show();

            var newTabId = parseInt($(elem).closest('li').prev('li').attr('data-index'));
            var newTabContent = $('<div role="tabpanel" class="tab-pane">').attr('id', 'imagem' + newTabId);
            var iframeId = 'iframe' + newTabId;

            newTabContent.append($('<iframe src="iframe.html" class="iframeContent" width="100%" frameborder="0" onload="updateHeight(this)">').attr('id', iframeId));
            newTabContent.appendTo($('.tab-content'));

            $('.tab-pane').removeClass('active');
            newTabContent.addClass('active');
            mappedIImgs[iframeId] = {};

        };

        // Gera código HTML completo
        generateFinalCode = function() {
            var finalCode = '<div class="qd-dm-mag-wrapper" style="display:none;">\n<div class="b-load">\n';
            $('#tab-list li.draggable').each(function() {
                finalCode += $('<div>').addClass('qd-dm-page').html("\n" + mappedIImgs['iframe' + $(this).attr('data-index')].html + "\n").prop('outerHTML');
                finalCode +=  "\n";
            });
            finalCode += '</div>\n</div>';

            // console.log(finalCode);
            $('#saveCode').val(finalCode);
            $('#modal-codigo-pronto').modal();
        };

        // Evento do botão de upload de código
        $('#btnLoadCode').on("click", function(e) {
            e.preventDefault();
            var code = $('#uploadCode').val().trim().replace(/\r?\n|\r/g, '');
            
            $(code).find('.qd-dm-page').each(function() {
                $('#addTab').trigger("click");
                var message = {
                    action: 'loadCode',
                    iframeId: $('.iframeContent').last().attr('id'),
                    imageSrc: $(this).find('img')[0].src,
                    mapAreas: []
                };

                $(this).find('area').each(function() {
                    message.mapAreas.push({
                        coords: this.coords,
                        href: this.href
                    });
                });


                document.getElementById(message.iframeId).onload= function() {
                    document.getElementById(message.iframeId).contentWindow.postMessage(JSON.stringify(message), '*');
                };
            });
            $('#modal-codigo').modal('hide');
        });
        
        // Trata botão de excluir aba
        initRemoveBtn = function() {
            $('span.removeTab').on('click', function(e){
                e.preventDefault();
                if (!confirm("Deseja remover esta aba?")) 
                return;
                
                var li = $(this).closest('li');
                $('#imagem' + li.attr('data-index')).remove();
                li.remove();
                
                $('li.draggable a').trigger('click');
                $(window).trigger('QD_orderChanged');
            });
        };
        
        // Evento do botão de adicionar tab
        $('#addTab').on("click", function(e){
            e.preventDefault();
            generateTab(this);
            generateTabContent(this);
            setTabsDraggable();
        });

        // Solicita altura do iframe
        updateHeight = function (iframeId) {
            // Atribui o id ao iframe
            document.getElementById(iframeId.id).contentWindow.postMessage(JSON.stringify({myId: iframeId.id}), '*');

            $('.qd-loading').hide();
        };
        
        // Trata botão de upload do código
        $('#uploadHTML').on('click', function(e){
            e.preventDefault();
            if (!confirm("Todas as abas serão reiniciadas.\nDeseja continuar assim mesmo?")) 
                return;
            
            // Remove outras abas
            $('#tab-list li.draggable').remove();
            $('.tab-pane').remove();

            $('#modal-codigo').modal();
        });
        
        // Trata botão de gerar HTML
        $('#generateHTML').on('click', function(e){ 
            e.preventDefault();
            
            messagesExchaged = 0;
            $('.iframeContent').each(function() {
                var message = {
                   iframeId: this.id 
                };
                document.getElementById(this.id).contentWindow.postMessage(JSON.stringify(message), '*');
                messagesExchaged++;
            });
        });

        // Ativa botão para remover tab quando ativada
        $('li.draggable').on('shown.bs.tab', function (e) {
            $('a[data-toggle="tab"] span').removeClass('removeTab').unbind('click');
            $(e.target).find('span').addClass('removeTab');
            initRemoveBtn();
        });

        // Atualiza nome das abas
        $(window).on('QD_orderChanged', function() { 
            var liList = $('#tab-list li.draggable')
            for (let i = 0; i < liList.length; i++) {
                let span = $(liList[i]).find('a span');
                let text = 'Página ' + i;
                
                if(i == 0)
                    text = 'Capa';
                
                $(liList[i]).find('a').text(text).append(span);
            }
        });

        // Trata mensagens recebidas
        $(window).on('QD_messageReceived', function(e, msg) {
            var data = JSON.parse(msg.data);
            if(data.event == 'loading') {
                if(data.mode =='start')
                    $('.qd-loading').show();
                else
                    $('.qd-loading').hide();

                return;
            }

            if(data.error) {
                alert('Erro: ' + data.error);
                return;
            }

            if(data.height) {
                $('#' + data.iframe).height(data.height + 50);
                return;
            }

            mappedIImgs[data.iframeId].html = data.HTML;
            
            messagesExchaged--;
            if(messagesExchaged < 1)
                generateFinalCode();
        });

        $('#addTab').trigger('click');
        initRemoveBtn();
	});


    
    // Funções com os eventos do postMessage
	try{
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
		eventer(messageEvent, function (e) {
			$(window).trigger('QD_messageReceived', e);
		}, false);
	}
	catch(e){
		if (typeof console !== "undefined" && typeof console.warn === "function")
			console.warn("Ooops, algo deu errado com a comunicação entre Vtex >> Blog.", e.message);
	}
	// Confirmar ao sair da janela
	qdWindow.onbeforeunload = function(){
		return "Se você sair desta página todos os seus dados serão perdidos. Faça uma cópia para sua máquina! Deseja sair da página?";
	};
})(this, jQuery);