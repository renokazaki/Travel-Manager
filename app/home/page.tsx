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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Users, Plus, MapPin, Plane, Settings, Bell, Search, Calendar, UserPlus } from "lucide-react";

// 友達データ
const friends = [
  { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg", status: "オンライン" },
  { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg", status: "オフライン" },
  { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg", status: "オンライン" },
  { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg", status: "オフライン" },
  { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg", status: "オンライン" },
  { id: "6", name: "山田美咲", avatar: "/avatars/yamada.jpg", status: "オンライン" },
  { id: "7", name: "中村健太", avatar: "/avatars/nakamura.jpg", status: "オフライン" },
  { id: "8", name: "小林愛", avatar: "/avatars/kobayashi.jpg", status: "オンライン" }
];

// 旅行グループデータ（実際のメンバー情報付き）
const travelGroups = [
  {
    id: "1",
    name: "沖縄旅行",
    date: "2025年7月15日 - 7月18日",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" },
      { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg" },
      { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg" }
    ],
    image: "/images/okinawa.jpg",
    status: "計画中"
  },
  {
    id: "2",
    name: "京都観光",
    date: "2025年8月10日 - 8月12日",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" }
    ],
    image: "/images/kyoto.jpg",
    status: "確定"
  },
  {
    id: "3",
    name: "北海道スキー",
    date: "2025年12月24日 - 12月27日",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" },
      { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg" },
      { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg" },
      { id: "6", name: "山田美咲", avatar: "/avatars/yamada.jpg" },
      { id: "7", name: "中村健太", avatar: "/avatars/nakamura.jpg" },
      { id: "8", name: "小林愛", avatar: "/avatars/kobayashi.jpg" }
    ],
    image: "/images/hokkaido.jpg",
    status: "計画中"
  }
];

const recentActivities = [
  { id: "1", user: "田中太郎", action: "「沖縄旅行」に新しい予定を追加しました", time: "1時間前" },
  { id: "2", user: "佐藤花子", action: "「京都観光」の宿泊先を更新しました", time: "3時間前" },
  { id: "3", user: "鈴木一郎", action: "「北海道スキー」に参加しました", time: "1日前" },
  { id: "4", user: "高橋和子", action: "新しい支出「居酒屋 5,000円」を追加しました", time: "2日前" }
];

// メンバー表示コンポーネント
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

// 新規旅行作成コンポーネント
function CreateTripDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    destination: ""
  });

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFriends(friends.map(f => f.id));
  };

  const handleDeselectAll = () => {
    setSelectedFriends([]);
  };

  const handleSubmit = () => {
    console.log("新しい旅行:", {
      ...formData,
      selectedFriends
    });
    
    // フォームリセット
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      destination: ""
    });
    setSelectedFriends([]);
    onOpenChange(false);
  };

  const selectedFriendsList = friends.filter(f => selectedFriends.includes(f.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>新しい旅行を計画</DialogTitle>
          <DialogDescription>
            旅行の詳細を入力して、一緒に行く友達を選択してください。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">基本情報</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">旅行名 *</Label>
                <Input 
                  id="name" 
                  placeholder="例: 沖縄旅行2025"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">日程 *</Label>
                <div className="flex gap-2">
                  <Input 
                    id="start-date" 
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <span className="flex items-center text-muted-foreground">〜</span>
                  <Input 
                    id="end-date" 
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">目的地</Label>
                <Input 
                  id="destination" 
                  placeholder="例: 沖縄県那覇市"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* 友達選択 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-muted-foreground">参加メンバーを選択</h3>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={selectedFriends.length === friends.length}
                >
                  全選択
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleDeselectAll}
                  disabled={selectedFriends.length === 0}
                >
                  全解除
                </Button>
              </div>
            </div>
            
            {/* 選択された友達のプレビュー */}
            {selectedFriends.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    選択済み ({selectedFriends.length}人)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFriendsList.map(friend => (
                    <div key={friend.id} className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="text-xs">{friend.name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      <span>{friend.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 友達リスト */}
            <ScrollArea className="h-48 border rounded-md p-4">
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`friend-${friend.id}`}
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => handleFriendToggle(friend.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback className="text-xs">{friend.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label 
                        htmlFor={`friend-${friend.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {friend.name}
                      </Label>
                 
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.startDate || !formData.endDate}
          >
            旅行を作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
            <Button 
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              onClick={() => setIsCreateGroupOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> 新しい旅行
            </Button>
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
                      <MemberAvatars members={group.members} maxDisplay={3} />
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MapPin className="h-4 w-4" /> 詳細
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}

            {/* 新規作成カード */}
            <Card 
              className="border-dashed border-2 hover:border-blue-400 transition-all duration-300 flex items-center justify-center h-full cursor-pointer" 
              onClick={() => setIsCreateGroupOpen(true)}
            >
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

      {/* 新規旅行作成ダイアログ */}
      <CreateTripDialog 
        open={isCreateGroupOpen} 
        onOpenChange={setIsCreateGroupOpen} 
      />
    </div>
  );
}