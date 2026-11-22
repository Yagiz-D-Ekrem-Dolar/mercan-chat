/**
 * Automatically resizes a textarea element to fit its content
 * @param textareaElement - The textarea element to resize
 */
export default function autoResizeTextarea(textareaElement: HTMLTextAreaElement | null): void {
	if (textareaElement) {
		// Boşken ölçme: yer tutucu yazısı dar genişlikte satırlara bölünüp scrollHeight'ı
		// şişirebiliyor (kutu 300+ px'e takılıyordu). Boş kutu tek satır yüksekliğinde kalır.
		if (!textareaElement.value) {
			textareaElement.style.height = '3rem';

			return;
		}

		textareaElement.style.height = '1rem';
		textareaElement.style.height = textareaElement.scrollHeight + 'px';
	}
}
