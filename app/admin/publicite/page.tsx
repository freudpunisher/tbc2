"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Save, X, Upload, Play, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define types for our video data
interface VideoData {
  id: number | string
  title: string
  description: string
  videoPath: string | null
  thumbnailPath: string | null
  type: "promotional" | "workplace"
  active: boolean
}

export default function PublicitePage() {
  const [videos, setVideos] = useState<{
    promotional: VideoData | null
    workplace: VideoData | null
  }>({
    promotional: null,
    workplace: null,
  })
  const [editingPromo, setEditingPromo] = useState(false)
  const [editingWorkplace, setEditingWorkplace] = useState(false)
  const [promoVideo, setPromoVideo] = useState<VideoData | null>(null)
  const [workplaceVideo, setWorkplaceVideo] = useState<VideoData | null>(null)
  const [activeTab, setActiveTab] = useState("promotional")
  const [mounted, setMounted] = useState(false)
  const [promoVideoFile, setPromoVideoFile] = useState<File | null>(null)
  const [workplaceVideoFile, setWorkplaceVideoFile] = useState<File | null>(null)
  const [promoVideoUrl, setPromoVideoUrl] = useState<string | null>(null)
  const [workplaceVideoUrl, setWorkplaceVideoUrl] = useState<string | null>(null)
  const [promoThumbnailFile, setPromoThumbnailFile] = useState<File | null>(null)
  const [workplaceThumbnailFile, setWorkplaceThumbnailFile] = useState<File | null>(null)
  const [promoThumbnailUrl, setPromoThumbnailUrl] = useState<string | null>(null)
  const [workplaceThumbnailUrl, setWorkplaceThumbnailUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const { toast } = useToast()

  // Fetch videos from API
  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/publicite")
      if (!response.ok) {
        throw new Error("Failed to fetch videos")
      }
      const data = await response.json()

      // Organize videos by type
      const promoVideo = data.find((video: VideoData) => video.type === "promotional") || null
      const workVideo = data.find((video: VideoData) => video.type === "workplace") || null

      setVideos({
        promotional: promoVideo,
        workplace: workVideo,
      })

      // Initialize edit states
      if (promoVideo) setPromoVideo(promoVideo)
      if (workVideo) setWorkplaceVideo(workVideo)
    } catch (error) {
      console.error("Error fetching videos:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les vidéos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchVideos()

    // Clean up object URLs when component unmounts
    return () => {
      if (promoVideoUrl) URL.revokeObjectURL(promoVideoUrl)
      if (workplaceVideoUrl) URL.revokeObjectURL(workplaceVideoUrl)
      if (promoThumbnailUrl) URL.revokeObjectURL(promoThumbnailUrl)
      if (workplaceThumbnailUrl) URL.revokeObjectURL(workplaceThumbnailUrl)
    }
  }, [])

  if (!mounted) return null

  const handleSavePromo = async () => {
    if (!promoVideo) return

    setIsSaving(true)
    try {
      // Prepare form data for file uploads
      const formData = new FormData()
      formData.append("title", promoVideo.title)
      formData.append("description", promoVideo.description)
      formData.append("type", "promotional")
      formData.append("active", promoVideo.active.toString())

      if (promoVideoFile) {
        formData.append("video", promoVideoFile)
      }

      if (promoThumbnailFile) {
        formData.append("thumbnail", promoThumbnailFile)
      }

      // Determine if we're creating or updating
      const method = promoVideo.id ? "PUT" : "POST"
      const url = promoVideo.id ? `/api/publicite/${promoVideo.id}` : "/api/publicite"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to save video")
      }

      const savedVideo = await response.json()

      // Update state with saved video
      setVideos((prev) => ({
        ...prev,
        promotional: savedVideo,
      }))

      setEditingPromo(false)
      toast({
        title: "Succès",
        description: "La vidéo promotionnelle a été enregistrée",
      })

      // Refresh videos
      fetchVideos()
    } catch (error) {
      console.error("Error saving video:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la vidéo",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveWorkplace = async () => {
    if (!workplaceVideo) return

    setIsSaving(true)
    try {
      // Prepare form data for file uploads
      const formData = new FormData()
      formData.append("title", workplaceVideo.title)
      formData.append("description", workplaceVideo.description)
      formData.append("type", "workplace")
      formData.append("active", workplaceVideo.active.toString())

      if (workplaceVideoFile) {
        formData.append("video", workplaceVideoFile)
      }

      if (workplaceThumbnailFile) {
        formData.append("thumbnail", workplaceThumbnailFile)
      }

      // Determine if we're creating or updating
      const method = workplaceVideo.id ? "PUT" : "POST"
      const url = workplaceVideo.id ? `/api/publicite/${workplaceVideo.id}` : "/api/publicite"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to save video")
      }

      const savedVideo = await response.json()

      // Update state with saved video
      setVideos((prev) => ({
        ...prev,
        workplace: savedVideo,
      }))

      setEditingWorkplace(false)
      toast({
        title: "Succès",
        description: "La vidéo de travail a été enregistrée",
      })

      // Refresh videos
      fetchVideos()
    } catch (error) {
      console.error("Error saving video:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la vidéo",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelPromo = () => {
    // Reset to original state
    setPromoVideo(videos.promotional)
    setEditingPromo(false)

    // Revoke object URLs
    if (promoVideoUrl) {
      URL.revokeObjectURL(promoVideoUrl)
      setPromoVideoUrl(null)
    }
    if (promoThumbnailUrl) {
      URL.revokeObjectURL(promoThumbnailUrl)
      setPromoThumbnailUrl(null)
    }

    // Reset file inputs
    setPromoVideoFile(null)
    setPromoThumbnailFile(null)
  }

  const handleCancelWorkplace = () => {
    // Reset to original state
    setWorkplaceVideo(videos.workplace)
    setEditingWorkplace(false)

    // Revoke object URLs
    if (workplaceVideoUrl) {
      URL.revokeObjectURL(workplaceVideoUrl)
      setWorkplaceVideoUrl(null)
    }
    if (workplaceThumbnailUrl) {
      URL.revokeObjectURL(workplaceThumbnailUrl)
      setWorkplaceThumbnailUrl(null)
    }

    // Reset file inputs
    setWorkplaceVideoFile(null)
    setWorkplaceThumbnailFile(null)
  }

  const handlePromoVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && promoVideo) {
      // Revoke previous URL if it exists
      if (promoVideoUrl) URL.revokeObjectURL(promoVideoUrl)

      // Create a new URL for the video file
      const url = URL.createObjectURL(file)
      setPromoVideoUrl(url)
      setPromoVideoFile(file)

      // Update state with temporary URL for preview
      setPromoVideo({
        ...promoVideo,
        videoPath: url, // This is temporary for preview only
      })
    }
  }

  const handleWorkplaceVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && workplaceVideo) {
      // Revoke previous URL if it exists
      if (workplaceVideoUrl) URL.revokeObjectURL(workplaceVideoUrl)

      // Create a new URL for the video file
      const url = URL.createObjectURL(file)
      setWorkplaceVideoUrl(url)
      setWorkplaceVideoFile(file)

      // Update state with temporary URL for preview
      setWorkplaceVideo({
        ...workplaceVideo,
        videoPath: url, // This is temporary for preview only
      })
    }
  }

  const handlePromoThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && promoVideo) {
      // Revoke previous URL if it exists
      if (promoThumbnailUrl) URL.revokeObjectURL(promoThumbnailUrl)

      // Create a new URL for the thumbnail file
      const url = URL.createObjectURL(file)
      setPromoThumbnailUrl(url)
      setPromoThumbnailFile(file)

      // Update state with temporary URL for preview
      setPromoVideo({
        ...promoVideo,
        thumbnailPath: url, // This is temporary for preview only
      })
    }
  }

  const handleWorkplaceThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && workplaceVideo) {
      // Revoke previous URL if it exists
      if (workplaceThumbnailUrl) URL.revokeObjectURL(workplaceThumbnailUrl)

      // Create a new URL for the thumbnail file
      const url = URL.createObjectURL(file)
      setWorkplaceThumbnailUrl(url)
      setWorkplaceThumbnailFile(file)

      // Update state with temporary URL for preview
      setWorkplaceVideo({
        ...workplaceVideo,
        thumbnailPath: url, // This is temporary for preview only
      })
    }
  }

  const handleStartEditingPromo = () => {
    if (!videos.promotional) {
      // Create a new promotional video object if none exists
      setPromoVideo({
        id: "",
        title: "Notre publicité",
        description: "Découvrez nos produits et services dans cette vidéo promotionnelle",
        videoPath: null,
        thumbnailPath: null,
        type: "promotional",
        active: true,
      })
    }
    setEditingPromo(true)
  }

  const handleStartEditingWorkplace = () => {
    if (!videos.workplace) {
      // Create a new workplace video object if none exists
      setWorkplaceVideo({
        id: "",
        title: "Notre travail",
        description: "Découvrez comment nous travaillons",
        videoPath: null,
        thumbnailPath: null,
        type: "workplace",
        active: true,
      })
    }
    setEditingWorkplace(true)
  }

  const renderVideoContent = (
    video: VideoData | null,
    isEditing: boolean,
    editState: VideoData | null,
    handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
    videoFile: File | null,
    thumbnailFile: File | null,
    type: "promotional" | "workplace",
  ) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )
    }

    if (!isEditing) {
      return (
        <div className="space-y-6">
          {video ? (
            <>
              <div>
                <h3 className="text-lg font-semibold">{video.title}</h3>
                <p className="text-gray-500 mt-1">{video.description}</p>
              </div>

              <div className="aspect-video relative rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                {video.videoPath ? (
                  <div className="relative w-full h-full">
                    <video
                      src={video.videoPath}
                      className="w-full h-full"
                      controls
                      poster={video.thumbnailPath || undefined}
                    />
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500">Aucune vidéo téléchargée</p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Statut:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${video.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {video.active ? "Actif" : "Inactif"}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-gray-500">
                Aucune vidéo {type === "promotional" ? "promotionnelle" : "de travail"} configurée
              </p>
              <Button
                onClick={type === "promotional" ? handleStartEditingPromo : handleStartEditingWorkplace}
                className="mt-4"
              >
                Ajouter une vidéo
              </Button>
            </div>
          )}
        </div>
      )
    }

    if (!editState) return null

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${type}-title`}>Titre</Label>
          <Input
            id={`${type}-title`}
            value={editState.title}
            onChange={(e) =>
              type === "promotional"
                ? setPromoVideo({ ...editState, title: e.target.value })
                : setWorkplaceVideo({ ...editState, title: e.target.value })
            }
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-description`}>Description</Label>
          <Textarea
            id={`${type}-description`}
            value={editState.description}
            onChange={(e) =>
              type === "promotional"
                ? setPromoVideo({ ...editState, description: e.target.value })
                : setWorkplaceVideo({ ...editState, description: e.target.value })
            }
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor={`${type}-video-upload`}>Télécharger une vidéo</Label>
          <div className="mt-1 flex items-center">
            <Input
              id={`${type}-video-upload`}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById(`${type}-video-upload`)?.click()}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choisir un fichier
            </Button>
            {videoFile && <span className="ml-3 text-sm text-gray-500">{videoFile.name}</span>}
          </div>
          <p className="text-xs text-gray-500 mt-1">Formats acceptés: MP4, WebM, Ogg (max 100MB)</p>
        </div>

        <div>
          <Label htmlFor={`${type}-thumbnail-upload`}>Télécharger une miniature (optionnel)</Label>
          <div className="mt-1 flex items-center">
            <Input
              id={`${type}-thumbnail-upload`}
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById(`${type}-thumbnail-upload`)?.click()}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choisir un fichier
            </Button>
            {thumbnailFile && <span className="ml-3 text-sm text-gray-500">{thumbnailFile.name}</span>}
          </div>
          <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, WebP (max 5MB)</p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`${type}-active`}
            checked={editState.active}
            onChange={(e) =>
              type === "promotional"
                ? setPromoVideo({ ...editState, active: e.target.checked })
                : setWorkplaceVideo({ ...editState, active: e.target.checked })
            }
            className="rounded border-gray-300"
          />
          <Label htmlFor={`${type}-active`}>Actif</Label>
        </div>

        {editState.videoPath && (
          <div>
            <Label>Aperçu</Label>
            <div className="aspect-video relative rounded-lg overflow-hidden border mt-1 bg-gray-100">
              <video
                src={editState.videoPath}
                className="w-full h-full"
                controls
                poster={editState.thumbnailPath || undefined}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Vidéos Publicitaires</h1>

        <Tabs defaultValue="promotional" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="promotional">Vidéo Promotionnelle</TabsTrigger>
            <TabsTrigger value="workplace">Notre Travail</TabsTrigger>
          </TabsList>

          <TabsContent value="promotional">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Vidéo Promotionnelle</CardTitle>
                  {!editingPromo ? (
                    videos.promotional && (
                      <Button onClick={handleStartEditingPromo}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    )
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancelPromo} disabled={isSaving}>
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                      <Button onClick={handleSavePromo} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {renderVideoContent(
                  videos.promotional,
                  editingPromo,
                  promoVideo,
                  handlePromoVideoUpload,
                  handlePromoThumbnailUpload,
                  promoVideoFile,
                  promoThumbnailFile,
                  "promotional",
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workplace">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Notre Travail</CardTitle>
                  {!editingWorkplace ? (
                    videos.workplace && (
                      <Button onClick={handleStartEditingWorkplace}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    )
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancelWorkplace} disabled={isSaving}>
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                      <Button onClick={handleSaveWorkplace} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {renderVideoContent(
                  videos.workplace,
                  editingWorkplace,
                  workplaceVideo,
                  handleWorkplaceVideoUpload,
                  handleWorkplaceThumbnailUpload,
                  workplaceVideoFile,
                  workplaceThumbnailFile,
                  "workplace",
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
