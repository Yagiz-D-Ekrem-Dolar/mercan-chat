import { CLI_FLAGS } from './cli-flags.constants';
import { DEFAULT_MCP_CONFIG } from './mcp.constants';
import { SETTINGS_KEYS } from './settings-keys.constants';
import { TITLE_GENERATION } from './title-generation.constants';
import { FILE_GLOB_SEARCH_PICKERS } from './working-directory.constants';
import {
	Code,
	Database,
	Funnel,
	ListRestart,
	Monitor,
	Moon,
	PencilRuler,
	SlidersVertical,
	Sun
} from '@lucide/svelte';
import { SyncableParameterType } from '$lib/enums';
import { SettingsFieldType } from '$lib/enums/settings.enums';
import { ColorMode } from '$lib/enums/ui.enums';
import type {
	SettingsConfigValue,
	SettingsEntry,
	SettingsFieldConfig,
	SettingsSection,
	SettingsSectionEntry
} from '$lib/types';

/** Settings sections — slug is the routing identity, title is the display label. */
export const SETTINGS_SECTIONS = {
	AGENTIC: { slug: 'agentic', title: 'Ajan' },
	DEVELOPER: { slug: 'developer', title: 'Geliştirici' },
	DISPLAY: { slug: 'display', title: 'Görünüm' },
	GENERAL: { slug: 'general', title: 'Genel' },
	IMPORT_EXPORT: { slug: 'import-export', title: 'İçe/Dışa Aktar' },
	SAMPLING_PENALTIES: { slug: 'sampling-penalties', title: 'Yanıt' },
	TOOLS: { slug: 'tools', title: 'Araçlar' }
} as const;

export const SETTINGS_SECTION_SLUGS = {
	AGENTIC: SETTINGS_SECTIONS.AGENTIC.slug,
	DEVELOPER: SETTINGS_SECTIONS.DEVELOPER.slug,
	DISPLAY: SETTINGS_SECTIONS.DISPLAY.slug,
	GENERAL: SETTINGS_SECTIONS.GENERAL.slug,
	IMPORT_EXPORT: SETTINGS_SECTIONS.IMPORT_EXPORT.slug,
	SAMPLING_PENALTIES: SETTINGS_SECTIONS.SAMPLING_PENALTIES.slug,
	TOOLS: SETTINGS_SECTIONS.TOOLS.slug
} as const;

export const SETTINGS_SECTION_TITLES = {
	AGENTIC: SETTINGS_SECTIONS.AGENTIC.title,
	DEVELOPER: SETTINGS_SECTIONS.DEVELOPER.title,
	DISPLAY: SETTINGS_SECTIONS.DISPLAY.title,
	GENERAL: SETTINGS_SECTIONS.GENERAL.title,
	IMPORT_EXPORT: SETTINGS_SECTIONS.IMPORT_EXPORT.title,
	SAMPLING_PENALTIES: SETTINGS_SECTIONS.SAMPLING_PENALTIES.title,
	TOOLS: SETTINGS_SECTIONS.TOOLS.title
} as const;

export const SETTINGS_REGISTRY: SettingsSectionEntry[] = [
	// General
	{
		icon: SlidersVertical,
		settings: [
			{
				defaultValue: ColorMode.SYSTEM,
				help: 'Arayüzün renk temasını seç: Sistem (cihaz ayarını izler), Açık ya da Koyu.',
				key: SETTINGS_KEYS.THEME,
				label: 'Tema',
				options: [
					{ icon: Monitor, label: 'Sistem', value: ColorMode.SYSTEM },
					{ icon: Sun, label: 'Açık', value: ColorMode.LIGHT },
					{ icon: Moon, label: 'Koyu', value: ColorMode.DARK }
				],
				type: SettingsFieldType.SELECT
			},
			{
				defaultValue: '',
				help: `Sunucuda <code> ${CLI_FLAGS.API_KEY} </code> seçeneğini kullanıyorsan API anahtarını gir.`,
				isPrivate: true,
				key: SETTINGS_KEYS.API_KEY,
				label: 'API Anahtarı',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: '',
				help: 'Modelin nasıl davranacağını belirleyen başlangıç mesajı.',
				key: SETTINGS_KEYS.SYSTEM_MESSAGE,
				label: 'Sistem Mesajı',
				type: SettingsFieldType.TEXTAREA
			},
			{
				defaultValue: true,
				help: 'Sistem mesajını her sohbetin en üstünde göster.',
				key: SETTINGS_KEYS.SHOW_SYSTEM_MESSAGE,
				label: 'Sistem mesajını göster',
				standaloneField: false,
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: 2500,
				help: 'Uzun metin yapıştırıldığında dosyaya dönüştürülür. Bu değerle dosya uzunluğu eşiğini belirlersin. 0 değeri özelliği kapatır.',
				key: SETTINGS_KEYS.PASTE_LONG_TEXT_TO_FILE_LEN,
				label: 'Uzun metni dosyaya çevirme eşiği',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: true,
				help: 'Göndermek için Enter, yeni satır için Shift + Enter kullan. Kapalıyken Ctrl/Cmd + Enter ile gönderilir.',
				key: SETTINGS_KEYS.SEND_ON_ENTER,
				label: 'Enter ile gönder',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Ses destekleyen modellerde kutu boşken gönder düğmesi yerine mikrofon düğmesini göster.',
				key: SETTINGS_KEYS.AUTO_MIC_ON_EMPTY,
				label: 'Boş kutuda mikrofonu göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Asistan mesajları için, düşünen modeller dahil, "Devam et" düğmesini etkinleştir.',
				isExperimental: true,
				key: SETTINGS_KEYS.ENABLE_CONTINUE_GENERATION,
				label: '"Devam et" düğmesi',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Sohbet başlıklarının nasıl üretileceğini seç. İlk dolu satır hızlı ve sabit bir kural kullanır; model seçeneği ilk mesajlaşmadan başlığı modele ürettirir.',
				key: SETTINGS_KEYS.TITLE_GENERATION_USE_FIRST_LINE,
				label: 'Sohbet başlığı',
				radioOptions: [
					{
						key: SETTINGS_KEYS.TITLE_GENERATION_USE_FIRST_LINE,
						label: 'Başlık için ilk dolu satırı kullan',
						value: 'firstLine'
					},
					{
						isExperimental: true,
						key: SETTINGS_KEYS.TITLE_GENERATION_USE_LLM,
						label: 'Başlığı model ile üret',
						value: 'llm'
					}
				],
				type: SettingsFieldType.RADIO
			},
			{
				defaultValue: TITLE_GENERATION.DEFAULT_PROMPT,
				dependsOn: SETTINGS_KEYS.TITLE_GENERATION_USE_LLM,
				help: 'Başlık üretme istemi için isteğe bağlı şablon. Kullanıcı mesajı için {{USER}}, asistan mesajı için {{ASSISTANT}} kullan.',
				key: SETTINGS_KEYS.TITLE_GENERATION_PROMPT,
				label: 'Model başlık üretme istemi',
				type: SettingsFieldType.TEXTAREA
			},
			{
				defaultValue: false,
				help: 'Sohbet başlığı seçiminin karşılığı; ayrı bir alan olmadan saklanır ve eşitlenir.',
				key: SETTINGS_KEYS.TITLE_GENERATION_USE_LLM,
				label: 'Başlığı model ile üret',
				standaloneField: false,
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Metin ekli bir mesajı kopyalarken ekleri, geri ek olarak yapıştırılabilen özel biçim yerine tek bir düz metne birleştir.',
				key: SETTINGS_KEYS.COPY_TEXT_ATTACHMENTS_AS_PLAIN_TEXT,
				label: 'Metin eklerini düz metin olarak kopyala',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'PDF\'yi metin yerine görüntü olarak işle. Görüntü desteklemeyen modellerde otomatik olarak metne döner.',
				key: SETTINGS_KEYS.PDF_AS_IMAGE,
				label: 'PDF\'yi görüntü olarak işle',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: 0,
				help: 'Bundan büyük görseller sunucuya gönderilmeden önce küçültülür. Kapatmak için 0 yaz.',
				key: SETTINGS_KEYS.MAX_IMAGE_RESOLUTION,
				label: 'En yüksek görsel çözünürlüğü (megapiksel)',
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.GENERAL,
		title: SETTINGS_SECTION_TITLES.GENERAL
	},
	// Display
	{
		icon: Monitor,
		settings: [
			{
				defaultValue: true,
				help: 'Her asistan mesajının altında üretim istatistiklerini (token/sn, token sayısı, süre) göster.',
				key: SETTINGS_KEYS.SHOW_MESSAGE_STATS,
				label: 'Üretim istatistiklerini göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				dependsOn: SETTINGS_KEYS.SHOW_MESSAGE_STATS,
				help: 'Ajan yanıtlarında her tur için istatistikleri (token, süre) göster. Yalnızca "Üretim istatistiklerini göster" açıkken görünür.',
				key: SETTINGS_KEYS.SHOW_AGENTIC_TURN_STATS,
				label: 'Ajan turları için istatistik göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Mesaj üretilirken düşünme sürecini varsayılan olarak açık göster.',
				key: SETTINGS_KEYS.SHOW_THOUGHT_IN_PROGRESS,
				label: 'Süren düşünmeyi göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Araç çağrısı ayrıntılarını çalışırken otomatik aç ve bittikten sonra da açık tut.',
				key: SETTINGS_KEYS.ALWAYS_SHOW_TOOL_CALL_CONTENT,
				label: 'Araç çağrısı içeriğini hep göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Kullanıcı mesajlarını sohbette Markdown olarak işle. Kapatırsan mesaj yazdığın gibi kalır; @-anma rozetleri her durumda görünür.',
				key: SETTINGS_KEYS.RENDER_USER_CONTENT_AS_MARKDOWN,
				label: 'Kullanıcı mesajını Markdown olarak işle',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Düşünme bloğunun içeriğini düz metin yerine biçimli Markdown olarak işle.',
				key: SETTINGS_KEYS.RENDER_THINKING_AS_MARKDOWN,
				label: 'Düşünmeyi Markdown olarak işle',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Kod bloklarını yükseklik sınırlarını yok sayarak her zaman tam boyunda göster.',
				key: SETTINGS_KEYS.FULL_HEIGHT_CODE_BLOCKS,
				label: 'Kod bloklarını tam yükseklikte göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Mesajlar akarken otomatik kaydırmayı kapat; görünümü kendin yönet.',
				key: SETTINGS_KEYS.DISABLE_AUTO_SCROLL,
				label: 'Otomatik kaydırmayı kapat',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Masaüstünde kenar çubuğunu otomatik gizlemek yerine hep görünür tut.',
				key: SETTINGS_KEYS.ALWAYS_SHOW_SIDEBAR_ON_DESKTOP,
				label: 'Kenar çubuğunu masaüstünde hep göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Açık sohbetleri konuşmanın üstünde tarayıcı sekmeleri gibi göster. Kapalıyken aynı anda tek sohbet görünür.',
				key: SETTINGS_KEYS.CONVERSATION_TABS,
				label: 'Sohbet sekmeleri',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Rozetli ayrıştırılmış adlar yerine ham model kimliklerini (örn. "ggml-org/GLM-4.7-Flash-GGUF:Q8_0") göster.',
				key: SETTINGS_KEYS.SHOW_RAW_MODEL_NAMES,
				label: 'Ham model adlarını göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Arayüzde model adlarının yanında niceleme rozetlerini (örn. Q8_0, Q4_K_M) göster.',
				key: SETTINGS_KEYS.SHOW_MODEL_QUANTIZATION,
				label: 'Model niceleme bilgisini göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'Arayüzde model adlarının yanında model etiketlerini (örn. "vision", "reasoning") göster.',
				key: SETTINGS_KEYS.SHOW_MODEL_TAGS,
				label: 'Model etiketlerini göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Model seçici düğmesinde kuruluş adını göster.',
				key: SETTINGS_KEYS.SHOW_MODEL_ORG_NAME_IN_TRIGGER,
				label: 'Model seçicide kuruluş adını göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Arayüzün sağ alt köşesinde sürüm bilgisini göster.',
				key: SETTINGS_KEYS.SHOW_BUILD_VERSION,
				label: 'Sürüm bilgisini göster',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Dosya ve klasör @-anma rozetlerinde yalnızca ad yerine tam yolu göster.',
				key: SETTINGS_KEYS.SHOW_FULL_PATH_IN_MENTIONS,
				label: 'Anmalarda tam yolu göster',
				type: SettingsFieldType.CHECKBOX
			}
		],
		slug: SETTINGS_SECTION_SLUGS.DISPLAY,
		title: SETTINGS_SECTION_TITLES.DISPLAY
	},
	// MCP Servers (non-UI config object)
	{
		icon: PencilRuler,
		settings: [
			{
				defaultValue: '[]',
				help: 'MCP sunucularını JSON listesi olarak yapılandır. Düzenlemek için MCP İstemcisi bölümündeki formu kullan.',
				key: SETTINGS_KEYS.MCP_SERVERS,
				label: 'MCP sunucuları',
				standaloneField: false,
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.TOOLS,
		title: SETTINGS_SECTION_TITLES.TOOLS
	},
	// Tools
	{
		icon: ListRestart,
		settings: [
			{
				defaultValue: 10,
				help: 'Durmadan önceki en fazla araç çalıştırma döngüsü sayısı (sonsuz döngüyü önler).',
				isPositiveInteger: true,
				key: SETTINGS_KEYS.AGENTIC_MAX_TURNS,
				label: 'Ajan turları',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: DEFAULT_MCP_CONFIG.requestTimeoutSeconds,
				help: 'Tek tek MCP araç çağrıları için zaman aşımı.',
				isPositiveInteger: true,
				key: SETTINGS_KEYS.MCP_REQUEST_TIMEOUT_SECONDS,
				label: 'MCP istek zaman aşımı (saniye)',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: FILE_GLOB_SEARCH_PICKERS.DEFAULT_SEARCH_DEPTH,
				help: '@-anma dosya araması çalışma dizininin kaç alt düzeyine iner. Büyük değerler derindeki dosyaları bulur ama büyük ağaçlarda yavaşlar.',
				isPositiveInteger: true,
				key: SETTINGS_KEYS.MENTION_SEARCH_MAX_DEPTH,
				label: 'Anma arama derinliği',
				max: FILE_GLOB_SEARCH_PICKERS.MAX_SEARCH_DEPTH,
				min: 1,
				placeholder: `${FILE_GLOB_SEARCH_PICKERS.DEFAULT_SEARCH_DEPTH}`,
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.AGENTIC,
		title: SETTINGS_SECTION_TITLES.AGENTIC
	},
	// Import/Export
	{
		icon: Database,
		settings: [],
		slug: SETTINGS_SECTION_SLUGS.IMPORT_EXPORT,
		title: SETTINGS_SECTION_TITLES.IMPORT_EXPORT
	},
	// Sampling
	{
		icon: Funnel,
		settings: [
			{
				defaultValue: undefined,
				help: 'Çıktı token\'larının olasılık dağılımını etkileyerek metnin rastgeleliğini belirler. Yüksek = daha rastgele, düşük = daha odaklı.',
				key: SETTINGS_KEYS.TEMPERATURE,
				label: 'Sıcaklık',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.TEMPERATURE
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Sıcaklık örnekleyicisi eklentisi. Token entropisine göre olasılıkları ayarlayan dinamik sıcaklık aralığına eklenen değer.',
				key: SETTINGS_KEYS.DYNATEMP_RANGE,
				label: 'Dinamik sıcaklık aralığı',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DYNATEMP_RANGE
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Sıcaklık örnekleyicisi eklentisi. En olası token\'a göre olasılık yeniden dağılımını yumuşatır.',
				key: SETTINGS_KEYS.DYNATEMP_EXPONENT,
				label: 'Dinamik sıcaklık üssü',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DYNATEMP_EXPONENT
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Yalnızca en iyi k token\'ı tutar.',
				key: SETTINGS_KEYS.TOP_K,
				label: 'En iyi K',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.TOP_K },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Token\'ları, toplam olasılığı en az p olanlarla sınırlar.',
				key: SETTINGS_KEYS.TOP_P,
				label: 'En iyi P',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.TOP_P },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Bir token\'ın değerlendirilmesi için gereken en düşük olasılığı, en olası token\'ın olasılığına göre sınırlar.',
				key: SETTINGS_KEYS.MIN_P,
				label: 'En düşük P',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.MIN_P },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'XTC örnekleyici en üst token\'ları keser; bu değer kesme olasılığını belirler. 0 XTC\'yi kapatır.',
				key: SETTINGS_KEYS.XTC_PROBABILITY,
				label: 'XTC olasılığı',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.XTC_PROBABILITY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'XTC örnekleyici en üst token\'ları keser; bu değer bir token\'ın kesilmesi için gereken olasılığı belirler.',
				key: SETTINGS_KEYS.XTC_THRESHOLD,
				label: 'XTC eşiği',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.XTC_THRESHOLD
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Token\'ları log-olasılık ile entropi farkına göre sıralar ve sınırlar.',
				key: SETTINGS_KEYS.TYP_P,
				label: 'Tipik P',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.TYP_P },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Çıktı başına en fazla token sayısı. Sınırsız için -1 yaz.',
				key: SETTINGS_KEYS.MAX_TOKENS,
				label: 'En fazla token',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.MAX_TOKENS
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: '',
				help: 'Örnekleyicilerin uygulanma sırası (basit gösterim). Varsayılan "top_k;typ_p;top_p;min_p;temperature": top_k->typ_p->top_p->min_p->temperature',
				key: SETTINGS_KEYS.SAMPLERS,
				label: 'Örnekleyiciler',
				sync: { paramType: SyncableParameterType.STRING, serverKey: SETTINGS_KEYS.SAMPLERS },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: false,
				help: 'Arka uç tabanlı örnekleyicileri etkinleştir. Açıkken desteklenen örnekleyiciler hızlandırıcıda çalışır.',
				key: SETTINGS_KEYS.BACKEND_SAMPLING,
				label: 'Arka uç örnekleme',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: undefined,
				help: 'Tekrarı cezalandırırken dikkate alınacak son n token',
				key: SETTINGS_KEYS.REPEAT_LAST_N,
				label: 'Son N tekrarı',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.REPEAT_LAST_N
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Üretilen metinde token dizilerinin tekrarını denetler',
				key: SETTINGS_KEYS.REPEAT_PENALTY,
				label: 'Tekrar cezası',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.REPEAT_PENALTY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Token\'ları çıktıda görünüp görünmediklerine göre sınırlar.',
				key: SETTINGS_KEYS.PRESENCE_PENALTY,
				label: 'Varlık cezası',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.PRESENCE_PENALTY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'Token\'ları çıktıda ne sıklıkla göründüklerine göre sınırlar.',
				key: SETTINGS_KEYS.FREQUENCY_PENALTY,
				label: 'Sıklık cezası',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.FREQUENCY_PENALTY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY örnekleme uzun bağlamlarda bile tekrarı azaltır. Bu değer DRY çarpanını belirler.',
				key: SETTINGS_KEYS.DRY_MULTIPLIER,
				label: 'DRY çarpanı',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DRY_MULTIPLIER
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY örnekleme uzun bağlamlarda bile tekrarı azaltır. Bu değer DRY taban değerini belirler.',
				key: SETTINGS_KEYS.DRY_BASE,
				label: 'DRY tabanı',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.DRY_BASE },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY örnekleme uzun bağlamlarda bile tekrarı azaltır. Bu değer DRY için izin verilen uzunluğu belirler.',
				key: SETTINGS_KEYS.DRY_ALLOWED_LENGTH,
				label: 'DRY izinli uzunluk',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DRY_ALLOWED_LENGTH
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY örnekleme uzun bağlamlarda bile tekrarı azaltır. Bu değer son n token için DRY cezasını belirler.',
				key: SETTINGS_KEYS.DRY_PENALTY_LAST_N,
				label: 'DRY ceza son N',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DRY_PENALTY_LAST_N
				},
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.SAMPLING_PENALTIES,
		title: SETTINGS_SECTION_TITLES.SAMPLING_PENALTIES
	},
	// Developer
	{
		icon: Code,
		settings: [
			{
				defaultValue: false,
				help: 'Her yanıttan sonra sohbeti yeniden göndererek sunucu KV önbelleğini önceden doldur. Sen yanıtı okurken istem kodlandığı için sonraki tur hızlanır.',
				key: SETTINGS_KEYS.PRE_ENCODE_CONVERSATION,
				label: 'Yanıttan sonra KV önbelleğini doldur',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'reasoning_format=none gönder; sunucu düşünme token\'larını ayrı alana çıkarmak yerine metnin içinde döndürür.',
				key: SETTINGS_KEYS.DISABLE_REASONING_PARSING,
				label: 'Düşünme içeriği ayrıştırmasını kapat',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Göndermeden önce önceki mesajlardaki düşünmeyi çıkar. Kapalıyken düşünme reasoning_content alanıyla geri gönderilir; model turlar arasında kendi düşünce zincirini görür.',
				key: SETTINGS_KEYS.EXCLUDE_REASONING_FROM_CONTEXT,
				label: 'Düşünmeyi bağlamdan çıkar',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Mesajları Markdown biçimi yerine düz metin olarak göstermek için bir geçiş düğmesi göster',
				key: SETTINGS_KEYS.SHOW_RAW_OUTPUT_SWITCH,
				label: 'Ham çıktı geçişi',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Modele bir run_javascript aracı aç. Kod, arayüzden ve API\'sinden yalıtılmış, kum havuzlu bir iframe içindeki Web Worker\'da, katı zaman aşımıyla çalışır.',
				key: SETTINGS_KEYS.JS_SANDBOX_ENABLED,
				label: 'JavaScript kum havuzu aracı',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				dependsOn: SETTINGS_KEYS.JS_SANDBOX_ENABLED,
				help: 'Sembolik hesaplama için kum havuzuna nerdamer\'ı önceden yükle: sadeleştirme, türev, integral, çözme ve daha fazlası. "JavaScript kum havuzu aracı" açık olmalı.',
				key: SETTINGS_KEYS.SYMBOLIC_MATH_ENABLED,
				label: 'Sembolik matematik (nerdamer)',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: '',
				help: 'API\'ye gönderilecek özel JSON parametreleri. Geçerli JSON olmalı.',
				key: SETTINGS_KEYS.CUSTOM_JSON,
				label: 'Özel JSON',
				type: SettingsFieldType.TEXTAREA
			},
			{
				defaultValue: '',
				help: 'Çalışma anında sayfaya eklenen CSS. Buradan ayarla ya da sunucu tarafında --ui-config customCss alanıyla ver.',
				key: SETTINGS_KEYS.CUSTOM_CSS,
				label: 'Özel CSS',
				type: SettingsFieldType.TEXTAREA
			}
		],
		slug: SETTINGS_SECTION_SLUGS.DEVELOPER,
		title: SETTINGS_SECTION_TITLES.DEVELOPER
	}
];

function getAllSettings(): SettingsEntry[] {
	const result: SettingsEntry[] = [];

	for (const section of SETTINGS_REGISTRY) {
		result.push(...section.settings);
	}

	return result;
}

/** Flat config object stored in localStorage. */
export const SETTING_CONFIG_DEFAULT: Record<string, SettingsConfigValue> = Object.fromEntries(
	getAllSettings().map((s) => [s.key, s.defaultValue])
) as Record<string, SettingsConfigValue>;

/** Help text for every setting (including non-UI). */
export const SETTING_CONFIG_INFO: Record<string, string> = Object.fromEntries(
	getAllSettings().map((s) => [s.key, s.help])
) as Record<string, string>;

/**
 * Basit sohbet için gerekmeyen bölümler ve ayarlar arayüzden gizlenir.
 * Varsayılan değerleri (SETTING_CONFIG_DEFAULT) yine de korunur.
 */
const HIDDEN_SECTION_SLUGS: readonly string[] = [
	SETTINGS_SECTION_SLUGS.TOOLS,
	SETTINGS_SECTION_SLUGS.AGENTIC,
	SETTINGS_SECTION_SLUGS.DEVELOPER,
	SETTINGS_SECTION_SLUGS.DISPLAY,
	SETTINGS_SECTION_SLUGS.IMPORT_EXPORT,
	SETTINGS_SECTION_SLUGS.SAMPLING_PENALTIES
];

const VISIBLE_SETTING_KEYS: ReadonlySet<string> = new Set([SETTINGS_KEYS.THEME]);

/** Sidebar sections + field configs (as consumed by UI). */
function toSettingsSection(section: SettingsSectionEntry): SettingsSection {
	return {
		fields: section.settings
			.filter((s) => s.standaloneField !== false && VISIBLE_SETTING_KEYS.has(s.key))
			.map((s) => ({
				dependsOn: s.dependsOn,
				help: s.help,
				isExperimental: s.isExperimental,
				isPositiveInteger: s.isPositiveInteger,
				isPrivate: s.isPrivate,
				key: s.key,
				label: s.label,
				max: s.max,
				min: s.min,
				options: s.options as SettingsFieldConfig['options'],
				placeholder: s.placeholder,
				radioOptions: s.radioOptions,
				type: s.type
			})),
		icon: section.icon,
		slug: section.slug,
		title: section.title
	};
}

/** Sidebar sections in custom display order (the registry array order). */
export const SETTINGS_CHAT_SECTIONS: SettingsSection[] = SETTINGS_REGISTRY.filter(
	(section) => !HIDDEN_SECTION_SLUGS.includes(section.slug)
).map(toSettingsSection);

/** INPUT-type settings whose value is a number. */
export const NUMERIC_FIELDS = getAllSettings()
	.filter((s) => s.type === SettingsFieldType.INPUT && typeof s.defaultValue !== 'string')
	.map((s) => s.key) as readonly string[];

/** Numeric fields clamped to >= 1 and rounded. */
export const POSITIVE_INTEGER_FIELDS = getAllSettings()
	.filter((s) => s.isPositiveInteger)
	.map((s) => s.key) as readonly string[];
