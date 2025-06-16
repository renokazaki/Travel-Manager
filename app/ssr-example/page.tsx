import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, MapPin, Calendar, TrendingUp } from 'lucide-react';

// 旅行先の型定義
type Destination = {
  id: number;
  name: string;
  description: string;
  popularity: number;
  bestSeason: string;
  imageUrl: string;
};

// サーバーサイドで直接データを生成（API routeを使わない）
// Next.js 15のサーバーコンポーネントでは、このような関数はサーバー側でのみ実行される
function getServerSideDestinations(): Destination[] {
  // 実際のアプリケーションでは、ここでデータベースからデータを取得したり
  // 外部APIを呼び出したりします
  return [
    {
      id: 1,
      name: '京都',
      description: '歴史的な寺院や神社、美しい庭園が魅力の古都',
      popularity: 95,
      bestSeason: '春・秋',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'
    },
    {
      id: 2,
      name: '沖縄',
      description: '美しいビーチと豊かな自然、独自の文化が魅力の島',
      popularity: 90,
      bestSeason: '春・夏',
      imageUrl: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e'
    },
    {
      id: 3,
      name: '北海道',
      description: '広大な自然と美味しい食べ物、四季折々の景色が楽しめる',
      popularity: 88,
      bestSeason: '夏・冬',
      imageUrl: 'https://images.unsplash.com/photo-1548026983-0c2a0d5c3b15'
    },
    {
      id: 4,
      name: '東京',
      description: '最先端の都市と伝統が共存する日本の首都',
      popularity: 92,
      bestSeason: '春・秋',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'
    },
    {
      id: 5,
      name: '広島',
      description: '平和記念公園と宮島の厳島神社が有名な都市',
      popularity: 85,
      bestSeason: '春・秋',
      imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989'
    }
  ];
}

// ローディングコンポーネント
function DestinationsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium">人気の旅行先を読み込み中...</p>
    </div>
  );
}

// 旅行先リストコンポーネント - サーバーコンポーネント
function DestinationsList() {
  // サーバーサイドでデータを取得
  const destinations = getServerSideDestinations();
  
  if (!destinations || destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">データが見つかりませんでした。</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48 w-full">
            <Image 
              src={destination.imageUrl} 
              alt={destination.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">{destination.name}</CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {destination.popularity}%
              </Badge>
            </div>
            <CardDescription>{destination.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>ベストシーズン: {destination.bestSeason}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link 
              href={`/destinations/${destination.id}`}
              className={buttonVariants({
                variant: "outline",
                className: "w-full"
              })}
            >
              <MapPin className="mr-2 h-4 w-4" /> 詳細を見る
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// メインページコンポーネント
export default function SSRExamplePage() {
  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-center mb-8">
        <Plane className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SSR実装例（API不使用）
          </span>
        </h1>
      </div>
      
      <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        このページはNext.js 15のサーバーコンポーネントを使用したSSR実装です。
        API routeを使わず、サーバーコンポーネント内で直接データを生成しています。
      </p>
      
      <Suspense fallback={<DestinationsLoading />}>
        <DestinationsList />
      </Suspense>
      
      <div className="mt-12 text-center">
        <Link 
          href="/"
          className={buttonVariants({
            variant: "default",
            className: "rounded-full px-8"
          })}
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
