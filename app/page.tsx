"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {  CalendarCheck, DollarSign, Receipt, Plane, MessageSquare, Clock, Brain, Zap, Target, Smartphone, ArrowDown, Play, Code, Database, Shield } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GuestLogin from './(Auth)/GuestLogin';

// リアルタイムタイピングエフェクト
const TypeWriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay + currentIndex * 50);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-blue-400"
      >
        |
      </motion.span>
    </span>
  );
};

// 問題シミュレーター
const ProblemSimulator = () => {
  const [currentProblem, setCurrentProblem] = useState(0);
  const problems = [
    {
      title: "LINEの嵐",
      messages: [
        "田中: 7/15どう？",
        "佐藤: ちょっと厳しい...",
        "鈴木: 16日なら！",
        "田中: 高橋さんは？",
        "高橋: 17日がいいかも",
        "佐藤: じゃあ18日は？",
        "鈴木: え、何日になったの？",
      ]
    },
    {
      title: "支払いの混乱",
      messages: [
        "誰がいくら払った？",
        "レシート失くした！",
        "計算合わない",
        "割り勘が複雑すぎる",
        "これなんの支払いだっけ？"
      ]
    },
    {
      title: "時間がかかる",
      messages: [
        "調整だけで疲れる",
        "本来楽しいはずの旅行計画が苦痛に",
        "行きたい場所がわからない",
        "スケジュールの調整が複雑すぎる"
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProblem(prev => (prev + 1) % problems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-6 font-mono text-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-gray-400 ml-2">{problems[currentProblem].title}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProblem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-2 h-48 overflow-hidden"
        >
          {problems[currentProblem].messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
              className="text-gray-300"
            >
              {msg}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};



export default function InnovativeLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* 動的背景 */}
      <motion.div
        className="fixed inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
          y: backgroundY
        }}
      />

      {/* ヒーローセクション */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">現在開発中</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  旅行調整の
                </span>
                <br />
                <TypeWriter text="イライラ終了。" delay={1000} />
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                もう二度とLINEめんどくさい調整を進めなくていい。
                <br />
                <span className="text-purple-400 font-semibold">
                  面倒な調整は全部お任せください。
                </span>
              </p>
              <Link href="/sign-in">
            <Button className='hover:from-blue-200 hover:to-purple-200 cursor-pointer'>始める</Button>
              </Link>
        <GuestLogin />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ProblemSimulator />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="h-6 w-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* 問題の可視化セクション */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                こんな経験ありませんか？
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "終わらないLINE",
                description: "「いつ空いてる？」から始まる無限ループ。結局決まらない日程調整。",
                icon: MessageSquare,
                color: "from-red-500 to-pink-500"
              },
              {
                title: "複雑な割り勘",
                description: "誰が何を払ったか分からない。計算が合わない。レシートどこ？",
                icon: DollarSign,
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "時間の無駄",
                description: "調整だけで疲れる。本来楽しいはずの旅行計画が苦痛に。",
                icon: Clock,
                color: "from-purple-500 to-indigo-500"
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${problem.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <problem.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
                <p className="text-gray-400">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ソリューションセクション */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                その全てを解決します
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              一つのアプリで、すべての面倒から解放
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                {[
                  {
                    title: "ワンクリック日程調整",
                    description: "カレンダー連携で全員の空き状況を自動取得。最適な日程を瞬時に提案。",
                    icon: CalendarCheck
                  },
                  {
                    title: "自動割り勘計算",
                    description: "レシート撮影だけで支出記録。複雑な計算も自動で完璧に処理。",
                    icon: Receipt
                  },
                  {
                    title: "リアルタイム同期",
                    description: "全メンバーの変更が瞬時に同期。いつでも最新の情報を確認。",
                    icon: Zap
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
      
            </motion.div>
          </div>
        </div>
      </section>

 

      {/* フッターCTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              面倒な旅行調整から
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                今すぐ解放されましょう
              </span>
            </h2>
         
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>完全無料</span>
              </div>
         
              <div className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <span>全デバイス対応</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}