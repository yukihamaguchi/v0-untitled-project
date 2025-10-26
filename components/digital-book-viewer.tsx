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
    const baseStyle = "absolute bg-transparent"
    switch (message.page_size) {
      case "quarter":
        return `${baseStyle} top-12 left-12 right-12 bottom-[50%]`
      case "half":
        return `${baseStyle} top-12 left-12 right-12 bottom-12`
      case "full":
      default:
        return `${baseStyle} top-12 left-12 right-12 bottom-12`
    }
  }

  // フレームエリアのスタイルを取得
  const getFrameAreaStyle = () => {
    const baseStyle = "absolute pointer-events-none"
    switch (message.page_size) {
      case "quarter":
        return `${baseStyle} top-6 left-6 right-6 bottom-[50%]`
      case "half":
        return `${baseStyle} top-6 left-6 right-6 bottom-6`
      case "full":
      default:
        return `${baseStyle} top-6 left-6 right-6 bottom-6`
    }
  }

  // フレーム画像のパスを取得
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
              className="relative w-full max-w-md aspect-square bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-8 opacity-20 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, #999 0%, transparent 100%)",
                }}
              />

              {frameImage && (
                <div
                  className={getFrameAreaStyle()}
                  style={{
                    backgroundImage: `url(${frameImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: 10,
                  }}
                />
              )}

              <div className={getWritableAreaStyle()} style={{ zIndex: 20 }}>
                <div className="w-full h-full p-4 overflow-hidden">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-800">
                    {message.comment || "メッセージなし"}
                  </p>
                </div>
              </div>

              {message.stamps && message.stamps.length > 0 && (
                <div
                  className="absolute bottom-16 left-12 right-12 flex justify-center items-center gap-1 flex-wrap"
                  style={{ zIndex: 30 }}
                >
                  {message.stamps.map((stamp, index) => (
                    <span key={index} className="text-2xl">
                      {stamp}
                    </span>
                  ))}
                </div>
              )}

              <div className="absolute bottom-4 right-4 text-xs text-gray-500" style={{ zIndex: 5 }}>
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
