"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, Plus, MapPin, Plane, Settings, Bell, Search, Calendar } from "lucide-react";

// モックデータ
const travelGroups = [
  {
    id: "1",
    name: "沖縄旅行",
    date: "2025年7月15日 - 7月18日",
    members: 5,
    image: "/images/okinawa.jpg",
    status: "計画中"
  },
  {
    id: "2",
    name: "京都観光",
    date: "2025年8月10日 - 8月12日",
    members: 3,
    image: "/images/kyoto.jpg",
    status: "確定"
  },
  {
    id: "3",
    name: "北海道スキー",
    date: "2025年12月24日 - 12月27日",
    members: 8,
    image: "/images/hokkaido.jpg",
    status: "提案"
  }
];

const friends = [
  { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg", status: "オンライン" },
  { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg", status: "オフライン" },
  { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg", status: "オンライン" },
  { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg", status: "オフライン" },
  { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg", status: "オンライン" }
];

const recentActivities = [
  { id: "1", user: "田中太郎", action: "「沖縄旅行」に新しい予定を追加しました", time: "1時間前" },
  { id: "2", user: "佐藤花子", action: "「京都観光」の宿泊先を更新しました", time: "3時間前" },
  { id: "3", user: "鈴木一郎", action: "「北海道スキー」に参加しました", time: "1日前" },
  { id: "4", user: "高橋和子", action: "新しい支出「居酒屋 5,000円」を追加しました", time: "2日前" }
];

export default function Home() {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">マイページ</h1>
          <p className="text-muted-foreground">旅行計画と友達を管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="旅行や友達を検索..." className="pl-10" />
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
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  <Plus className="mr-2 h-4 w-4" /> 新しい旅行
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新しい旅行を計画</DialogTitle>
                  <DialogDescription>
                    新しい旅行の詳細を入力してください。作成後、友達を招待できます。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">旅行名</Label>
                    <Input id="name" placeholder="例: 沖縄旅行2025" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">日程</Label>
                    <div className="flex gap-2">
                      <Input id="start-date" type="date" />
                      <span className="flex items-center">〜</span>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="destination">目的地</Label>
                    <Input id="destination" placeholder="例: 沖縄県那覇市" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>キャンセル</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">作成</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelGroups.map((group) => (
              <Link href={`/trip/${group.id}`} key={group.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <div className="relative h-40 w-full bg-gradient-to-r from-blue-400 to-teal-400">
                    {/* 画像があれば表示、なければグラデーション背景 */}
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
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{group.members}人</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MapPin className="h-4 w-4" /> 詳細
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}

            {/* 新規作成カード */}
            <Card className="border-dashed border-2 hover:border-blue-400 transition-all duration-300 flex items-center justify-center h-full cursor-pointer" onClick={() => setIsCreateGroupOpen(true)}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="font-medium text-center">新しい旅行を計画</p>
                <p className="text-sm text-muted-foreground text-center mt-1">クリックして作成</p>
              </CardContent>
            </Card>
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
            {friends.map((friend) => (
              <Card key={friend.id} className="flex items-center p-4 hover:shadow-md transition-all duration-300">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{friend.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${friend.status === "オンライン" ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="text-sm text-muted-foreground">{friend.status}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* アクティビティタブ */}
        <TabsContent value="activity" className="space-y-6">
          <h2 className="text-xl font-semibold">最近のアクティビティ</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <Card key={activity.id} className="p-4">
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
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 統計情報 */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">計画中の旅行</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{travelGroups.filter(g => g.status === "計画中").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">友達</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{friends.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">完了した旅行</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
