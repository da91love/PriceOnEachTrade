var sync_request = require('sync-request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cheerio = require('cheerio');

var APIs=require('./public/json/APIs.json');

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();

    return hour + ":" + min + ":" + sec;
}

function jsonDataWithHtml(coinApi){
	var res = sync_request('GET', coinApi);
	var body = res.getBody('utf8');
	var jsonData = JSON.parse(body);
	return jsonData;
//	var $ = cheerio.load(res.getBody('utf8'));
////	console.log(typeof $('body').text() + ':' + $('body').text());
//	var jsonData = JSON.parse($('body').text());

}

function jsonDataWithXML(coinApi) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", coinApi, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
//    console.log(xhttp.responseText);
    var response = JSON.parse(xhttp.responseText);
    return response;
}


function ML(target){
	var stringTg=target.toString();
	while(stringTg.length<10){
		stringTg = stringTg + ' ';
	}
	return stringTg;
}


setInterval(function(){
	var exchangeRate = jsonDataWithXML(APIs.exRate)[0].rate;
	var coin_price={
			kr:{
				bitcoin:[
						Math.floor(jsonDataWithHtml(APIs.coins.kr.upbit.bitcoin)[0].tradePrice),
						Math.floor(jsonDataWithXML(APIs.coins.kr.bithumb.bitcoin).data[0].price),
						Math.floor(jsonDataWithXML(APIs.coins.kr.gopax.bitcoin).price)
						],
				ripple:[
						Math.floor(jsonDataWithHtml(APIs.coins.kr.upbit.ripple)[0].tradePrice),
						Math.floor(jsonDataWithXML(APIs.coins.kr.bithumb.ripple).data[0].price),
						Math.floor(0)
						],
				bitcash:[
						Math.floor(jsonDataWithHtml(APIs.coins.kr.upbit.bitcash)[0].tradePrice),
						Math.floor(jsonDataWithXML(APIs.coins.kr.bithumb.bitcash).data[0].price),
						Math.floor(jsonDataWithXML(APIs.coins.kr.gopax.bitcash).price)
						]
			},
			jp:{
				bitcoin:[
						Math.floor(jsonDataWithXML(APIs.coins.jp.bitbank.bitcoin).data.last),
						Math.floor(jsonDataWithXML(APIs.coins.jp.gmo.bitcoin).data[1].bid),
						Math.floor(jsonDataWithHtml(APIs.coins.jp.bitflyer.bitcoin).best_bid)
						],
				ripple:[
						Math.floor(jsonDataWithXML(APIs.coins.jp.bitbank.ripple).data.last),
						Math.floor(jsonDataWithXML(APIs.coins.jp.gmo.ripple).data[5].bid),
						Math.floor(0)
						],
				bitcash:[
						Math.floor(jsonDataWithXML(APIs.coins.jp.bitbank.bitcash).data.last),
						Math.floor(jsonDataWithXML(APIs.coins.jp.gmo.bitcoin).data[3].bid),
						Math.floor(0)
						]
			},
			exJp:{
				bitcoin:[
						Math.floor(jsonDataWithXML(APIs.coins.jp.bitbank.bitcoin).data.last*exchangeRate),
						Math.floor(jsonDataWithXML(APIs.coins.jp.gmo.bitcoin).data[1].bid*exchangeRate),
						Math.floor(jsonDataWithHtml(APIs.coins.jp.bitflyer.bitcoin).best_bid*exchangeRate)
						],
				ripple:[
						Math.floor(jsonDataWithXML(APIs.coins.jp.bitbank.ripple).data.last*exchangeRate),
						Math.floor(jsonDataWithXML(APIs.coins.jp.gmo.bitcoin).data[5].bid*exchangeRate),
						Math.floor(0)
						],
				bitcash:[
						Math.floor(jsonDataWithXML(APIs.coins.jp.bitbank.bitcash).data.last*exchangeRate),
						Math.floor(jsonDataWithXML(APIs.coins.jp.gmo.bitcoin).data[3].bid*exchangeRate),
						Math.floor(0)
						]
			}
	}

	console.log('TIME : '+getDateTime())
	console.log('-------------------------------------------------')
	console.log('│'+ML('KOR')+'│'+ML('BTC')+'│'+ML('XRP')+'│'+ML('BCC')+'│')
	console.log('.................................................')
	console.log('│'+ML('upbit')+'│'+ML(coin_price.kr.bitcoin[0])+'│'+ML(coin_price.kr.ripple[0])+'│'+ML(coin_price.kr.bitcash[0])+'│')
	console.log('│'+ML('bithumb')+'│'+ML(coin_price.kr.bitcoin[1])+'│'+ML(coin_price.kr.ripple[1])+'│'+ML(coin_price.kr.bitcash[1])+'│')
	console.log('│'+ML('gopax')+'│'+ML(coin_price.kr.bitcoin[2])+'│'+ML('-')+'│'+ML(coin_price.kr.bitcash[2])+'│')
	console.log('-------------------------------------------------')



	console.log('                                               ')
	console.log('-------------------------------------------------')
	console.log('│'+ML('JP')+'│'+ML('BTC')+'│'+ML('XRP')+'│'+ML('BCC')+'│')
	console.log('.................................................')
	console.log('│'+ML('bitbank')+'│'+ML(coin_price.jp.bitcoin[0])+'│'+ML(coin_price.jp.ripple[0])+'│'+ML(coin_price.jp.bitcash[0])+'│')
	console.log('│'+ML('Exchanged')+'│'+ML(coin_price.exJp.bitcoin[0])+'│'+ML(coin_price.exJp.ripple[0])+'│'+ML(coin_price.exJp.bitcash[0])+'│')
	console.log('.................................................')
	console.log('│'+ML('gmo')+'│'+ML(coin_price.jp.bitcoin[1])+'│'+ML(coin_price.jp.ripple[1])+'│'+ML(coin_price.jp.bitcash[1])+'│')
	console.log('│'+ML('Exchanged')+'│'+ML(coin_price.exJp.bitcoin[1])+'│'+ML(coin_price.exJp.ripple[1])+'│'+ML(coin_price.exJp.bitcash[1])+'│')
	console.log('.................................................')
	console.log('│'+ML('bitflyer')+'│'+ML(coin_price.jp.bitcoin[2])+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('│'+ML('Exchanged')+'│'+ML(coin_price.exJp.bitcoin[2])+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('-------------------------------------------------')
	console.log('                                               ')



	console.log('-------------------------------------------------')
	console.log('│'+ML('Arbitrage')+'│'+ML('BTC')+'│'+ML('XRP')+'│'+ML('BCC')+'│')
	console.log('.................................................')
	console.log('│'+ML('ub-bb')+'│'+ML((coin_price.kr.bitcoin[0]-coin_price.exJp.bitcoin[0]))+'│'+ML((coin_price.kr.ripple[0]-coin_price.exJp.ripple[0]))+'│'+ML((coin_price.kr.bitcash[0]-coin_price.exJp.bitcash[0]))+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[0]-coin_price.exJp.bitcoin[0])/coin_price.exJp.bitcoin[0]).toFixed(3))+'│'+ML(((coin_price.kr.ripple[0]-coin_price.exJp.ripple[0])/coin_price.exJp.ripple[0]).toFixed(3))+'│'+ML(((coin_price.kr.bitcash[0]-coin_price.exJp.bitcash[0])/coin_price.exJp.bitcash[0]).toFixed(3))+'│')
	console.log('.................................................')
	console.log('│'+ML('bh-bb')+'│'+ML((coin_price.kr.bitcoin[1]-coin_price.exJp.bitcoin[0]))+'│'+ML((coin_price.kr.ripple[1]-coin_price.exJp.ripple[0]))+'│'+ML((coin_price.kr.bitcash[1]-coin_price.exJp.bitcash[0]))+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[1]-coin_price.exJp.bitcoin[0])/coin_price.exJp.bitcoin[0]).toFixed(3))+'│'+ML(((coin_price.kr.ripple[1]-coin_price.exJp.ripple[0])/coin_price.exJp.ripple[0]).toFixed(3))+'│'+ML(((coin_price.kr.bitcash[1]-coin_price.exJp.bitcash[0])/coin_price.exJp.bitcash[0]).toFixed(3))+'│')
	console.log('.................................................')
	console.log('│'+ML('gp-bb')+'│'+ML((coin_price.kr.bitcoin[2]-coin_price.exJp.bitcoin[0]))+'│'+ML('-')+'│'+ML((coin_price.kr.bitcash[2]-coin_price.exJp.bitcash[0]))+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[2]-coin_price.exJp.bitcoin[0])/coin_price.exJp.bitcoin[0]).toFixed(3))+'│'+ML('-')+'│'+ML(((coin_price.kr.bitcash[2]-coin_price.exJp.bitcash[0])/coin_price.exJp.bitcash[0]).toFixed(3))+'│')



	console.log('.................................................')
	console.log('│'+ML('ub-gmo')+'│'+ML((coin_price.kr.bitcoin[0]-coin_price.exJp.bitcoin[1]))+'│'+ML((coin_price.kr.ripple[0]-coin_price.exJp.ripple[1]))+'│'+ML((coin_price.kr.bitcash[0]-coin_price.exJp.bitcash[1]))+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[0]-coin_price.exJp.bitcoin[1])/coin_price.exJp.bitcoin[1]).toFixed(3))+'│'+ML(((coin_price.kr.ripple[0]-coin_price.exJp.ripple[1])/coin_price.exJp.ripple[1]).toFixed(3))+'│'+ML(((coin_price.kr.bitcash[0]-coin_price.exJp.bitcash[1])/coin_price.exJp.bitcash[1]).toFixed(3))+'│')
	console.log('.................................................')
	console.log('│'+ML('bh-gmo')+'│'+ML((coin_price.kr.bitcoin[1]-coin_price.exJp.bitcoin[1]))+'│'+ML((coin_price.kr.ripple[1]-coin_price.exJp.ripple[1]))+'│'+ML((coin_price.kr.bitcash[1]-coin_price.exJp.bitcash[1]))+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[1]-coin_price.exJp.bitcoin[1])/coin_price.exJp.bitcoin[1]).toFixed(3))+'│'+ML(((coin_price.kr.ripple[1]-coin_price.exJp.ripple[1])/coin_price.exJp.ripple[1]).toFixed(3))+'│'+ML(((coin_price.kr.bitcash[1]-coin_price.exJp.bitcash[1])/coin_price.exJp.bitcash[1]).toFixed(3))+'│')
	console.log('.................................................')
	console.log('│'+ML('gp-gmo')+'│'+ML((coin_price.kr.bitcoin[2]-coin_price.exJp.bitcoin[1]))+'│'+ML('-')+'│'+ML((coin_price.kr.bitcash[2]-coin_price.exJp.bitcash[1]))+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[2]-coin_price.exJp.bitcoin[1])/coin_price.exJp.bitcoin[1]).toFixed(3))+'│'+ML('-')+'│'+ML(((coin_price.kr.bitcash[2]-coin_price.exJp.bitcash[1])/coin_price.exJp.bitcash[1]).toFixed(3))+'│')



	console.log('.................................................')
	console.log('│'+ML('ub-bf')+'│'+ML((coin_price.kr.bitcoin[0]-coin_price.exJp.bitcoin[2]))+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[0]-coin_price.exJp.bitcoin[2])/coin_price.exJp.bitcoin[2]).toFixed(3))+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('.................................................')
	console.log('│'+ML('bh-bf')+'│'+ML((coin_price.kr.bitcoin[1]-coin_price.exJp.bitcoin[2]))+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[1]-coin_price.exJp.bitcoin[2])/coin_price.exJp.bitcoin[2]).toFixed(3))+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('.................................................')
	console.log('│'+ML('gp-bf')+'│'+ML((coin_price.kr.bitcoin[2]-coin_price.exJp.bitcoin[2]))+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('│'+ML('')+'│'+ML(((coin_price.kr.bitcoin[2]-coin_price.exJp.bitcoin[2])/coin_price.exJp.bitcoin[2]).toFixed(3))+'│'+ML('-')+'│'+ML('-')+'│')
	console.log('-------------------------------------------------')

},20000);






