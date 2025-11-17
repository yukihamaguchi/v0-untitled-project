"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, EyeIcon } from "lucide-react"
import type { GiftingData } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface DigitalBookViewerProps {
  messages: GiftingData[]
  eventId?: number
}

export function DigitalBookViewer({ messages, eventId }: DigitalBookViewerProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const { default: html2canvas } = await import("html2canvas")
      const { default: jsPDF } = await import("jspdf")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // 各メッセージページをPDFに追加
      for (let i = 0; i < messages.length; i++) {
        setCurrentPage(i)
        // DOMの更新を待つ
        await new Promise((resolve) => setTimeout(resolve, 100))

        const bookElement = document.getElementById("book-page")
        if (bookElement) {
          const canvas = await html2canvas(bookElement, {
            scale: 2,
            backgroundColor: "#FFFFFF",
            logging: false,
          })

          const imgData = canvas.toDataURL("image/png")
          const imgWidth = 180
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          if (i > 0) {
            pdf.addPage()
          }

          pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight)
        }
      }

      pdf.save(`メッセージブック_${new Date().toLocaleDateString("ja-JP")}.pdf`)
      setCurrentPage(0)
    } catch (error) {
      console.error("PDF生成エラー:", error)
      alert("PDFの生成に失敗しました")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const viewPDF = () => {
    if (eventId) {
      router.push(`/artist/events/${eventId}/pdf`)
    }
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">メッセージはまだありません</CardContent>
      </Card>
    )
  }

  const message = messages[currentPage]

  // ページサイズに応じた表示エリアのスタイルを取得
  const getWritableAreaStyle = () => {
    switch (message.page_size) {
      case "quarter":
        return {
          width: "calc(100% - 64px)",
          height: "calc(33% - 40px)",
          top: "32px",
          left: "32px",
        }
      case "half":
        return {
          width: "calc(100% - 64px)",
          height: "calc(50% - 48px)",
          top: "32px",
          left: "32px",
        }
      case "full":
      default:
        return {
          width: "calc(100% - 64px)",
          height: "calc(100% - 64px)",
          top: "32px",
          left: "32px",
        }
    }
  }

  // フレームエリアのスタイルを取得
  const getFrameAreaStyle = () => {
    switch (message.page_size) {
      case "quarter":
        return {
          width: "calc(100% - 64px)",
          height: "calc(33% - 40px)",
          top: "32px",
          left: "32px",
        }
      case "half":
        return {
          width: "calc(100% - 64px)",
          height: "calc(50% - 48px)",
          top: "32px",
          left: "32px",
        }
      case "full":
      default:
        return {
          width: "calc(100% - 64px)",
          height: "calc(100% - 64px)",
          top: "32px",
          left: "32px",
        }
    }
  }

  const getFrameImage = () => {
    switch (message.frame_type) {
      case "flower":
        return "/images/frame-flower.png"
      case "autumn":
        return "/images/frame-autumn.png"
      default:
        return null
    }
  }

  const frameImage = getFrameImage()
  const writableArea = getWritableAreaStyle()
  const frameArea = getFrameAreaStyle()

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(messages.length - 1, prev + 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={viewPDF} disabled={isGeneratingPDF || !eventId} variant="default" size="sm">
          <EyeIcon className="h-4 w-4 mr-2" />
          PDFを表示
        </Button>
        <Button onClick={generatePDF} disabled={isGeneratingPDF} variant="outline" size="sm">
          <DownloadIcon className="h-4 w-4 mr-2" />
          {isGeneratingPDF ? "PDF生成中..." : "PDFダウンロード"}
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div
              id="book-page"
              className="relative w-full max-w-md aspect-square rounded-lg shadow-2xl overflow-hidden"
              style={{
                backgroundImage: "url(/images/page-background.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-8 opacity-20 pointer-events-none z-[5]"
                style={{
                  background: "linear-gradient(90deg, #999 0%, transparent 100%)",
                }}
              />

              <div
                className="absolute bg-white z-[1]"
                style={{
                  width: writableArea.width,
                  height: writableArea.height,
                  top: writableArea.top,
                  left: writableArea.left,
                }}
              >
                {frameImage && (
                  <div
                    className="absolute inset-0 pointer-events-none z-[5]"
                    style={{
                      backgroundImage: `url(${frameImage})`,
                      backgroundSize: "100% 100%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}

                {message.sender_name && (
                  <div className="absolute top-2 left-2 flex items-center gap-2 bg-white/90 px-2 py-1 rounded-lg z-10">
                    <img
                      src={message.sender_avatar || "/images/default-avatar.jpg"}
                      alt={message.sender_name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                    />
                    <span className="text-xs font-medium text-gray-700">{message.sender_name}</span>
                  </div>
                )}

                <div className="absolute inset-0 p-4 pt-16 overflow-hidden z-10">
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap break-words font-serif"
                    style={{ color: "#7c3aed" }}
                  >
                    {message.comment || "メッセージなし"}
                  </p>
                </div>
              </div>

              {message.stamps && message.stamps.length > 0 && (
                <div
                  className="absolute flex justify-center items-center gap-1 flex-wrap px-2 z-30"
                  style={{
                    width: writableArea.width,
                    left: writableArea.left,
                    bottom: `calc(100% - ${writableArea.top} - ${writableArea.height} + 8px)`,
                  }}
                >
                  {message.stamps.map((stamp, index) => (
                    <span key={index} className="text-2xl">
                      {stamp}
                    </span>
                  ))}
                </div>
              )}

              <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-serif z-[5] leading-none scale-y-50 origin-bottom">
                {message.page_size === "quarter" ? "1/4ページ" : message.page_size === "half" ? "1/2ページ" : "1ページ"}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="font-medium text-sm">{message.user_name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {message.amount.toLocaleString()}pt
                {message.created_at && ` • ${new Date(message.created_at).toLocaleDateString("ja-JP")}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 0}>
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          前のページ
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentPage + 1} / {messages.length}
        </span>

        <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === messages.length - 1}>
          次のページ
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
