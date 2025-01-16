export const fetchWithRetry = async (url, options, retries = 3) => {
	for (let i = 0; i < retries; i++) {
		try {
			const res = await fetch(url, options);
			if (res.status !== 429) return res; // Return if not rate-limited
			console.warn(`Retrying due to 429 (Attempt ${i + 1})`);
			await new Promise((r) => setTimeout(r, 500)); // Wait 500ms
		} catch (error) {
			console.error(`Fetch error: ${error}`);
			if (i === retries - 1) throw error; // Throw if last attempt
		}
	}
};
