import { useTranslation } from 'next-i18next';
import { function as Image } from 'next/image';

export function Milestones() {
  const { t } = useTranslation('about');
  
  const milestones = [
    {
      id: 1,
      year: '2020',
      titleKey: 'milestones.items.founding.title',
      descriptionKey: 'milestones.items.founding.description',
      image: '/images/about/milestones/founding.jpg'
    },
    {
      id: 2,
      year: '2019',
      titleKey: 'milestones.items.launch.title',
      descriptionKey: 'milestones.items.launch.description',
      image: '/images/about/milestones/launch.jpg'
    },
    {
      id: 3, 
      year: '2020',
      titleKey: 'milestones.items.expansion.title',
      descriptionKey: 'milestones.items.expansion.description',
      image: '/images/about/milestones/expansion.jpg'
    },
    {
      id: 4,
      year: '2022',
      titleKey: 'milestones.items.ai.title',
      descriptionKey: 'milestones.items.ai.description',
      image: '/images/about/milestones/ai.jpg'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('milestones.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {t('milestones.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id}
              className={`flex flex-col md:flex-row items-start mb-16 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <div className={`relative h-64 w-full rounded-lg overflow-hidden shadow-md ${
                  index % 2 === 1 ? 'md:ml-8' : 'md:mr-8'
                }`}>
                  <Image 
                    src={milestone.image}
                    alt={t(milestone.titleKey)}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mb-4">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t(milestone.titleKey)}
                </h3>
                <p className="text-gray-600">
                  {t(milestone.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 