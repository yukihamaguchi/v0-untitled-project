"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserSession } from "@/utils/auth"
import { getEventGiftings } from "@/app/actions/gifting-actions"
import { useToast } from "@/hooks/use-toast"
import type { GiftingData } from "@/lib/supabase"

interface PDFPageProps {
  params: {
    id: string
  }
}

export default function PDFPage({ params }: PDFPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const eventId = Number.parseInt(params.id)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [messages, setMessages] = useState<GiftingData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getUserSession()
    if (!session || session.role !== "artist") {
      router.push("/artist/login")
      return
    }

    fetchEventGiftings(eventId)
  }, [eventId, router])

  const fetchEventGiftings = async (eventId: number) => {
    try {
      setIsLoading(true)
      const result = await getEventGiftings(eventId)

      if (result.success && result.data) {
        const giftings = result.data as GiftingData[]
        setMessages(giftings)
        // 自動的にPDF生成を開始
        generatePDF(giftings)
      } else {
        toast({
          title: "エラー",
          description: result.error || "ギフティングデータの取得に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching event giftings:", error)
      toast({
        title: "エラー",
        description: "ギフティングデータの取得中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generatePDF = async (messagesData: GiftingData[]) => {
    setIsGeneratingPDF(true)
    try {
      const { default: html2canvas } = await import("html2canvas")
      const { default: jsPDF } = await import("jspdf")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 210], // 正方形フォーマット
      })

      for (let i = 0; i < messagesData.length; i++) {
        const message = messagesData[i]

        const tempDiv = document.createElement("div")
        tempDiv.style.width = "794px"
        tempDiv.style.height = "794px"
        tempDiv.style.position = "absolute"
        tempDiv.style.left = "-9999px"
        tempDiv.style.backgroundImage = "url(/images/page-background.jpg)"
        tempDiv.style.backgroundSize = "cover"
        tempDiv.style.backgroundPosition = "center"
        tempDiv.className = "relative"

        const getWritableAreaStyle = () => {
          switch (message.page_size) {
            case "quarter":
              return "position: absolute; top: 60px; left: 60px; right: 60px; bottom: 50%; background: #FFFFFF;"
            case "half":
              return "position: absolute; top: 60px; left: 60px; right: 60px; bottom: 60px; background: #FFFFFF;"
            case "full":
            default:
              return "position: absolute; top: 60px; left: 60px; right: 60px; bottom: 60px; background: #FFFFFF;"
          }
        }

        const getFrameAreaStyle = () => {
          switch (message.page_size) {
            case "quarter":
              return "position: absolute; top: 30px; left: 30px; right: 30px; bottom: 50%; pointer-events: none; z-index: 10;"
            case "half":
              return "position: absolute; top: 30px; left: 30px; right: 30px; bottom: 30px; pointer-events: none; z-index: 10;"
            case "full":
            default:
              return "position: absolute; top: 30px; left: 30px; right: 30px; bottom: 30px; pointer-events: none; z-index: 10;"
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

        tempDiv.innerHTML = `
          ${
            frameImage
              ? `<div style="${getFrameAreaStyle()} background-image: url(${frameImage}); background-size: 100% 100%; background-position: center; background-repeat: no-repeat;"></div>`
              : ""
          }
          <div style="${getWritableAreaStyle()} z-index: 20;">
            <div style="width: 100%; height: 100%; padding: 40px; overflow: hidden;">
              <p style="font-size: 18px; line-height: 2.0; white-space: pre-wrap; word-break: break-word; color: #1f2937; font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;">
                ${message.comment || "メッセージなし"}
              </p>
            </div>
          </div>
          ${
            message.stamps && message.stamps.length > 0
              ? `<div style="position: absolute; bottom: 80px; left: 60px; right: 60px; display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap; z-index: 30;">
              ${message.stamps.map((stamp) => `<span style="font-size: 48px;">${stamp}</span>`).join("")}
            </div>`
              : ""
          }
          <div style="position: absolute; bottom: 30px; right: 30px; font-size: 12px; color: #9ca3af; z-index: 5;">
            ${i + 1}ページ
          </div>
        `

        document.body.appendChild(tempDiv)

        await new Promise((resolve) => setTimeout(resolve, 200))

        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          backgroundColor: "#FFFFFF",
          logging: false,
        })

        document.body.removeChild(tempDiv)

        const imgData = canvas.toDataURL("image/png")
        const imgWidth = 210
        const imgHeight = 210

        if (i > 0) {
          pdf.addPage()
        }

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      }

      const pdfBlob = pdf.output("blob")
      const blobUrl = URL.createObjectURL(pdfBlob)
      setPdfBlobUrl(blobUrl)
    } catch (error) {
      console.error("PDF生成エラー:", error)
      toast({
        title: "エラー",
        description: "PDFの生成に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (isLoading || isGeneratingPDF) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{isGeneratingPDF ? "PDF生成中..." : "読み込み中..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background">
      {pdfBlobUrl ? (
        <iframe
          src={pdfBlobUrl}
          className="w-full h-full border-0"
          title="メッセージブックPDF"
          style={{ display: "block" }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">PDFを生成できませんでした</p>
        </div>
      )}
    </div>
  )
}
