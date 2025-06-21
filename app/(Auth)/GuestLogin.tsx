// 'use client';
// import { useSignIn } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';

// export default function GuestLogin() {
//   const { signIn, setActive } = useSignIn();

//   const router = useRouter();

//   const handleGuestLogin = async () => {
//     if (!signIn) return;

//     const result = await signIn.create({
//       identifier: process.env.NEXT_PUBLIC_GUEST_USER!,
//       password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
//     });

//     if (result.status === 'complete') {
//       await setActive({ session: result.createdSessionId });
//       router.push('/home');
//     }
//   };

//   return (
//     <Button
//       onClick={handleGuestLogin}
//       className="bg-green-500 hover:bg-green-600 cursor-pointer rounded-full text-white"
//     >
//       ゲストログイン
//     </Button>
//   );
// }
