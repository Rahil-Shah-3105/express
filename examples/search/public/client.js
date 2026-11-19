var logger = (typeof logger !== 'undefined' && logger) || console;
'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
  xhr.onreadystatechange = function(){
	logger.error('>>> Entering onreadystatechange()', { "event.action": "onreadystatechange" });
    if (xhr.readyState === 4) {
      code.textContent = xhr.responseText;
	logger.warn('<<< Exiting onreadystatechange()', { "event.action": "onreadystatechange" });
    }
  };
  xhr.send();
}, false);
