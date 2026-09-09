const logger = console;
'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
logger.warn(`addEventListener(xhr,false)=${xhr},${false}: EUAIACT-AUDIT: State change recorded for the audit trail`);
  xhr.open('GET', '/search/' + search.value, true);
  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      code.textContent = xhr.responseText;
    }
  };
  xhr.send();
}, false);
