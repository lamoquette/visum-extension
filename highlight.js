if(document.readyState !== 'complete') {
    window.addEventListener('load',afterDOMLoaded);
} else {
    afterDOMLoaded();
}

function afterDOMLoaded(){
    /*
    var elementPrefixed = [].filter.call(document.querySelectorAll('*'), function (el) {
        // '\b' is a word-boundary,
        // 'element' is the literal string
        // \d+ is a string of numeric characters, of length one or more:
        return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(el?.innerHTML?.toLowerCase());c
    });
    
    // iterates over the found elements, to show those elements that were found:
    [].forEach.call(elementPrefixed, function (el) {
    
        var mail = el.innerHTML.toLowerCase().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)[0]
    
        el.onclick = function (event) {
            event.preventDefault();
        }
        var dateSpan = document.createElement('span')
        dateSpan.onclick = () => {
            chrome.runtime.sendMessage({ searchLinkedIn: mail }, function (response) {
    
            });
        }
        dateSpan.innerHTML = "🦉";
        dateSpan.setAttribute('style', 'margin-left: 5px;cursor:pointer;');
        el.appendChild(dateSpan);
    });*/

    setTimeout(function() {
        var el = document.getElementById("ember49");
        var dateSpan = document.createElement('div')
        dateSpan.innerHTML = "Visum it 🦉";
        dateSpan.setAttribute('style', 'cursor:pointer;background-image: linear-gradient(to right, rgb(247, 107, 28), rgb(250, 217, 97));color: white !important;font-size: 1.6rem;border-radius: 15px;padding: .6rem 1.2rem;min-height: 3.2rem;line-height: 2rem;font-family: inherit;font-weight: 600;');
        el.appendChild(dateSpan);
        el.insertBefore(dateSpan, el.firstChild);
    }, 5000);

    
    /*
    // iterates over the found elements, to show those elements that were found:
    [].forEach.call(elementPrefixed, function (el) {

        var dateSpan = document.createElement('div')
        dateSpan.innerHTML = "Visum it 🦉";
        dateSpan.setAttribute('style', 'margin-left: 5px;cursor:pointer;');
        el.appendChild(dateSpan);
    });*/
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "linkedin_url") {
            
            navigator.clipboard.writeText(request.linkedInUrl)
        }
    }
);