var $ = jQuery = require("./js/jquery-2.1.4.min.js");
var Hammer = require('./js/hammer.min.js');
hljs.initHighlightingOnLoad();

var md = require('./js/markdown-it.min.js')({
	html: true,
	linkify: true,
	typographer: true,
	highlight: function(str, lang) {
		lang = lang.split(":")[0];
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}

		try {
			return hljs.highlightAuto(str).value;
		} catch (__) {}

		return ''; // use external default escaping
	}
});
var mdEditor = CodeMirror.fromTextArea(document.getElementById('editor_textarea'), {
	mode: "markdown",
	autofocus: true,
	lineNumbers: true,
	indentUnit: 4,
	extraKeys: {
		"Enter": "newlineAndIndentContinueMarkdownList"
	},
});

function adjustWindow() {
	var h = $(window).height();
	var hHeader = $("#nav_toolbar").height();
	var hFooter = $("#footer").height();
	$('html').css('height', h - hHeader - hFooter - 5); //可変部分の高さを適用
}

var editorVm, toolbarVm, footerVm;

$(function() {
	$('div.split-pane').splitPane();
	$(window).on('resize', function() {
		setTimeout(function(){adjustWindow()}, 50);
	});
	editorVm = new Vue({
		el: '#editor',
		data: {
			input: ""
		},
		filters: {
			marked: function(input) {
				var result = md.render(input);
				result = result.replace(/(:[0-9a-zA-Z_\+\-]+?:)/g, " $1 ");
				// console.log(result);
				return emojify.replace(result);
			}
		}
	});
	mdEditor.on(
		'change',
		function() {
			mdEditor.save();
			editorVm.input = $('#editor_textarea').val();
		}
	);

	toolbarVm = new Vue({
		el: '#nav_toolbar',
		data: {},
		methods: {
			load: function(e) {
				loadFile();
			},
			save: function(e) {
				saveFile();
			}
		}
	});

	footerVm = new Vue({
		el: '#footer',
		data: {
			currentPath: ""
		}
	});
});