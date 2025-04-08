import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-white shadow-sm rounded-lg mx-4 mb-4 mt-8">
            <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    © 2025 <a href="" className="hover:underline font-medium">SwaLay</a>. All Rights Reserved.
                </span>

                <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                    <a 
                        href="/about-us"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        About Us
                    </a>

                    <a 
                        href="/terms-of-service"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Terms of Service
                    </a>

                    <a 
                        href="/privacy-policy"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Privacy Policy
                    </a>

                    <a 
                        href="/pricing-and-payment-policy"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Pricing & Payment Policy
                    </a>

                    <a 
                        href="/return-and-refund-policy"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Return & Refund Policy
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer  