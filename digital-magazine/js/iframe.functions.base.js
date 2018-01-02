$(function(){
    var myId;

    // Cria nova área via código
    function newArea(id, link, coords) {
        // Trata link
        var a = $('<a>')[0];
        a.href = link;

        if(coords) {
            // Cria nova map área
            myimgmap.addNewArea();
            myimgmap.initArea(id, 'rect');
            // Coloca coordenadas
            myimgmap._recalculate(id, coords);
        }
        
        myimgmap.areas[id].ahref = a.href.replace(a.protocol+'//','').replace(a.host,'').replace('/digital-magazine/', '/');
        
        $('#img_area_' + id).find('input.img_href').val(link);
        myimgmap._repaintAll();
        myimgmap.setMapHTML(myimgmap.getMapHTML());
    }

    // Envia mensagem para atualização da height
    function updateHeight() {
        var message = {
            event: 'resize',
            iframe: myId,
            height: $('body >.container-fluid').height() + 10
        };
        window.parent.postMessage(JSON.stringify(message), '*');
    }

    // Altera a cor da área em destaque
    $(window).on('QD_workingArea QD_onRelaxArea', function(e, id) {
        myimgmap.areas.forEach(function(area) {
            if(area)
                area.style.borderColor = '#D00';
        });
        myimgmap.areas[id].style.borderColor = '#00F';
    });

    // Faz a requisição do link da área
    $(window).on('QD_onDrawedArea', function(e, id) {
        var link = prompt("Informe o link do produto:", $('#img_area_' + id).find('input.img_href').val());
        if (link == null || link == "")
            $(window).trigger('QD_onDrawedArea', id);
        else
            newArea(id, link, false);
    });

    // Solicita alteração do tamanho do iframe quando há alteraração do número de áreas
    $(window).on('scroll click QD_newAreaCreated QD_onRemoveArea', function(e) {
        updateHeight();
    });

    $(document.body).on('load', 'img', function() {
        updateHeight();
    });

    // Carrega imagem
    $(window).on('QD_onLoadImage', function(e, img) {
        var msg = {event: 'loading', mode: 'start'};
        window.parent.postMessage(JSON.stringify(msg), '*');

        $('.imageSelectorWrapper').hide();
        $('.imageEditorWrapper').show();
        $('.imageMappedWrapper').show();
        
        $(img).on('load', function() {
            updateHeight();
            msg.mode = 'stop';
            window.parent.postMessage(JSON.stringify(msg), '*');
        });
    });

    // Carrega elementos via código
    $(window).on('QD_loadByCode', function(e, data) {
        gui_loadImage(data.imageSrc);
        $(window).trigger('QD_imageLoaded');

        var id = 0;
        $(data.mapAreas).each(function() {
            newArea(id, this.href, this.coords);
            id++;
        })
    });

    // Retorna ao estado de escolha da imagem
    $('#changeImage').on("click", function(e) {
        e.preventDefault();
        $('.imageSelectorWrapper').show();
        $('.imageEditorWrapper').hide();
        $('.imageMappedWrapper').hide();
    });
    
    // Altera zoom da imagem
    $('input.radioZoom').on('click', function() {
        $('#dd_zoom').val($(this).val());
        gui_zoom();
    });

    // Funções com os eventos do postMessage
    // Here "addEventListener" is for standards-compliant web browsers and "attachEvent" is for IE Browsers.
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    // Listen to message from child IFrame window
    eventer(messageEvent, function (e) {
        try{
            var data = JSON.parse(e.data);
            // Atribui id do iframe
            if(data.myId) {
                myId = data.myId;
                updateHeight(); 
                return;
            }

            // Criação via código
            if(data.action == 'loadCode') {
                myId = data.iframeId;
                $(window).trigger('QD_loadByCode', data);
                return;
            }

            // Retorna código HTML
            var response = {
                event: 'code',
                iframeId : data.iframeId,
                HTML : myimgmap.getMapHTML(),
                error : myimgmap.error
            };
			window.parent.postMessage(JSON.stringify(response), '*');
        }
        catch (e) {(typeof console !== "undefined" && typeof console.error === "function" && console.error("Problemas :( . Detalhes: ", e)); }
    }, false);
});