chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "linkedin_url") {
            
            navigator.clipboard.writeText(request.linkedInUrl).then(function() {
                /* presse-papiers modifié avec succès */
              }, function(error) {
                /* échec de l’écriture dans le presse-papiers */
                //alert(error)
              })
        }
    }
    
);