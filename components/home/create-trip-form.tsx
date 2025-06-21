// "use client";

// import { useFormState, useFormAction } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DialogFooter } from "@/components/ui/dialog";
// import { UserPlus } from "lucide-react";
// import { FriendsData } from "@/lib/mockdeta";
// import { createTripAction } from "./lib/trip-actions";

// // 選択された友達のプレビューコンポーネント
// function SelectedFriendsPreview({ selectedFriends }: { selectedFriends: string[] }) {
//   const selectedFriendsList = FriendsData.filter(f => selectedFriends.includes(f.id));

//   if (selectedFriends.length === 0) return null;

//   return (
//     <div className="p-3 bg-blue-50 rounded-lg">
//       <div className="flex items-center gap-2 mb-2">
//         <UserPlus className="h-4 w-4 text-blue-600" />
//         <span className="text-sm font-medium text-blue-800">
//           選択済み ({selectedFriends.length}人)
//         </span>
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {selectedFriendsList.map(friend => (
//           <div key={friend.id} className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs">
//             <Avatar className="h-4 w-4">
//               <AvatarImage src={friend.avatar} alt={friend.name} />
//               <AvatarFallback className="text-xs">{friend.name.substring(0, 1)}</AvatarFallback>
//             </Avatar>
//             <span>{friend.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // 友達選択コンポーネント
// function FriendSelector({ selectedFriends, onToggle }: { 
//   selectedFriends: string[], 
//   onToggle: (friendId: string, checked: boolean) => void 
// }) {
//   return (
//     <ScrollArea className="h-48 border rounded-md p-4">
//       <div className="space-y-3">
//         {FriendsData.map((friend) => (
//           <div key={friend.id} className="flex items-center space-x-3">
//             <Checkbox
//               id={`friend-${friend.id}`}
//               name="selectedFriends"
//               value={friend.id}
//               checked={selectedFriends.includes(friend.id)}
//               onCheckedChange={(checked) => onToggle(friend.id, checked as boolean)}
//             />
//             <Avatar className="h-8 w-8">
//               <AvatarImage src={friend.avatar} alt={friend.name} />
//               <AvatarFallback className="text-xs">{friend.name.substring(0, 2)}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <Label 
//                 htmlFor={`friend-${friend.id}`}
//                 className="text-sm font-medium cursor-pointer"
//               >
//                 {friend.name}
//               </Label>
//             </div>
//           </div>
//         ))}
//       </div>
//     </ScrollArea>
//   );
// }

// export function CreateTripForm() {
//   const [state, formAction, pending] = useFormAction(createTripAction, {
//     selectedFriends: [],
//     errors: {},
//     success: false
//   });

//   const handleFriendToggle = (friendId: string, checked: boolean) => {
//     const event = new Event('change', { bubbles: true });
//     const input = document.createElement('input');
//     input.name = 'friendToggle';
//     input.value = JSON.stringify({ friendId, checked });
//     input.dispatchEvent(event);
//   };

//   const handleSelectAll = () => {
//     FriendsData.forEach(friend => handleFriendToggle(friend.id, true));
//   };

//   const handleDeselectAll = () => {
//     FriendsData.forEach(friend => handleFriendToggle(friend.id, false));
//   };

//   return (
//     <form action={formAction}>
//       <div className="grid gap-6 py-4">
//         {/* 基本情報 */}
//         <div className="space-y-4">
//           <h3 className="font-medium text-sm text-muted-foreground">基本情報</h3>
//           <div className="grid gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">旅行名 *</Label>
//               <Input 
//                 id="name" 
//                 name="name"
//                 placeholder="例: 沖縄旅行2025"
//                 required
//               />
//               {state.errors?.name && (
//                 <p className="text-sm text-red-500">{state.errors.name}</p>
//               )}
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="date">日程 *</Label>
//               <div className="flex gap-2">
//                 <Input 
//                   id="start-date" 
//                   name="startDate"
//                   type="date"
//                   required
//                 />
//                 <span className="flex items-center text-muted-foreground">〜</span>
//                 <Input 
//                   id="end-date" 
//                   name="endDate"
//                   type="date"
//                   required
//                 />
//               </div>
//               {state.errors?.startDate && (
//                 <p className="text-sm text-red-500">{state.errors.startDate}</p>
//               )}
//               {state.errors?.endDate && (
//                 <p className="text-sm text-red-500">{state.errors.endDate}</p>
//               )}
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="destination">目的地</Label>
//               <Input 
//                 id="destination" 
//                 name="destination"
//                 placeholder="例: 沖縄県那覇市"
//               />
//             </div>
//           </div>
//         </div>

//         {/* 友達選択 */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="font-medium text-sm text-muted-foreground">参加メンバーを選択</h3>
//             <div className="flex gap-2">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 size="sm"
//                 onClick={handleSelectAll}
//                 disabled={state.selectedFriends.length === FriendsData.length}
//               >
//                 全選択
//               </Button>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 size="sm"
//                 onClick={handleDeselectAll}
//                 disabled={state.selectedFriends.length === 0}
//               >
//                 全解除
//               </Button>
//             </div>
//           </div>
          
//           {/* 選択された友達のプレビュー */}
//           <SelectedFriendsPreview selectedFriends={state.selectedFriends} />

//           {/* 友達リスト */}
//           <FriendSelector 
//             selectedFriends={state.selectedFriends}
//             onToggle={handleFriendToggle}
//           />
//         </div>
//       </div>

//       <DialogFooter>
//         <Button type="button" variant="outline">
//           キャンセル
//         </Button>
//         <Button 
//           type="submit"
//           className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
//           disabled={pending}
//         >
//           {pending ? "作成中..." : "旅行を作成"}
//         </Button>
//       </DialogFooter>

//       {state.success && (
//         <p className="text-sm text-green-500 mt-2">旅行が作成されました！</p>
//       )}
//     </form>
//   );
// }