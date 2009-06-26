// ==UserScript==
// @name           格子铺外挂
// @include        http://gzk.sdo.com/*
// ==/UserScript==
GamePanel = {
	initialize: function(i) {
		var c = i.frameEl;
		var b = i.leftArrow;
		var g = i.rightArrow;
		var j = i.beforeScroll;
		var e = new gzk.widget.Messagebox({
			disableFrame: true
		});
		e.element.style.top = "0px";
		e.element.style.left = "0px";
		c.appendChild(e.element);
		var d = new gzk.widget.Messagebox({
			disableFrame: true
		});
		d.element.style.top = "0px";
		d.element.style.left = "0px";
		c.appendChild(d.element);
		var f = function() {
			e.element.style.width = c.offsetWidth + "px";
			e.element.style.height = c.offsetHeight + "px";
			e.element.style.filter = "alpha(opacity=80)";
			e.element.style.opacity = "0.8";
			e.element.style.backgroundColor = "#000000"
		};
		f();
		var a = document.getElementById("grid");
		window.$MAX_CLICK_INTERVAL = 0;
		var h = function() {
			var k = new Date();
			if (k - window.$last_click_time < window.$MAX_CLICK_INTERVAL) {
				return
			}
			window.$last_click_time = new Date();
			window.$gz_is_busy = false;
			d.hide();
			e.hide()
		};
		this.hide = function() {
			h()
		};
		this.showMessage = function(k) {
			e.show({
				position: {}
			});
			d.show({
				position: {},
				html: k
			});
			window.$last_click_time = new Date();
			/*
			window.setTimeout(function() {
				var l = document.getElementById("close_msg_sec");
				if (l) {
					l.innerHTML = 2
				}
			},
			1000);
			window.setTimeout(function() {
				var l = document.getElementById("close_msg_sec");
				if (l) {
					l.innerHTML = 1
				}
			},
			2000);
			window.setTimeout(function() {
				var l = document.getElementById("close_msg_sec");
				if (l) {
					l.innerHTML = 0
				}
			},
			3000)
			*/
			document.getElementById('close_msg_sec').innerHTML = 0;
		};
		jQuery(d.element).click(function(k) {
			h()
		});
		jQuery(e.element).click(function(k) {
			h()
		})
	}
};
jQuery(document).ready(function() {
	var MAX_AREA = $maxArea;
	var MAXIMUM_DISPLAY_AREA = 3;
	var lbtnLeftArrow = jQuery("#lbtnLeftArrow");
	var lbtnRightArrow = jQuery("#lbtnRightArrow");
	var resetArrow = function() {
		$firstArea == 0 ? lbtnLeftArrow.addClass("stop") : lbtnLeftArrow.removeClass("stop");
		if ($firstArea + MAXIMUM_DISPLAY_AREA == MAX_AREA) {
			lbtnRightArrow.addClass("stop")
		} else {
			lbtnRightArrow.removeClass("stop")
		}
	};
	resetArrow();
	window.$gz_is_busy = false;
	window.$last_click_time = new Date();
	var loading = function() {
		gzk.loading()
	};
	var gzClick = function() {
		try {
			/*
			if (window.$gz_is_busy) {
				return
			}
			window.$gz_is_busy = true;
			*/
			var _loadingTimer = window.setTimeout(loading, 200);
			var id = this.id;
			var p = id.split("_");
			var a = this;
			jQuery.ajax({
				url: "/grid/check_grid_new.php",
				type: "POST",
				data: {
					a: p[0],
					p: p[1]
				},
				async: true,
				timeout: 5000,
				success: function(data) {
					try {
						if (_loadingTimer) {
							window.clearTimeout(_loadingTimer);
							_loadingTimer = 0
						}
						var jscode = data.match(/<data>([\s\S]*)?(?:<\/data>)/i);
						if (jscode && jscode[1]) {
							try {
								var className = jscode[1].replace(/<data>|<\/data>|\n|\r/g, "");
								className = eval(className);
								a.className = className
							} catch(e) {}
						}
						data = data.replace(/<data>[\s\S]*?(<\/data>)/g, "");
						GamePanel.showMessage(data);
						jQuery("a.pop").hover(function() {
							var title = jQuery(this).next();
							if (title.length) {
								gzk.popTip(this, title.html())
							}
						},
						function() {
							gzk.hideTip()
						})
					} catch(e) {}
				},
				complete: function(rq, state) {
					try {
						if (_loadingTimer) {
							window.clearTimeout(_loadingTimer);
							_loadingTimer = 0
						}
						gzk.unloading();
						if (rq.status != 200) {
							gzk.layer({
								type: 2,
								data: "无法找到请求页面,请检查网络连接是否正?"
							});
							window.$gz_is_busy = false
						}
					} catch(e) {}
				},
				error: function(xhr, status, e) {
					gzk.unloading()
				}
			})
		} catch(e) {}
	};
	var is_scrolling = false;
	function loadGameArea(nArea, direction) {
		jQuery.ajax({
			type: "POST",
			url: "/grid/area.php",
			data: {
				stage: nArea,
				direction: direction
			},
			complete: function(rq, state) {
				if (rq.status == 404) {
					gzk.layer({
						type: 2,
						data: "无法找到请求页面!"
					})
				}
				is_scrolling = false;
				gzk.unloading()
			},
			success: function(data) {
				if (data.indexOf("error") == 0) {
					gzk.layer({
						type: 2,
						data: "请求数据失败:" + data.substr(6)
					});
					return
				}
				var grid = document.getElementById("grid");
				var newGrid = document.createElement("div");
				newGrid.className = "list";
				newGrid.innerHTML = data;
				if (nArea < $firstArea) {
					$("div.list:last", grid).remove();
					grid.insertBefore(newGrid, grid.firstChild);
					$firstArea--
				} else {
					$("div.list:first", grid).remove();
					grid.appendChild(newGrid);
					$firstArea++
				}
				jQuery("span.K", newGrid).click(gzClick);
				resetArrow()
			}
		})
	}
	var grid = document.getElementById("grid");
	grid.style.width = grid.scrollWidth + "px";
	var option = {};
	option.rightArrow = lbtnRightArrow.get(0);
	option.frameEl = $("#container").get(0);
	option.leftArrow = lbtnLeftArrow.get(0);
	var beforeScroll = function(direction) {
		var loadArea = (direction == "left") ? $firstArea - 1 : $firstArea + MAXIMUM_DISPLAY_AREA;
		if (loadArea < 0 || loadArea == MAX_AREA) {
			return
		}
		if (is_scrolling) {
			return
		}
		is_scrolling = true;
		lbtnRightArrow.addClass("stop");
		lbtnLeftArrow.addClass("stop");
		gzk.loading();
		loadGameArea(loadArea, direction)
	};
	jQuery("#lbtnLeftArrow").click(function() {
		beforeScroll("left")
	});
	jQuery("#lbtnRightArrow").click(function() {
		beforeScroll("right")
	});
	GamePanel.initialize(option);
	jQuery("#grid span.K").click(gzClick)
});

