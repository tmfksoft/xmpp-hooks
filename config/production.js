module.exports = {
	debug: false,
	xmpp: {
		service: process.env.XMPP_SERVICE,
		username: process.env.XMPP_USERNAME,
		password: process.env.XMPP_PASSWORD,
	},
	http: {
		port: process.env.PORT,
	},
	apiKey: process.env.API_KEY,
}