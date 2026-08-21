const logger = console;
'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
const _start_addEventListener = Date.now();
  xhr.onreadystatechange = function(){
	logger.debug('>>> Entering function()');
    if (xhr.readyState === 4) {
	logger.info(`addEventListener(xhr=${xhr}, false=${false}): API call took ${Date.now() - _start_addEventListener} ms`);
      code.textContent = xhr.responseText;
	logger.debug('<<< Exiting function()');
    }
  };
  xhr.send();
}, false);