(function() {

/**
 * Game Plugin
 */

var $ = jQuery;

$('body').append('<div id="game-plugin" style="z-index:10000;position:fixed;right:10px;bottom:10px;">\
					<div id="game-plugin-msg"></div>\
					<input type="text" id="auto_click_from" size="3" value="40" />\
					<input type="text" id="auto_click_to" size="3" value="50" />\
					<button id="auto_click">自动点盒子</button>\
					<button id="auto_sell_card">卖掉所有功能卡</button>\
					<button id="auto_sell_linggan_card">卖掉所有灵感卡</button>\
					<button id="auto_eat">吃100以下体力</button>\
				</div>');

var console = {
	error: function(msg) {
		$('#game-plugin-msg').append('<p>'+msg+'</p>');
	}
}

$('#auto_click_from').bind('blur', function() {
	$('#auto_click_to').val($('#auto_click_from').val() * 1 + 10);
});

$('#auto_eat').bind('click', function() {
	$.ajax({
		type:	'get',
		url:	'http://gzk.sdo.com/myhome/mydoc_ajax.php?action=query&type=food',
		success: function(msg) {
			var arr = $.trim(msg).match(/(_(\d{6}))|(\d{2,3})点/g);
			$.each(arr, function(i) {
				if (i%2 !== 0) {
					var point = this.toString().replace('点', '');
					if (point < 100) {
						var that = arr[i-1].toString().replace('_', '');
						$.ajax({
							type:	'post',
							url:	'http://gzk.sdo.com/myhome/mydoc_use.php',
							data:	{
								pid: that,
								step: 3,
								type: 'food'
							}
						});
					}
				}
			});
		}
	});
		
});

$('#auto_sell_linggan_card').bind('click', function() {
	$.ajax({
		type:	'get',
		url:	'http://gzk.sdo.com/myhome/mydoc_ajax.php?action=query&type=afflatus',
		success: function(msg) {
			var arr = $.trim(msg).match(/(\d{6})_/g);
			$.each(arr, function() {
				var that = this.toString().replace('_', '');
				$.ajax({
					type:	'post',
					url:	'http://gzk.sdo.com/myhome/mydoc_ajax.php',
					data:	{
						pid: that,
						step: 3,
						type: 'afflatus'
					}
				});
			});
		}
	});
		
});

$('#auto_sell_card').bind('click', function() {
	$.ajax({
		type:	'get',
		url:	'http://gzk.sdo.com/myhome/mydoc_ajax.php?action=query&type=card',
		success: function(msg) {
			var arr = $.trim(msg).match(/(\d{6})/g);
			$.each(arr, function() {
				var that = this;
				$.ajax({
					type:	'post',
					url:	'http://gzk.sdo.com/myhome/mydoc_ajax.php',
					data:	{
						pid: that,
						step: 3,
						type: 'card'
					}
				});
			});
		}
	});
		
});

$('#auto_click').bind('click', function(e) {
	var from = $('#auto_click_from').val();
	var to = $('#auto_click_to').val();

	$('#auto_click_from').val(from * 1 + 10);
	$('#auto_click_to').val(to * 1 + 10);
	$('#grid span').each(function(i) {
		if (i < from || i > to) return;

		var arr = this.id.split('_');
		$.ajax({
			url: "/grid/check_grid_new.php",
			type: "POST",
			data: {
				a: arr[0],
				p: arr[1]
			},
			async: true,
			success: function(msg) {
				/**
				 * 取消此功能，屏幕上已有提示
				if (msg.indexOf('继续工作') !== -1 || msg.indexOf('苦力') !== -1 || msg.indexOf('困在厕所') !== -1 || msg.indexOf('还在客户那里') !== -1) {
					console.error('残了。。');
				}
				*/
				if (msg.indexOf('满') !== -1) {
					console.error('满了。。');
				}
			}
		});
	});
});

})();
