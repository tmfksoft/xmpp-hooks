module.exports = {
	debug: process.env.NODE_ENV === "development",
	xmpp: {
		service: process.env.XMPP_SERVICE,
		username: process.env.XMPP_USERNAME,
		password: process.env.XMPP_PASSWORD,
		domain: process.env.XMPP_DOMAIN, // Only used to auto complete addresses when only the first part of the JID is supplied.
	},
	http: {
		port: process.env.PORT,
	},
	apiKey: process.env.API_KEY,
}