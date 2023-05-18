document.getElementById('find-image').addEventListener('click', () => {
    // 立即执行
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.storage.sync.set(
            { img2hubExec: true },
            () => {
              console.log("img2hubExec storage set: true");
            }
        );
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['assets/js/img2hub.js']
        });
    });
});

// const bg = chrome.extension.getBackgroundPage()
document.getElementById('setting-hub-conf').addEventListener('click', () => {
    window.open('options.html', '_blank');
});

const currentYear = new Date().getFullYear();
document.getElementById('copyright').innerHTML =
    '&copy; ' + currentYear + ' <a href="https://github.com/itcuihao" target="_blank">@haoc</a>';
  
  