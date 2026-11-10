import { ArrowDown } from 'lucide-react';

export function SiteFooter({ year }: { year: number | null }) {
  return <>
    <section className="bottom-note" id="haqqinda"><div className="note-symbol">✳</div><div><h3>Yavaşlamaq da irəliləyişdir.</h3><p>Bir iş, bir nəfəs, bir addım. Öz ritmini tap.</p></div><span className="note-plant">☘</span></section>
    <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">f.</span><span>F-todo</span></a><span>Fikirlərinə yer aç. © {year ?? ''}</span><a href="#necedir">Yuxarı qayıt <ArrowDown size={13}/></a></footer>
  </>;
}
