if(!self.define){let e,i={};const o=(o,c)=>(o=new URL(o+".js",c).href,i[o]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=o,e.onload=i,document.head.appendChild(e)}else e=o,importScripts(o),i()})).then((()=>{let e=i[o];if(!e)throw new Error(`Module ${o} didn’t register its module`);return e})));self.define=(c,r)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(i[f])return;let n={};const s=e=>o(e,f),d={module:{uri:f},exports:n,require:s};i[f]=Promise.all(c.map((e=>d[e]||s(e)))).then((e=>(r(...e),n)))}}define(["./workbox-5d0b2bdf"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"favicon/android-chrome-192x192.png",revision:"3334d7bba96c7178f92c82289b2ec849"},{url:"favicon/android-chrome-512x512.png",revision:"4627a24baca23babdba6456c7929c033"},{url:"favicon/apple-touch-icon.png",revision:"1619380888c50472fd17133c57cf681c"},{url:"favicon/favicon-16x16.png",revision:"26dc07d154d6bff7281465bf430344f6"},{url:"favicon/favicon-32x32.png",revision:"280fe5549bfcd59b218c2b492ef75f15"},{url:"favicon/favicon.ico",revision:"4da5b6faadd3fda58361fdfef638c1e3"},{url:"fonts/CircularStd-Bold.otf",revision:"e7d8d6236925285b4445f933aebb68f3"},{url:"fonts/CircularStd-Book.otf",revision:"4f84355b5c00ed31cdcf994158c0af39"},{url:"fonts/CircularStd-Medium.otf",revision:"35be8fce7bdccf610b76528990f76136"},{url:"fonts/index.css",revision:"8711e169f3dc54f34d839f18d7acef21"},{url:"fonts/Roboto-Bold.ttf",revision:"e07df86cef2e721115583d61d1fb68a6"},{url:"fonts/Roboto-Regular.ttf",revision:"11eabca2251325cfc5589c9c6fb57b46"},{url:"icons/ic_analytics.svg",revision:"356b7f532a580f07b8b7e0f86fe5ceea"},{url:"icons/ic_banking.svg",revision:"bd920e249e265e9546d8e42a726ce751"},{url:"icons/ic_blog.svg",revision:"a34c0d3046096c4dc3a90e79ab57a6c3"},{url:"icons/ic_booking.svg",revision:"19db467e176f85ee8aaace5b967cafef"},{url:"icons/ic_calendar.svg",revision:"e821271a8dc5273615571b7d283e9242"},{url:"icons/ic_cart.svg",revision:"aa9740e3d3a44f6c9cb3f98f2c0f781e"},{url:"icons/ic_chat.svg",revision:"704e574bfeb926d5cdc389c5d2c38813"},{url:"icons/ic_dashboard.svg",revision:"bd60ee7c05e71db0a13684ec8180729c"},{url:"icons/ic_ecommerce.svg",revision:"5989fd7d993b35515795eed22e988e27"},{url:"icons/ic_kanban.svg",revision:"097e1d99449b6395f4e947aeb95075df"},{url:"icons/ic_mail.svg",revision:"0422394bed25c0bbd0f2f9e7ba17e01e"},{url:"icons/ic_user.svg",revision:"46ef665540a7ecf243bd91a44e35b570"},{url:"index.html",revision:"21794eebb576a10bb4a011f78ab92831"},{url:"logo/logo_full.jpg",revision:"ea3206d2edb3605cefbd555ccaf919b2"},{url:"logo/logo_full.svg",revision:"b3225e6e195eb86367125f7a8cd94ba1"},{url:"logo/logo_single.svg",revision:"117be1751c5e71cf16f6ea4792afc55b"},{url:"logo/logo-ccp.png",revision:"447285d945a88825875d9b427bfd0afe"},{url:"logo/logo-prro.png",revision:"bbc106e3c711f66f04416cf7544d4020"},{url:"manifest.json",revision:"2ff0edd5dc0271955beb77b6843e7f3c"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map