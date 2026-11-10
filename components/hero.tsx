import { ArrowRight, Check, Plus, Sparkles } from 'lucide-react';

export function Hero({ date, onCreate }: { date: Date | null; onCreate: () => void }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Az et.<br/><em>Yaxşı et.</em></h1>
        <p>Günün içində itən fikirlər yox, sənə yer açan bir siyahı. Planla, başla və hər dəfə bir işi tamamla.</p>
        <button className="primary-button" onClick={onCreate}><Plus size={17}/> Todo yarat <ArrowRight size={16}/></button>
        <div className="hero-caption"><span className="tiny-check"><Check size={11}/></span> Hesab açmadan başlaya bilərsən</div>
      </div>
      <div className="hero-art">
        <div className="sun-disc"/><div className="hero-note note-back"><span className="note-line"/><span className="note-line short"/><span className="note-check"><Check size={12}/></span></div>
        <div className="hero-note note-front" aria-hidden="true">
          <div className="note-top"><span>BU GÜN</span><span className="note-date">{date ? `${date.getDate()} / ${date.getMonth()+1}` : '—'}</span></div>
          <div className="mini-task"><span className="mini-box"/><span className="note-skeleton note-skeleton-long"/></div>
          <div className="mini-task"><span className="mini-box"/><span className="note-skeleton note-skeleton-medium"/></div>
          <div className="mini-task"><span className="mini-box"/><span className="note-skeleton note-skeleton-short"/></div>
          <div className="note-footer"><span className="note-dot"/> öz ritmində davam et</div>
        </div>
        <div className="art-star">✳</div><div className="art-orbit"/>
      </div>
    </section>
  );
}
