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

const FRAMES = [
  {
    value: "none",
    label: "フレームなし",
    points: 0,
    image: null,
  },
  {
    value: "flower",
    label: "フラワーフレーム",
    points: 500,
    image: "/images/frame-flower.png",
  },
  {
    value: "autumn",
    label: "オータムフレーム",
    points: 500,
    image: "/images/frame-autumn.png",
  },
] as const

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
        format: [210, 210],
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
              return "position: absolute; top: 60px; left: 60px; right: 60px; height: calc(33% - 40px); background: #FFFFFF;"
            case "half":
              return "position: absolute; top: 60px; left: 60px; right: 60px; height: calc(50% - 60px); background: #FFFFFF;"
            case "full":
            default:
              return "position: absolute; top: 60px; left: 60px; right: 60px; bottom: 60px; background: #FFFFFF;"
          }
        }

        const getFrameAreaStyle = () => {
          switch (message.page_size) {
            case "quarter":
              return "position: absolute; top: 30px; left: 30px; right: 30px; height: calc(33% - 30px); pointer-events: none; z-index: 10;"
            case "half":
              return "position: absolute; top: 30px; left: 30px; right: 30px; height: calc(50% - 30px); pointer-events: none; z-index: 10;"
            case "full":
            default:
              return "position: absolute; top: 30px; left: 30px; right: 30px; bottom: 30px; pointer-events: none; z-index: 10;"
          }
        }

        const getFrameImage = () => {
          const frame = FRAMES.find((f) => f.value === message.frame_type)
          return frame?.image || null
        }

        const frameImage = getFrameImage()

        tempDiv.innerHTML = `
          <div style="${getWritableAreaStyle()} z-index: 1;">
            ${
              frameImage
                ? `<div style="position: absolute; inset: 0; background-image: url(${frameImage}); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; pointer-events: none; z-index: 5;"></div>`
                : ""
            }
            <div style="width: 100%; height: 100%; padding: 40px; overflow: hidden; position: relative; z-index: 10;">
              ${
                message.user_name
                  ? `<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                  <img src="/images/default-avatar.jpg" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(124, 58, 237, 0.2);" />
                  <span style="font-size: 16px; font-weight: 600; color: #374151;">${message.user_name}</span>
                </div>`
                  : ""
              }
              <p style="font-size: 18px; line-height: 2.0; white-space: pre-wrap; word-break: break-word; color: #7c3aed; font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;">
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
          <div style="position: absolute; bottom: 30px; right: 30px; font-size: 12px; color: #9ca3af; z-index: 5; line-height: 1; transform: scaleY(0.5); transform-origin: bottom;">
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
