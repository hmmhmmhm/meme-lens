'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/src/i18n/navigation';

type Locale = 'ko' | 'en' | 'ja';

interface LanguageOption {
  code: Locale;
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
];

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
}

export function LanguageModal({ isOpen, onClose, isDarkTheme }: LanguageModalProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const cardBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-50';
  const buttonHover = isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const selectedBg = isDarkTheme ? 'bg-blue-600' : 'bg-blue-500';

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLanguages(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLanguageSelect = (langCode: Locale) => {
    // next-intl 라우터를 사용해서 로케일 변경
    router.push(pathname, { locale: langCode });
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className={`${cardBg} ${borderColor} ${textColor} border rounded-lg shadow-lg w-full max-w-md max-h-96`}
        style={{ touchAction: 'none' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
          <div className="flex items-center gap-2">
            <Globe size={20} />
            <h2 className="text-lg font-semibold">{t('selectLanguage')}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${buttonHover} transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('searchLanguage')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Language List */}
        <div className="max-h-48 overflow-y-auto">
          {filteredLanguages.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No languages found
            </div>
          ) : (
            filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full text-left px-4 py-3 ${buttonHover} transition-colors flex items-center justify-between ${
                  locale === lang.code ? selectedBg + ' text-white' : ''
                }`}
              >
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className={`text-sm ${locale === lang.code ? 'text-blue-100' : 'text-gray-500'}`}>
                    {lang.name}
                  </div>
                </div>
                {locale === lang.code && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}