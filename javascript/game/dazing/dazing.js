(function(A){var C={group:10,step:1.25,life:3};var D=["up","down","left","right"];var E={"38":"up","40":"down","37":"left","39":"right"};A.Dazing=function(F,G){this.container=F;this.config=G||C;this.init()};var B=A.Dazing.prototype;B.init=function(){this.container.innerHTML="";this.score=this.current=this.life=0;this.step=this.config.step||1.25;this.container.style.overflow="hidden";this.container.style.paddingLeft=this.container.clientWidth+"px";var F=this;document.onkeydown=function(H){H=H||window.event;var G=E[H.keyCode];if(G){F.judge(G)}}};B.build=function(){for(var F=0;F<this.config.group*2;F++){var G=document.createElement("li");G.className=D[Math.round((Math.random()*100))%4];G.innerHTML="<span>"+G.className.toUpperCase()+"</span>";this.container.appendChild(G)}};B.judge=function(G){var H=this.container.childNodes[this.current],F=H.className;if(F==G){H.className+=" done"}else{if(this.life<this.config.life){H.style.visibility="hidden";this.life++}else{this.stop();if("function"==typeof this.config.onFinished){this.config.onFinished.call(this)}return }}this.current++};B.scrolling=function(){var F=this,I=arguments.callee;this.container.scrollLeft+=(this.level+1)*this.step;var H=this.container.childNodes[this.current];if(H&&(this.container.scrollLeft>H.offsetLeft)){this.stop();if("function"==typeof this.config.onFinished){this.config.onFinished.call(this)}return }else{this.level=Math.floor((this.current)/this.config.group);var G=(this.level+2)*this.config.group;if(G>=this.container.childNodes.length){this.build()}this.timer=setTimeout(function(){I.call(F)},20)}this.score=this.current-this.life;if("function"==typeof this.config.onScrolling){this.config.onScrolling.call(this)}};B.stop=function(){clearTimeout(this.timer);document.onkeydown=null};B.start=function(){this.scrolling()}})(window);
