/**
 * 导航栏功能：点击展开目录时，若子级目录仅一个元素，就展开子级目录
 */

// source/_static/expand-single-nav.js

function onNavBtnClick(tocBtn, e) {
    const tocBtnContainersCurr = tocBtn.parentElement; // reference internal
    const tocTreeListCurr = tocBtnContainersCurr.parentElement; // toctree-11 toctree-12 toctree-13 ...
    const expanded = tocTreeListCurr.getAttribute('aria-expanded');
    if (expanded == "false") {
        return;
    }
    const subToc = tocTreeListCurr.children[1]; // ul
    const subTocCnt = subToc.children.length; // num of li
    if (subTocCnt === 1) {
        subToc.children[0]// li
            .children[0]// reference internal
            .children[0]// button toctree-expand
            .click();
    }
}

function redirectHomePageUrl() {
    // 左上角 导航栏顶部的 HOME 按钮
    /*
    const logoBtns = document.getElementsByClassName('wy-side-nav-search'); // HTMLCollection
    const logoLink = Array.from(logoBtns).at(0).children[0];
    if (logoLink) {
        const logoLinkUrl = new URL(logoLink.href);
        if (logoLinkUrl.protocol !== 'http:' && logoLinkUrl.protocol !== 'https:') {
            return;
        }
        logoLink.href = '/gms_doc.html';
    }
    */
    // 正文出顶部左上角的 HOME 按钮 and 左上角 导航栏顶部的 HOME 按钮
    const homeBtns = document.getElementsByClassName('icon icon-home'); // HTMLCollection
    Array.from(homeBtns).forEach(homeLink => {
        if (homeLink) {
            const homeLinkUrl = new URL(homeLink.href);
            if (homeLinkUrl.protocol !== 'http:' && homeLinkUrl.protocol !== 'https:') {
                return;
            }
            if (window.location.pathname.startsWith('/gms/')) {
                homeLink.href = '/gms/gms_doc.html';
            } else {
                homeLink.href = '/gms_doc.html';
            }
        }
    });

    /*
    Array.from(document.querySelectorAll('footer')).find(footer => {
        footer.remove();
    });
    */
}

function expandNavAuto() {
    redirectHomePageUrl();

    // 选择所有导航中的二级菜单项（即只有一个子项的目录）
    console.log("expand-single-nav DOMContentLoaded");
    const menuVerts = document.getElementsByClassName('wy-menu wy-menu-vertical'); // HTMLCollection

    
    // const currTocBtnContainers = Array.from(menuVerts).at(0).getElementsByClassName('reference internal current');
    // console.log('currTocBtnContainers: ', currTocBtnContainers);
    // console.log('currTocBtnContainers: ', currTocBtnContainers.parentElement);
    // const currSubTocLen = currTocBtnContainers.parentElement.children.length;
    // if (currSubTocLen == 1) {

    // }

    if (true) {
        const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log('动态加载完成：', mutation);
            mutation.addedNodes.forEach(node => {
                const clsName = node.getAttribute('class');
                const titleName = node.getAttribute('title');
                if (clsName === 'toctree-expand' && titleName === 'Open/close menu') {
                    // console.log('动态加载完成 node：', node);
                    node.addEventListener('click', function(e){
                        // console.log('click：', e);
                        onNavBtnClick(node, e);
                    });
                } else if (clsName === 'reference internal current') {
                    console.log('动态加载完成 reference internal current node：', node);
                }
            });
        });
        });

        observer.observe(Array.from(menuVerts).at(0), {
        childList: true,
        subtree: true
        });
        return;
    }

    // const menuVerts = document.querySelector('.wy-menu.wy-menu-vertical');
    Array.from(menuVerts).forEach(menuVert => {
        const label = menuVert.getAttribute('aria-label');
        console.log('找到了menuVert：aria-label: ', label);
        console.log('找到了menuVert：', menuVert);

        const tocBtnContainers = menuVert.getElementsByClassName('reference internal');
        console.log('找到了 reference internal：length ', tocBtnContainers.length);
        Array.from(tocBtnContainers).forEach(tocBtnContainer => {
            tocBtns = tocBtnContainer.getElementsByClassName('toctree-expand'); // tocBtnContainer.querySelectorAll('button.toctree-expand')
            if (tocBtns.length < 1) {
                return;
            }
            console.log('找到了按钮：', tocBtns.length);
            console.log('找到了按钮：', tocBtnContainer.children);

            Array.from(tocBtns).forEach(tocBtn => {
                tocBtn.addEventListener('click', function(e) {
                    onNavBtnClick(tocBtn, e);
                    /*
                    console.log('点击了按钮：', e.target);
                    const tocBtnContainersCurr = tocBtn.parentElement; // reference internal
                    const tocTreeListCurr = tocBtnContainersCurr.parentElement; // toctree-11 toctree-12 toctree-13 ...
                    const expanded = tocTreeListCurr.getAttribute('aria-expanded');
                    if (expanded == "false") {
                        return;
                    }
                    console.log('点击了按钮：', tocTreeListCurr);
                    console.log('点击了按钮：', expanded);
                    const subToc = tocTreeListCurr.children[1]; // ul
                    const subTocCnt = subToc.children.length; // num of li
                    if (subTocCnt === 1) {
                        subToc.children[0]// li
                            .children[0]// reference internal
                            .children[0]// button toctree-expand
                            .click();
                    }
                    console.log('点击了按钮：', );
                    */
                });
            });
        });
    });
}


document.addEventListener('DOMContentLoaded', expandNavAuto);
// document.addEventListener('click', expandNavAuto);
