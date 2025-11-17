import { useEffect, useRef } from "react";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyContact = () => {
  // New: icons above chatway, styled like the provided image
  // Refs for idle animation
  const waRef = useRef<HTMLButtonElement>(null);
  const phoneRef = useRef<HTMLButtonElement>(null);
  const mailRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let running = false;
    function stylizedSpin(btn: HTMLButtonElement, color: string) {
      if (!btn) return;
      running = true;
      btn.style.background = color;
      btn.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.15) rotate(-20deg)' },
        { transform: 'scale(1.1) rotate(380deg)' },
        { transform: 'scale(1) rotate(360deg)' }
      ], {
        duration: 900,
        easing: 'cubic-bezier(.7,-0.2,.7,1.2)'
      });
      setTimeout(() => {
        btn.style.background = '';
        running = false;
      }, 900);
    }
    function loop() {
      if (waRef.current && phoneRef.current && mailRef.current) {
        stylizedSpin(waRef.current, '#25D366');
        setTimeout(() => stylizedSpin(phoneRef.current!, '#6739B7'), 300);
        setTimeout(() => stylizedSpin(mailRef.current!, '#EA4335'), 600);
      }
      timeout = setTimeout(loop, 10000);
    }
    timeout = setTimeout(loop, 10000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2 items-end animate-slide-up md:bottom-[90px] md:right-6 md:gap-3">
      {/* Custom icon row above chatway */}
      <div className="flex flex-col gap-2 mb-1 items-end md:gap-3 md:mb-2">
        {/* WhatsApp Icon */}
        <div className="rounded-full shadow-xl transition-all duration-200 group w-10 h-10 md:w-14 md:h-14" style={{ background: 'linear-gradient(135deg,#ffd166,#ef476f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            ref={waRef}
            aria-label="WhatsApp"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'transform 0.18s, box-shadow 0.18s' }}
            onClick={() => window.open("https://wa.me/919335909050", "_blank")}
            className="group hover:scale-110 hover:shadow-2xl focus:outline-none w-10 h-10 md:w-14 md:h-14"
            onMouseEnter={e => e.currentTarget.style.background = '#25D366'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            <svg className="h-5 w-5 md:h-8 md:w-8 transition-transform duration-200 group-hover:rotate-[15deg]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.978 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </button>
        </div>
        {/* Phone Icon */}
        <div className="rounded-full shadow-xl transition-all duration-200 group w-10 h-10 md:w-14 md:h-14" style={{ background: 'linear-gradient(135deg,#ffd166,#ef476f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            ref={phoneRef}
            aria-label="Call"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'transform 0.18s, box-shadow 0.18s' }}
            onClick={() => window.open("tel:+919335909050")}
            className="group hover:scale-110 hover:shadow-2xl focus:outline-none w-10 h-10 md:w-14 md:h-14"
            onMouseEnter={e => e.currentTarget.style.background = '#6739B7'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            <svg className="h-5 w-5 md:h-8 md:w-8 transition-transform duration-200 group-hover:rotate-[15deg]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/>
            </svg>
          </button>
        </div>
        {/* Mail Icon */}
        <div className="rounded-full shadow-xl transition-all duration-200 group w-10 h-10 md:w-14 md:h-14" style={{ background: 'linear-gradient(135deg,#ffd166,#ef476f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            ref={mailRef}
            aria-label="Mail"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'transform 0.18s, box-shadow 0.18s' }}
            onClick={() => window.open("mailto:propertyganj@outlook.com")}
            className="group hover:scale-110 hover:shadow-2xl focus:outline-none w-10 h-10 md:w-14 md:h-14"
            onMouseEnter={e => e.currentTarget.style.background = '#EA4335'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            <svg className="h-5 w-5 md:h-8 md:w-8 transition-transform duration-200 group-hover:rotate-[15deg]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 6.99 8-6.99V20H4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyContact;
