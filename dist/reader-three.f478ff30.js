parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"Q8gO":[function(require,module,exports) {
console.log("Three-js included?",!!THREE),!1===WEBGL.isWebGLAvailable()&&document.body.appendChild(WEBGL.getWebGLErrorMessage());var e=[];e.push("body2"),e.push("body"),e.push("transmission");var t=[];t.push("wheel-1"),t.push("tire-1");var n,o,d,h=new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,1e3),l=new THREE.Scene,c=new THREE.WebGLRenderer({antialias:!0}),a=new THREE.STLLoader,s=new THREE.MeshPhongMaterial({color:6710886,flatShading:!1,side:THREE.DoubleSide}),m={},p={r:.2,g:.3,b:.4},E=12,u=1.5,w=-49,_=218,g=150,f=34.5;function v(e){var t="data/"+e+".stl";a.load(t,function(t){t.computeBoundingBox();var n=new THREE.Mesh(t,s);l.add(n),S(l),m[e]={},m[e].mesh=n,m[e].bbox=t.boundingBox})}function b(e){var t="data/"+e+".stl";a.load(t,function(t){t.computeBoundingBox();var n=new THREE.Mesh(t,s);m[e]={},m[e].mesh=n,m[e].bbox=t.boundingBox,"tire-1"===e&&k(),"tire-1"===e&&T("tire-1"),"wheel-1"===e&&C()})}function T(e){for(vec=m[e].mesh.geometry.attributes.position.array,cnt=m[e].mesh.geometry.attributes.position.count,r=[],i=0;i<cnt;i++)x=vec[3*i+0],y=vec[3*i+1],z=vec[3*i+2],r.push(Math.sqrt(x*x+y*y));r_min=R.reduce(R.min,1e4,r),r_max=R.reduce(R.max,-1e4,r),m[e].radii=R.map(function(e){return(e-r_min)/(r_max-r_min)},r)}function k(){geom=m["tire-1"].mesh.geometry;var e=new THREE.Mesh(geom.clone(),s),t=new THREE.Mesh(geom.clone(),s),n=new THREE.Mesh(geom.clone(),s),i=new THREE.Mesh(geom.clone(),s);l.add(e),l.add(t),l.add(n),l.add(i),m.tire_lf={},m.tire_rf={},m.tire_lr={},m.tire_rr={},m.tire_lf.mesh=e,m.tire_rf.mesh=t,m.tire_lr.mesh=n,m.tire_rr.mesh=i,H(),S(l)}function H(){m.tire_lf.mesh.geometry.rotateX(THREE.Math.degToRad(90)),m.tire_rf.mesh.geometry.rotateX(THREE.Math.degToRad(-90)),m.tire_lr.mesh.geometry.rotateX(THREE.Math.degToRad(90)),m.tire_rr.mesh.geometry.rotateX(THREE.Math.degToRad(-90)),m.tire_lf.mesh.position.x=E-_/2,m.tire_lf.mesh.position.y=u-g/2,m.tire_lf.mesh.position.z=w+f,m.tire_rf.mesh.position.x=E-_/2,m.tire_rf.mesh.position.y=u+g/2,m.tire_rf.mesh.position.z=w+f,m.tire_lr.mesh.position.x=E+_/2,m.tire_lr.mesh.position.y=u-g/2,m.tire_lr.mesh.position.z=w+f,m.tire_rr.mesh.position.x=E+_/2,m.tire_rr.mesh.position.y=u+g/2,m.tire_rr.mesh.position.z=w+f}function M(){m.wheel_lf.mesh.geometry.rotateX(THREE.Math.degToRad(90)),m.wheel_rf.mesh.geometry.rotateX(THREE.Math.degToRad(-90)),m.wheel_lr.mesh.geometry.rotateX(THREE.Math.degToRad(90)),m.wheel_rr.mesh.geometry.rotateX(THREE.Math.degToRad(-90)),m.wheel_lf.mesh.position.x=E-_/2,m.wheel_lf.mesh.position.y=u-g/2,m.wheel_lf.mesh.position.z=w+f,m.wheel_rf.mesh.position.x=E-_/2,m.wheel_rf.mesh.position.y=u+g/2,m.wheel_rf.mesh.position.z=w+f,m.wheel_lr.mesh.position.x=E+_/2,m.wheel_lr.mesh.position.y=u-g/2,m.wheel_lr.mesh.position.z=w+f,m.wheel_rr.mesh.position.x=E+_/2,m.wheel_rr.mesh.position.y=u+g/2,m.wheel_rr.mesh.position.z=w+f}function C(){geom=m["wheel-1"].mesh.geometry;var e=new THREE.Mesh(geom.clone(),s),t=new THREE.Mesh(geom.clone(),s),n=new THREE.Mesh(geom.clone(),s),i=new THREE.Mesh(geom.clone(),s);l.add(e),l.add(t),l.add(n),l.add(i),m.wheel_lf={},m.wheel_rf={},m.wheel_lr={},m.wheel_rr={},m.wheel_lf.mesh=e,m.wheel_rf.mesh=t,m.wheel_lr.mesh=n,m.wheel_rr.mesh=i,M(),S(l),c.render(l,h)}function B(e){var t=new THREE.Box3;return l.traverse(function(e){e instanceof THREE.Mesh&&t.expandByObject(e)}),t}function L(e,t){if(e.isEmpty()&&console.log("scene empty"),!e.isEmpty()){var n=new THREE.Vector3;e.getSize(n);var i=new THREE.Vector3;e.getCenter(i);var o=new THREE.Vector3;t.getWorldDirection(o);var r=t.fov*(Math.PI/180),d=Math.abs(n.length()/Math.sin(r/2));d*=1;var h=i.add(o.multiplyScalar(-d));0,t.position.copy(h),t.far=2*d,t.updateProjectionMatrix()}}function S(e){bb=B(e),L(bb,h)}function I(){for(i in c.setPixelRatio(window.devicePixelRatio),c.setSize(.65*window.innerWidth,.65*window.innerHeight),document.getElementById("MyScene").appendChild(c.domElement),(n=new THREE.TrackballControls(h,c.domElement)).rotateSpeed=2.5,n.zoomSpeed=-2.2,n.panSpeed=.8,n.noZoom=!1,n.noPan=!1,n.staticMoving=!0,n.dynamicDampingFactor=.3,n.keys=[65,83,68],n.addEventListener("change",X),l.background=new THREE.Color(13421772),l.background=new THREE.Color(0),l.background.setRGB(.2,.3,.4),e)v(e[i]);for(i in t)b(t[i]);(d=new THREE.DirectionalLight(16777215)).position.copy(h.position),l.add(d);var o=new THREE.AmbientLight(16777215);l.add(o),window.addEventListener("resize",W,!1),X()}function W(){h.aspect=window.innerWidth/window.innerHeight,h.updateProjectionMatrix(),c.setSize(.65*window.innerWidth,.65*window.innerHeight),n.handleResize(),X()}function P(){requestAnimationFrame(P),n.update()}function X(){d.position.copy(h.position),c.render(l,h)}function G(e){var t=document.getElementById("checkboxes"),n=document.createElement("dl");n.id="checkboxes_dl";var i=document.createElement("dt");i.innerHTML="Part visibility",n.appendChild(i);for(var o=0;o<e.length;o++){var r=e[o];console.log(r);var d=document.createElement("dd"),a=document.createElement("input");a.type="checkbox",a.id="chk"+e[o],a.name="chk"+e[o],a.value="value",a.checked=!0,a.onclick=function(e){return function(){checked=document.getElementById("chk"+e).checked,m[e].mesh.visible=checked,c.render(l,h)}}(r);var s=document.createElement("label");s.htmlFor="chk"+e[o],s.appendChild(document.createTextNode(e[o])),d.appendChild(a),d.appendChild(s),n.appendChild(d)}t.appendChild(n)}function F(){var e=document.getElementById("checkboxes_dl"),t=document.createElement("dd"),n=document.createElement("input");n.type="checkbox",n.id="chk_tires",n.name="chk_tires",n.value="value",n.checked=!0,n.onclick=function(){checked=document.getElementById("chk_tires").checked,m.tire_lf.mesh.visible=checked,m.tire_rf.mesh.visible=checked,m.tire_lr.mesh.visible=checked,m.tire_rr.mesh.visible=checked,c.render(l,h)};var i=document.createElement("label");i.htmlFor="chk_tires",i.appendChild(document.createTextNode("tires")),t.appendChild(n),t.appendChild(i),e.appendChild(t)}function j(){var e=document.getElementById("checkboxes_dl"),t=document.createElement("dd"),n=document.createElement("input");n.type="checkbox",n.id="chk_wheels",n.name="chk_wheels",n.value="value",n.checked=!0,n.onclick=function(){checked=document.getElementById("chk_wheels").checked,m.wheel_lf.mesh.visible=checked,m.wheel_rf.mesh.visible=checked,m.wheel_lr.mesh.visible=checked,m.wheel_rr.mesh.visible=checked,c.render(l,h)};var i=document.createElement("label");i.htmlFor="chk_wheels",i.appendChild(document.createTextNode("wheels")),t.appendChild(n),t.appendChild(i),e.appendChild(t)}function D(e,t){var n="color_"+e;console.log(n);var i=document.getElementById(n),o=document.createElement("label");o.innerHTML=n+":";var r=document.createElement("input");r.type="range",r.min="0",r.max="1",r.step="0.1",r.value=t,r.oninput=function(){p[e]=this.value,document.getElementById(n+"_label").innerHTML=p[e],l.background.setRGB(p.r,p.g,p.b),c.render(l,h)};var d=document.createElement("em");d.id=n+"_label",d.style="font-style: normal",d.innerHTML=t,i.appendChild(o),i.appendChild(r),i.appendChild(d)}G(e),j(),F(),D("r",p.r),D("g",p.g),D("b",p.b),I(),P();
},{}]},{},["Q8gO"], null)
//# sourceMappingURL=/reader-three.f478ff30.map