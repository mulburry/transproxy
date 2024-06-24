javascript:(function() {
    function createFloatingWindow() {
        var div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.right = '10px';
        div.style.width = '400px';
        div.style.backgroundColor = 'white';
        div.style.border = '1px solid black';
        div.style.padding = '10px';
        div.style.zIndex = '10000';

        var closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.marginBottom = '10px';
        closeBtn.style.color = '#088c99';
        closeBtn.style.border = '0px';
        closeBtn.onclick = function() {
            document.body.removeChild(div);
        };
        
        var contentDiv = document.createElement('div');
        contentDiv.id = 'div_trans_content';
        contentDiv.style.border = '1px solid #088cdb';
        contentDiv.style.color = 'black';
        contentDiv.style.padding = '2px 5px 2px 5px';
        contentDiv.style.overflow = 'auto';
        contentDiv.innerHTML = 'loading';

        div.appendChild(closeBtn);
        div.appendChild(contentDiv);
        document.body.appendChild(div);
    }
    
    function showTranslation(content) {
        contentDiv = document.getElementById('div_trans_content');
        contentDiv.innerHTML = content;
    }
    
    createFloatingWindow();

    var selection = window.getSelection().toString();
    if (!selection) {
        showTranslation('请先选择要翻译的文本');
        return;
    }

    var key = 'mykey...';
    var serverUrl = 'https://mysite/transproxy/?key=' + key + '&text=' + encodeURIComponent(selection) + '&target=zh-CN';

    fetch(serverUrl)
        .then(response => response.json())
        .then(data => {
            if (data.translated_text) {
                showTranslation(data.translated_text);
            } else {
                showTranslation('翻译失败，请稍后再试。');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showTranslation('翻译失败，请稍后再试。');
        });
})();
