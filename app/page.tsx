import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Compass, Users, CalendarCheck, DollarSign, Receipt, Plane } from "lucide-react";
import FeatureCard from "@/components/feature-card";

export default function HomePage() {
  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
      {/* ヒーロセクション */}
      <div className="flex flex-col items-center text-center space-y-6 pt-8 md:pt-16 pb-12">
        <div className="flex items-center justify-center mb-4">
          <Plane className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
              グループ旅行調整
            </span>
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto leading-relaxed">
          文章の煩雑な調整はもう卒業。<br />
          <span className="font-semibold text-foreground">日程調整から割り勘計算まで</span>これ一つで完結
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href="/home" 
            className={buttonVariants({ 
              size: "lg", 
              className: "rounded-full font-medium px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            })}
          >
            無料で始める
          </Link>
          <Link 
            href="/demo" 
            className={buttonVariants({ 
              size: "lg", 
              variant: "outline", 
              className: "rounded-full font-medium px-8 py-3 text-lg border-2 hover:bg-muted/50 transition-all duration-300"
            })}
          >
            デモを体験
          </Link>
          <Link 
            href="/ssr-example" 
            className={buttonVariants({ 
              size: "lg", 
              variant: "ghost", 
              className: "rounded-full font-medium px-8 py-3 text-lg hover:bg-muted transition-all duration-300"
            })}
          >
            SSR実装例
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          クレジットカード不要 • 1分で登録完了
        </p>
      </div>
      
      {/* 機能紹介セクション */}
      <div className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            旅行調整の悩みを全て解決
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CalendarCheck className="h-12 w-12 text-blue-500" />}
            title="日程調整"
            description="カレンダー形式で全員の空き状況を一目で把握。最適な旅行日程を自動で提案します。"
          />
          <FeatureCard
            icon={<DollarSign className="h-12 w-12 text-green-500" />}
            title="予算管理"
            description="交通費・宿泊費・食費などカテゴリ別に予算を設定。グループ全体の予算分布を可視化します。"
          />
          <FeatureCard
            icon={<Compass className="h-12 w-12 text-amber-500" />}
            title="プラン編集"
            description="行きたい場所・やりたいことをみんなで共同編集。優先度設定と投票機能でスムーズに決定。"
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-purple-500" />}
            title="スケジュール調整"
            description="ドラッグ&ドロップで直感的にタイムライン作成。移動時間も考慮した最適化提案付き。"
          />
          <FeatureCard
            icon={<Receipt className="h-12 w-12 text-rose-500" />}
            title="精算機能"
            description="支出を記録するだけで自動で割り勘計算。複雑な貸し借り関係も一目で分かります。"
          />
          
        </div>
      </div>
      
      {/* 使用例セクション */}
      <div className="py-16 mt-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">こんな方におすすめ</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            様々なシーンでご利用いただけます
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">職場・大学のメンバー</h3>
            <p className="text-sm text-muted-foreground">
              幹事の負担を軽減し、全員が満足する旅行を
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">家族旅行</h3>
            <p className="text-sm text-muted-foreground">
              世代を超えた調整もスムーズに
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">友人グループ</h3>
            <p className="text-sm text-muted-foreground">
              みんなの意見をまとめて最高の思い出作り
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">カップル旅行</h3>
            <p className="text-sm text-muted-foreground">
              二人の理想を叶える完璧なプランニング
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}