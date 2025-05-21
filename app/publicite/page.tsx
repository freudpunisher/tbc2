'use client'

import { useState, useEffect } from "react"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"

interface Video {
  id: number
  title: string
  description: string
  videoPath: string
  thumbnailPath?: string
  type: 'promotional' | 'workplace'
  active: boolean
}

export default function PublicitePage() {
  const [videos, setVideos] = useState<{
    promotional: Video | null
    workplace: Video | null
  }>({
    promotional: null,
    workplace: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/publicite')
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos')
        }
        
        const data = await response.json()
        
        // Organize videos by type
        const promotionalVideo = data.find((video: Video) => video.type === 'promotional' && video.active) || null
        const workplaceVideo = data.find((video: Video) => video.type === 'workplace' && video.active) || null
        
        setVideos({
          promotional: promotionalVideo,
          workplace: workplaceVideo
        })
      } catch (error) {
        console.error('Error fetching videos:', error)
        toast.error('Erreur lors du chargement des vidéos')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div className="container mx-auto py-24 px-4 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Nos Vidéos</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez notre entreprise à travers nos vidéos promotionnelles et notre travail.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      ) : (
        <Tabs defaultValue="promotional" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="promotional">Vidéo Promotionnelle</TabsTrigger>
            <TabsTrigger value="workplace">Notre Travail</TabsTrigger>
          </TabsList>

          <TabsContent value="promotional">
            <Card>
              <CardContent className="p-6">
                {videos.promotional ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-yellow-600">{videos.promotional.title}</h2>
                      <p className="text-gray-600 mt-2">{videos.promotional.description}</p>
                    </div>

                    <div className="aspect-video relative rounded-lg overflow-hidden border bg-gray-100">
                      <video
                        src={videos.promotional.videoPath}
                        className="w-full h-full"
                        controls
                        poster={videos.promotional.thumbnailPath || "/placeholder.svg?height=720&width=1280"}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Aucune vidéo promotionnelle disponible pour le moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workplace">
            <Card>
              <CardContent className="p-6">
                {videos.workplace ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-yellow-600">{videos.workplace.title}</h2>
                      <p className="text-gray-600 mt-2">{videos.workplace.description}</p>
                    </div>

                    <div className="aspect-video relative rounded-lg overflow-hidden border bg-gray-100">
                      <video
                        src={videos.workplace.videoPath}
                        className="w-full h-full"
                        controls
                        poster={videos.workplace.thumbnailPath || "/placeholder.svg?height=720&width=1280"}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Aucune vidéo de travail disponible pour le moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
