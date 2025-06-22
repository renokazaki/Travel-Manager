import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, Plus, MapPin, Plane, Settings, Search, Calendar, Clock } from "lucide-react";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// クライアントコンポーネントのインポート
import { CreateTripButton } from "@/components/home/create-trip-button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { prisma } from "@/prisma/prisma";
import { Trip, User, ActivityLog } from "@prisma/client";

// 型定義
type TripWithUsers = Trip & {
  users: User[];
  _count?: {
    events: number;
  };
};

type ActivityWithUser = ActivityLog & {
  user: User | null;
  trip: Trip | null;
};

// メンバー表示コンポーネント
function MemberAvatars({ members, maxDisplay = 4 }: { members: User[], maxDisplay?: number }) {
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayMembers.map((member) => (
          <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
            <AvatarImage src={member.profileImage || ""} alt={member.displayName} />
            <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              {member.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
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

// 旅行ステータスのバッジカラー
function getStatusBadge(status: string) {
  switch (status) {
    case "PLANNING":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">計画中</Badge>;
    case "CONFIRMED":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">確定</Badge>;
    case "COMPLETED":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">完了</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// 旅行カードコンポーネント
function TripCard({ trip }: { trip: TripWithUsers }) {
  const formatDate = (date: Date | null) => {
    if (!date) return "未定";
    return new Intl.DateTimeFormat('ja-JP', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <Link href={`/trip/${trip.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
        <div className="relative h-40 w-full bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400">
          {trip.image && (
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
              style={{ backgroundImage: `url(${trip.image})` }} 
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute top-3 right-3">
            {getStatusBadge(trip.status)}
          </div>
          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              {trip.destination}
            </div>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1">{trip.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </CardDescription>
        </CardHeader>
        
        <CardFooter className="pt-0 flex justify-between items-center">
          <MemberAvatars members={trip.users} />
          {trip._count && (
            <div className="text-sm text-muted-foreground">
              {trip._count.events}件の予定
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

// 新規作成カード
function CreateTripCard() {
  return (
    <CreateTripButton>
      <Card className="border-dashed border-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center h-full cursor-pointer group">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-medium text-center text-lg">新しい旅行を計画</p>
          <p className="text-sm text-muted-foreground text-center mt-1">クリックして作成</p>
        </CardContent>
      </Card>
    </CreateTripButton>
  );
}

// 友達カード
function FriendCard({ friend }: { friend: User }) {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="flex items-center p-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={friend.profileImage || ""} alt={friend.displayName} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            {friend.displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{friend.displayName}</h3>
          <p className="text-sm text-muted-foreground">
            参加日: {new Intl.DateTimeFormat('ja-JP').format(friend.createdAt)}
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// アクティビティカード
function ActivityCard({ activity }: { activity: ActivityWithUser }) {
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    return "たった今";
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activity.user?.profileImage || ""} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              {activity.user?.displayName?.substring(0, 2).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user?.displayName || "不明なユーザー"}</span>さんが
              <span className="ml-1">{activity.description}</span>
            </p>
            {activity.trip && (
              <p className="text-xs text-muted-foreground mt-1">
                旅行: {activity.trip.name}
              </p>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <Clock className="h-3 w-3" />
              {timeAgo(activity.createdAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



// TODO 現在ユーザーの登録機能がないので、一旦条件を省略
// データ取得関数（修正版）
async function getTripsData(userId: string): Promise<TripWithUsers[]> {
  const trips = await prisma.trip.findMany({
    // where: {
    //   users: {
    //     some: {
    //       clerkId: userId,
    //     },
    //   },
    // },
    include: {
      users: true,
      _count: {
        select: {
          events: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  return trips;
}

async function getFriendsData(userId: string): Promise<User[]> {
  // TODO 現在ユーザーの登録機能がないので、一旦条件を省略
  // 同じ旅行に参加したことがあるユーザーを友達として表示
  const friends = await prisma.user.findMany({
    // where: {
    //   AND: [
    //     { NOT: { clerkId: userId } },
    //     {
    //       trips: {
    //         some: {
    //           users: {
    //             some: {
    //               clerkId: userId,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ],
    // },
    take: 10,
  });
  return friends;
}


// TODO 現在ユーザーの登録機能がないので、一旦条件を省略
async function getActivitiesData(userId: string): Promise<ActivityWithUser[]> {
  const activities = await prisma.activityLog.findMany({
    // where: {
    //   Trip: {
    //     users: {
    //       some: {
    //         clerkId: userId,
    //       },
    //     },
    //   },
    // },
    include: {
      Trip: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  // ユーザー情報を別途取得して型を合わせる
  const activitiesWithUser: ActivityWithUser[] = await Promise.all(
    activities.map(async (activity) => {
      const user = await prisma.user.findUnique({
        where: { clerkId: activity.clerkId },
      });
      return {
        ...activity,
        user: user || null,
        trip: activity.Trip || null,
      };
    })
  );

  return activitiesWithUser;
}

// メインのホームページコンポーネント
export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  try {
    const [trips, friends, activities] = await Promise.all([
      getTripsData(userId),
      getFriendsData(userId),
      getActivitiesData(userId),
    ]);

    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              マイページ
            </h1>
            <Badge variant="outline" className="text-sm">
              {trips.length}件の旅行
            </Badge>
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* メインコンテンツ */}
        <Tabs defaultValue="trips" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
            <TabsTrigger value="trips" className="flex items-center gap-2 text-sm">
              <Plane className="h-4 w-4" /> 旅行 ({trips.length})
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" /> 友達 ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" /> アクティビティ
            </TabsTrigger>
          </TabsList>

          {/* 旅行タブ */}
          <TabsContent value="trips" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">あなたの旅行計画</h2>
              <CreateTripButton>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg">
                  <Plus className="mr-2 h-4 w-4" /> 新しい旅行
                </Button>
              </CreateTripButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
              <CreateTripCard />
            </div>

            {trips.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Plane className="h-16 w-16 mx-auto text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">まだ旅行がありません</h3>
                <p className="text-gray-500 mb-6">最初の旅行を計画してみましょう！</p>
                <CreateTripButton>
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                    <Plus className="mr-2 h-4 w-4" /> 新しい旅行を作成
                  </Button>
                </CreateTripButton>
              </div>
            )}
          </TabsContent>

          {/* 友達タブ */}
          <TabsContent value="friends" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">旅行仲間</h2>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> 友達を招待
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>

            {friends.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">まだ旅行仲間がいません</h3>
                <p className="text-gray-500">友達を旅行に招待してみましょう！</p>
              </div>
            )}
          </TabsContent>

          {/* アクティビティタブ */}
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-semibold">最近のアクティビティ</h2>
            
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {activities.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">アクティビティがありません</h3>
                <p className="text-gray-500">旅行の計画を始めると、ここにアクティビティが表示されます。</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">エラーが発生しました</h2>
          <p className="text-gray-500">データの読み込みに失敗しました。しばらく後に再試行してください。</p>
        </div>
      </div>
    );
  }
}