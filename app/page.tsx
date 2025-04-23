"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { CategoryFilter } from "@/components/category-filter"
import { Button } from "@/components/ui/button"
import { StartProjectOverlay } from "@/components/start-project-overlay"
import { TestNetworkGuide } from "@/components/test-network-guide"
import { useToast } from "@/hooks/use-toast"
import { useProjects } from "@/hooks/use-projects"
import type { Project } from "@/types/project"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isStartProjectOpen, setIsStartProjectOpen] = useState(false)
  const { projects, addProject, isLoading } = useProjects()
  const { toast } = useToast()

  // Get unique categories from projects
  const categories = Array.from(new Set(projects.map((project) => project.category)))

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory)

  const handleAddProject = (newProject: Omit<Project, "id" | "raised" | "imageUrl">) => {
    // Add the new project
    const addedProject = addProject(newProject)

    // Show success toast
    toast({
      title: "Project created!",
      description: `Your project "${addedProject.title}" has been created successfully.`,
    })
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading projects...</div>
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl tracking-tight">Support Our Community</h1>
        <p className="text-xl text-muted-foreground">
          Discover and fund amazing projects with ETH on our decentralized crowdfunding platform.
        </p>
        <Button size="lg" className="mt-4" onClick={() => setIsStartProjectOpen(true)}>
          Start Your Campaign
        </Button>
      </div>

      <TestNetworkGuide />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found in this category.</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsStartProjectOpen(true)}>
            Create the first project
          </Button>
        </div>
      )}

      <StartProjectOverlay
        isOpen={isStartProjectOpen}
        onClose={() => setIsStartProjectOpen(false)}
        onProjectCreate={handleAddProject}
      />
    </div>
  )
}
