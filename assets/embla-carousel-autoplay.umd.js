!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(n="undefined"!=typeof globalThis?globalThis:n||self).EmblaCarouselAutoplay=t()}(this,(function(){"use strict";const n={active:!0,breakpoints:{},delay:4e3,jump:!1,playOnInit:!0,stopOnFocusIn:!0,stopOnInteraction:!0,stopOnMouseEnter:!1,stopOnLastSnap:!1,rootNode:null};function t(o={}){let e,i,r,a=!1,s=!0,l=!1,u=0;function c(){if(r)return;if(!s)return;a||i.emit("autoplay:play");const{ownerWindow:n}=i.internalEngine();n.clearInterval(u),u=n.setInterval(g,e.delay),a=!0}function p(){if(r)return;a&&i.emit("autoplay:stop");const{ownerWindow:n}=i.internalEngine();n.clearInterval(u),u=0,a=!1}function d(){if(f())return s=a,p();s&&c()}function f(){const{ownerDocument:n}=i.internalEngine();return"hidden"===n.visibilityState}function y(n){void 0!==n&&(l=n),s=!0,c()}function g(){const{index:n}=i.internalEngine(),t=n.clone().add(1).get(),o=i.scrollSnapList().length-1;e.stopOnLastSnap&&t===o&&p(),i.canScrollNext()?i.scrollNext(l):i.scrollTo(0,l)}return{name:"autoplay",options:o,init:function(a,u){i=a;const{mergeOptions:y,optionsAtMedia:g}=u,O=y(n,t.globalOptions),m=y(O,o);if(e=g(m),i.scrollSnapList().length<=1)return;l=e.jump,r=!1;const{eventStore:I,ownerDocument:v}=i.internalEngine(),b=i.rootNode(),w=e.rootNode&&e.rootNode(b)||b,E=i.containerNode();i.on("pointerDown",p),e.stopOnInteraction||i.on("pointerUp",c),e.stopOnMouseEnter&&(I.add(w,"mouseenter",(()=>{s=!1,p()})),e.stopOnInteraction||I.add(w,"mouseleave",(()=>{s=!0,c()}))),e.stopOnFocusIn&&(I.add(E,"focusin",p),e.stopOnInteraction||I.add(E,"focusout",c)),I.add(v,"visibilitychange",d),e.playOnInit&&!f()&&c()},destroy:function(){i.off("pointerDown",p).off("pointerUp",c),p(),r=!0,a=!1},play:y,stop:function(){a&&p()},reset:function(){a&&y()},isPlaying:function(){return a}}}return t.globalOptions=void 0,t}));