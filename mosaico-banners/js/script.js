(function setSizes() {
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    var container = getUrlParameter('largura');
    var containerWidth = parseInt(container);

    if($.isNumeric(containerWidth)) {
        $('.container').removeClass('container').addClass('generic-container').css('width', containerWidth + 'px');
    }

    $('.mosaic-banners [class*="col-"]').each(function () {
        $(this).empty().append($(this).width() + 'px');
    });
})();

$(window).resize(function(){
    setSizes();
});