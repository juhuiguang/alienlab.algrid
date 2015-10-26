/***
 * @author Joyce
 * @param {Object} $
 * @param {Object} window
 * @version 1.0
 */
(function($, window) {
	$.fn.extend({
		algrid: function(config) {
			var source = this;
			var parentNode = $(this);
			//默认参数
			var defaultconfig = {
				debug: false,
				datafrom: "json", //数据来源 json:json数据文件,http发起数据请求
				/**
				 * 可以在初始化时直接指定表格数据
				 */
				data: {},
				request: {
					url: "", //当datafrom为http时，发起数据请求的url
					postdata: {} //当发起请求时提交的参数
				},
				rownumber: false, //是否显示行号
				/***
				 * 列表表头配置：
				 * 1、支持render函数配置，自定义输出内容，render函数传入参数1、单元格值  2、行数据 3、整表数据
				 * 2、支持hidden属性配置，设置隐藏列
				 * 3、支持单元格按钮配置，请指定type:button,并且指定content:[{name:"button",color:"#aaa",click:click()}]为按钮数组。
				 */
				header: [{
					field: '',
					name: "列1"
				}, {
					field: '',
					name: "列2"
				}, {
					field: '',
					name: "列3"
				}, {
					field: '',
					name: "列4"
				}],
				page: false, //列表是否分页
				pageconfig: { //列表分页配置
					url: "", //分页请求的url
					param: { // 分页请求传递参数
						index: 0, //当前页码
						length: 10 //页长度
					}
				},
				/**
				 * 数据加载完成后调用
				 */
				onload: function() {

				},
				/**
				 * 表格选中模式，cell为单元格选中，row为整行选中
				 */
				selectModal: "cell"
			};

			//初始化参数
			var tableconfig = $.extend(true, defaultconfig, config);
			var altable = {};
			var currentdata = {};

			var getSelected = function() {
				//获取当前行列索引，和data值
				var selectNode = $(".altable .selected");
				if (selectNode.length == 0) { //如果不存在选择元素，返回null
					return null;
				} else { //获取当前选择元素值
					var selectData = {
						node: selectNode,
						value: "",
						rowIndex: 0,
						columnIndex: 0
					}
					if (tableconfig.selectModal == "cell") {
						selectData.value = selectNode.text();
						selectData.rowIndex = selectNode.parent().index();
						selectData.columnIndex = selectNode.index();
					} else if (tableconfig.selectModal == "row") {
						selectData.rowIndex = selectNode.index();
						selectData.value = currentdata.tableRows[selectData.rowIndex];
					}
					return selectData;
				}

			}

			var setSelected = function(el) {
				if (el.hasClass("selected")) {
					el.removeClass("selected");
				} else {
					$(".altable .selected").removeClass("selected");
					el.addClass("selected");

					if (source.onSelect) {
						source.onSelect(getSelected());
					} else if (tableconfig.onSelect) {
						tableconfig.onSelect(getSelected());
					}
				}

			}

			//初始化鼠标选择事件
			var initSelectionEvent = function() {
				if (tableconfig.selectModal == "cell") { //如果表格设置为列选择
					$(".altable td").hover(function() {
						$(this).addClass("hover");
					}, function() {
						$(this).removeClass("hover");
					}).click(function() {
						setSelected($(this));
					});
				} else if (tableconfig.selectModal == "row") { //表格设置为行选择
					$(".altable tr").hover(function() {
						$(this).addClass("hover");
					}, function() {
						$(this).removeClass("hover");
					}).click(function() {
						setSelected($(this));
					});
				}
			}

			var setdata = function(data) {
				currentdata = data;
				var tbody = renderTable(data);
				altable.append(tbody);
				initSelectionEvent();
				if (tableconfig.onload) {
					tableconfig.onload(data);
				}
			}

			var reload = function() {
				requestData(function(dt) {
					if (dt.tableRows && dt.tableRows.length > 0) {
						setdata(dt);
					}
				});
			}


			//绘制表头
			var drawHeader = function() {
					var header = $('<thead><tr></tr></thead>');
					if (tableconfig.header && tableconfig.header.length > 0) {
						//如果显示行号
						if (tableconfig.rownumber) {
							var item = $("<th>序号</th>");
							header.append(item);
						}
						for (var i = 0; i < tableconfig.header.length; i++) {
							if (tableconfig.header[i].hidden) {
								continue;
							}
							var item = $("<th>" + tableconfig.header[i].name + "</th>");
							header.append(item);
						}
					}
					return header;
				}
				//获取数据
			var requestData = function(callback) {
				var tabledata = {};
				if (tableconfig.datafrom == "json") {
					tabledata = tableconfig.data;
					callback(tabledata);
				} else if (tableconfig.datafrom = "http") {
					$.ajax({
						url: tableconfig.request.url,
						type: 'POST',
						dataType: 'json',
						data: tableconfig.request.postdata,
						success: function(dt) {
							tabledata = dt;
							callback(tabledata);
						}
					});
				}
			}

			//渲染表格数据
			var renderTable = function(data) {
				altable.find("tbody").remove();
				var tbody = $("<tbody></tbody>");
				var tbh = data.tableHeader;
				for (var i = 0; i < data.tableRows.length; i++) {
					var tr = $("<tr></tr>");
					if (tableconfig.rownumber) {
						td = $("<td>" + (i + 1) + "</td>");
						tr.append(td);
					}
					for (var j = 0; j < tableconfig.header.length; j++) {
						var td = "";
						if (tableconfig.header[j].hidden) {
							continue;
						}
						if (tableconfig.header[j].type && tableconfig.header[j].type == "button") {
							var html = "";
							td = $("<td></td>");
							for (var k = 0; k < tableconfig.header[j].content.length; k++) {
								var text = tableconfig.header[j].content[k].name;
								var color = option.header[j].content[k].color;
								var button = $("<a class='tablebutton ui " + (color ? color : "green") + " button mini'>" + text + "</a>");
								var render = tableconfig.header[j].content[k].render;
								if (render) {
									button.html(render(row, data, button));
								}
								var callback = tableconfig.header[j].content[k].click;
								if (callback) {
									button.unbind("click").bind("click", {
										rowIndex: i,
										row: data.tableRows[i],
										data: data
									}, callback);
								}
								td.append(button);
							}

						} else {
							var pos = tbh.indexOf(tableconfig.header[j].field);
							var value = data.tableRows[i][pos];
							var row = data.tableRows[i];
							if (tableconfig.header[j].render) {
								td = $("<td>" + tableconfig.header[j].render(value, row, data) + "</td>");
							} else {
								td = $("<td>" + value + "</td>");
							}

							if (tableconfig.header[j].key) {
								tr.attr("key", data.tableRows[i][pos]);
							}
						}
						//如果该列需要支持rowspan
						if (tableconfig.header[j].rowspan) {
							td.addClass("rospan rospan_" + j);
						}
						tr.append(td);
					}
					tbody.append(tr);
				}
				//处理rowspan
				for (var i = 0; i < tableconfig.header.length; i++) {
					//如果当前列需要rowspan操作
					if (tableconfig.header[i].rowspan) {
						var column = tbody.find(".rospan_" + i);
						for (var j = 0; j < column.length; j++) {
							$(column[j]).addClass("delrowspan");
						}
						var groups = {};
						for (var j = 0; j < column.length; j++) {
							var text = $(column[j]).text();
							var count = 1;
							for (var k = j + 1; k < column.length; k++) {
								if ($(column[k]).text() == text) {
									count += 1;
								} else {
									break;
								}
							}
							$(column[j]).attr("rowspan", count);
							$(column[j]).removeClass("delrowspan");
							j += count - 1;
						}
					}
				}
				tbody.find(".delrowspan").remove();
				return tbody;
			}

			//初始化表格
			var inittable = function() {
				//初始化列表
				altable = $('<table></table>').attr("id", "altable_" + parentNode.attr("id"))
					.attr("class", "altable");
				//绘制表头
				altable.append(drawHeader());
				//将表格插入dom
				parentNode.append(altable);
				//加载数据
				reload();
				initSelectionEvent();
			}

			inittable();


			/**
			 * 获取当前表格数据
			 */
			this.currentdata = currentdata;
			/**
			 * 重新加载数据方法
			 */
			this.reload = reload;
			/**
			 * 设置表格数据方法
			 */
			this.setdata = setdata;
			/**
			 * 获取当前选中对象
			 */
			this.getSelection = function() {
				return getSelected();
			}


			return this;
		}
	});
})($, window);