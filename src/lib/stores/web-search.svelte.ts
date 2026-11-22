const STORAGE_KEY = 'Mercan.webSearch';

/** Web arama düğmesinin açık/kapalı durumu (tarayıcıda hatırlanır). */
class WebSearchStore {
	enabled = $state(false);

	constructor() {
		try {
			this.enabled = localStorage.getItem(STORAGE_KEY) === '1';
		} catch {
			// localStorage kullanılamıyorsa varsayılan: kapalı
		}
	}

	toggle() {
		this.enabled = !this.enabled;

		try {
			localStorage.setItem(STORAGE_KEY, this.enabled ? '1' : '0');
		} catch {
			// yoksay
		}
	}
}

export const webSearchStore = new WebSearchStore();
