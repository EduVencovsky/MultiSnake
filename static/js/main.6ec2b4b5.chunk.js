(this["webpackJsonpmulti-snake-web"]=this["webpackJsonpmulti-snake-web"]||[]).push([[0],{49:function(e,n,t){},50:function(e,n,t){},85:function(e,n,t){"use strict";t.r(n);var r=t(1),c=t(0),o=t.n(c),i=t(38),u=t.n(i),a=(t(49),t(21)),l=(t(50),t(39)),s=t(40),d=t(42);function b(){var e=Object(s.a)(["\n  width: 25px;\n  height: 25px;\n  border: 1px solid white;\n  background-color: ",";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"]);return b=function(){return e},e}var j=["\ud83c\udf53","\ud83c\udf47","\ud83c\udf48","\ud83c\udf49","\ud83c\udf4a","\ud83c\udf4b","\ud83c\udf4c","\ud83c\udf4d","\ud83e\udd6d","\ud83c\udf4e","\ud83c\udf4f","\ud83c\udf50","\ud83c\udf51","\ud83c\udf52"],f=d.a.div(b(),(function(e){return e.tile.player?e.playerId===e.tile.player.id?"deepskyblue":"white":"rgba(0,0,0,0)"})),w=function(e){var n=e.children,t=e.tile,o=e.playerId,i=Object(c.useMemo)((function(){return j[Math.floor(Math.random()*j.length)]}),[]);return Object(r.jsxs)(f,{tile:t,playerId:o,children:[t.fruit&&i,n]})},p=t(22),O=t(23);function v(e,n){var t=Object(c.useCallback)((function(t){var r=t.key,c=Object(O.a)(t,["key"]);r===e&&n(Object(p.a)({key:r},c))}),[e,n]),r=Object(c.useCallback)((function(t){var r=t.key,c=Object(O.a)(t,["key"]);r===e&&n(Object(p.a)({key:r},c))}),[e,n]);Object(c.useEffect)((function(){return window.addEventListener("keydown",t),window.addEventListener("keyup",r),function(){window.removeEventListener("keydown",t),window.removeEventListener("keyup",r)}}),[t,r])}var y="".concat("wss","://").concat("venkos-multi-snake.herokuapp.com"),k=new l.Manager(y).socket("/");console.log("isProd",true),console.log("isProd",y);var h=function(){var e=Object(c.useState)(),n=Object(a.a)(e,2),t=n[0],o=n[1],i=Object(c.useState)(null),u=Object(a.a)(i,2),l=u[0],s=u[1],d=Object(c.useRef)(k);Object(c.useEffect)((function(){d.current.io.on("connect",(function(){console.log("connect ".concat(d.current.id))})),d.current.io.on("error",(function(e){console.error(e)}))}),[]),Object(c.useEffect)((function(){d.current.on("game-status",(function(e){console.log(e),null!==e.winner&&"string"===typeof e.winner&&s("draw"===e.winner?"draw":e.winner===d.current.id?"win":"lose"),o(e.board)}))}),[]);var b=Object(c.useCallback)((function(e){d.current.emit("move-player",d.current.id,"left")}),[]),j=Object(c.useCallback)((function(e){d.current.emit("move-player",d.current.id,"right")}),[]),f=Object(c.useCallback)((function(e){d.current.emit("move-player",d.current.id,"up")}),[]),p=Object(c.useCallback)((function(e){d.current.emit("move-player",d.current.id,"down")}),[]);return v("ArrowLeft",b),v("ArrowRight",j),v("ArrowUp",f),v("ArrowDown",p),console.log(l),Object(r.jsx)("div",{className:"App",children:Object(r.jsxs)("header",{className:"App-header",children:[Object(r.jsx)("div",{children:"Welcome"}),Object(r.jsx)("div",{children:null!==l&&("draw"===l?"Draw":"win"===l?"You Win":"You Lose")}),Object(r.jsx)("div",{style:{display:"flex"},children:t&&t.map((function(e,n){return Object(r.jsx)("div",{children:e.map((function(e,n){return Object(r.jsx)(w,{tile:e,playerId:d.current.id},n)}))},n)}))})]})})};u.a.render(Object(r.jsx)(o.a.StrictMode,{children:Object(r.jsx)(h,{})}),document.getElementById("root"))}},[[85,1,2]]]);
//# sourceMappingURL=main.6ec2b4b5.chunk.js.map