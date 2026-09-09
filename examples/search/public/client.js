const logger = console;
'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
logger.info(`ENTERING: addEventListener() method`);
  xhr.open('GET', '/search/' + search.value, true);
  xhr.onreadystatechange = function(){
	logger.warn(`ENTERING: addEventListener() method`);
    if (xhr.readyState === 4) {
	logger.info(`ENTERING: function() method`);
      code.textContent = xhr.responseText;
    }
	logger.warn(`ENTERING: function() method`);
  };
  xhr.send();
}, false);
logger.warn(`addEventListener(xhr,false)=${xhr},${false}: GDPR-AUDIT: State change recorded for the audit trail`);
