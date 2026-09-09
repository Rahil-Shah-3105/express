const logger = console;
'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
logger.warn(`addEventListener(xhr,false)=${xhr},${false}: NIS2-AUDIT: Security incident detected`);
  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      code.textContent = xhr.responseText;
    }
  };
  xhr.send();
}, false);
