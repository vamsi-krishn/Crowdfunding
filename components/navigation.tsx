"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Wallet, Server } from "lucide-react"
import { StartProjectOverlay } from "@/components/start-project-overlay"
import { WalletConnect } from "@/components/wallet-connect"
import { isHardhatNetwork } from "@/utils/network"
import { Badge } from "@/components/ui/badge"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStartProjectOpen, setIsStartProjectOpen] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainId: string) => {
          setChainId(chainId)
        })
        .catch(console.error)

      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId)
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {})
      }
    }
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const isHardhat = chainId ? isHardhatNetwork(chainId) : false

  return (
    <nav className="bg-secondary">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span className="text-xl font-bold">Crowdfunding Central</span>
            {isHardhat && (
              <Badge
                variant="outline"
                className="ml-2 flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20"
              >
                <Server className="h-3 w-3" /> Hardhat
              </Badge>
            )}
          </Link>
          <div className="hidden md:flex space-x-2 items-center">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <WalletConnect />
            <Button variant="default" onClick={() => setIsStartProjectOpen(true)}>
              Start a Project
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link href="/" onClick={toggleMenu}>
                Home
              </Link>
            </Button>
            <div className="py-2">
              <WalletConnect />
            </div>
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                setIsStartProjectOpen(true)
                setIsMenuOpen(false)
              }}
            >
              Start a Project
            </Button>
          </div>
        )}
      </div>
      <StartProjectOverlay isOpen={isStartProjectOpen} onClose={() => setIsStartProjectOpen(false)} />
    </nav>
  )
}
