"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOutIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearUserSession } from "@/utils/auth"

interface ArtistHeaderProps {
  artist: {
    name: string
    image: string
  }
}

export function ArtistHeader({ artist }: ArtistHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // セッション情報をクリア
    clearUserSession()
    // ログインページにリダイレクト
    router.push("/artist/login")
  }

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/artist/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-lg">アーティストポータル</span>
        </Link>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={artist.image || "/placeholder.svg"} alt={artist.name} />
                  <AvatarFallback>{artist.name[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{artist.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">アーティスト</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>設定</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>ログアウト</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
