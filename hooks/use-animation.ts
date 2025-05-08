"use client"

import { useEffect, useState, useRef } from "react"

// 要素が画面内に表示されたときにアニメーションを開始するためのフック
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          // 一度表示されたら監視を停止
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      {
        threshold: 0.1, // 10%が表示されたらトリガー
        rootMargin: "0px 0px -50px 0px", // 下部に少し余裕を持たせる
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return { ref, isInView }
}

// ページ遷移アニメーションのためのフック
export function usePageTransition() {
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  useEffect(() => {
    setIsPageTransitioning(true)
    const timer = setTimeout(() => setIsPageTransitioning(false), 100)
    return () => clearTimeout(timer)
  }, [])

  return isPageTransitioning
}
