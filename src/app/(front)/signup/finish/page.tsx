import Link from "next/link";

import { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "新規申し込み完了",
  description: "新規申し込み完了ページです。",
};

const emailSent = () => {
  return (
    <main className="container">
      <h1>メール送信完了</h1>
      <p>メールを送信しました。メールに記載されたURLから本登録を行ってください。</p>
      <p>
        メールが届かない場合は、迷惑メールボックスを確認し、それでも見当たらない場合は「@example.com」からのメール受信を許可頂いた上で、再度仮申込をお願い致します。
      </p>
      <Button asChild>
        <Link href="/signup">新規登録ページに戻る</Link>
      </Button>
    </main>
  );
};

export default emailSent;
