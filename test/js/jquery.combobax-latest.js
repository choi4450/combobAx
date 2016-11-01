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
		label: 'Select another option',
		bullet: '▼',
		animateType: 'fade',
		animateDuration: 200
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
			config.selected.txt = config.selected.opt.text();

			// fn.getRegexForDetectAttrInHtmlStr = function (attr) {
			// 	return new RegExp("((" + attr + ")[\s]*=[\s]*([\"\']{1}))([\s]*|[\s\w]*[\s]*.*?[\s]*|[\s]+[\s\w]*)([\"\']{1})", "i");
			// };

			// fn.setAttrInHtmlStr = function (attr, val, str) {
			// 	val = '' + val;
			// 	var ret = '',
			// 		regex;
			// 	if (str) {
			// 		regex = fn.getRegexForDetectAttrInHtmlStr(attr);
			// 		// console.log('str: ', str);
			// 		// console.log('attr: ', attr);
			// 		// console.log('regex.test(str): ', regex.test(str));
			// 		// console.log('val: ', val);
			// 		// console.log('!!val: ', !!val);
			// 	}
			// 	if (str && regex.test(str)) ret = str.replace(regex, '$2=$3' + val + '$5');
			// 	else ret = attr + '="' + val + '"';
			// 	// console.log('ret: ', ret);
			// 	// console.log('');
			// 	return ret;
			// };

			// fn.addAttrInHtmlStr = function (attr, val, str) {
			// 	val = '' + val;
			// 	var ret = str,
			// 		regex;
			// 	if (!!val) {
			// 		regex = fn.getRegexForDetectAttrInHtmlStr(attr);
			// 		// console.log('str: ', str);
			// 		// console.log('attr: ', attr);
			// 		// console.log('regex.test(str): ', regex.test(str));
			// 		// console.log('val: ', val);
			// 		// console.log('!!val: ', !!val);
			// 		// console.log('regex.test(str) && !!val:', regex.test(str) && !!val);
			// 		if (regex.test(str) && !!val) ret = str.replace(regex, '$2=$3$4 ' + val + '$5');
			// 	}
			// 	// console.log('ret: ', ret);
			// 	// console.log('');
			// 	return ret;
			// };

			// fn.removeAttrInHtmlStr = function (attr, val, str) {
			// };

			fn.replaceCbo = function () {
				var attrObj = {};
				attrObj.box = {};
				attrObj.box.classname = 'class="combobax';	// attrObj.box.classname = fn.setAttrInHtmlStr('class', 'combobax');
				attrObj.box.classname += config.prop.disabled ? ' combobax--disabled' : '';	// attrObj.box.classname = fn.addAttrInHtmlStr('class', config.prop.disabled ? 'combobax--disabled' : '', attrObj.box.classname);
				attrObj.box.classname += config.attr.classname != '' ? ' ' + config.attr.classname + '"' : '"';	// attrObj.box.classname = fn.addAttrInHtmlStr('class', config.attr.classname != '' ? config.attr.classname : '', attrObj.box.classname);
				attrObj.trigger = {};
				attrObj.trigger.id = config.attr.id != '' ? 'id="' + config.attr.id + '"' : '';	// attrObj.trigger.id = fn.setAttrInHtmlStr('id', config.attr.id);
				attrObj.trigger.title = config.attr.title != '' ? 'title="' + config.attr.title + '"' : '';	// attrObj.trigger.title = fn.setAttrInHtmlStr('title', config.attr.title);
				attrObj.trigger.label = 'aria-label="' + config.label + '"';	// attrObj.trigger.label = fn.setAttrInHtmlStr('aria-label', config.label);
				attrObj.trigger.disabled = config.prop.disabled ? 'disabled tabindex="-1"' : '';
				attrObj.opt = {};
				attrObj.opt.name = config.attr.name != '' ? 'name="' + config.attr.name + '"' : '';	// attrObj.opt.name = fn.setAttrInHtmlStr('name', config.attr.name);
				attrObj.opt.required = config.prop.required ? 'required' : '';
				attrObj.opt.disabled = config.prop.disabled ? 'disabled' : '';

				var addOptionHtmlStr = function (element) {
					var ret = '';
					element.each(function () {
						var $this = $(this),
							itemClassname = '',
							optAttr = $this.val() ? 'value="' + $this.val() + '"' : '';

						if ($this.prop('selected')) {
							itemClassname += ' combobax__item--selected';
							optAttr += ' checked';
						}

						if ($this.prop('disabled')) {
							itemClassname += ' combobax__item--disabled';
							optAttr += ' disabled';
						}

						ret +=
							'<label class="combobax__item' + itemClassname + '">' +
							'<input class="combobax__item-option" type="radio" ' + attrObj.opt.name + ' ' + attrObj.opt.disabled + ' ' + attrObj.opt.required + ' ' + optAttr + '>' +
							'<span class="combobax__item-txt">' + $this.text() + '</span>' +
							'</label>'
					});

					return ret;
				};

				var replaceHtmlStr =
					'<span ' + attrObj.box.classname + ' style="width: ' + config.style.width + 'px;">' +
					'<button class="combobax__trigger" ' + attrObj.trigger.id + ' type="button" aria-controls="@@@@@@@@@@" ' + attrObj.trigger.title + ' ' + attrObj.trigger.label + ' ' + attrObj.trigger.disabled + ' aria-expanded="false" ' + attrObj.opt.disabled + ' value="A">' +
					'<span class="combobax__trigger-txt">' + config.selected.txt + '</span>' +
					'<span class="combobax__trigger-bu" aria-hidden="true">' + config.bullet + '</span>' +
					'</button>' +
					'<span class="combobax__listbox" role="group" aria-label="Options" id="@@@@@@@@@@" aria-hidden="true"' + (config.animateType !== 'css' ? ' style="display: none;"' : '') + '>';

				dom.cbo.find('>*').each(function () {
					var $this = $(this);

					if ($this.is('optgroup')) {
						replaceHtmlStr +=
							'<span class="combobax__group" role="group" aria-label="' + $this.attr('label') + '">' +
							'<span class="combobax__group-label" aria-hidden="true">' + $this.attr('label') + '</span>' +
							addOptionHtmlStr($this.find('option')) +
							'</span>';
					} else {
						replaceHtmlStr +=
							addOptionHtmlStr($this);
					}
				});

				replaceHtmlStr +=
					'</span>' +
					'</span>';

				var replaceHtml = $(replaceHtmlStr);
				dom.cbo.replaceWith(replaceHtml);

				dom.cbo = replaceHtml;
				dom.trigger = dom.cbo.find('.combobax__trigger');
				dom.triggerTxt = dom.trigger.find('.combobax__trigger-txt');
				dom.listbox = dom.cbo.find('.combobax__listbox');
				dom.items = dom.listbox.find('.combobax__item');
				dom.itemsEnabled = dom.items.not('.combobax__item--disabled');
				dom.opts = dom.items.find('.combobax__item-option');
				dom.optsEnabled = dom.itemsEnabled.find('.combobax__item-option');

			};

			fn.toggleExpandCbo = function (action) {

				if (typeof action == 'undefined') action = 'toggle';

				var propExpanded = dom.trigger.attr('aria-expanded') === 'true',
					setOpenExpanded = function () {
						setTimeout(function () {
							dom.trigger.attr('aria-expanded', 'true');
							dom.listbox.attr('aria-hidden', 'false');
							dom.cbo.addClass('combobax--expanded');
							switch (config.animateType) {
								case 'css':
									dom.cbo.addClass('combobax--fadein');
									setTimeout(function () {
										dom.cbo.removeClass('combobax--fadein');
									}, config.animateDuration);
									break;
								case 'fade':
								default:
									dom.listbox.clearQueue().fadeIn(config.animateDuration);
									break;
							}
							dom.opts.filter(':checked').focus();
						}, 0);
					},
					setCloseExpanded = function () {
						setTimeout(function () {
							dom.trigger.attr('aria-expanded', 'false');
							dom.listbox.attr('aria-hidden', 'true');
							switch (config.animateType) {
								case 'css':
									dom.cbo.addClass('combobax--fadeout');
									setTimeout(function () {
										dom.cbo.removeClass('combobax--fadeout combobax--expanded');
									}, config.animateDuration);
									break;
								case 'fade':
								default:
									dom.listbox.clearQueue().fadeOut(config.animateDuration, function () {
										dom.cbo.removeClass('combobax--expanded');
									});
									break;
							}
						}, 0);
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
				var item = el,
					opt = item.find('.combobax__item-option');

				if (typeof changeBool == 'undefined') changeBool = true;

				dom.items.removeClass('combobax__item--selected');
				item.addClass('combobax__item--selected');

				if (changeBool == true) {
					opt.focus().prop('checked', true);
					dom.triggerTxt.text(opt.siblings('.combobax__item-txt').text());
				}
			};

			fn.replaceCbo();

			dom.trigger.on('click', function (e) {
				e.preventDefault();
				if (e.type != 'keydown' || e.which === 13 || e.which === 32) {
					if (!config.prop.disabled) {
						fn.toggleExpandCbo();
					}
				}
			});
			dom.itemsEnabled.on({
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
			dom.optsEnabled.on('keydown', function (e) {
				var $this = $(this);

				if (e.which === 9 || e.which === 13) {
					e.preventDefault();

					dom.trigger.focus();
					fn.toggleExpandCbo('close');
				} else if (e.which >= 37 && e.which <= 40) {
					e.preventDefault();

					var thisOpt = $this.parent('.combobax__item'),
						thisOptIdx = dom.itemsEnabled.index(thisOpt),
						controlsOpt,
						allOptLen = dom.itemsEnabled.length,
						listboxHeight = dom.listbox.height(),
						listboxOffsetTop = dom.listbox.offset().top + parseInt(dom.listbox.css('border-top-width')),
						listboxScrollTop = dom.listbox.scrollTop();

					if (e.which >= 37 && e.which <= 38) {
						if (thisOptIdx == 0) controlsOpt = dom.itemsEnabled.last();
						else controlsOpt = dom.itemsEnabled.eq(thisOptIdx - 1);
					} else if (e.which >= 39 && e.which <= 40) {
						if (thisOptIdx == (allOptLen - 1)) controlsOpt = dom.itemsEnabled.first();
						else controlsOpt = dom.itemsEnabled.eq(thisOptIdx + 1);
					}

					var controlsOptHeight = controlsOpt.height(),
						controlsOptOffsetTop = controlsOpt.offset().top - listboxOffsetTop + listboxScrollTop;

					setTimeout(function () {
						fn.activeOpt(controlsOpt);

						if (controlsOptOffsetTop >= (listboxHeight + listboxScrollTop)) {
							dom.listbox.scrollTop(controlsOptOffsetTop - (listboxHeight - controlsOptHeight));
						} else if (controlsOptOffsetTop < listboxScrollTop) {
							dom.listbox.scrollTop(controlsOptOffsetTop);
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
