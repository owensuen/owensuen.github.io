
async function hashString(str) {
 const isSecure = window.location.protocol === 'https:';
 const isLoopback = window.location.hostname === '127.0.0.1';
 if (isSecure || isLoopback) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str); // 转为 Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', data); // 计算哈希
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // 转为字节数组
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // 转为十六进制
  return hashHex;
 } else {
  return CryptoJS.SHA256(str).toString();// 'crypto-js/sha256'
 }
}

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const VALID_PASSWORD = "190d85db6bc0127179cbb4c440d6d0ccfe824a927f5356944ce1e011d299bdcc"; // 你可以修改为任意密码

    hashString(password).then(hash => {
        console.log("password hash: " + hash); 
        if (hash === VALID_PASSWORD) {
            localStorage.setItem('isLoggedIn', 'true');
            // 记录目标地址以供登陆后直接跳转到目标地址 start
            const sessionTargetUrl = localStorage.getItem('sessionTargetUrl');
            localStorage.removeItem('sessionTargetUrl');
            console.log("getItem sessionTargetUrl " + sessionTargetUrl);
            if (sessionTargetUrl) {
                const url = new URL(sessionTargetUrl);
                if (url.pathname === '/'
                    || url.pathname === '/login.html'
                    || url.pathname === '/index.html'
                    || url.pathname === '/gms/login.html'
                    || url.pathname === '/gms/index.html') {
                    if ((url === 'http:' || url === 'https:')
                        && url.startsWith('/gms/')) {
                        window.location.href = '/gms/gms_doc.html';
                    } else {
                        window.location.href = 'gms_doc.html';
                    }
                } else {
                    window.location.href = sessionTargetUrl;
                }
            } else {
                if ((window.location.protocol === 'http:' || window.location.protocol === 'https:')
                    && window.location.pathname.startsWith('/gms/')) {
                    window.location.href = '/gms/gms_doc.html';
                } else {
                    window.location.href = 'gms_doc.html';
                }
            }
            // 记录目标地址以供登陆后直接跳转到目标地址 end
        } else {
            const errorMsg = document.getElementById("errorMessage");
            errorMsg.textContent = "密码错误，请重试。";
            errorMsg.style.display = "block";
            document.getElementById("password").value = ""; // 清空密码框
        }
    });
});
