import { useTranslation } from 'next-i18next';
import { function as Image } from 'next/image';

export function Hero() {
  const { t } = useTranslation('about');

  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image 
          src="/images/about/hero-bg.jpg"
          alt=""
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {t('hero.subtitle')}
          </p>
          
          <div className="inline-flex rounded-md shadow">
            <a
              href="#contact"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
            >
              {t('hero.cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 