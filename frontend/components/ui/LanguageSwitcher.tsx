import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { enabledLanguages } from '@/utils/i18n';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [currentLocale, setCurrentLocale] = useState(locale || 'en');

  useEffect(() => {
    if (locale) {
      setCurrentLocale(locale);
    }
  }, [locale]);

  const getCurrentLanguage = () => {
    const lang = enabledLanguages.find(lang => lang.code === currentLocale);
    return lang || enabledLanguages.find(lang => lang.code === 'en') || enabledLanguages[0];
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <GlobeAltIcon className="mr-2 h-5 w-5 text-gray-400" />
          <span className="mr-1">{getCurrentLanguage().flag}</span>
          {getCurrentLanguage().name}
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {enabledLanguages.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }: { active: boolean }) => (
                  <Link 
                    href={{ pathname, query }}
                    as={asPath}
                    locale={language.code}
                    legacyBehavior
                  >
                    <a
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm ${currentLocale === language.code ? 'font-bold bg-blue-50' : ''}`}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </a>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 