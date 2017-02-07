;(function(){
	
	function pageScaleSize(scale,cwidth){
		var view=document.documentElement.clientWidth||document.body.clientWidth;
		var html=document.getElementsByTagName('html')[0];
		if(cwidth){
			//限制比例为最大设计图宽度
			if(view>=cwidth){
				html.style.fontSize=cwidth/scale+'px';
				html.style.width=cwidth+"px";
				html.style.margin="0 auto";
			}else{
				html.style.fontSize=view/scale+'px';
				html.style.width=view+"px";
				html.style.margin="";	
			}		
		}else{
			html.style.fontSize=view/scale+'px';		
		}		
	}
	pageScaleSize(7.2,720);	
	window.addEventListener('resize',function(){
		pageScaleSize(7.2,720);			
	},false)
	
	
	//避免报错影响后面代码
	window.tryCode=function(callback){
		try{
			callback()		
		}catch(e){
			//console.warn(e) //屏蔽错误 给一个警告  提示的时候开启错误报告
			//throw e.message //依然报错 调试时候使用
		}	
	}
	
	//css按需加载
	window.loadCss=function(cssUrl,callback) {
		var elem,bl,isExecuted = false; // 防止在ie9中，callback执行两次
		if (cssUrl == null ) {
			return String(cssUrl);
		}
		elem = document.createElement('link'),
		elem.rel = 'stylesheet';
		if (type(callback) === 'function' )  {
			bl = true;
		}
		// for ie
		function handle() {
			if ( elem.readyState === 'loaded' || elem.readyState === 'complete' ) {
				if (bl && !isExecuted) {
					callback();
					isExecuted = true;
				}
				elem.onreadystatechange = null;
			}
		}
		elem.onreadystatechange = handle;
		// for 非ie
		if (bl && !isExecuted) {
			elem.onload = callback;
			isExecuted = true;
		}
		elem.href = cssUrl;
		document.getElementsByTagName('head')[0].appendChild(elem);
		
		function type (obj) {
			var classTypes, objectTypes;
			if ( obj == null ) {
				return String(obj);
			}
			classTypes = {};
			objectTypes = ('Boolean Number String Function Array Date RegExp Object Error').split(' ');
			for ( var i = 0, len = objectTypes.length; i < len; i++ ) {
				classTypes[ '[object ' + objectTypes[i] + ']' ] = objectTypes[i].toLowerCase();
			}
			if ( typeof obj === 'object' || typeof obj === 'function' ) {
				var key = Object.prototype.toString.call(obj);
				return classTypes[key];
			}
			return typeof obj;
		}	
	}
	
	/*
	css放头部原因：浏览器是逐步呈现页面的，为了避免引起界面样式重绘，浏览器等所有同步css加载完成后，在渲染页面，如果放底部，就会导致白屏
	css导致webkit白屏和无样式闪烁重绘内容引起的性能损耗  异步加载 无阻塞模式
	外部样式不会阻止后面外部脚本的加载，但是外部脚本的执行必须等到css加载完毕。也就是说外部样式不会阻塞外部脚本的加载，但会阻塞外部脚本的执行css并不会阻塞图片等资源的下载，但会影响body内容的呈现
	阻塞加载 并行加载 阻塞执行 下面是阻塞运行的
	白屏时间，加载时间，http请求数量，图片并发量，同步脚本阻塞时间，css加载时间，dom重绘时间
	使用局部变量优化原因：全局变量和对象都是作用域链的最后一个，而局部变量总是处于作用域链的顶端，为了避免查找损耗，所以尽量存储局部变量
	避免增加作用域链的长度：with语句和 try catch(cathc语句块)
	点.属性的长度越小，性能越高，查找问题
	变量和字面量存储优于数组和对象存储
	*/
	
	//并联加载多个js
	window.parallelJsArr=function(scripts,callback) {
	   if(typeof(scripts) != "object") var scripts = [scripts];
	   var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement, s = new Array(), loaded = 0;
	   for(var i=0; i<scripts.length; i++) {
		   s[i] = document.createElement("script");
		   s[i].setAttribute("type","text/javascript");
		   s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
			   if(!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
				   loaded++;
				   this.onload = this.onreadystatechange = null; this.parentNode.removeChild(this); 
				   if(loaded == scripts.length && typeof(callback) == "function") callback();
			   }
		   };
		   s[i].setAttribute("src",scripts[i]);
		   HEAD.appendChild(s[i]);
	   }
	}
	
	window.addClass=function(obj, sClass) { //添加class样式
		var aClass = obj.className.split(' ');
		if (!obj.className) {
			obj.className = sClass;
			return;
		}
		for (var i = 0; i < aClass.length; i++) {
			if (aClass[i] === sClass) return;
		}
		obj.className += ' ' + sClass;
	}
	window.removeClass=function(obj, sClass) { //移除class样式
		var aClass = obj.className.split(' ');
		if (!obj.className) return;
		for (var i = 0; i < aClass.length; i++) {
			if (aClass[i] === sClass) {
				aClass.splice(i, 1);
				obj.className = aClass.join(' ');
				break;
			}
		}
	}				
})()
