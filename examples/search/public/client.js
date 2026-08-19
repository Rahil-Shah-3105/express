const logger = console;
'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
logger.info(`addEventListener(xhr=${xhr}, false=${false}): API call took ${Date.now() - _start} ms`);
  xhr.onreadystatechange = function(){
	logger.debug('>>> Entering function()');
    if (xhr.readyState === 4) {
      code.textContent = xhr.responseText;
	logger.debug('<<< Exiting function()');
    }
  };
  xhr.send();
}, false);
logger.debug(`<<< Exiting addEventListener(xhr=${xhr},false=${false})`);
