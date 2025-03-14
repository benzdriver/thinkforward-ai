import { useTranslation } from 'next-i18next';
import Image from 'next/image';

export default function Team() {
  const { t } = useTranslation('about');
  
  // This would come from your data file in a real implementation
  const team = [
    {
      id: 1,
      nameKey: 'team.members.member1.name',
      positionKey: 'team.members.member1.position',
      bioKey: 'team.members.member1.bio',
      image: '/images/about/team/member1.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
    {
      id: 2,
      nameKey: 'team.members.member2.name',
      positionKey: 'team.members.member2.position',
      bioKey: 'team.members.member2.bio',
      image: '/images/about/team/member2.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
    {
      id: 3,
      nameKey: 'team.members.member3.name',
      positionKey: 'team.members.member3.position',
      bioKey: 'team.members.member3.bio',
      image: '/images/about/team/member3.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
    {
      id: 4,
      nameKey: 'team.members.member4.name',
      positionKey: 'team.members.member4.position',
      bioKey: 'team.members.member4.bio',
      image: '/images/about/team/member4.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('team.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div 
              key={member.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-80 w-full">
                <Image 
                  src={member.image}
                  alt={t(member.nameKey)}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {t(member.nameKey)}
                </h3>
                <p className="text-blue-600 mb-4">
                  {t(member.positionKey)}
                </p>
                <p className="text-gray-600 mb-4">
                  {t(member.bioKey)}
                </p>
                <div className="flex space-x-3">
                  <a 
                    href={member.social.linkedin} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a 
                    href={member.social.twitter} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 