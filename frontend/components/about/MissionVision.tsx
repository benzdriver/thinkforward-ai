import { useTranslation } from 'next-i18next';

export function MissionVision() {
  const { t } = useTranslation('about');

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('mission_vision.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {t('mission_vision.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {t('mission_vision.mission.title')}
              </h3>
            </div>
            <p className="text-gray-600">
              {t('mission_vision.mission.description')}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-8 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {t('mission_vision.vision.title')}
              </h3>
            </div>
            <p className="text-gray-600">
              {t('mission_vision.vision.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 