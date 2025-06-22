import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, Plus, MapPin, Plane, Settings, Search, Calendar } from "lucide-react";
import { FriendsData, travelGroups, recentActivities } from "@/lib/mockdeta";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { FriendsDataType, RecentActivityDataType, TravelGroupDataType } from "@/types/types";

// クライアントコンポーネントのインポート
import { CreateTripButton } from "@/components/home/create-trip-button";
import { SearchInput } from "@/components/home/serach-input";

// メンバー表示コンポーネント（サーバーコンポーネント）
function MemberAvatars({ members, maxDisplay = 4 }: { members: any[], maxDisplay?: number }) {
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayMembers.map((member, index) => (
          <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-xs">{member.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div className="h-8 w-8 border-2 border-white rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            +{remainingCount}
          </div>
        )}
      </div>
      <span className="text-sm text-muted-foreground ml-2">
        {members.length}人
      </span>
    </div>
  );
}

// 旅行カードコンポーネント（サーバーコンポーネント）
function TripCard({ group }: { group: TravelGroupDataType }) {
  return (
    <Link href={`/trip/${group.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative h-40 w-full bg-gradient-to-r from-blue-400 to-teal-400">
          {group.image && (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${group.image})` }} />
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={group.status === "確定" ? "default" : group.status === "計画中" ? "secondary" : "outline"}>
              {group.status}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> {group.date}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <MemberAvatars members={group.members} maxDisplay={3} />
            <Button variant="ghost" size="sm" className="gap-1">
              <MapPin className="h-4 w-4" /> 詳細
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

// 新規作成カードコンポーネント（サーバーコンポーネント）
function CreateTripCard() {
  return (
    <CreateTripButton>
      <Card className="border-dashed border-2 hover:border-blue-400 transition-all duration-300 flex items-center justify-center h-full cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4">
            <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-medium text-center">新しい旅行を計画</p>
          <p className="text-sm text-muted-foreground text-center mt-1">クリックして作成</p>
        </CardContent>
      </Card>
    </CreateTripButton>
  );
}

// 友達カードコンポーネント（サーバーコンポーネント）
function FriendCard({ friend }: { friend: FriendsDataType }) {
  return (
    <Card className="flex items-center p-4 hover:shadow-md transition-all duration-300">
      <Avatar className="h-12 w-12 mr-4">
        <AvatarImage src={friend.avatar} alt={friend.name} />
        <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium">{friend.name}</h3>
      </div>
      <Button variant="ghost" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </Card>
  );
}

// アクティビティカードコンポーネント（サーバーコンポーネント）
function ActivityCard({ activity }: { activity: RecentActivityDataType }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p>
            <span className="font-medium">{activity.user}</span>さんが
            <span>{activity.action}</span>
          </p>
          <p className="text-sm text-muted-foreground">{activity.time}</p>
        </div>
      </div>
    </Card>
  );
}

// メインのホームページコンポーネント（サーバーコンポーネント）
export default async function Home() {
   // 認証チェック
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            マイページ
          </h1>
          <p className="text-muted-foreground">旅行計画と友達を管理</p>
        </div>
      </div>

      {/* 検索バー */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <SearchInput />
      </div>

      {/* メインコンテンツ */}
      <Tabs defaultValue="trips" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="trips" className="flex items-center gap-2">
            <Plane className="h-4 w-4" /> 旅行
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> 友達
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> アクティビティ
          </TabsTrigger>
        </TabsList>

        {/* 旅行タブ */}
        <TabsContent value="trips" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">あなたの旅行計画</h2>
            <CreateTripButton>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                <Plus className="mr-2 h-4 w-4" /> 新しい旅行
              </Button>
            </CreateTripButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelGroups.map((group) => (
              <TripCard key={group.id} group={group} />
            ))}
            <CreateTripCard />
          </div>
        </TabsContent>

        {/* 友達タブ */}
        <TabsContent value="friends" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">友達リスト</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> 友達を追加
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FriendsData.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </TabsContent>

        {/* アクティビティタブ */}
        <TabsContent value="activity" className="space-y-6">
          <h2 className="text-xl font-semibold">最近のアクティビティ</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}