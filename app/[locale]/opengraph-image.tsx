import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";

export const alt = "MemeLens - Camera Lens Effect for Character Images";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Image({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Left content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            maxWidth: "600px",
            flex: "1",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#1f2937",
              margin: "0 0 24px 0",
              lineHeight: "1.1",
            }}
          >
            {t("appTitle")}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "28px",
              color: "#6b7280",
              margin: "0 0 40px 0",
              lineHeight: "1.4",
            }}
          >
            {t("metaDescription")}
          </p>

          {/* Feature highlights */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#374151",
                fontSize: "20px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                ✓
              </div>
              {locale === "ko"
                ? "카메라 렌즈 효과"
                : locale === "ja"
                ? "カメラレンズ効果"
                : "Camera Lens Effects"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#374151",
                fontSize: "20px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                ✓
              </div>
              {locale === "ko"
                ? "캐릭터 이미지 꾸미기"
                : locale === "ja"
                ? "キャラクター画像デコレーション"
                : "Character Image Decoration"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#374151",
                fontSize: "20px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                ✓
              </div>
              {locale === "ko"
                ? "무료 온라인 도구"
                : locale === "ja"
                ? "無料オンラインツール"
                : "Free Online Tool"}
            </div>
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: "40px",
              color: "#9ca3af",
              fontSize: "18px",
            }}
          >
            meme-lens.com
          </div>
        </div>

        {/* Right logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "60px",
          }}
        >
          <img
            src="https://meme-lens.hmmhmmhm.workers.dev/logo-og.png"
            alt="MemeLens Logo"
            width="300"
            height="300"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
