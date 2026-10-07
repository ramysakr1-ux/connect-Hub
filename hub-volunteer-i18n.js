/* Connect Lite — the volunteer student's words, in six languages.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 30 Sep 2026: "the volunteer students how-to section could be done in
 * different languages. I don't know how many you have." Connect has six for
 * its volunteer sign-up (src/lib/fol/volunteer-signup-i18n.ts): Turkish,
 * Arabic, Russian, Persian, Ukrainian, English. The same six here, for the
 * two things a volunteer reads in their own language: the centre's joining
 * note, and how their page works. Everything else on their page stays in
 * English -- it is an English class.
 *
 * PROVENANCE, because it matters for a consent text:
 *   consent*  -- Connect's strings, word for word. Its Turkish is verbatim
 *                from Ramy's design handoff; its Arabic, Russian, Persian and
 *                Ukrainian are Connect's own best-effort translations, which
 *                Connect itself flags as never having had a native-speaker
 *                legal review.
 *   how*, kept*, agreedOn, readAgain, close -- written for Lite, 30 Sep 2026,
 *                not native-reviewed in any of the five. Plain sentences on
 *                purpose, so a reviewer's pass is short.
 *   invite*   -- the volunteer's invitation card (invite.html?v=), written
 *                7 Oct 2026, not native-reviewed in any of the five.
 *
 * Shape: hubVolunteerI18n.languages -> [{code, native, english, rtl}];
 *        hubVolunteerI18n.t[code]   -> the strings;
 *        hubVolunteerI18n.pick()    -> the code to use (remembered choice,
 *                                      else the browser's language, else en).
 */
