import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";
const S3_REGION = process.env.S3_REGION || "ap-northeast-1";
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

let s3Client: S3Client;

if (NODE_ENV === "development") {
  s3Client = new S3Client({
    credentials: fromEnv(),
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    forcePathStyle: true,
  });
} else {
  s3Client = new S3Client({
    credentials: fromEnv(),
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
  });
}
// S3に画像をアップロードし、そのURLを取得する関数
export const uploadImageToS3 = async (file: File, uploadPath: string = "") => {
  console.debug("画像アップロード開始:", file);
  // もしsvgファイルなら、サニタイズする
  if (file.type === "image/svg+xml") {
    // TODO: 画像をサニタイズする
  }

  // アップロード時のファイル名を作成
  const fileName = `${Date.now()}-${file.name}`;
  // Fileオブジェクトから、Buffer に変換する
  const buffer = Buffer.from(await file.arrayBuffer());
  // S3へのアップロードに必要な情報をまとめるオブジェクト
  // Bucket: アップロード先のバケット名を環境変数から取得します。
  // Key: アップロードするファイルのキーを指定します。
  // ContentType: アップロードするファイルのMIMEタイプを指定します。
  // Body: アップロードするファイルデータを指定します。
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: path.join(uploadPath, fileName),
    ContentType: file.type,
    Body: buffer,
  });

  try {
    // S3に画像をアップロードす
    const data = await s3Client.send(command);
    // アップロード成功時の処理
    console.debug("画像アップロード成功:", data);
    // アップロードされた画像のURLを取得
    return data;
  } catch (error) {
    // アップロードエラー発生時の処理
    console.error("画像アップロードエラー:", error);
    throw error;
  }
};
