import React from 'react';
import Link from 'next/link';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" aria-label="Back to Home" className="inline-block mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="mb-6">
        <p>At The Calculator Movie Industry Tycoon, we value your privacy and want to be transparent about our practices.</p>
        <p>1. Data Collection: We do not collect any sensitive user data during your navigation on our platform.</p>
        <p>2. Cache Usage: We use browser cache exclusively to store information about your language and theme (light / dark) choices to improve your browsing experience.</p>
        <p>3. Advertisements: The ads displayed on our platform are provided by third parties and have no direct link to the developer. These ads do not represent any ideas or opinions related to the developer or The Calculator Movie Industry Tycoon.</p>
        <p>4. Third-Party Cookies: Advertisers may use their own cookies or similar technologies to collect information about your interactions with their ads. We recommend that you review these third parties' privacy policies to understand their practices.</p>
        <p>5. User Control: You can manage your cookie and advertising preferences through your browser or device settings.</p>
        <p>We are committed to protecting your privacy and ensuring a safe experience on our platform. If you have any questions or concerns, please contact us.</p>
      </div>
      <p className="mt-8 text-sm text-gray-600">Last updated: February 15, 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
