export const dynamic = "force-dynamic"; // This disables SSG and ISR

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Button } from "@/components/ui/button";
import OutfitCard from "@/components/ui/outfit-card";
import prisma from "@/lib/prisma";

// Define the outfit type
interface Outfit {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  tags: string[];
  isPrivate: boolean;
  shareSlug?: string;
  createdAt: string;
  items: Array<{
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
  }>;
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Fetch some public outfits to showcase on the homepage
  let showcaseOutfits: Outfit[] = [];
  try {
    const outfits = await prisma.outfit.findMany({
      where: {
        isPrivate: false,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    showcaseOutfits = outfits.map(outfit => ({
      id: outfit.id,
      name: outfit.name,
      description: outfit.description || undefined,
      imageUrl: outfit.imageUrl || undefined,
      tags: outfit.tags,
      isPrivate: outfit.isPrivate,
      shareSlug: outfit.shareSlug || undefined,
      createdAt: outfit.createdAt.toISOString(),
      items: outfit.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description || undefined,
        purchaseUrl: item.purchaseUrl || undefined,
      })),
    }));
  } catch (error) {
    console.error('Error fetching showcase outfits:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&crop=center')"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/90 to-background/70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black text-foreground mb-12 leading-tight animate-fade-in-up">
              Save Your
              <span className="block text-gradient-royal animate-gradient">
                {" "}Style
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl text-muted-foreground mb-20 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up-delayed">
              Organize your favorite outfits, discover new styles, and never forget what to wear again.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24 animate-fade-in-up-delayed-2">
              {session ? (
                <>
                  <Button asChild size="lg" className="text-lg px-10 py-6 bg-gradient-royal hover:bg-gradient-royal-light shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white">
                    <Link href="/outfits/new" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Save New Outfit
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-10 py-6 border-2 border-royal/30 hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 hover:border-royal" style={{ color: 'hsl(var(--royal))' }}>
                    <Link href="/my-outfits" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      View My Outfits
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg px-10 py-6 bg-gradient-royal hover:bg-gradient-royal-light shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white">
                    <Link href="/register" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Started Free
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-10 py-6 border-2 border-royal/30 hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 text-foreground">
                    <Link href="/login" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-background" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Asymmetric Header */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-left">
              <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                {showcaseOutfits.length > 0 ? 'Featured' : 'See What\'s'}
                <span className="block text-gradient-royal">
                  {showcaseOutfits.length > 0 ? 'Outfits' : 'Possible'}
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {showcaseOutfits.length > 0
                  ? 'Real outfits from our community'
                  : 'Examples of how you can organize your outfits'
                }
              </p>
            </div>
          </div>

          {/* Masonry-style Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {showcaseOutfits.length > 0 ? (
              showcaseOutfits.map((outfit: Outfit, index: number) => (
                <div key={outfit.id} className={`break-inside-avoid ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'}`}>
                  <OutfitCard
                    outfit={{
                      ...outfit,
                      isPrivate: false,
                      items: outfit.items || []
                    }}
                    showActions={false}
                  />
                </div>
              ))
            ) : (
              // Fallback sample outfits with staggered positioning
              <>
                <div className="break-inside-avoid">
                  <OutfitCard
                    outfit={{
                      id: 1,
                      name: "Summer Casual",
                      description: "Perfect for warm days. Light cotton dress with sandals and a wide-brim hat",
                      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
                      tags: ["casual", "summer", "dress"],
                      isPrivate: false,
                      shareSlug: undefined,
                      createdAt: new Date().toISOString(),
                      items: []
                    }}
                    showActions={false}
                  />
                </div>
                <div className="break-inside-avoid lg:mt-8">
                  <OutfitCard
                    outfit={{
                      id: 2,
                      name: "Business Professional",
                      description: "Classic business attire for important meetings and presentations",
                      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
                      tags: ["formal", "business", "professional"],
                      isPrivate: false,
                      shareSlug: undefined,
                      createdAt: new Date().toISOString(),
                      items: []
                    }}
                    showActions={false}
                  />
                </div>
                <div className="break-inside-avoid">
                  <OutfitCard
                    outfit={{
                      id: 3,
                      name: "Weekend Brunch",
                      description: "Comfortable and stylish outfit perfect for weekend brunches",
                      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
                      tags: ["casual", "weekend", "brunch"],
                      isPrivate: false,
                      shareSlug: undefined,
                      createdAt: new Date().toISOString(),
                      items: []
                    }}
                    showActions={false}
                  />
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-16">
            <Button asChild variant="link" className="text-lg group">
              <Link href="/register" className="flex items-center gap-2 text-gradient-royal hover:text-royal transition-colors duration-300">
                Start saving your own outfits
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Remove the Footer component from here */}
    </div>
  );
}
