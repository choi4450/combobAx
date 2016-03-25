/**
 * jQuery Accessible combobox v0.1.0
 * https://github.com/choi4450/jquery.accessiblecombobox
 *
 * Copyright 2015 Gyumin Choi Foundation and other contributors
 * Released under the MIT license
 * https://github.com/choi4450/jquery.accessiblecombobox/blob/master/LICENSE.txt
 */

(function($) {

	$.fn.accessibleComboboxConfig = {
		label: 'Select another option',
		bullet: '',
		style: null,
		animate: false,
		duration: 0,
		easingOpen: null,
		easingClose: null
	};

	$.fn.accessibleCombobox = function(defaults) {

		if (navigator.userAgent.indexOf("MSIE 6") >= 0) return false;

		var config = $.extend({}, $.fn.accessibleComboboxConfig, defaults),
			fn = {},
			dom = {};

		dom.cbo = $(this);
		config.elemId = dom.cbo.attr('id') || '';
		config.elemClass = dom.cbo.attr('class') || '';
		config.elemName = dom.cbo.attr('name') || '';
		config.elemTitle = dom.cbo.attr('title') || '';
		config.elemWidth = dom.cbo.width();
		config.selectedOpt = dom.cbo.find('option:selected');
		config.selectedOptTxt = config.selectedOpt.text();
		config.propDisabled = dom.cbo.prop('disabled');
		config.propRequired = dom.cbo.prop('required');

		fn.replaceCbo = function() {

			var attrGroup = {};
			attrGroup.boxSelector = 'class="' + config.elemClass + ' accessiblecbo';
			attrGroup.boxSelector += config.propDisabled ? ' is-disabled"' : '"';
			attrGroup.boxSelector += config.elemId != '' ? ' id="' + config.elemId + '"' : '';
			attrGroup.btnTitle = config.elemTitle != '' ? 'title="' + config.elemTitle + '"' : '';
			attrGroup.btnLabel = 'aria-label="' + config.label + '"';
			attrGroup.optName = config.elemName != '' ? 'name="' + config.elemName + '"' : '';
			attrGroup.boxRequired = config.propRequired ? 'aria-required="true"' : '';
			attrGroup.optRequired = config.propRequired ? 'required="required"' : '';
			attrGroup.btnDisabled = config.propDisabled ? 'aria-disabled="true" tabindex="-1"' : '';
			attrGroup.optDisabled = config.propDisabled ? 'disabled="disabled"' : '';

			var addOptionHtmlStr = function(element) {
				var returnHtmlStr = '';
				element.each(function(_i) {
					var $this = $(this),
						thisAttrVal = $this.val() ? 'value="' + $this.val() + '"' : '',
						selectedClass = '',
						selectedAttr = '';

					if ($this.prop('selected')) {
						selectedClass = $this.prop('selected') ? ' is-selected' : '';
						selectedAttr = $this.prop('selected') ? 'checked="checked"' : '';
					}

					returnHtmlStr +=
						'<label class="accessiblecbo-opt' + selectedClass + '">' +
						'<input type="radio" class="accessiblecbo-opt-radio" ' + attrGroup.optName + ' ' + thisAttrVal + ' ' + attrGroup.optDisabled + ' ' + attrGroup.optRequired + ' ' + selectedAttr + '>' +
						'<span class="accessiblecbo-opt-txt">' + $this.text() + '</span>' +
						'</label>';
				});

				return returnHtmlStr;
			};

			var replaceHtmlStr =
				'<span ' + attrGroup.boxSelector + ' role="menu" aria-live="polite" aria-relevant="all" aria-haspopup="true" aria-expanded="false" style="width: ' + config.elemWidth + 'px;" ' + attrGroup.btnDisabled + ' ' + attrGroup.boxRequired + '>' +
				'<a href="#" class="accessiblecbo-btn" role="button" aria-live="off" ' + attrGroup.btnTitle + ' ' + attrGroup.btnLabel + ' ' + attrGroup.btnDisabled + '>' +
				'<span class="accessiblecbo-btn-txt">' + config.selectedOptTxt + '</span>' +
				'<span class="accessiblecbo-btn-bu" aria-hidden="true">' + config.bullet + '</span>' +
				'</a>' +
				'<span class="accessiblecbo-listbox" role="radiogroup" aria-hidden="true" ' + attrGroup.boxRequired + '>' +
				'<span class="accessiblecbo-listbox-wrap">';

			dom.cbo.find('>*').each(function(_i) {
				var $this = $(this);

				if ($this.is('optgroup')) {
					replaceHtmlStr +=
						'<span class="accessiblecbo-optgroup" role="radiogroup">' +
						'<em class="accessiblecbo-optgroup-tit">Optgroup</em>' +
						addOptionHtmlStr($this.find('option')) +
						'</span>';
				} else {
					replaceHtmlStr +=
						addOptionHtmlStr($this);
				}
			});

			replaceHtmlStr +=
				'</span>' +
				'</span>' +
				'</span>';

			var replaceHtml = $(replaceHtmlStr);
			dom.cbo.replaceWith(replaceHtml);

			dom.cbo = replaceHtml;
			dom.cboBtn = dom.cbo.find('.accessiblecbo-btn');
			dom.cboBtnTxt = dom.cboBtn.find('.accessiblecbo-btn-txt');
			dom.cboListbox = dom.cbo.find('.accessiblecbo-listbox');
			dom.cboOpt = dom.cboListbox.find('.accessiblecbo-opt');
			dom.cboOptRadio = dom.cboOpt.find('.accessiblecbo-opt-radio');

		};

		fn.toggleExpandCbo = function(action) {

			if (typeof action == 'undefined') action = 'toggle';

			var propExpanded = dom.cbo.attr('aria-expanded'),
				setOpenExpanded = function() {
					dom.cbo.attr('aria-expanded', 'true').addClass('is-expanded');
					dom.cboListbox.attr('aria-hidden', 'false');
					dom.cboOptRadio.filter(':checked').focus();
				},
				setCloseExpanded = function() {
					dom.cbo.attr('aria-expanded', 'false').removeClass('is-expanded');
					dom.cboListbox.attr('aria-hidden', 'true');
				},
				returnBoolChkAction = function(chk) {
					return action == 'toggle' || action == chk;
				};

			if (returnBoolChkAction('open') && propExpanded == 'false') {
				setOpenExpanded();
				setTimeout(function() {
					$(document).one('click.accessibleCbo-closeExpanded', function(e) {
						if (dom.cbo.has(e.target).length < 1) setCloseExpanded();
					});
				}, 0);
			} else if (returnBoolChkAction('close') && propExpanded == 'true') {
				setCloseExpanded();
				$(document).off('.accessibleCbo-closeExpanded');
			}

		};

		fn.activeOpt = function(element, change) {
			var thisOpt = element,
				thisOptRadio = thisOpt.find('.accessiblecbo-opt-radio');

			if (typeof change == 'undefined') change = true;

			dom.cboOpt.removeClass('is-selected');
			thisOpt.addClass('is-selected');

			if (change == true) {
				thisOptRadio.focus().prop('checked', true);
				dom.cboBtnTxt.text(thisOptRadio.siblings('.accessiblecbo-opt-txt').text());
			}
		};

		fn.replaceCbo();

		dom.cboBtn.on('click', function(e) {
			e.preventDefault();
			if (e.type != 'keydown' || e.keyCode === 13 || e.keyCode === 32) {
				if (!config.propDisabled) {
					fn.toggleExpandCbo();
				}
			}
		});
		dom.cboOpt.on({
			mouseover: function(e) {
				var $this = $(this);
				fn.activeOpt($this, false);
			},
			mousedown: function(e) {
				var $this = $(this);
				fn.activeOpt($this);
				fn.toggleExpandCbo('close');
			}
		});
		dom.cboOptRadio.on('keydown', function(e) {
			var $this = $(this);

			if (e.keyCode === 9 || e.keyCode === 13) {
				e.preventDefault();

				dom.cboBtn.focus();
				fn.toggleExpandCbo('close');
			} else if (e.keyCode >= 37 && e.keyCode <= 40) {
				e.preventDefault();

				var thisOpt = $this.parent('.accessiblecbo-opt'),
					thisOptIdx = dom.cboOpt.index(thisOpt),
					controlsOpt,
					allOptLen = dom.cboOpt.length,
					listboxHeight = dom.cboListbox.height(),
					listboxOffsetTop = dom.cboListbox.offset().top,
					listboxScrollTop = dom.cboListbox.scrollTop();

				if (e.keyCode >= 37 && e.keyCode <= 38) {
					if (thisOptIdx == 0) controlsOpt = dom.cboOpt.last();
					else controlsOpt = dom.cboOpt.eq(thisOptIdx - 1);
				} else if (e.keyCode >= 39 && e.keyCode <= 40) {
					if (thisOptIdx == (allOptLen - 1)) controlsOpt = dom.cboOpt.first();
					else controlsOpt = dom.cboOpt.eq(thisOptIdx + 1);
				}

				var controlsOptHeight = controlsOpt.height(),
					controlsOptOffsetTop = controlsOpt.offset().top - listboxOffsetTop + listboxScrollTop;

				setTimeout(function() {
					fn.activeOpt(controlsOpt);

					if (controlsOptOffsetTop >= (listboxHeight + listboxScrollTop)) {
						dom.cboListbox.scrollTop(controlsOptOffsetTop - (listboxHeight - controlsOptHeight));
					} else if (controlsOptOffsetTop < listboxScrollTop) {
						dom.cboListbox.scrollTop(controlsOptOffsetTop);
					}
				}, 0);
			}
		});

	};

	$(function() {
		$('select[data-accessiblecbo]').each(function() {
			var $this = $(this),
				argumentStr = $this.attr('data-accessiblecbo'),
				argumentObj = eval('({' + argumentStr + '})');
			$this.accessibleCombobox(argumentObj);
		});
	});

}(jQuery));
