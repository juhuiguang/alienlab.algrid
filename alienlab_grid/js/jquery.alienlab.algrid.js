(function($,window){
	$.fn.extend({
		algrid:function(config){
			//默认参数
			var defaultconfig={
				debug:false,
				datafrom:"json",//数据来源 json:json数据文件,http发起数据请求
				request:{
					url:"",//当datafrom为http时，发起数据请求的url
					postdata:{}//当发起请求时提交的参数
				},
				rownumber:false,//是否显示行号
				header:[//列表表头配置
					{field:'',name:"列1"},
			        {field:'',name:"列2"},
			        {field:'',name:"列3"},
			        {field:'',name:"列4"}
				],
				page:false,//列表是否分页
				pageconfig:{//列表分页配置
					url:"",//分页请求的url
					param:{// 分页请求传递参数
						index:0; //当前页码
						length:10; //页长度
					}
				}
				onload:function(){
					
				}
			};
			//初始化参数
			var tableconfig=$.extend(true,defaultconfig,config);
			
			//初始化表格
			var inittable=function(){
				
				
			}
			
			//绘制表头
			var drawHeader=function(){
				
			}
			//获取数据
			var requestData=function(){
				
			}
			
			//渲染表格数据
			var renderTable=function(){
				
			}
			
			var doms{
				table:'<table></table>',
				tr:'<tr></tr>',
				td:'<td></td>',
				tbody:'<tbody></tbody>',
				th:'<th></th>',
				thxh:'<th>序号</th>',
				theader:'<thead><tr></tr></thead>',
				
			}
			
			
		}
	});
})($, window);
