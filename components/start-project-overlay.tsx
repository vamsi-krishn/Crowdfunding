"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import confetti from "canvas-confetti"
import type { Project } from "@/types/project"

interface StartProjectOverlayProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (project: Omit<Project, "id" | "raised" | "imageUrl">) => void
}

const categories = ["Education", "Community", "Technology", "Environment", "Arts & Culture", "Wellness"]

export function StartProjectOverlay({ isOpen, onClose, onProjectCreate }: StartProjectOverlayProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [daysToFund, setDaysToFund] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setAmount("")
    setCategory("")
    setDaysToFund("")
  }

  const handleSubmit = () => {
    if (!title || !description || !amount || !category || !daysToFund) {
      return
    }

    setIsSubmitting(true)

    // Create the new project object
    const newProject = {
      title,
      description,
      goal: Number.parseFloat(amount),
      daysLeft: Number.parseInt(daysToFund),
      category,
    }

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Pass the new project to the parent component
    onProjectCreate(newProject)

    // Reset form and close overlay
    resetForm()
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a New Project</DialogTitle>
          <DialogDescription>Fill in the details below to create your new crowdfunding project.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Funding Goal (ETH)</Label>
            <Input
              id="amount"
              placeholder="Enter funding goal in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days">Funding Duration (days)</Label>
            <Input
              id="days"
              placeholder="Enter funding duration in days"
              value={daysToFund}
              onChange={(e) => setDaysToFund(e.target.value)}
              type="number"
              min="1"
              max="90"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isSubmitting || !title || !description || !amount || !category || !daysToFund}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
