const WebSocket = require('rpc-websockets').Client;
const ip = require('ip-to-int');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
	ws.subscribe('numericReady');
	ws.subscribe('symbolicReady');
	const symbolicAddress = process.argv[2];
	const numericAddress = ip(process.argv[3]).toInt();

	ws.call('stn', [symbolicAddress]);
	ws.call('nts', [numericAddress]);
});

ws.on('symbolicReady', async () => {
	const symbolic = await ws.call('getSymbolic', null);
	console.log(symbolic);
});

ws.on('numericReady', async () => {
	const numeric = await ws.call('getNumeric', null);
	console.log(ip(numeric).toIP());
});
