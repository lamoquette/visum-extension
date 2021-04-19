var arr = []; // the array
var tbinput;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("token-btn").addEventListener('click', addItems);
});

function addItems() {
    chrome.runtime.sendMessage({getToken: true});
  //tbinput = document.getElementById("tbinput").value; // clear textbox value
  //alert(tbinput)
};