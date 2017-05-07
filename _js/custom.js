(function ($) {

	"use strict";

	var javadocToMarkdown = new JavadocToMarkdown();

	function startConverter() {
		$("div.jumbotron").slideUp(400);
	}

	function showConvertedCode(language, headingsLevel, code) {
		var output,
			outputBox;

		outputBox = $("#results");
		output = javadocToMarkdown.convertCode(language, code, headingsLevel)

		outputBox.text(output);
		outputBox.parent().slideDown(400);
	}

	function setLanguage(language) {
		$("label[for='javadoc-to-markdown-code']").text(language);
		$("#javadoc-to-markdown-code").attr("placeholder", "Paste your code that contains "+language+" ...");
	}

	$(document).ready(function () {
		$("textarea.expand").focus(function () {
			$(this).animate({ rows: "15" }, 200);
		});

		$("#javadoc-to-markdown-language").click(function () {
			setLanguage($(this).val());
		});

		$("#btn-start").click(function (e) {
			startConverter();
			e.preventDefault();
		});

		$("#javadoc-to-markdown-form").submit(function (e) {
			var code,
				headingsLevel,
				language,
				resultsContainer;
			language = $(this).find("#javadoc-to-markdown-language").val();
			headingsLevel = parseInt($(this).find("#javadoc-to-markdown-headings").val());
			code = $(this).find("#javadoc-to-markdown-code").val();

			showConvertedCode(language, headingsLevel, code);

			resultsContainer = $("#results");
			resultsContainer.scrollTop(0);

			scrollToElement(resultsContainer.parent());

			e.preventDefault();
		});

		$("#btn-options").click(function (e) {
			$("#hidden-options").slideDown(400);
			scrollToElement($("#javadoc-to-markdown-form"));

			e.preventDefault();
		});

		$("#btn-select-all").click(function (e) {
			var results = $("#results");
			selectText(results[0]);

			e.preventDefault();
		});
	});

	function scrollToElement(element) {
		$("html, body").animate({
			scrollTop: element.offset().top
		}, 400);
	}

	/**
	 * @author Jason (Stack Overflow)
	 */
	function selectText(element) {
		var doc = document,
			range,
			selection;

		if (doc.body.createTextRange) { // MS
			range = doc.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		}
		else if (window.getSelection) { // all others
			selection = window.getSelection();
			range = doc.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

})(jQuery);
