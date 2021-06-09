var refreshIntervalId = null;
var linkMap = {};  //outside the listener function
var LokiAuthToken = null;

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function getLinkedInProfile(mail, token, callback) {
    let baseURL = 'https://sfeur.loki.delve.office.com/api/v1/linkedin/profiles/full?Smtp=' + mail + '&ConvertGetPost=true';
    let body = '{"Accept":"text/plain, application/json, text/json","X-ClientType":"OwaPeopleHub","X-ClientFeature":"LivePersonaCard","X-LPCVersion":"1.20201214.3.1","authorization":"Bearer ' + token + '","X-HostAppCapabilities":"{}"}'

    axios.post(baseURL, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async function (response) {
            //console.log(response.data);
            if (response.data.persons.length > 0) {
                let linkedinProfile = response.data.persons[0];

                if (linkedinProfile.displayName !== undefined) {
                    let fullName = linkedinProfile.displayName.split(' ');
                    let firstName = fullName[0];
                    let lastName = fullName[fullName.length - 1];
                    linkedinProfile.firstName = firstName;
                    linkedinProfile.lastName = lastName;
                }

                console.log('✅ ' + ("Le profil linkedIn associé au mail 💌 : '" + (mail) + "' a été trouvé :"));
                console.log(linkedinProfile)

                callback(null, linkedinProfile);
            }
            else {
                console.log('❌ ' + ("Aucun profil LinkedIn associé au mail 💌 : '" + (mail) + "' a été trouvé :"));
                console.log(response.data)

                callback(null, false);
            }
        })
        .catch(async function (error) {
            console.log('❌ ' + ("Un problème est survenu avec le mail 💌 : '" + (mail) + "'"));
            console.log(error.response.data)

            callback("error", null);
        });
}

chrome.notifications.onClicked.addListener(function(notificationId){
    chrome.notifications.clear(notificationId);
    window.open(linkMap[notificationId]); //optional
 })

 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    asyncFunctionWithAwait(request, sender, sendResponse)

    return true
})

const asyncFunctionWithAwait = async function (request, sender, sendResponse) {

        if (request.getToken != undefined && request.getToken == true) {
            getToken();
        }
        else if (request.textSelected != undefined && !validateEmail(request.textSelected)) {
            chrome.notifications.create(
                "demo",
                {
                    type: "basic",
                    iconUrl: "red-cross.jpg",
                    title: "Mauvais format",
                    message: "Le texte recherché n'est pas un mail.",
                },
                (notificationId) => { }
            );
        }
        else if (request.textSelected != undefined && LokiAuthToken != undefined) {

            await getLinkedInProfile(request.textSelected, LokiAuthToken, (err, result) => {

                if (!result) {
                    chrome.notifications.create(
                        "demo",
                        {
                            type: "basic",
                            iconUrl: "red-cross.jpg",
                            title: "Aucun profil trouvé",
                            message: "Ce mail n'est rattaché à aucun compte LinkedIn",
                        },
                        (notificationId) => { }
                    );
                }
                else if (result != undefined && result) {
                    chrome.notifications.create(
                        "demo",
                        {
                            type: "basic",
                            iconUrl: result?.photoUrl ? result.photoUrl : "icon.png",
                            title: result?.displayName,
                            message: result?.headline,
                        },
                        (notificationId) => { linkMap[notificationId] = result.linkedInUrl; }
                    );

                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            msg: "linkedin_url",
                            linkedInUrl: result.linkedInUrl
                        });
                    });
                }
            })
        }
        else if (request.searchLinkedIn != undefined && LokiAuthToken != undefined) {

            //sendResponse('whatever');

            await getLinkedInProfile(request.searchLinkedIn, LokiAuthToken, (err, result) => {
                if (!result) {
                    chrome.notifications.create(
                        "demo",
                        {
                            type: "basic",
                            iconUrl: "red-cross.jpg",
                            title: "Aucun profil trouvé",
                            message: "Ce mail n'est rattaché à aucun compte LinkedIn",
                        },
                        (notificationId) => { }
                    );
                }
                else if (result != undefined && result) {
                    chrome.notifications.create(
                        "demo",
                        {
                            type: "basic",
                            iconUrl: result?.photoUrl ? result.photoUrl : "icon.png",
                            title: result?.displayName,
                            message: result?.headline,
                        },
                        (notificationId) => { linkMap[notificationId] = result.linkedInUrl; }
                    );

                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            msg: "linkedin_url",
                            linkedInUrl: result.linkedInUrl
                        });
                    });
                }
            })
        }

        if (request.LokiAuthToken != undefined) {

            LokiAuthToken = request.LokiAuthToken;

            chrome.notifications.create(
                "demo",
                {
                    type: "basic",
                    iconUrl: "icon.png",
                    title: "Token Outlook à jour",
                    message: "Copié dans le presse papier !",
                },
                (notificationId) => {
                    clearInterval(refreshIntervalId);
                    chrome.browserAction.setIcon({ path: 'icon.png' })
                }
            );

            chrome.tabs.remove(sender.tab.id, function () { });

        }

    }

function loading() {
    chrome.browserAction.setIcon({ path: 'loading.png' })

    var context = document.createElement('canvas').getContext('2d');
    var start = new Date();
    var lines = 16,
        cW = 40,
        cH = 40;

    refreshIntervalId = setInterval(function () {
        var rotation = parseInt(((new Date() - start) / 1000) * lines) / lines;
        context.save();
        context.clearRect(0, 0, cW, cH);
        context.translate(cW / 2, cH / 2);
        context.rotate(Math.PI * 2 * rotation);
        for (var i = 0; i < lines; i++) {
            context.beginPath();
            context.rotate(Math.PI * 2 / lines);
            context.moveTo(cW / 10, 0);
            context.lineTo(cW / 4, 0);
            context.lineWidth = cW / 30;
            context.strokeStyle = 'rgba(0, 0, 0,' + i / lines + ')';
            context.stroke();
        }

        var imageData = context.getImageData(10, 10, 19, 19);
        chrome.browserAction.setIcon({
            imageData: imageData
        });

        context.restore();
    }, 1000 / 30);
}

function getToken() {
    chrome.tabs.create({
        url: 'https://outlook.live.com/people/?visum=1',
        active: true
    }, function (tab) {

        loading();
    });
}

chrome.browserAction.onClicked.addListener(function (activeTab) {

    getToken();
});

chrome.contextMenus.create({
    title: 'LinkedIn Finder',
    'contexts': ['selection'],
    'onclick': (e, tab) => {

        chrome.tabs.executeScript(tab.id, {
            code: 'chrome.runtime.sendMessage({textSelected: window.getSelection().toString()});',
        });
    }

}, function () { })