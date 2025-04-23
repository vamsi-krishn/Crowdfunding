"use client"

import { useState, useEffect } from "react"
import initialProjectsData from "@/data/projects.json"
import type { Project } from "@/types/project"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjectsData)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load projects from localStorage on initial render
  useEffect(() => {
    // Skip localStorage in SSR
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    try {
      const storedProjects = localStorage.getItem("projects")
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects))
      }
    } catch (error) {
      console.error("Error loading projects:", error)
      // Already using initialProjectsData as default state
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [])

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return

    try {
      localStorage.setItem("projects", JSON.stringify(projects))
    } catch (error) {
      console.error("Error saving projects:", error)
    }
  }, [projects, isInitialized])

  // Add a new project
  const addProject = (newProject: Omit<Project, "id" | "raised" | "imageUrl">) => {
    const projectToAdd: Project = {
      ...newProject,
      id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
      raised: 0,
      imageUrl: `https://picsum.photos/seed/project${Date.now()}/800/400`,
    }

    setProjects((prevProjects) => [...prevProjects, projectToAdd])
    return projectToAdd
  }

  // Update an existing project
  const updateProject = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
    )
  }

  // Get a project by ID
  const getProject = (id: number): Project | undefined => {
    return projects.find((project) => project.id === id)
  }

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    getProject,
  }
}
