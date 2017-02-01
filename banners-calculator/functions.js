/**
* Funções base
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
"function"!==typeof String.prototype.replaceSpecialChars&&(String.prototype.replaceSpecialChars=function(){var b={"\u00e7":"c","\u00e6":"ae","\u0153":"oe","\u00e1":"a","\u00e9":"e","\u00ed":"i","\u00f3":"o","\u00fa":"u","\u00e0":"a","\u00e8":"e","\u00ec":"i","\u00f2":"o","\u00f9":"u","\u00e4":"a","\u00eb":"e","\u00ef":"i","\u00f6":"o","\u00fc":"u","\u00ff":"y","\u00e2":"a","\u00ea":"e","\u00ee":"i","\u00f4":"o","\u00fb":"u","\u00e5":"a","\u00e3":"a","\u00f8":"o","\u00f5":"o",u:"u","\u00c1":"A","\u00c9":"E", "\u00cd":"I","\u00d3":"O","\u00da":"U","\u00ca":"E","\u00d4":"O","\u00dc":"U","\u00c3":"A","\u00d5":"O","\u00c0":"A","\u00c7":"C"};return this.replace(/[\u00e0-\u00fa]/ig,function(a){return"undefined"!=typeof b[a]?b[a]:a})});
Array.prototype.indexOf||(Array.prototype.indexOf=function(d,e){var a;if(null==this)throw new TypeError('"this" is null or not defined');var c=Object(this),b=c.length>>>0;if(0===b)return-1;a=+e||0;Infinity===Math.abs(a)&&(a=0);if(a>=b)return-1;for(a=Math.max(0<=a?a:b-Math.abs(a),0);a<b;){if(a in c&&c[a]===d)return a;a++}return-1});

try {
	var Common = {
		run: function() {},
		init: function() {
			Common.parseUrl();
			Common.setTitleCols();
			Common.bannerChangeCol();
			Common.setInitBannersCol();
			Common.bannerHeight();
			Common.formCancel();
		},
		ajaxStop: function() {},
		windowOnload: function() {},
		parseUrl: function() {
			var query = JSON.parse('{"' +  location.search.replace("?", "").replace(/\=/ig, '":"').replace(/\&/ig, '","') + '"}');
			
			var link = $('<link rel="stylesheet" href="' + query.bootstrap + '" id="bootstrapcss">');
			link.load(function() {
				Common.updateInfo();
			});
			$("head").append(link);
			
			$(document.body).attr("data-cols", query.cols);
			Common.cols = query.cols;
		},
		setTitleCols: function() {
			$(".full-line").addClass("col-xs-" + Common.cols);
		},
		setInitBannersCol: function() {
			$(".banner-wrapper .cols").val("col-xs-" + (Common.cols / 2)).change();
		},
		bannerChangeCol: function() {
			$(".cols").change(function() {
				var $t = $(this);
				$t.getParent(".banner-wrapper").attr("class", "banner-wrapper " + $t.val());
				Common.updateInfo();
			});
		},
		bannerHeight: function() {
			$(".banner-height").val("100px").change(function() {
				var $t = $(this);
				$(".banner-wrapper form").height($t.val());
				Common.updateInfo();
			}).change();
		},
		updateInfo: function() {
			$(".banner-wrapper form").each(function() {
				var $t = $(this);

				$t.find(".banner-info-w").text($t.outerWidth() + "px");
				$t.find(".banner-info-h").text($t.outerHeight() + "px");
			});
		},
		formCancel: function() {
			$("form").submit(function() {
				return false;
			});
		}
	};
}
catch (e) {(typeof console !== "undefined" && typeof console.error === "function" && console.error("Houve um erro nos objetos. Detalhes: " + e.message)); }

try {
	(function() {
		var body, ajaxStop, windowLoad;

		windowLoad = function() {
			Common.windowOnload();
		};

		ajaxStop = function() {
			Common.ajaxStop();
		};

		$(function() {
			body = $(document.body);
			Common.init();
			$(document).ajaxStop(ajaxStop);
			$(window).load(windowLoad);
			body.addClass('jsFullLoaded');
		});

		Common.run();
	})();
}
catch (e) {(typeof console !== "undefined" && typeof console.error === "function" && $("body").addClass('jsFullLoaded jsFullLoadedError') && console.error("Houve um erro ao iniciar os objetos. Detalhes: " + e.message)); }

/* Versão Minimizada */
/* $("a").getParent("ul"); // 2.0 // Carlos Vinicius [ QUATRO DIGITAL ] // MIT */
(function(b){b.fn.getParent=function(c){var a;a=b(this);if(1>a.length)return a;a=a.parent();return a.is("html")?b(""):a.is(c)?a.filter(c):a.length?a.getParent(c):a}})(jQuery);