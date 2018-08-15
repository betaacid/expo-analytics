export default class HitValidator {
	constructor({ debug }) {
		this.debug = debug;
	}

	validate = ({ url }) => {
		// Do not validate in prod mode
		if (!this.debug) return Promise.resolve(true);

		const hostname = this.extractHostname(url);
		const queryStr = url.slice(url.indexOf(hostname) + hostname.length);

		return fetch(`https://${hostname}/debug${queryStr}`, { method: "get" })
			.then(result => result.json())
			.then(res => {
				if (res.hitParsingResult && Array.isArray(res.hitParsingResult)) {
					const validationResult = res.hitParsingResult[0];
					const { valid, parserMessage } = validationResult;
					if (valid) return true;

					// INFO message will not prevent hit from being successfully sent
					// but WARN will...which is confusing for me...I thought only ERROR
					// will cause hit to be not recorded
					parserMessage
						.filter(m => m.messageType !== "INFO")
						.forEach(m => this.outputError(m, url));
					return false;
				}
				throw new Error(`Unexpected hitParsingResult: ${res.hitParsingResult}`);
			})
			.catch(err => {
				console.log(
					`[expo-analytics] Failed to validate hit request: ${err.message}`
				);
			});
	};

	outputError = (message, url) => {
		const { description, messageType } = message;
		console.log(
			`[expo-analytics] Failed to pass validation for ${url}:\n ${messageType} ${description}`
		);
	};

	extractHostname = url => {
		var hostname;
		//find & remove protocol (http, ftp, etc.) and get hostname
		if (url.indexOf("//") > -1) {
			hostname = url.split("/")[2];
		} else {
			hostname = url.split("/")[0];
		}

		//find & remove port number
		hostname = hostname.split(":")[0];
		//find & remove "?"
		hostname = hostname.split("?")[0];

		return hostname;
	};
}
