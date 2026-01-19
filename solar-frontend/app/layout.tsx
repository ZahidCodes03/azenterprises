import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'A Z Enterprises - Solar Rooftop Installation',
    description: 'Professional solar rooftop installation services in Jammu & Kashmir. Reduce your electricity bills and go green with A Z Enterprises.',
    keywords: 'solar, solar panels, rooftop installation, renewable energy, Jammu Kashmir, A Z Enterprises',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                        success: {
                            iconTheme: {
                                primary: '#074f37ff',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                {children}
            </body>
        </html>
    );
}