(function (root) {
  'use strict';
  var KEY = 'chub:volunteerLang';

  var languages = [
    { code: 'tr', native: 'Türkçe', english: 'Turkish' },
    { code: 'ar', native: 'العربية', english: 'Arabic', rtl: true },
    { code: 'ru', native: 'Русский', english: 'Russian' },
    { code: 'fa', native: 'فارسی', english: 'Persian', rtl: true },
    { code: 'uk', native: 'Українська', english: 'Ukrainian' },
    { code: 'en', native: 'English', english: 'English' }
  ];

  var t = {
    en: {
      consentHeading: 'Before we begin',
      consentIntro: 'Please note the following.',
      consentLines: [
        'The information you provide will be shared with the centre for teacher-training purposes.',
        'Trainee teachers may reference it in their coursework. It will not be shared with any other party.',
        'You may withdraw from the course at any time.'
      ],
      recordingConsentLine: 'I agree to being recorded, in sound or on video, during this sign-up and in lessons, for teacher-training purposes only.',
      agreeLabel: 'I agree',
      keptNote: 'Your agreement is kept on this device and noted on the course register.',
      readAgain: 'Read it again',
      close: 'Close',
      agreedOn: 'You agreed to the centre’s note on {date}.',
      howTitle: 'How your page works',
      howSub: 'You are being taught by teachers in training. Thank you. Here is how your page works.',
      howItems: [
        'Your link is your page. Keep it; nobody else needs it. It stops working when the course ends.',
        'Your next class is at the top, with the time in the course’s own clock and in yours. Press Join to go into the online room. You do not need to prepare anything.',
        'Anything your teachers share for a lesson appears under For your next class. Have a look if you like; you do not have to.',
        'Your attendance is marked by the tutor, not by you. A class counts when you were there for most of it. Your hours add up on your page.',
        'When your hours reach the centre’s number, your certificate of attendance appears on your page. Print it, or save it as a PDF, and the centre signs it.',
        'Add the page to your phone: Add to Home Screen in Safari, or Install in Chrome. Then it opens like an app.',
        'If you cannot come to a class, just tell your teacher.'
      ],
      howLink: 'How your page works'
    },
    tr: {
      consentHeading: 'Başlamadan önce',
      consentIntro: 'Lütfen aşağıdaki hususları dikkate alın.',
      consentLines: [
        'Sağladığınız bilgiler, öğretmen eğitimi amacıyla merkezle paylaşılacaktır.',
        'Öğretmen adayları bu bilgilere ödevlerinde başvurabilir. Bilgileriniz başka hiçbir tarafla paylaşılmayacaktır.',
        'Kurstan istediğiniz zaman ayrılabilirsiniz.'
      ],
      recordingConsentLine: 'Bu kayıt sırasında ve derslerde ses veya görüntü olarak kaydedilmeyi, yalnızca öğretmen eğitimi amacıyla, kabul ediyorum.',
      agreeLabel: 'Kabul ediyorum',
      keptNote: 'Onayınız bu cihazda saklanır ve kurs kayıt defterine işlenir.',
      readAgain: 'Tekrar oku',
      close: 'Kapat',
      agreedOn: 'Merkezin notunu {date} tarihinde kabul ettiniz.',
      howTitle: 'Sayfanız nasıl çalışır',
      howSub: 'Size eğitim gören öğretmenler ders veriyor. Teşekkür ederiz. Sayfanız şöyle çalışır.',
      howItems: [
        'Bağlantınız sizin sayfanızdır. Saklayın; başka kimsenin ihtiyacı yok. Kurs bittiğinde çalışmayı durdurur.',
        'Bir sonraki dersiniz en üsttedir; saati hem kursun saatiyle hem sizin saatinizle yazar. Çevrimiçi odaya girmek için Katıl’a basın. Hazırlık yapmanız gerekmez.',
        'Öğretmenlerinizin bir ders için paylaştığı her şey “Bir sonraki dersiniz için” başlığı altında görünür. İsterseniz bakın; zorunlu değil.',
        'Devamınızı siz değil, eğitmen işaretler. Dersin çoğunda oradaysanız ders sayılır. Saatleriniz sayfanızda toplanır.',
        'Saatleriniz merkezin belirlediği sayıya ulaşınca katılım belgeniz sayfanızda görünür. Yazdırın ya da PDF olarak kaydedin; merkez imzalar.',
        'Sayfayı telefonunuza ekleyin: Safari’de Ana Ekrana Ekle, Chrome’da Yükle. Sonra bir uygulama gibi açılır.',
        'Bir derse gelemeyecekseniz öğretmeninize haber vermeniz yeterli.'
      ],
      howLink: 'Sayfanız nasıl çalışır'
    },
    ar: {
      consentHeading: 'قبل أن نبدأ',
      consentIntro: 'يُرجى مراعاة ما يلي.',
      consentLines: [
        'سيتم مشاركة المعلومات التي تقدمها مع المركز لأغراض تدريب المعلمين.',
        'يجوز للمتدربين الرجوع إليها في أعمالهم الدراسية. لن تُشارك مع أي طرف آخر.',
        'يجوز لك الانسحاب من الدورة في أي وقت.'
      ],
      recordingConsentLine: 'أوافق على تسجيلي صوتًا أو صورةً أثناء هذا التسجيل وفي الدروس، لأغراض تدريب المعلمين فقط.',
      agreeLabel: 'أوافق',
      keptNote: 'تُحفظ موافقتك على هذا الجهاز وتُسجَّل في سجل الدورة.',
      readAgain: 'اقرأها مرة أخرى',
      close: 'إغلاق',
      agreedOn: 'وافقت على ملاحظة المركز بتاريخ {date}.',
      howTitle: 'كيف تعمل صفحتك',
      howSub: 'يُدرّسك معلمون قيد التدريب. شكرًا لك. إليك كيف تعمل صفحتك.',
      howItems: [
        'رابطك هو صفحتك. احتفظ به؛ لا يحتاجه أحد غيرك. يتوقف عن العمل عند انتهاء الدورة.',
        'درسك التالي في الأعلى، مع الوقت بتوقيت الدورة وبتوقيتك. اضغط «انضم» لدخول الغرفة عبر الإنترنت. لا تحتاج إلى أي تحضير.',
        'كل ما يشاركه معلموك لدرس ما يظهر تحت «لدرسك التالي». ألقِ نظرة إن أحببت؛ ليس واجبًا.',
        'يسجّل المدرّب حضورك، لا أنت. يُحتسب الدرس إذا حضرت معظمه. تتجمع ساعاتك على صفحتك.',
        'عندما تبلغ ساعاتك العدد الذي حدده المركز، تظهر شهادة الحضور على صفحتك. اطبعها أو احفظها بصيغة PDF، ويوقّعها المركز.',
        'أضف الصفحة إلى هاتفك: «إضافة إلى الشاشة الرئيسية» في Safari، أو «تثبيت» في Chrome. بعدها تُفتح كتطبيق.',
        'إذا لم تستطع الحضور إلى درس، أخبر معلمك فقط.'
      ],
      howLink: 'كيف تعمل صفحتك'
    },
    ru: {
      consentHeading: 'Прежде чем начать',
      consentIntro: 'Пожалуйста, ознакомьтесь со следующим.',
      consentLines: [
        'Предоставленная вами информация будет передана центру в целях подготовки преподавателей.',
        'Стажёры-преподаватели могут использовать её в учебных целях. Она не будет передана никакой другой стороне.',
        'Вы можете прекратить участие в курсе в любое время.'
      ],
      recordingConsentLine: 'Я согласен на аудио- или видеозапись во время этой регистрации и на занятиях, исключительно в целях подготовки преподавателей.',
      agreeLabel: 'Я согласен',
      keptNote: 'Ваше согласие сохраняется на этом устройстве и отмечается в журнале курса.',
      readAgain: 'Прочитать ещё раз',
      close: 'Закрыть',
      agreedOn: 'Вы согласились с примечанием центра {date}.',
      howTitle: 'Как работает ваша страница',
      howSub: 'Вас обучают преподаватели-стажёры. Спасибо. Вот как работает ваша страница.',
      howItems: [
        'Ваша ссылка — это ваша страница. Сохраните её; больше никому она не нужна. Она перестаёт работать, когда курс заканчивается.',
        'Ваше следующее занятие — вверху, со временем по часам курса и по вашим. Нажмите «Присоединиться», чтобы войти в онлайн-комнату. Готовиться не нужно.',
        'Всё, чем ваши преподаватели делятся к занятию, появляется в разделе «К вашему следующему занятию». Посмотрите, если хотите; это не обязательно.',
        'Посещаемость отмечает тьютор, а не вы. Занятие засчитывается, если вы были на большей его части. Ваши часы суммируются на странице.',
        'Когда ваши часы достигнут числа, установленного центром, на странице появится сертификат о посещении. Распечатайте его или сохраните в PDF; центр его подпишет.',
        'Добавьте страницу на телефон: «На экран Домой» в Safari или «Установить» в Chrome. Тогда она открывается как приложение.',
        'Если вы не можете прийти на занятие, просто скажите преподавателю.'
      ],
      howLink: 'Как работает ваша страница'
    },
    fa: {
      consentHeading: 'پیش از شروع',
      consentIntro: 'لطفاً به موارد زیر توجه فرمایید.',
      consentLines: [
        'اطلاعاتی که ارائه می‌دهید به‌منظور آموزش مربیان در اختیار مرکز قرار خواهد گرفت.',
        'کارآموزان معلمی ممکن است در تکالیف درسی خود به آن استناد کنند. این اطلاعات با هیچ طرف دیگری به اشتراک گذاشته نخواهد شد.',
        'شما می‌توانید در هر زمان از دوره انصراف دهید.'
      ],
      recordingConsentLine: 'من با ضبط صدا یا تصویر خودم در طول این ثبت‌نام و در کلاس‌ها، صرفاً برای اهداف آموزش معلمان، موافقم.',
      agreeLabel: 'موافقم',
      keptNote: 'موافقت شما روی این دستگاه نگه داشته می‌شود و در دفتر حضور دوره ثبت می‌شود.',
      readAgain: 'دوباره بخوانید',
      close: 'بستن',
      agreedOn: 'شما در تاریخ {date} با یادداشت مرکز موافقت کردید.',
      howTitle: 'صفحه‌ی شما چگونه کار می‌کند',
      howSub: 'معلمانی که در حال آموزش دیدن هستند به شما درس می‌دهند. سپاسگزاریم. صفحه‌ی شما این‌گونه کار می‌کند.',
      howItems: [
        'پیوند شما همان صفحه‌ی شماست. آن را نگه دارید؛ کس دیگری به آن نیاز ندارد. با پایان دوره از کار می‌افتد.',
        'کلاس بعدی شما در بالای صفحه است، با ساعت به وقت دوره و به وقت شما. برای ورود به اتاق آنلاین «پیوستن» را بزنید. نیازی به آمادگی نیست.',
        'هر چیزی که معلمانتان برای یک درس به اشتراک بگذارند زیر «برای کلاس بعدی شما» نمایش داده می‌شود. اگر خواستید نگاهی بیندازید؛ اجباری نیست.',
        'حضور شما را مربی ثبت می‌کند، نه شما. اگر بیشترِ کلاس را حاضر بوده باشید، آن کلاس حساب می‌شود. ساعت‌هایتان در صفحه‌تان جمع می‌شود.',
        'وقتی ساعت‌هایتان به عددی که مرکز تعیین کرده برسد، گواهی حضور در صفحه‌تان ظاهر می‌شود. آن را چاپ کنید یا به‌صورت PDF ذخیره کنید؛ مرکز آن را امضا می‌کند.',
        'صفحه را به تلفن خود اضافه کنید: «افزودن به صفحه‌ی اصلی» در Safari یا «نصب» در Chrome. سپس مانند یک برنامه باز می‌شود.',
        'اگر نمی‌توانید به کلاسی بیایید، فقط به معلم خود بگویید.'
      ],
      howLink: 'صفحه‌ی شما چگونه کار می‌کند'
    },
    uk: {
      consentHeading: 'Перш ніж почати',
      consentIntro: 'Будь ласка, ознайомтеся з наведеною нижче інформацією.',
      consentLines: [
        'Надана вами інформація буде передана центру з метою підготовки викладачів.',
        'Стажери-викладачі можуть використовувати її у своїх навчальних роботах. Вона не буде передана жодній іншій стороні.',
        'Ви можете припинити участь у курсі в будь-який час.'
      ],
      recordingConsentLine: 'Я погоджуюсь на аудіо- або відеозапис під час цієї реєстрації та на заняттях, виключно з метою підготовки викладачів.',
      agreeLabel: 'Погоджуюсь',
      keptNote: 'Ваша згода зберігається на цьому пристрої та відмічається в журналі курсу.',
      readAgain: 'Прочитати ще раз',
      close: 'Закрити',
      agreedOn: 'Ви погодилися з приміткою центру {date}.',
      howTitle: 'Як працює ваша сторінка',
      howSub: 'Вас навчають викладачі-стажери. Дякуємо. Ось як працює ваша сторінка.',
      howItems: [
        'Ваше посилання — це ваша сторінка. Збережіть його; більше нікому воно не потрібне. Воно перестає працювати, коли курс закінчується.',
        'Ваше наступне заняття — вгорі, з часом за годинником курсу та за вашим. Натисніть «Приєднатися», щоб увійти до онлайн-кімнати. Готуватися не потрібно.',
        'Усе, чим ваші викладачі діляться до заняття, з’являється в розділі «До вашого наступного заняття». Подивіться, якщо хочете; це не обов’язково.',
        'Відвідуваність відмічає тьютор, а не ви. Заняття зараховується, якщо ви були на більшій його частині. Ваші години підсумовуються на сторінці.',
        'Коли ваші години сягнуть числа, встановленого центром, на сторінці з’явиться сертифікат про відвідування. Роздрукуйте його або збережіть у PDF; центр його підпише.',
        'Додайте сторінку на телефон: «На Початковий екран» у Safari або «Встановити» в Chrome. Тоді вона відкривається як застосунок.',
        'Якщо ви не можете прийти на заняття, просто скажіть викладачеві.'
      ],
      howLink: 'Як працює ваша сторінка'
    }
  };

  /* The invitation card's three lines (7 Oct 2026). Unreviewed translations,
     like the how* strings above. */
  var invite = {
    en: { inviteWhat: 'Your page for the classes: the next one to come to, which days you came, and your certificate at the end.',
          inviteKeepB: 'This link is just for you.', inviteKeep: 'Open it on your phone before each class.', inviteGo: 'Open my page' },
    tr: { inviteWhat: 'Dersler için sayfanız: gelmeniz gereken bir sonraki ders, hangi günler geldiğiniz ve sonunda katılım belgeniz.',
          inviteKeepB: 'Bu bağlantı yalnızca sizin için.', inviteKeep: 'Her dersten önce telefonunuzda açın.', inviteGo: 'Sayfamı aç' },
    ar: { inviteWhat: 'صفحتك للدروس: الدرس التالي الذي تحضره، والأيام التي حضرتها، وشهادتك في النهاية.',
          inviteKeepB: 'هذا الرابط لك وحدك.', inviteKeep: 'افتحه على هاتفك قبل كل درس.', inviteGo: 'افتح صفحتي' },
    ru: { inviteWhat: 'Ваша страница для занятий: следующее занятие, дни, когда вы приходили, и ваш сертификат в конце.',
          inviteKeepB: 'Эта ссылка только для вас.', inviteKeep: 'Открывайте её на телефоне перед каждым занятием.', inviteGo: 'Открыть мою страницу' },
    fa: { inviteWhat: 'صفحهٔ شما برای کلاس‌ها: کلاس بعدی که باید بیایید، روزهایی که آمده‌اید، و گواهی شما در پایان.',
          inviteKeepB: 'این پیوند فقط برای شماست.', inviteKeep: 'پیش از هر کلاس آن را روی گوشی خود باز کنید.', inviteGo: 'صفحهٔ من را باز کن' },
    uk: { inviteWhat: 'Ваша сторінка для занять: наступне заняття, дні, коли ви приходили, і ваш сертифікат наприкінці.',
          inviteKeepB: 'Це посилання лише для вас.', inviteKeep: 'Відкривайте його на телефоні перед кожним заняттям.', inviteGo: 'Відкрити мою сторінку' }
  };
  Object.keys(invite).forEach(function (c) { if (t[c]) Object.keys(invite[c]).forEach(function (k) { t[c][k] = invite[c][k]; }); });

  function has(code){ return !!t[code]; }
  function remembered(){ try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function remember(code){ if (has(code)) { try { localStorage.setItem(KEY, code); } catch (e) {} } }
  /* The order of precedence: what they chose, then what the browser says,
     then English. A `lang=` in the address wins over both, because the link
     came from a page where they had already chosen. */
  function pick(fromQuery){
    if (fromQuery && has(fromQuery)) return fromQuery;
    var r = remembered(); if (has(r)) return r;
    var b = String((navigator.language || '')).slice(0, 2).toLowerCase();
    return has(b) ? b : 'en';
  }
  function isRtl(code){ var l = languages.filter(function (x) { return x.code === code; })[0]; return !!(l && l.rtl); }

  root.hubVolunteerI18n = { languages: languages, t: t, pick: pick, remember: remember, remembered: remembered, isRtl: isRtl, has: has };
})(typeof window !== 'undefined' ? window : globalThis);
