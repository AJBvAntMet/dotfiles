var m=Object.create;var l=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames;var v=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var k=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var w=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of b(t))!x.call(e,a)&&a!==r&&l(e,a,{get:()=>t[a],enumerable:!(n=p(t,a))||n.enumerable});return e};var y=(e,t,r)=>(r=e!=null?m(v(e)):{},w(t||!e||!e.__esModule?l(r,"default",{value:e,enumerable:!0}):r,e));var f=k((S,d)=>{var i=!0,s=!1,o=!1;d.exports=function(e,t){t&&(i=!t.enabled,s=!!t.label,o=!!t.labelAfter),e.core.ruler.after("inline","github-task-lists",function(r){for(var n=r.tokens,a=2;a<n.length;a++)L(n,a)&&(I(n[a],r.Token),c(n[a-2],"class","task-list-item"+(i?"":" enabled")),c(n[g(n,a-2)],"class","contains-task-list"))})};function c(e,t,r){var n=e.attrIndex(t),a=[t,r];n<0?e.attrPush(a):e.attrs[n]=a}function g(e,t){for(var r=e[t].level-1,n=t-1;n>=0;n--)if(e[n].level===r)return n;return-1}function L(e,t){return R(e[t])&&A(e[t-1])&&E(e[t-2])&&P(e[t])}function I(e,t){if(e.children.unshift(_(e,t)),e.children[1].content=e.children[1].content.slice(3),e.content=e.content.slice(3),s)if(o){e.children.pop();var r="task-item-"+Math.ceil(Math.random()*(1e4*1e3)-1e3);e.children[0].content=e.children[0].content.slice(0,-1)+' id="'+r+'">',e.children.push(O(e.content,r,t))}else e.children.unshift(C(t)),e.children.push(M(t))}function _(e,t){var r=new t("html_inline","",0),n=i?' disabled="" ':"";return e.content.indexOf("[ ] ")===0?r.content='<input class="task-list-item-checkbox"'+n+'type="checkbox">':(e.content.indexOf("[x] ")===0||e.content.indexOf("[X] ")===0)&&(r.content='<input class="task-list-item-checkbox" checked=""'+n+'type="checkbox">'),r}function C(e){var t=new e("html_inline","",0);return t.content="<label>",t}function M(e){var t=new e("html_inline","",0);return t.content="</label>",t}function O(e,t,r){var n=new r("html_inline","",0);return n.content='<label class="task-list-item-label" for="'+t+'">'+e+"</label>",n.attrs=[{for:t}],n}function R(e){return e.type==="inline"}function A(e){return e.type==="paragraph_open"}function E(e){return e.type==="list_item_open"}function P(e){return e.content.indexOf("[ ] ")===0||e.content.indexOf("[x] ")===0||e.content.indexOf("[X] ")===0}});var h=y(f());var u=`.contains-task-list {
    padding-left: 0;
}

.contains-task-list li {
    margin-left: 24px;
}

.contains-task-list .task-list-item {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
}

.contains-task-list .contains-task-list {
    padding-left: 20px;
} `;async function q(e){let t=await e.getRenderer("vscode.markdown-it-renderer");if(!t)throw new Error("Could not load 'vscode.markdown-it-renderer'");let r=document.createElement("style");r.textContent=u;let n=document.createElement("template");n.classList.add("markdown-style"),n.content.appendChild(r),document.head.appendChild(n),t.extendMarkdownIt(a=>a.use(()=>a.use(h.default)))}export{q as activate};
