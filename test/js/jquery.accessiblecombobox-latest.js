/**
 * jQuery Accessible combobox v0.1.1
 * https://github.com/choi4450/jquery.accessiblecombobox
 *
 * Copyright 2015 Gyumin Choi Foundation and other contributors
 * Released under the MIT license
 * https://github.com/choi4450/jquery.accessiblecombobox/blob/master/LICENSE.txt
 */

(function($) {

	$.fn.accessibleComboboxConfig = {
		//style: null,
		//animate: false,
		//duration: 0,
		//easingOpen: null,
		//easingClose: null,
		label: 'Select another option',
		bullet: ''
	};

	$.fn.accessibleCombobox = function(defaults) {

		if (navigator.userAgent.indexOf("MSIE 6") >= 0) return false;

		function init(el) {

			var config = $.extend({}, $.fn.accessibleComboboxConfig, defaults),
				fn = {},
				dom = {};

			dom.cbo = $(el);
			config.elId = dom.cbo.attr('id') || '';
			config.elClass = dom.cbo.attr('class') || '';
			config.elName = dom.cbo.attr('name') || '';
			config.elTitle = dom.cbo.attr('title') || '';
			config.elWidth = dom.cbo.outerWidth();
			config.selectedOpt = dom.cbo.find('option:selected');
			config.selectedOptTxt = config.selectedOpt.text();
			config.propDisabled = dom.cbo.prop('disabled');
			config.propRequired = dom.cbo.prop('required');

			fn.replaceCbo = function() {

				var attrGroup = {};
				attrGroup.boxSelector = 'class="' + config.elClass + ' accessiblecbo';
				attrGroup.boxSelector += config.propDisabled ? ' is-disabled"' : '"';
				attrGroup.boxSelector += config.elId != '' ? ' id="' + config.elId + '"' : '';
				attrGroup.btnTitle = config.elTitle != '' ? 'title="' + config.elTitle + '"' : '';
				attrGroup.btnLabel = 'aria-label="' + config.label + '"';
				attrGroup.optName = config.elName != '' ? 'name="' + config.elName + '"' : '';
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
							selectedAttr = '',
							disabledClass = '',
							disabledAttr = '';

						if ($this.prop('selected')) {
							selectedClass = ' is-selected';
							selectedAttr = 'checked="checked"';
						}

						if ($this.prop('disabled')) {
							disabledClass = ' is-disabled';
							disabledAttr = 'disabled="disabled"';
						}

						returnHtmlStr +=
							'<label class="accessiblecbo-opt' + selectedClass + ' ' + disabledClass + '">' +
							'<input type="radio" class="accessiblecbo-opt-radio" ' + attrGroup.optName + ' ' + thisAttrVal + ' ' + attrGroup.optDisabled + ' ' + attrGroup.optRequired + ' ' + selectedAttr + ' ' + disabledAttr + '>' +
							'<span class="accessiblecbo-opt-txt">' + $this.text() + '</span>' +
							'</label>';
					});

					return returnHtmlStr;
				};

				var replaceHtmlStr =
					'<span ' + attrGroup.boxSelector + ' role="menu" aria-live="polite" aria-relevant="all" aria-haspopup="true" aria-expanded="false" style="width: ' + config.elWidth + 'px;" ' + attrGroup.btnDisabled + ' ' + attrGroup.boxRequired + '>' +
					'<a href="#" class="accessiblecbo-btn" role="button" aria-live="off" ' + attrGroup.btnTitle + ' ' + attrGroup.btnLabel + ' ' + attrGroup.btnDisabled + '>' +
					'<span class="accessiblecbo-btn-txt">' + config.selectedOptTxt + '</span>' +
					'<span class="accessiblecbo-btn-bu" aria-hidden="true">' + config.bullet + '</span>' +
					'</a>' +
					'<span class="accessiblecbo-listbox">' +
					'<span class="accessiblecbo-listbox-wrapper" role="radiogroup" ' + attrGroup.boxRequired + ' aria-hidden="true"  style="display: none;">';

				dom.cbo.find('>*').each(function(_i) {
					var $this = $(this);

					if ($this.is('optgroup')) {
						replaceHtmlStr +=
							'<span class="accessiblecbo-optgroup" role="radiogroup">' +
							'<em class="accessiblecbo-optgroup-tit">' + $this.attr('label') + '</em>' +
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
				dom.cboListboxWrapper = dom.cboListbox.find('.accessiblecbo-listbox-wrapper');
				dom.cboOpt = dom.cboListbox.find('.accessiblecbo-opt');
				dom.cboOptEbabled = dom.cboOpt.not('.is-disabled');
				dom.cboOptRadio = dom.cboOpt.find('.accessiblecbo-opt-radio');
				dom.cboOptRadioEbabled = dom.cboOptEbabled.find('.accessiblecbo-opt-radio');

			};

			fn.toggleExpandCbo = function(action) {

				if (typeof action == 'undefined') action = 'toggle';

				var propExpanded = dom.cbo.attr('aria-expanded') === 'true',
					setOpenExpanded = function() {
						dom.cbo.attr('aria-expanded', 'true').addClass('is-expanded');
						dom.cboListboxWrapper.attr('aria-hidden', 'false').show();
						dom.cboOptRadio.filter(':checked').focus();
					},
					setCloseExpanded = function() {
						dom.cbo.attr('aria-expanded', 'false').removeClass('is-expanded');
						dom.cboListboxWrapper.attr('aria-hidden', 'true').hide();
					},
					returnBoolChkAction = function(chk) {
						return action == 'toggle' || action == chk;
					};

				if (returnBoolChkAction('open') && propExpanded === false) {
					setOpenExpanded();
					setTimeout(function() {
						$(document).one('click.accessibleCbo-closeExpanded', function(e) {
							if (dom.cbo.has(e.target).length < 1) setCloseExpanded();
						});
					}, 0);
				} else if (returnBoolChkAction('close') && propExpanded === true) {
					setCloseExpanded();
					$(document).off('.accessibleCbo-closeExpanded');
				}

			};

			fn.activeOpt = function(el, changeBool) {
				var thisOpt = el,
					thisOptRadio = thisOpt.find('.accessiblecbo-opt-radio');

				if (typeof changeBool == 'undefined') changeBool = true;

				dom.cboOpt.removeClass('is-selected');
				thisOpt.addClass('is-selected');

				if (changeBool == true) {
					thisOptRadio.focus().prop('checked', true);
					dom.cboBtnTxt.text(thisOptRadio.siblings('.accessiblecbo-opt-txt').text());
				}
			};

			fn.replaceCbo();

			dom.cboBtn.on('click', function(e) {
				e.preventDefault();
				if (e.type != 'keydown' || e.which === 13 || e.which === 32) {
					if (!config.propDisabled) {
						fn.toggleExpandCbo();
					}
				}
			});
			dom.cboOptEbabled.on({
				mouseover: function() {
					var $this = $(this);
					fn.activeOpt($this, false);
				},
				mousedown: function() {
					var $this = $(this);
					fn.activeOpt($this);
					fn.toggleExpandCbo('close');
				}
			});
			dom.cboOptRadioEbabled.on('keydown', function(e) {
				var $this = $(this);

				if (e.which === 9 || e.which === 13) {
					e.preventDefault();

					dom.cboBtn.focus();
					fn.toggleExpandCbo('close');
				} else if (e.which >= 37 && e.which <= 40) {
					e.preventDefault();

					var thisOpt = $this.parent('.accessiblecbo-opt'),
						thisOptIdx = dom.cboOptEbabled.index(thisOpt),
						controlsOpt,
						allOptLen = dom.cboOptEbabled.length,
						listboxHeight = dom.cboListbox.height(),
						listboxOffsetTop = dom.cboListbox.offset().top + parseInt(dom.cboListbox.css('border-top-width')),
						listboxScrollTop = dom.cboListbox.scrollTop();

					if (e.which >= 37 && e.which <= 38) {
						if (thisOptIdx == 0) controlsOpt = dom.cboOptEbabled.last();
						else controlsOpt = dom.cboOptEbabled.eq(thisOptIdx - 1);
					} else if (e.which >= 39 && e.which <= 40) {
						if (thisOptIdx == (allOptLen - 1)) controlsOpt = dom.cboOptEbabled.first();
						else controlsOpt = dom.cboOptEbabled.eq(thisOptIdx + 1);
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
		}

		$(this).each(function() {
			init(this);
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