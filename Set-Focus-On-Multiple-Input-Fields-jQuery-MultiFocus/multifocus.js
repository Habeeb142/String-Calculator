(function($){
	function MultiFocus(selector) {
		var scope = this;
		scope.selector = selector;
		var selectors = scope.selector.split(/\s+/);
		scope.parentSelector = selectors.slice(0, selectors.length - 1).join(" ");

		var lastSelector = selectors[selectors.length - 1];
		// Make sure to start with a class
		scope.selector = scope.parentSelector + " " + lastSelector.slice(lastSelector.indexOf("."));
	}

	MultiFocus.CSS = "$selector$.fake-container{ $input_css$ position: relative; cursor: text;} $selector$:not(.fake-container){ opacity: 0; position: absolute; pointer-events: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } $selector$.fake-container .fake-input{ white-space: pre; position: absoluterelative; left: 0; top: 0; border-right: solid 1px transparent;animation: blinkingCaret 1.2s infinite;} @keyframes blinkingCaret{ 33%{border-right-color: black} 66%{border-right-color: black} }"

	MultiFocus.prototype.init = MultiFocus.prototype.reload = function () {
		var scope = this;

		var $focusableInputs = $(scope.selector);
		var style, $fakeContainers, $focusInput, currentValue;
		var cancel = false;

		$focusableInputs.focus(function (e) {
			$focusInput = $(e.target);
			oldValue = $focusInput.val();
			currentValue = oldValue;

			$style = injectStyle($focusInput);

			$focusableInputs.each(function (index, el) {
				$input = $(el);
				replaceInputByFake($input);
			});
			$fakeContainers = $focusableInputs.siblings('.fake-container');
			var $fakeInputs = $fakeContainers.children('.fake-input');
			$fakeInputs.html(currentValue);


			// Add edit event
			$focusInput.on("keypress.MultiFocus", function (e) {
				currentValue += String.fromCharCode(e.charCode || e.keyCode);
				$fakeInputs.html(currentValue);
			});

			$focusInput.on("keydown.MultiFocus", function (e) {
				switch (e.keyCode) {
					case 27:
						cancel = true;
					case 13:
						$focusInput.blur();
						break;
					case 8 : // Backspace
						currentValue = currentValue.slice(0, currentValue.length - 1);
						$fakeInputs.html(currentValue);
						break;
				}
			});

			$focusInput.on('paste.MultiFocus', (e)=>{
				var clipboardStack = e.originalEvent.clipboardData.items;
				if (clipboardStack.length){
					currentValue += e.originalEvent.clipboardData.getData(clipboardStack[0].type);
					$fakeInputs.html(currentValue);
				}
			});
		});

		$focusableInputs.blur(function (e) {
			if ($fakeContainers)
				$fakeContainers.remove();
			$focusInput.off(".MultiFocus");
			$style.remove();
			if (cancel) {
				$focusInput.val(oldValue);
				cancel = false;
			} else {
				$focusableInputs.val(currentValue);
			}
		});

		function injectStyle($input) {
			var inputStyle = getComputedStyle($input[0]);
			$("head").append("<style id='multiFocusCSS'></style>");
			var $style = $("style#multiFocusCSS");
			$style.html(MultiFocus.CSS
				.replace(/\$selector\$/g, scope.selector)
				.replace(/\$input_css\$/g, inputStyle.cssText));

			return $style;
		}

		function replaceInputByFake($input) {
			var $fakeContainer = $("<div><span class='fake-input'></span></div>");
			$fakeContainer.addClass($input.attr("class") + " fake-container");
			$input.after($fakeContainer);
			return $fakeContainer;
		}

		return scope;
	};

	MultiFocus.prototype.remove = function () {
		$(this.selector).off();
	};

	$.multiFocus = function (selector) {
		return new MultiFocus(selector);
	};
}(jQuery))