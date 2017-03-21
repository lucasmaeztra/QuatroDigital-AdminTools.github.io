/**
* Funções base
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
"function"!==typeof String.prototype.replaceSpecialChars&&(String.prototype.replaceSpecialChars=function(){var b={"\u00e7":"c","\u00e6":"ae","\u0153":"oe","\u00e1":"a","\u00e9":"e","\u00ed":"i","\u00f3":"o","\u00fa":"u","\u00e0":"a","\u00e8":"e","\u00ec":"i","\u00f2":"o","\u00f9":"u","\u00e4":"a","\u00eb":"e","\u00ef":"i","\u00f6":"o","\u00fc":"u","\u00ff":"y","\u00e2":"a","\u00ea":"e","\u00ee":"i","\u00f4":"o","\u00fb":"u","\u00e5":"a","\u00e3":"a","\u00f8":"o","\u00f5":"o",u:"u","\u00c1":"A","\u00c9":"E", "\u00cd":"I","\u00d3":"O","\u00da":"U","\u00ca":"E","\u00d4":"O","\u00dc":"U","\u00c3":"A","\u00d5":"O","\u00c0":"A","\u00c7":"C"};return this.replace(/[\u00e0-\u00fa]/ig,function(a){return"undefined"!=typeof b[a]?b[a]:a})});
Array.prototype.indexOf||(Array.prototype.indexOf=function(d,e){var a;if(null==this)throw new TypeError('"this" is null or not defined');var c=Object(this),b=c.length>>>0;if(0===b)return-1;a=+e||0;Infinity===Math.abs(a)&&(a=0);if(a>=b)return-1;for(a=Math.max(0<=a?a:b-Math.abs(a),0);a<b;){if(a in c&&c[a]===d)return a;a++}return-1});

try {
	var Common = {
		run: function() {
		},
		init: function() {
			Common.changeColors();
			Common.cacheInputsSelectors();
			Common.initialColors();
			Common.setColors();
		},
		ajaxStop: function() {},
		windowOnload: function() {},
		cacheInputsSelectors: function() {
			Common.inputs = [null];
			Common.inputs.push($("input#Color-1"));
			Common.inputs.push($("input#Color-2"));
			Common.inputs.push($("input#Color-3"));
			Common.inputs.push($("input#Color-4"));
			Common.inputs.push($("input#Color-5"));
			Common.inputs.push($("input#Color-6"));
			Common.inputs.push($("input#Color-7"));
			Common.inputs.push($("input#Color-8"));
			Common.inputs.push($("input#Color-9"));
			Common.inputs.push($("input#Color-10"));
			Common.inputs.push($("input#Color-11"));
			Common.inputs.push($("input#Color-12"));
		},
		initialColors: function() {
			var colors = [];
			colors.push("#E1061A");
			colors.push("#FFCC33");
			colors.push("#B1B1B1");
			colors.push("#1CDEDE");
			colors.push("#44C60B");
			colors.push("#BEBEBE");
			colors.push("#FFFFFF");
			colors.push("#FFFFFF");
			colors.push("#FFFFFF");
			colors.push("#FFFFFF");
			colors.push("#262626");
			colors.push("#FFFFFF");

			var newColors = ($.bbq.getState("colors") || "").split(",");

			colors[0] = newColors[0] || colors[0];
			colors[1] = newColors[1] || colors[1];
			colors[2] = newColors[2] || colors[2];
			colors[3] = newColors[3] || colors[3];
			colors[4] = newColors[4] || colors[4];
			colors[5] = newColors[5] || colors[5];
			colors[6] = newColors[6] || colors[6];
			colors[7] = newColors[7] || colors[7];
			colors[8] = newColors[8] || colors[8];
			colors[9] = newColors[9] || colors[9];
			colors[10] = newColors[10] || colors[10];
			colors[11] = newColors[11] || colors[11];

			$.bbq.pushState({colors: colors.join(",")});
		},
		colorsToText: function() {
			function hexc(colorval) {
				var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				delete(parts[0]);
				for (var i = 1; i <= 3; ++i) {
					parts[i] = parseInt(parts[i]).toString(16);
					if (parts[i].length == 1)
						parts[i] = '0' + parts[i];
				}
				return '#' + parts.join('');
			};

			var elem = $('.pallet-box');
			less.pageLoadFinished.then(function() {
				elem.each(function() {
					var $t = $(this);
					var color = $t.find('.hex-color');
					if(!color.length)
						color = $('<div class="hex-color"></div>').appendTo($t);

					color.text(hexc($t.css('backgroundColor')).toUpperCase());
				});
			});
		},
		setColors: function() {
			var set = function() {
				var colors = $.bbq.getState("colors").split(",");
				colors.unshift(null);

				less.modifyVars({
					"@color-1": colors[1],
					"@color-2": colors[2],
					"@color-3": colors[3],
					"@color-4": colors[4],
					"@color-5": colors[5],
					"@color-6": colors[6],
					"@color-7": colors[7],
					"@color-8": colors[8],
					"@color-9": colors[9],
					"@color-10": colors[10],
					"@text-color-1": colors[11],
					"@text-color-2": colors[12]
				});

				Common.inputs[1].val(colors[1]).change();
				Common.inputs[2].val(colors[2]).change();
				Common.inputs[3].val(colors[3]).change();
				Common.inputs[4].val(colors[4]).change();
				Common.inputs[5].val(colors[5]).change();
				Common.inputs[6].val(colors[6]).change();
				Common.inputs[7].val(colors[7]).change();
			Common.colorsToText();
				Common.inputs[8].val(colors[8]).change();
				Common.inputs[9].val(colors[9]).change();
				Common.inputs[10].val(colors[10]).change();
				Common.inputs[11].val(colors[11]).change();
				Common.inputs[12].val(colors[12]).change();
			};

			set();
			$(window).hashchange(set);
		},
		changeColors: function() {
			$(".colorsForm input").on("keyup change", function(){
				var $t = $(this);
				var value = $t.val() || "";

				if(value.length < 7)
					return;
				
				Common.setHashHistory();

				$t.parent().css("background", value);
			});
		},
		setHashHistory: function() {
			var colors = [];
			colors.push(Common.inputs[1].val());
			colors.push(Common.inputs[2].val());
			colors.push(Common.inputs[3].val());
			colors.push(Common.inputs[4].val());
			colors.push(Common.inputs[5].val());
			colors.push(Common.inputs[6].val());
			colors.push(Common.inputs[7].val());
			colors.push(Common.inputs[8].val());
			colors.push(Common.inputs[9].val());
			colors.push(Common.inputs[10].val());
			colors.push(Common.inputs[11].val());
			colors.push(Common.inputs[12].val());

			$.bbq.pushState({colors: colors.join(",")});
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