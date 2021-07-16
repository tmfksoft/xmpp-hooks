import { client, xml } from '@xmpp/client';
import Hapi from '@hapi/hapi';
import Joi from 'joi';
import config from 'config';
import Boom from '@hapi/boom';

const debug = require('@xmpp/debug');

const xmpp = client({
	service: config.get('xmpp.service'),
	username: config.get('xmpp.username'),
	password: config.get('xmpp.password'),
});

if (config.get('debug')) {
	console.log(config);
	debug(xmpp, true);
}

xmpp.on("error", (err) => {
	console.error(err);
});

xmpp.on("offline", () => {
	console.log("offline");
});

xmpp.on("stanza", async (stanza) => {
	if (stanza.is("message")) {
		// Unused... currently :D
	}
});

xmpp.on("online", async (address) => {
	console.log("Online and ready!");
	// Makes itself available
	await xmpp.send(xml("presence"));
});

xmpp.start().catch(console.error);

const HTTP = new Hapi.Server(config.get('http'));

HTTP.route({
	method: "POST",
	path: "/api/v1/message",
	options: {
		validate: {
			payload: Joi.object({
				to: Joi.string().required(),
				message: Joi.string().required(),
			}),
		}
	},
	handler: async (req, h) => {
		if (!req.headers['authorization']) {
			return Boom.unauthorized("Missing API Key!");
		}
		if (req.headers['authorization'] !== config.get('apiKey')) {
			return Boom.unauthorized("Invalid API Key!");
		}

		const { to, message } = req.payload as { to: string, message: string };

		let address = to;
		if (address.indexOf("@") < 0) {
			address = `${address}@xmpp.burnett-taylor.me`;
		}
		
		const xmppMessage = xml(
			"message",
			{ type: "chat", to },
			xml("body", {}, message),
			xml("nick", { xmlns: "http://jabber.org/protocol/nick" }, "dave"),
		);
		try {
			await xmpp.send(xmppMessage);
		} catch (e) {
			return e;
		}
		return h.response().code(204);
	}
});
HTTP.start();