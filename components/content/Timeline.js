import Image from 'next/image';

export default function Timeline({ stages, items, locale = 'id' }) {
  const stageList = stages || items || [];
  return (
    <div className="relative max-w-5xl mx-auto px-4 md:px-0 py-12">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] transform md:-translate-x-1/2" />
      
      {stageList.map((stage, index) => {
        const isEven = index % 2 === 0;
        // Bilingual: use _en fields when locale=en, fall back to base field
        const title = (locale === 'en' && stage.title_en) ? stage.title_en : stage.title;
        const description = (locale === 'en' && stage.description_en) ? stage.description_en : stage.description;
        // Unique image per stage — fall back to stage-specific dummy
        const stageFallback = `/images/dummy/breeding/dummy-breeding-0${(index % 3) + 1}.jpg`;
        const imageSrc = stage.image_path || stageFallback;

        return (
          <div key={stage.id || index} className="relative flex flex-col md:flex-row items-center mb-24 last:mb-0 group">
            {/* Desktop Timeline Dot */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-background z-10" />
            
            {/* Mobile Timeline Dot */}
            <div className="md:hidden absolute left-4 top-8 w-3 h-3 rounded-full bg-primary transform -translate-x-[5.5px] ring-4 ring-background z-10" />

            {/* Content Left (Even) or Right (Odd) on Desktop */}
            <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:order-last'}`}>
              {stage.stage_number && (
                <span className="text-primary text-xs uppercase tracking-widest block mb-2 font-body">
                  Stage {String(stage.stage_number).padStart(2, '0')}
                </span>
              )}
              <h3 className="font-display text-3xl text-primary mb-4 pt-4 md:pt-0">{title}</h3>
              <p className="font-body text-muted leading-relaxed mb-6">{description}</p>
            </div>

            {/* Image Right (Even) or Left (Odd) on Desktop */}
            <div className={`w-full md:w-1/2 pl-12 md:pl-0 mt-6 md:mt-0 ${isEven ? 'md:pl-16 md:order-last' : 'md:pr-16'}`}>
              <div className="relative aspect-[4/3] bg-surface border border-white/[0.08] overflow-hidden">
                <Image 
                  src={imageSrc}
                  alt={title || `Breeding Stage ${index + 1}`}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
