'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var azbn = new require(__dirname + '/../../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var argv = require('optimist').argv;

azbn.setMdl('config', require('./config/main'));

azbn.setMdl('url', require('url'));

/*
var Iconv = require('iconv').Iconv;
var fromEnc = 'cp1251';
var toEnc = 'utf8';
var translator = new Iconv(fromEnc, toEnc);
*/

	//http://fssprus.ru/torgi/action/city?data=5700000000000
	//http://fssprus.ru/torgi/ajax_search/?torgi[bidnumber]=&torgi[status]=5&torgi[torgpublishdate][from]=&torgi[torgpublishdate][to]=&torgi[propname]=&torgi[region]=5700000000000&torgi[city]=&torgi[startprice][from]=&torgi[startprice][to]=&torgi[torgexpiredate][from]=&torgi[torgexpiredate][to]=
	//http://fssprus.ru/torgi
	/*
	Accept:*<убрать>/*
	Accept-Encoding:gzip, deflate
	Accept-Language:ru,en;q=0.8
	Cache-Control:no-cache
	Connection:keep-alive
	Cookie:_ym_uid=15121217251005127179; _ym_isad=2; PHPSESSID=u6k1u4m540r1q8v1fren2vv7f0; _ym_visorc_9346069=w; sputnik_session=1512623870967|3
	DNT:1
	Host:fssprus.ru
	Pragma:no-cache
	Referer:http://fssprus.ru/torgi/
	User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 YaBrowser/17.10.1.1204 Yowser/2.5 Safari/537.36
	X-Requested-With:XMLHttpRequest
	
	Accept:*<убрать>/*
	Accept-Encoding:gzip, deflate
	Accept-Language:ru,en;q=0.8
	Cache-Control:no-cache
	Connection:keep-alive
	Cookie:_ym_uid=15121217251005127179; _ym_isad=2; PHPSESSID=u6k1u4m540r1q8v1fren2vv7f0; _ym_visorc_9346069=w; sputnik_session=1512623870967|3
	DNT:1
	Host:fssprus.ru
	Pragma:no-cache
	Referer:http://fssprus.ru/torgi/
	User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 YaBrowser/17.10.1.1204 Yowser/2.5 Safari/537.36
	X-Requested-With:XMLHttpRequest
	*/
/*
azbn.mdl('web/http', {
		headers : {
			'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 YaBrowser/17.10.1.1204 Yowser/2.5 Safari/537.36',
			'Accept' : '* /*',
			'Accept-Encoding' : 'gzip, deflate',
			'Accept-Language' : 'ru,en;q=0.8',
			'Cache-Control' : 'no-cache',
			'Connection' : 'keep-alive',
			'DNT' : '1',
			'Host' : 'fssprus.ru',
			'Pragma' : 'no-cache',
			'Referer' : 'http://fssprus.ru/torgi/',
			'X-Requested-With' : 'XMLHttpRequest',
			'encoding' : null,
			//'proxy' : 'http://localproxy.com',
			//'rejectUnauthorized' : false,
		},
	}).r('GET', 'http://fssprus.ru/torgi/ajax_search/?torgi[bidnumber]=&torgi[status]=5&torgi[torgpublishdate][from]=&torgi[torgpublishdate][to]=&torgi[propname]=&torgi[region]=5700000000000&torgi[city]=&torgi[startprice][from]=&torgi[startprice][to]=&torgi[torgexpiredate][from]=&torgi[torgexpiredate][to]=', {}, function(error, response, body){
	
	//expect($('title').length > 0).toBe(true);
	//expect((new RegExp('яндекс', 'ig')).test($('title').eq(0).html())).toBe(true);
	
	if(error) {
		
		console.log(error);
		
	} else {
		//console.log(body);
		
		var table_selector = '.results-frame table';
		
		//
		var $ = azbn.mdl('web/http').parse(translator.convert(body).toString());
		
		var table = $(table_selector);
		
		var runTask_result = [];
		
		if(table.length > 0) {
			
			var trs = table.find('tr');
			
			trs.each(function(index){
				
				var tr = $(this);
				
				var
					notificationId = 0,
					lotId = 0,
					url = null
				;
				
				var as = tr.find('td:nth-child(2) a');
				as.each(function(index){
					var a = $(this);
					var href = a.attr('href');
					href = href + '';
					href = href.replace(/&amp;/ig, '&');
					url = azbn.mdl('url').parse(href, true, true);
					notificationId = url.query.notificationId;
					lotId = url.query.lotId;
				});
				
				var title = tr.find('td:nth-child(3)').html();
				
				var sum = tr.find('td:nth-child(4)').html();
				sum = sum + '';
				sum = sum.split('.');
				sum = sum[0];
				sum = sum.replace(/\s/ig, '');
				if(sum != '' && sum.length > 0) {
					sum = parseInt(sum);
				} else {
					sum = 0;
				}
				
				if(sum > 0) {
					runTask_result.push({
						notificationId : notificationId,
						lotId : lotId,
						title : title,
						sum : sum,
					});
				}
				
			});
			
		}
		
		if(runTask_result.length) {
			for(var i = 0; i < runTask_result.length; i++) {
				
				var item = runTask_result[i];
				app.mkDataDir('notifications/' + item.notificationId);
				app.saveJSON('notifications/' + item.notificationId + '/' + item.lotId, item);
				
			}
		}
		console.dir(runTask_result);
		
	}
	
});
*/



