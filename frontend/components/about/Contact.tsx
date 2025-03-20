import { useTranslation } from 'next-i18next';

export function Contact() {
  const { t } = useTranslation('about');

  return (
    <section id="contact" className="py-16 md:py-24 bg-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            {t('contact.title')}
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-blue-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-700 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('contact.email.title')}
            </h3>
            <p className="text-blue-200 mb-3">
              {t('contact.email.description')}
            </p>
            <a href="mailto:info@thinkforward.com" className="text-white hover:text-blue-100 font-medium">
              info@thinkforward.com
            </a>
          </div>
          
          <div className="bg-blue-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-700 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('contact.phone.title')}
            </h3>
            <p className="text-blue-200 mb-3">
              {t('contact.phone.description')}
            </p>
            <a href="tel:+16046011234" className="text-white hover:text-blue-100 font-medium">
              +1 (604) 601-1234
            </a>
          </div>
          
          <div className="bg-blue-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-700 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('contact.address.title')}
            </h3>
            <p className="text-blue-200 mb-3">
              {t('contact.address.description')}
            </p>
            <p className="text-white">
              6060 Silver Dr<br />
              Burnaby, BC V5H 0H5
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-md"
          >
            {t('contact.cta')}
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 