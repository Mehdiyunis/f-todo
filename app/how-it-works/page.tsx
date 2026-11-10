import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bell, CheckCircle2, Clock3, Cloud, ListChecks, ShieldCheck, Timer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Necə işləyir? — F-todo',
  description: 'F-todo funksiyaları, todo-ların saxlanması, taymer və xatırlatmalar haqqında məlumat.',
};

const features = [
  {
    icon: ListChecks,
    title: 'Todo yarat və planla',
    text: 'Başlıq əlavə et, işin növünü seç: vaxtsız todo bir dəfəlik siyahında qalır, gündəlik todo isə seçdiyin həftə günlərində təkrarlanır. Gündəlik todo üçün xatırlatma saatı da təyin edə bilərsən.',
  },
  {
    icon: CheckCircle2,
    title: 'Gedişatı izlə',
    text: 'Radio düyməsinə toxunaraq işi tamamlandı kimi işarələ. Gündəlik işlərin tamamlanması hər tarix üçün ayrıca saxlanılır; əvvəlki günlərə açılan tarix siyahısından baxa bilərsən.',
  },
  {
    icon: Timer,
    title: 'Fokus vaxtını ölç',
    text: 'Gündəlik todo-nun altındakı Başla düyməsi ilə taymeri işə sal. Pauza və Dayandır əməliyyatları sessiyanın vaxtını və müddətini todo detallarında saxlayır.',
  },
  {
    icon: Bell,
    title: 'Xatırlatma al',
    text: 'Gündəlik todo üçün saat seç və brauzer bildirişlərinə icazə ver. Xatırlatmalar sayt açıq olduğu müddətdə işləyir.',
  },
  {
    icon: Cloud,
    title: 'Qonaq və hesab rejimi',
    text: 'Hesabsız istifadə zamanı todo-lar bu brauzerdə saxlanılır. Google və ya e-poçt/şifrə ilə hesab açdıqdan və daxil olduqdan sonra qonaq todo-ların Supabase hesabına köçürülür və hesabla sinxronlaşır.',
  },
  {
    icon: ShieldCheck,
    title: 'Hesabına özün nəzarət et',
    text: 'E-poçt/şifrə ilə qeydiyyatda e-poçt təsdiqi tələb oluna bilər. Hesabına daxil olduqda sessiya bu brauzerdə yadda qalır; çıxış etsən və ya brauzer məlumatlarını silsən, yenidən daxil olmalısan.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="info-page">
      <header className="info-nav">
        <Link className="brand" href="/"><span className="brand-mark">f.</span><span>F-todo</span></Link>
        <Link className="back-link" href="/"><ArrowLeft size={15}/> Ana səhifə</Link>
      </header>

      <section className="info-hero">
        <div className="eyebrow">F-TODO / QISA BƏLƏDÇİ</div>
        <h1>Planını qur.<br/><em>Öz ritmində irəlilə.</em></h1>
        <p>F-todo gündəlik vərdişlərini və bir dəfəlik işlərini sadə siyahıda toplamağa kömək edir.</p>
        <Link className="primary-button info-cta" href="/"><span>Todo yaratmağa başla</span><ArrowRight size={16}/></Link>
      </section>

      <section className="info-features" aria-label="F-todo funksiyaları">
        {features.map(({ icon: Icon, title, text }, index) => (
          <article className="info-feature" key={title}>
            <div className="info-feature-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="info-feature-icon"><Icon size={20}/></div>
            <div><h2>{title}</h2><p>{text}</p></div>
          </article>
        ))}
      </section>

      <section className="free-note">
        <span className="free-note-star">✳</span>
        <div><h2>F-todo tamamilə pulsuzdur.</h2><p>Sayt istifadəçiləri məmnun etmək məqsədilə yaradılıb.</p></div>
      </section>

      <footer className="info-contact">
        <div><span className="section-kicker">ƏLAQƏ</span><h2>Təklifin və ya iradın var?</h2><p>Təklif və iradların üçün mənimlə bu e-poçt ünvanından əlaqə saxlaya bilərsən.</p></div>
        <a href="mailto:dev.mehdi.quluzade@gmail.com">dev.mehdi.quluzade@gmail.com <ArrowRight size={15}/></a>
      </footer>
    </main>
  );
}
