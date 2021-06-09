var problemWithOutlook = false;

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

async function watchContactElement() {
  var isPresent = false;

  while(!isPresent && !problemWithOutlook) {
    isPresent = getElementByXpath("html/body/div[2]/div/div[2]/div[2]/div[3]/div/div[2]/div/div[3]/div/div/div/div/div[1]/div[2]/div/button[4]/span/span/span") || getElementByXpath("/html/body/div[2]/div/div[2]/div[2]/div[3]/div/div[2]/div/div[1]/div/div[2]/div/button[1]")
    await new Promise(r => setTimeout(r, 500));
  }

  var LokiAuthToken = sessionStorage.getItem("LokiAuthToken");

  navigator.clipboard.writeText(LokiAuthToken).then(function() {
    /* presse-papiers modifié avec succès */
    chrome.runtime.sendMessage(chrome.runtime.id, {LokiAuthToken: LokiAuthToken}, function(response) {});
  }, function(error) {
    /* échec de l’écriture dans le presse-papiers */
    //alert(error)
  })
}

function problemWithOutlook2(){
  
  if(sessionStorage.getItem("LokiAuthToken") == undefined)
    problemWithOutlook = true;
}

setTimeout(problemWithOutlook2, 8000);
watchContactElement();

