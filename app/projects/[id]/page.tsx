"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Leaf, Cpu, Palette, Heart, Users, LayoutGrid } from "lucide-react"
import { DonationOverlay } from "@/components/donation-overlay"
import { TestNetworkGuide } from "@/components/test-network-guide"
import { useProjects } from "@/hooks/use-projects"

const categoryIcons = {
  All: LayoutGrid,
  Education: BookOpen,
  Environment: Leaf,
  Technology: Cpu,
  "Arts & Culture": Palette,
  Wellness: Heart,
  Community: Users,
}

const categoryColors = {
  All: "text-blue-400",
  Education: "text-purple-400",
  Environment: "text-green-400",
  Technology: "text-cyan-400",
  "Arts & Culture": "text-pink-400",
  Wellness: "text-red-400",
  Community: "text-yellow-400",
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [isDonationOverlayOpen, setIsDonationOverlayOpen] = useState(false)
  const { getProject, isLoading, updateProject } = useProjects()
  const router = useRouter()

  const projectId = Number.parseInt(params.id)
  const project = getProject(projectId)

  // Handle donation completion
  const handleDonationComplete = (amount: number) => {
    if (project) {
      const updatedProject = {
        ...project,
        raised: project.raised + amount,
      }
      updateProject(updatedProject)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading project...</div>
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  const progress = (project.raised / project.goal) * 100
  const Icon = categoryIcons[project.category as keyof typeof categoryIcons]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">{project.title}</CardTitle>
            <div className="flex items-center">
              <Icon className={`w-6 h-6 mr-2 ${categoryColors[project.category as keyof typeof categoryColors]}`} />
              <span className={`text-lg ${categoryColors[project.category as keyof typeof categoryColors]}`}>
                {project.category}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64 lg:h-80 max-w-2xl mx-auto mb-6 relative">
            <Image
              src={project.imageUrl || "/placeholder.svg?height=400&width=800"}
              alt={project.title}
              width={800}
              height={400}
              className="object-cover rounded-md w-full h-full"
            />
          </div>
          <p className="text-xl mb-6">{project.description}</p>
          <div className="space-y-4">
            <Progress value={progress} className="h-4" />
            <div className="flex justify-between text-lg">
              <span>{project.raised.toFixed(4)} ETH raised</span>
              <span>{project.goal.toFixed(4)} ETH goal</span>
            </div>
            <p className="text-muted-foreground">{project.daysLeft} days left to fund this project</p>
          </div>
        </CardContent>
      </Card>

      <TestNetworkGuide />

      <Card>
        <CardContent className="pt-6">
          <Button size="lg" className="w-full" onClick={() => setIsDonationOverlayOpen(true)}>
            Support This Project
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>About This Project</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.description}</p>
          <p className="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </CardContent>
      </Card>
      <DonationOverlay
        isOpen={isDonationOverlayOpen}
        onClose={() => setIsDonationOverlayOpen(false)}
        projectTitle={project.title}
        onDonationComplete={(amount) => handleDonationComplete(amount)}
      />
    </div>
  )
}