const needle = require('needle');

needle.get(
	'http://fssprus.ru/torgi/ajax_search/?torgi[bidnumber]=&torgi[status]=5&torgi[torgpublishdate][from]=&torgi[torgpublishdate][to]=&torgi[propname]=&torgi[region]=5700000000000&torgi[city]=&torgi[startprice][from]=&torgi[startprice][to]=&torgi[torgexpiredate][from]=&torgi[torgexpiredate][to]=',
	{
		headers : {
			'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 YaBrowser/17.10.1.1204 Yowser/2.5 Safari/537.36',
			'Accept' : '* /*',
			'Accept-Encoding' : 'gzip, deflate',
			'Accept-Language' : 'ru,en;q=0.8',
			'Cache-Control' : 'no-cache',
			'Connection' : 'keep-alive',
			'DNT' : '1',
			'Host' : 'fssprus.ru',
			'Pragma' : 'no-cache',
			'Referer' : 'http://fssprus.ru/torgi/',
			'X-Requested-With' : 'XMLHttpRequest',
			'encoding' : null,
			//'proxy' : 'http://localproxy.com',
			//'rejectUnauthorized' : false,
		},
	}, function(error, response, body) {
	
		if(error) {
			
			console.log(error);
			
		} else {
			//console.log(body);
			
			var table_selector = '.results-frame table';
			
			//
			var $ = azbn.mdl('web/http').parse(body);
			
			var table = $(table_selector);
			
			var runTask_result = [];
			
			if(table.length > 0) {
				
				var trs = table.find('tr');
				
				trs.each(function(index){
					
					var tr = $(this);
					
					var
						notificationId = 0,
						lotId = 0,
						url = null
					;
					
					var as = tr.find('td:nth-child(2) a');
					as.each(function(index){
						var a = $(this);
						var href = a.attr('href');
						href = href + '';
						href = href.replace(/&amp;/ig, '&');
						url = azbn.mdl('url').parse(href, true, true);
						notificationId = url.query.notificationId;
						lotId = url.query.lotId;
					});
					
					var title = tr.find('td:nth-child(3)').html();
					
					var sum = tr.find('td:nth-child(4)').html();
					sum = sum + '';
					sum = sum.split('.');
					sum = sum[0];
					sum = sum.replace(/\s/ig, '');
					if(sum != '' && sum.length > 0) {
						sum = parseInt(sum);
					} else {
						sum = 0;
					}
					
					if(sum > 0) {
						runTask_result.push({
							notificationId : notificationId,
							lotId : lotId,
							title : title,
							sum : sum,
						});
					}
					
				});
				
			}
			
			if(runTask_result.length) {
				for(var i = 0; i < runTask_result.length; i++) {
					
					var item = runTask_result[i];
					app.mkDataDir('notifications/' + item.notificationId);
					app.saveJSON('notifications/' + item.notificationId + '/' + item.lotId, item);
					
				}
			}
			console.dir(runTask_result);
			
		}

});