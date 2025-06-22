"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

// バリデーションスキーマ
const createTripSchema = z.object({
  name: z.string().min(1, "旅行名は必須です").max(100, "旅行名は100文字以内で入力してください"),
  startDate: z.string().min(1, "開始日は必須です"),
  endDate: z.string().min(1, "終了日は必須です"),
  destination: z.string().optional(),
  selectedFriends: z.array(z.string()).optional().default([]),
});

interface CreateTripState {
  selectedFriends: string[];
  errors: Record<string, string>;
  success: boolean;
}

export async function createTripAction(
  prevState: CreateTripState,
  formData: FormData
): Promise<CreateTripState> {
  try {
    // フォームデータの取得
    const rawData = {
      name: formData.get("name") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      destination: formData.get("destination") as string,
      selectedFriends: formData.getAll("selectedFriends") as string[],
    };

    // バリデーション
    const validatedData = createTripSchema.parse(rawData);

    // 日付の妥当性チェック
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    
    if (endDate <= startDate) {
      return {
        selectedFriends: validatedData.selectedFriends,
        errors: { endDate: "終了日は開始日より後の日付を選択してください" },
        success: false,
      };
    }

    // TODO: 実際のデータベース操作
    // const trip = await prisma.trip.create({
    //   data: {
    //     name: validatedData.name,
    //     startDate: startDate,
    //     endDate: endDate,
    //     destination: validatedData.destination || "",
    //     status: "PLANNING",
    //     // TODO: Clerkからユーザー情報を取得
    //   }
    // });

    // TODO: メンバーの追加
    // for (const friendId of validatedData.selectedFriends) {
    //   await prisma.tripMember.create({
    //     data: {
    //       tripId: trip.id,
    //       clerkId: friendId,
    //     }
    //   });
    // }

    console.log("新しい旅行作成:", validatedData);

    // 成功時はリダイレクト
    // redirect(`/trip/${trip.id}`);
    
    // 一時的に成功状態を返す
    return {
      selectedFriends: [],
      errors: {},
      success: true,
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      // バリデーションエラー
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      
      return {
        selectedFriends: prevState.selectedFriends,
        errors,
        success: false,
      };
    }

    // その他のエラー
    console.error("旅行作成エラー:", error);
    return {
      selectedFriends: prevState.selectedFriends,
      errors: { general: "旅行の作成に失敗しました。もう一度お試しください。" },
      success: false,
    };
  }
}