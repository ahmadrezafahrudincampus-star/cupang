import Button from '@/components/ui/Button';

export default function ProductCTA({ fish, mode = 'inquiry', locale = 'id' }) {
  if (!fish) return null;

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
  
  const textId = `Halo, saya tertarik dengan Betta ID ${fish.fish_code || ''} - ${fish.name || ''} (${fish.type || 'Betta'}). Apakah spesimen ini masih tersedia?`;
  const textEn = `Hello, I am interested in Betta ID ${fish.fish_code || ''} - ${fish.name || ''} (${fish.type || 'Betta'}). Is this specimen currently available?`;
  
  const message = locale === 'en' ? textEn : textId;
  const waUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  const btnLabel = locale === 'en' ? 'INQUIRE ABOUT THIS FISH' : 'INQUIRE SPESIMEN INI';

  return (
    <div className="w-full">
      <Button 
        href={waUrl} 
        variant="primary" 
        size="lg" 
        className="w-full justify-center text-center font-bold tracking-widest text-xs"
        target="_blank"
        rel="noopener noreferrer"
      >
        {btnLabel} &rarr;
      </Button>
    </div>
  );
}
