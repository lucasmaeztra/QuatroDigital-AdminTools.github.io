$(document).on('ready', function(){
    schema = {
      "title": "Person",
      "type": "object",
      "properties": {
        "images": {
          "type": "array",
          "format": "table",
          "title": "Imagens",
          "uniqueItems": false,
          "items": {
            "type": "object",
            "title": "Imagem",
            "properties": {
              "size": {
                "title": "Tamanho",
                "type": "string",
                "enum": [
                    "50% da linha",
                    "25% da linha"
                ],
                "default": "col-6"
              },
              "imageUrl": {
                "title": "Link da imagem",
                "type": "string"
              },
              "text": {
                "title": "Texto da imagem",
                "type": "string"
              },
              "link": {
                "title": "Url de Redirecionamento",
                "type": "string"
              }
            }
          },
          "default": [
            {
              "size": "50% da linha",
              "imageUrl": "https://i.imgur.com/imagem.jpg",
              "text": "Olá, sou uma imagem",
              "link": "/produto"
            }
          ]
        }
      }
    };

    var lang = window.location.href.split("?")[2] || navigator.language.split("-")[0] || navigator.userLanguage.split("-")[0];

    var editorLanguages = {
        default: {
            button_add_row_title: "Adicionar {{0}}",
            button_delete_last_title: "Deletar último {{0}}",
            button_delete_last: "Último {{0}}",
            button_delete_all_title: "Deletar todos",
            button_delete_all: "Todos",
            button_delete_row_title: "Deletar {{0}}",
            error_uniqueItems: "Os itens devem ser únicos"
        },
        "en": {
            button_add_row_title: "Add {{0}}",
            button_delete_last_title: "Delete last {{0}}",
            button_delete_last: "Last {{0}}",
            button_delete_all_title: "Delete all",
            button_delete_all: "All",
            button_delete_row_title: "Delete {{0}}",
            error_uniqueItems: "Items must be unique"
        }
    };

    $.extend(true, JSONEditor.defaults.languages.en, editorLanguages[lang] || editorLanguages.default);

    var jsoneditor;

    $('#setvalue').click(function() {
        if(confirm("Atenção, essa ação irá alterar todo o conteúdo editado!")){
            try{
                jsoneditor.setValue(JSON.parse($('#input').val()));
                $('.import-toggle').click();
                $(this).parent().removeClass('has-error');
            } catch(e){
                $(this).parent().addClass('has-error');
            }
        }
    });

    $('.import-toggle').click(function(){
        $('.json-qd-v1-import-field').toggle(500);
    });
    
    $('.qd-change-store').click(function(){
        $('.json-qd-v1-change-store').toggle(500);
    });

    $('#output + button').click(function(){
        $('#output').select();
        document.execCommand('copy');
    });

    $('.json-qd-v1-delete-all').click(function(){
        if(confirm("Certeza que deseja apagar o conteúdo?\nTodas alterações não salvas serão apagadas!"))
            $('.json-editor-btn-delete').last().click();
    });

    var htmlSample = '<div class="col-xs-12 col-md-{{size}}"> <div class="mosaic-qd-v1-wrapper"> <div class="mosaic-qd-v1-legend"> <a href="{{link}}"> <span>{{text}}</span> </a> </div><div class="mosaic-qd-v1-image"> <img src="{{imageUrl}}" class="img-responsive"> </div></div></div>'

    $('.json-qd-v1-output-field-button').click(function(){
        $('.json-qd-v1-output-field').show(500);
        var json = jsoneditor.getValue();
        var finalCode = "";
        for(var i = 0, image; image = json.images[i]; i++){
            image.size = (image.size.match('50%') == null)?'col-3':'col-3';
            finalCode += htmlSample.replace(/{{size}}/g, image.size.match(/\d/g)).replace(/{{link}}/g, image.link).replace(/{{imageUrl}}/g, image.imageUrl).replace(/{{text}}/g, image.text);
        }
        $('#output').val(finalCode);
    });

    if(jsoneditor) jsoneditor.destroy();
    jsoneditor = new JSONEditor($('#editor')[0], {
        schema: schema,
        theme: "bootstrap3",
        iconlib: "fontawesome4",
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
        no_additional_properties: true
    });

    $(window).on('beforeunload', function (e) {
        e = e || window.event;

        if (e) {
            e.returnValue = 'Certeza que deseja sair?\nAlterações não salvas serão apagadas!';
        }

        return 'Certeza que deseja sair?\nAlterações não salvas serão apagadas!';
    });
});