# Mercan

Yerel yapay zekâ modelleri için **Türkçe sohbet arayüzü**. [llama.cpp](https://github.com/ggml-org/llama.cpp) web arayüzünün (SvelteKit) üzerine kuruldu; [Ollama](https://ollama.com) ile çalışır.

## Özellikler

- Tamamen Türkçe, sade arayüz (ayarlarda yalnızca tema)
- Açık / koyu tema
- **Düşünme** düğmesi: model düşünürken tema maviye döner
- **Web arama** düğmesi: açıkken yanıt üretilirken tema yeşile döner (arama Vikipedi üzerinden yapılır)
- Mesaj eylemleri: kopyala, düzenle (yalnızca kendi mesajların), yeniden üret, dallandır, sil — hepsi onaysız, doğrudan
- Düşünürken ve ararken hareketlenen Mercan logosu

## Kurulum

Gerekenler: [Node.js](https://nodejs.org) 20+ ve [Ollama](https://ollama.com).

```bash
# 1) Bir model indir (örnek: küçük bir Qwen modeli)
ollama pull qwen3.5:0.8b

# 2) Bağımlılıkları kur
npm ci

# 3) Uyumluluk sunucusunu başlat (8033 portu; Ollama'ya köprü kurar)
npm run shim

# 4) Başka bir terminalde arayüzü başlat
npm run dev
```

Arayüz: <http://127.0.0.1:5173>

Farklı bir model kullanmak için sim sunucusunu şöyle başlat:

```bash
MERCAN_MODEL=llama3.2:3b npm run shim        # macOS / Linux
$env:MERCAN_MODEL='llama3.2:3b'; npm run shim # Windows PowerShell
```

## Nasıl çalışır?

Arayüz, `llama-server` uç noktalarını bekler. `ollama-shim.mjs` küçük bir Node sunucusudur ve:

- `/props` yanıtını taklit eder,
- istekleri Ollama'ya (`localhost:11434`) iletir,
- Ollama'nın `reasoning` alanını arayüzün beklediği `reasoning_content`'e çevirir,
- düşünme düğmesini (`enable_thinking`) Ollama'nın `reasoning_effort` ayarına eşler,
- web arama açıkken sorudan anahtar kelimeleri çıkarıp Vikipedi'de arar, sonuçları isteme ekler ve yanıtın sonuna kaynakları yazar.

> Web arama bir arama motoru değil, Vikipedi aramasıdır; küçük modeller sonuçları her zaman doğru kullanamaz.

## Lisans

MIT. Arayüzün büyük bölümü llama.cpp projesinden (© The ggml authors) gelir; ayrıntılar için `LICENSE` dosyasına bak.
