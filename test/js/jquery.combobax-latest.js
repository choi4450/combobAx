/**
 * combobAx v0.1.2
 * https://github.com/choi4450/combobAx
 *
 * Copyright 2015 Gyumin Choi Foundation and other contributors
 * Released under the MIT license
 * https://github.com/choi4450/combobAx/blob/master/LICENSE.txt
 */

(function ($) {

	$.fn.combobAxConfig = {
		//style: null,
		//animate: false,
		//duration: 0,
		//easingOpen: null,
		//easingClose: null,
		label: 'Select another option',
		bullet: ''
	};

	$.fn.combobAx = function (defaults) {

		if (navigator.userAgent.indexOf("MSIE 6") >= 0) return false;

		function init(el) {

			var dom = {},
				fn = {},
				config = $.extend({}, $.fn.combobAxConfig, defaults);

			dom.cbo = $(el);
			config.attr = config.prop = config.style = config.selected = {};
			config.attr.id = dom.cbo.attr('id') || '';
			config.attr.classname = dom.cbo.attr('class') || '';
			config.attr.name = dom.cbo.attr('name') || '';
			config.attr.title = dom.cbo.attr('title') || '';
			config.prop.disabled = dom.cbo.prop('disabled');
			config.prop.required = dom.cbo.prop('required');
			config.style.width = dom.cbo.outerWidth();
			config.selected.opt = dom.cbo.find('option:selected');
			config.selected.optTxt = config.selected.opt.text();

			fn.getRegexForDetectAttrInHtmlStr = function (attr) {
				return new RegExp("((" + attr + ")[\s]*=[\s]*([\"\']{1}))([\s]*|[\s\w]*[\s]*.*?[\s]*|[\s]+[\s\w]*)([\"\']{1})", "i");
			};

			fn.setAttrInHtmlStr = function (attr, val, str) {
				val = '' + val;
				var ret = '',
					regex;
				if (str) {
					regex = fn.getRegexForDetectAttrInHtmlStr(attr);
					// console.log('str: ', str);
					// console.log('attr: ', attr);
					// console.log('regex.test(str): ', regex.test(str));
					// console.log('val: ', val);
					// console.log('!!val: ', !!val);
				}
				if (str && regex.test(str)) ret = str.replace(regex, '$2=$3' + val + '$5');
				else ret = ' ' + attr + '="' + val + '"';
				// console.log('ret: ', ret);
				// console.log('');
				return ret;
			};

			fn.addAttrInHtmlStr = function (attr, val, str) {
				val = '' + val;
				var ret = str,
					regex = fn.getRegexForDetectAttrInHtmlStr(attr);
				// console.log('str: ', str);
				// console.log('attr: ', attr);
				// console.log('regex.test(str): ', regex.test(str));
				// console.log('val: ', val);
				// console.log('!!val: ', !!val);
				// console.log('regex.test(str) && !!val:', regex.test(str) && !!val);
				if (regex.test(str) && !!val) ret = str.replace(regex, '$2=$3$4 ' + val + '$5');
				// console.log('ret: ', ret);
				// console.log('');
				return ret;
			};

			// fn.removeAttrInHtmlStr = function (attr, val, str) {
			// };

			fn.replaceCbo = function () {

				var attrObj = {};
				attrObj.box = attrObj.btn = attrObj.opt = {};
				attrObj.box.classname = fn.setAttrInHtmlStr('class', 'combobax');
				attrObj.box.classname = fn.addAttrInHtmlStr('class', config.prop.disabled ? 'is-disabled' : '', attrObj.box.classname);
				attrObj.box.classname = fn.addAttrInHtmlStr('class', config.attr.classname != '' ? config.attr.classname : '', attrObj.box.classname);
				attrObj.box.id = fn.setAttrInHtmlStr('id', config.attr.id);
				attrObj.btn.title = fn.setAttrInHtmlStr('title', config.attr.title);
				attrObj.btn.label = fn.setAttrInHtmlStr('aria-label', config.attr.name);
				attrObj.opt.name = fn.setAttrInHtmlStr('name', config.attr.name);
				attrObj.box.required = config.prop.required ? 'aria-required="true"' : '';
				attrObj.opt.required = config.prop.required ? 'required="required"' : '';
				attrObj.btn.disabled = config.prop.disabled ? 'aria-disabled="true" tabindex="-1"' : '';
				attrObj.opt.disabled = config.prop.disabled ? 'disabled="disabled"' : '';

				var addOptionHtmlStr = function (element) {
					var ret = '';
					element.each(function () {
						var $this = $(this),
							thisOptClassName = '',
							thisRadioAttr = $this.val() ? 'value="' + $this.val() + '"' : '';

						if ($this.prop('selected')) {
							thisOptClassName += ' combobax__item--selected';
							thisRadioAttr += ' checked';
						}

						if ($this.prop('disabled')) {
							thisOptClassName += ' combobax__item--disabled';
							thisRadioAttr += ' disabled';
						}

						ret +=
							'<label class="combobax__item' + thisOptClassName + '">' +
							'<input class="combobax__item-option" type="radio" ' + attrObj.opt.name + ' ' + attrObj.opt.disabled + ' ' + attrObj.opt.required + ' ' + thisRadioAttr + '>' +
							'<span class="combobax__item-txt" role="presentation">' + $this.text() + '</span>' +
							'</label>'
					});

					return ret;
				};

				var replaceHtmlStr =
					// '<span class="combobax">' +
					// '<button class="combobax__trigger" type="button" aria-controls="field-combobax" aria-expanded="false" title="Select another option" aria-label="Select another option" value="A">' +
					// '<span class="combobax__trigger-txt" role="presentation">Option A</span>' +
					// '</button>' +
					// '<span class="combobax__listbox" role="group" aria-label="Options" id="field-combobax" aria-hidden="true">'
					//
					'<span ' + attrObj.box.classname + +attrObj.box.id + ' role="menu" aria-live="polite" aria-relevant="all" aria-haspopup="true" aria-expanded="false" style="width: ' + config.style.width + 'px;" ' + attrObj.btn.disabled + ' ' + attrObj.box.required + '>' +
					'<button type="button" class="combobax-btn" aria-live="off" ' + attrObj.btn.title + ' ' + attrObj.btn.label + ' ' + attrObj.btn.disabled + '>' +
					'<span class="combobax-btn-txt">' + config.selected.optTxt + '</span>' +
					'<span class="combobax-btn-bu" aria-hidden="true">' + config.bullet + '</span>' +
					'</button>' +
					'<span class="combobax-listbox">' +
					'<span class="combobax-listbox-wrapper" role="radiogroup" ' + attrObj.box.required + ' aria-hidden="true"  style="display: none;">';

				dom.cbo.find('>*').each(function () {
					var $this = $(this);

					if ($this.is('optgroup')) {
						replaceHtmlStr +=
							'<span class="combobax-optgroup" role="radiogroup">' +
							'<em class="combobax-optgroup-tit">' + $this.attr('label') + '</em>' +
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
				dom.cboBtn = dom.cbo.find('.combobax-btn');
				dom.cboBtnTxt = dom.cboBtn.find('.combobax-btn-txt');
				dom.cboListbox = dom.cbo.find('.combobax-listbox');
				dom.cboListboxWrapper = dom.cboListbox.find('.combobax-listbox-wrapper');
				dom.cboOpt = dom.cboListbox.find('.combobax-opt');
				dom.cboOptEbabled = dom.cboOpt.not('.is-disabled');
				dom.cboOptRadio = dom.cboOpt.find('.combobax-opt-radio');
				dom.cboOptRadioEbabled = dom.cboOptEbabled.find('.combobax-opt-radio');

			};

			fn.toggleExpandCbo = function (action) {

				if (typeof action == 'undefined') action = 'toggle';

				var propExpanded = dom.cbo.attr('aria-expanded') === 'true',
					setOpenExpanded = function () {
						dom.cbo.attr('aria-expanded', 'true').addClass('is-expanded');
						dom.cboListboxWrapper.attr('aria-hidden', 'false').show();
						dom.cboOptRadio.filter(':checked').focus();
					},
					setCloseExpanded = function () {
						dom.cbo.attr('aria-expanded', 'false').removeClass('is-expanded');
						dom.cboListboxWrapper.attr('aria-hidden', 'true').hide();
					},
					returnBoolChkAction = function (chk) {
						return action == 'toggle' || action == chk;
					};

				if (returnBoolChkAction('open') && propExpanded === false) {
					setOpenExpanded();
					setTimeout(function () {
						$(document).one('click.combobAx-closeExpanded', function (e) {
							if (dom.cbo.has(e.target).length < 1) setCloseExpanded();
						});
					}, 0);
				} else if (returnBoolChkAction('close') && propExpanded === true) {
					setCloseExpanded();
					$(document).off('.combobAx-closeExpanded');
				}

			};

			fn.activeOpt = function (el, changeBool) {
				var thisOpt = el,
					thisOptRadio = thisOpt.find('.combobax-opt-radio');

				if (typeof changeBool == 'undefined') changeBool = true;

				dom.cboOpt.removeClass('is-selected');
				thisOpt.addClass('is-selected');

				if (changeBool == true) {
					thisOptRadio.focus().prop('checked', true);
					dom.cboBtnTxt.text(thisOptRadio.siblings('.combobax-opt-txt').text());
				}
			};

			fn.replaceCbo();

			dom.cboBtn.on('click', function (e) {
				e.preventDefault();
				if (e.type != 'keydown' || e.which === 13 || e.which === 32) {
					if (!config.prop.disabled) {
						fn.toggleExpandCbo();
					}
				}
			});
			dom.cboOptEbabled.on({
				mouseover: function () {
					var $this = $(this);
					fn.activeOpt($this, false);
				},
				mousedown: function () {
					var $this = $(this);
					fn.activeOpt($this);
					fn.toggleExpandCbo('close');
				}
			});
			dom.cboOptRadioEbabled.on('keydown', function (e) {
				var $this = $(this);

				if (e.which === 9 || e.which === 13) {
					e.preventDefault();

					dom.cboBtn.focus();
					fn.toggleExpandCbo('close');
				} else if (e.which >= 37 && e.which <= 40) {
					e.preventDefault();

					var thisOpt = $this.parent('.combobax-opt'),
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

					setTimeout(function () {
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

		$(this).each(function () {
			init(this);
		});

	};

	$(function () {
		$('select[data-combobax]').each(function () {
			var $this = $(this),
				argumentStr = $this.attr('data-combobax'),
				argumentObj = eval('({' + argumentStr + '})');
			$this.combobAx(argumentObj);
		});
	});

}(jQuery));
