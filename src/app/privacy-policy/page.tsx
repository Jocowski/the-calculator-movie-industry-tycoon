// src/app/privacy-policy/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const PrivacyPolicy: React.FC = () => {
  const { translations: t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        aria-label={t.backToHome}
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
      >
        &larr; {t.backToHome}
      </Link>
      <h1 className="text-3xl font-bold mb-6">{t.privacyPolicyTitle}</h1>
      <div className="mb-6 space-y-4">
        <p>{t.privacyPolicyIntro}</p>
        <ol className="list-decimal">
          <li>{t.privacyPolicySection1}</li>
          <li>{t.privacyPolicySection2}</li>
          <li>{t.privacyPolicySection3}</li>
          <li>{t.privacyPolicySection4}</li>
          <li>{t.privacyPolicySection5}</li>
          <li>{t.privacyPolicyContact}</li>
        </ol>
      </div>
      <p className="mt-8 text-sm text-gray-600">{t.privacyPolicyLastUpdated}</p>
    </div>
  );
};

export default PrivacyPolicy;