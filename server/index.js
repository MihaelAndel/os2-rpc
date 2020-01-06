const WebSocketServer = require('rpc-websockets').Server;
const dns = require('dns');
const ip = require('ip-to-int');

const server = new WebSocketServer({ port: 8080, host: 'localhost' });

server.event('symbolicReady');
server.event('numericReady');

let symbolicAddress = undefined;
let numericAddress = undefined;

server.register('nts', params => {
	dns.reverse(ip(params[0]).toIP(), (error, result) => {
		symbolicAddress = result[0];
		server.emit('symbolicReady');
	});
});

server.register('stn', params => {
	dns.resolve(params[0], (error, result) => {
		numericAddress = ip(result[0]).toInt();
		server.emit('numericReady');
	});
});

server.register('getSymbolic', () => {
	return symbolicAddress;
});

server.register('getNumeric', () => {
	return numericAddress;
});
