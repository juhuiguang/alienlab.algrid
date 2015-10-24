(function($, window) {
	$.fn.extend({
		algrid: function(config) {
			var parentNode = $(this);
			//默认参数
			var defaultconfig = {
				debug: false,
				datafrom: "json", //数据来源 json:json数据文件,http发起数据请求
				data: {},
				request: {
					url: "", //当datafrom为http时，发起数据请求的url
					postdata: {} //当发起请求时提交的参数
				},
				rownumber: false, //是否显示行号
				header: [ //列表表头配置
					{
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
					}
				],
				page: false, //列表是否分页
				pageconfig: { //列表分页配置
					url: "", //分页请求的url
					param: { // 分页请求传递参数
						index: 0, //当前页码
						length: 10 //页长度
					}
				},
				onload: function() {

				}
			};

			//初始化参数
			var tableconfig = $.extend(true, defaultconfig, config);
			var altable = {};
			var currentdata = {};
			var setdata=function(data){
				currentdata=data;
				var tbody=renderTable(data);
				altable.append(tbody);
				if(tableconfig.onload){
					tableconfig.onload(data);
				}
			}
			
			var reload=function(){
				requestData(function(dt) {
					setdata(dt);
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
						tr.append(td);
					}
					tbody.append(tr);
				}
				return tbody;
			}
			
			//初始化表格
			var inittable = function() {
				//初始化列表
				altable = $('<table></table>').attr("id", "altable_" + parentNode.id);
				//绘制表头
				altable.append(drawHeader());
				//将表格插入dom
				parentNode.append(altable);
				//加载数据
				reload();
			}
			
			inittable();

			this.currentdata=currentdata;
			this.reload=reload;
			this.setdata=setdata;
		}
	});
})($, window);