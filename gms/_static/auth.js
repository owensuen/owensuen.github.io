
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str); // 转为 Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', data); // 计算哈希
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // 转为字节数组
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // 转为十六进制
  return hashHex;
}

// auth.js - 所有受保护页面共用的鉴权逻辑
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let redirectUrl = '/login.html';
    if ((window.location.protocol === 'http:' || window.location.protocol === 'https:')
      && window.location.pathname.startsWith('/gms/')) {
      redirectUrl = '/gms/login.html';
    }
    // alert('密码错误，访问被拒绝');
    // hashString("xxxxxx").then(hash => {
    //     console.log(hash); 
    // });
    // const hash = CryptoJS.SHA256("sagereal").toString();// 'crypto-js/sha256'
    // console.log(hash);


    if (!isLoggedIn) {
        const sessionLoggedIn = sessionStorage.getItem('isSessionLoggedIn')
        if (sessionLoggedIn && sessionLoggedIn === 'true') {
            localStorage.setItem('isLoggedIn', 'true');// 处理刷新问题
        } else {
            // 阻止页面内容渲染，直接跳转
            // document.body.innerHTML = `
            //     <div style="text-align: center; padding: 4rem; font-family: Arial, sans-serif; background: #f8f9fa;">
            //         <h2>🚫 未授权访问</h2>
            //         <p>您尚未登录，或会话已过期。</p>
            //         <a href="${redirectUrl}" style="display: inline-block; margin-top: 1rem; padding: 0.8rem 1.5rem; background: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">返回登录页</a>
            //     </div>
            // `;
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            document.body.style.margin = '0';
            document.body.style.padding = '2rem';
            document.body.style.minHeight = '100vh';
            document.body.innerHTML = `
            `;

            // 记录目标地址以供登陆后直接跳转到目标地址 start
            if (window.location.href) {
                localStorage.setItem('sessionTargetUrl', "" + window.location.href);
            }
            // 记录目标地址以供登陆后直接跳转到目标地址 end
            window.location.href = redirectUrl;
            return;
        }
    }

    if (window.location.href) {
        const urlStr = window.location.href.toString();
        const rootUrlPath = window.location.protocol + '//' + window.location.host;
        if (urlStr === rootUrlPath + '/' ||
            urlStr === rootUrlPath + '/login.html' ||
            urlStr === rootUrlPath + '/index.html' ||
            urlStr === rootUrlPath + '/gms/login.html' ||
            urlStr === rootUrlPath + '/gms/index.html' ||
            urlStr === rootUrlPath
        ) {
            if ((window.location.protocol === 'http:' || window.location.protocol === 'https:')
                && window.location.pathname.startsWith('/gms/')) {
                window.location.href = '/gms/gms_doc.html';
            } else {
                window.location.href = '/gms_doc.html';
            }
            console.log('redirect to href: ', window.location.href);
            return;
        }
    }

    var ctrlPressed = false
    var f5Pressed = false
    var triggerCtrlF5Refresh = false

    window.addEventListener('load', function(event) {
        // console.log("load " + event.type + ", " + event.target + ", " + event.target.tagName);
        if (event.target === "object HTMLDocument") {
            ctrlPressed = false
            f5Pressed = false
        }

        const savedState = sessionStorage.getItem('appSessionState');
        if (savedState) {
            console.log('appSessionState: ' + savedState);
        } else {
            console.log('appSessionState: null');
        }
        sessionStorage.setItem('appSessionState', "sessionAlive");

        const loadCountStr = localStorage.getItem('loadCount');// 'loadCount' 标记用于统计当前有多少个页面打开了保密页面
        var loadCount = loadCountStr ? parseInt(loadCountStr) : 0;
        localStorage.setItem('loadCount', loadCount + 1);
        console.log("load loadCount: " + (loadCount + 1));

        const unloading = sessionStorage.getItem('unloading');
        // if (unloading) {
            
        //     const loadCountStr = localStorage.getItem('loadCount');
        //     var loadCount = loadCountStr ? parseInt(loadCountStr) : 0;
        //     if (loadCount < 0) {
        //         loadCount = 0;
        //         localStorage.setItem('loadCount', 0);
        //     } else if (loadCount === 1) {

        //     } else {
        //         localStorage.setItem('loadCount', loadCount - 1);
        //     }
        //     console.log("unload loadCount: " + loadCount);
        // }
        sessionStorage.removeItem('unloading');
    });

    window.addEventListener('beforeunload', function(event) {
        // console.log("beforeunload " + event);
        if (triggerCtrlF5Refresh) {
            // localStorage.clear();
            // with sessionStorage, Ctrl + F5 do not clear localStorage
        } else if (f5Pressed) {
            // localStorage.clear();
            // F5 do not clear localStorage
        }
    // }); // 'unload' not working on Chrome

    // window.addEventListener('unload', function(event) { // 'unload' not working on Chrome
        console.log("unload " + event);
        const unloading = sessionStorage.getItem('unloading');// 'unloading' 标记用于规避单页面反复快速按 F5 刷新导致的 'loadCount' 标记递减
        if (unloading && unloading === 'yes') {
            // localStorage.clear();
            return
        } else {
            sessionStorage.setItem('unloading', "yes");
        }
        const loadCountStr = localStorage.getItem('loadCount');
        var loadCount = loadCountStr ? parseInt(loadCountStr) : 0;
        if (loadCount < 1) {
            loadCount = 0;
            localStorage.setItem('loadCount', 0);
            localStorage.removeItem('isLoggedIn');// 'loadCount' 标记为 0 表明无页面打开，故移除 'isLoggedIn'
        } else if (loadCount === 1) {
            localStorage.setItem('loadCount', 0);
            localStorage.removeItem('isLoggedIn');// 'loadCount' 标记为 0 表明无页面打开，故移除 'isLoggedIn'
            // 为确保用户关闭最后一个页面时能够移除 'isLoggedIn'，必须有上述 removeItem 逻辑；
            // 但是这会导致最后一个页面刷新的时候 'isLoggedIn' 标签被移除，导致需要重新登陆；
            // 为解决此问题，使用 sessionStorage 额外处理
            sessionStorage.setItem('isSessionLoggedIn', "true");
        // } else if (loadCount === 2) {
        //     localStorage.setItem('loadCount', 0);
        //     localStorage.removeItem('isLoggedIn');// 'loadCount' 标记为 0 表明无页面打开，故移除 'isLoggedIn'
        } else {
            localStorage.setItem('loadCount', (loadCount - 1));
        }
        console.log("unload loadCount: " + loadCount);
    });

    // window.addEventListener('pagehide', function(event) {
    //     console.log("pagehide " + event);
    // });

    window.addEventListener('keydown', function(event) {
        // console.log("keydown " + event.key + ", " + event.coed);
        if (event.key === "Control") {
            ctrlPressed = true
            // console.log("keydown ctrlPressed true");
        } else if (event.key === "F5") {
            f5Pressed = true
            // console.log("keydown f5Pressed true");
            if (ctrlPressed) {
                triggerCtrlF5Refresh = true
            }
        }
    });

    window.addEventListener('keyup', function(event) {
        console.log("keyup " + event.key + ", " + event.coed);
        if (event.key === "Control") {
            ctrlPressed = false
            // console.log("keyup ctrlPressed false");
        } else if (event.key === "F5") {
            f5Pressed = false
            // console.log("keyup f5Pressed false");
        }
    });

    // 如果已登录，显示页面内容（默认已加载）
    /**
     * 注释掉如下逻辑，解决刷新、跳转闪烁一下页面的问题
     */
    /*
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = 1;
    }, 100);
    */
}

