'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload, Move, ChevronDown } from 'lucide-react'

function CornerIndicator({ className }: { className: string }) {
  return <ChevronDown className={`w-12 h-12 text-white absolute ${className}`} />
}

export function ProfilePhotoEditor() {
  const searchParams = useSearchParams()
  const defaultColor = searchParams.get('color')?.replace('#', '') || 'FF5733'
  const templateImage = searchParams.get('template')
  
  const [image, setImage] = useState<string | null>(null)
  const [color, setColor] = useState(`#${defaultColor.toUpperCase()}`)
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setPosition({ x: 0, y: 0 }) // Reset position when new image is uploaded
    }
    reader.readAsDataURL(file)
  }, [])

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'profile-photo.png'
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const handleDrag = (e: React.DragEvent, entering: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!(e.target as HTMLElement).closest('input[type="file"]')) {
      setDragCounter(prev => entering ? prev + 1 : prev - 1)
      setIsDragging(entering || dragCounter > 0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(0)
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(files[0])
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files
      }
      
      processImage(files[0])
    }
  }

  const handleImageDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!canvasRef.current || !image) return
    setIsDraggingImage(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const maxOffset = 240 / 4 // Limit dragging to 1/4 of the image size
      let newX = e.clientX - rect.left - startX + position.x
      let newY = e.clientY - rect.top - startY + position.y
      newX = Math.max(-maxOffset, Math.min(newX, maxOffset))
      newY = Math.max(-maxOffset, Math.min(newY, maxOffset))
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDraggingImage(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const size = 240 // Set fixed size to 240x240
        canvas.width = size
        canvas.height = size

        ctx.clearRect(0, 0, size, size)

        // Draw colored ring
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2)
        ctx.fill()

        // Create circular clipping path - changed from 10 to 15 for thicker ring
        ctx.beginPath()
        ctx.arc(size/2, size/2, (size/2) - 11, 0, Math.PI * 2)
        ctx.clip()

        // Calculate scaling to fill the circle
        const scale = Math.max(size / img.width, size / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale

        // Draw the image centered and scaled
        ctx.drawImage(
          img,
          position.x - (scaledWidth - size) / 2,
          position.y - (scaledHeight - size) / 2,
          scaledWidth,
          scaledHeight
        )
      }
      img.src = image
    }
  }, [image, color, position])

  useEffect(() => {
    setDragCounter(0)
    setIsDragging(false)
  }, [image])

  useEffect(() => {
    if (templateImage) {
      fetch(templateImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "template.png", { type: "image/png" })
          processImage(file)
        })
        .catch(console.error)
    }
  }, [templateImage, processImage])

  return (
    <div
      className=" flex items-center justify-center p-4"
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Top Left */}
          <CornerIndicator className="top-4 left-4 rotate-[135deg]" />
          {/* Top Right - adjusted rotation */}
          <CornerIndicator className="top-4 right-4 rotate-[225deg]" />
          {/* Bottom Left */}
          <CornerIndicator className="bottom-4 left-4 rotate-45" />
          {/* Bottom Right */}
          <CornerIndicator className="bottom-4 right-4 -rotate-45" />
          
          <div className="text-6xl font-bold text-white text-center">
            Drop image anywhere
          </div>
        </div>
      )}
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Profile Photo Editor</h2>
          <p className="text-muted-foreground">Upload a photo, customize your profile ring, and adjust position</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div 
              className="relative w-64 h-64 rounded-full overflow-hidden"
              onMouseDown={handleImageDragStart}
              style={{ cursor: image ? (isDraggingImage ? 'grabbing' : 'grab') : 'default' }}
            >
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                width={240}
                height={240}
              />
              {image && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                  <Move className="w-8 h-8 text-white" />
                </div>
              )}
              {!image && (
                <div 
                  className="absolute inset-0 border-2 border-dashed rounded-full flex items-center justify-center bg-muted cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Upload Photo</Label>
            <Input
              id="photo"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="cursor-pointer file:mr-2  file:px-2 file:rounded-md file:border-0 file:text-sm file:font-normal file:bg-background hover:file:bg-accent file:text-foreground file:cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ring-color">Ring Color</Label>
            <div className="flex gap-2">
              <Input
                id="ring-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full"
            disabled={!image}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </Card>
    </div>
  )
}