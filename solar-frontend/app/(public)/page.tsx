import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import TrustBadges from '@/components/home/TrustBadges';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
    return (
        <>
            <Hero />
            <TrustBadges />
            <Benefits />

            {/* CTA Section */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-4xl font-bold mb-6">Ready to Go Solar?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Book your solar installation today and start saving on electricity bills while contributing to a greener planet.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/book">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                Book Installation Now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                       
                    </div>
                </div>
            </section>
        </>
    );
}
