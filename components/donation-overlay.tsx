"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ExternalLink } from "lucide-react"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"
import { isTestNetwork, getNetworkName, switchToTestNetwork } from "@/utils/network"

interface DonationOverlayProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
}

export function DonationOverlay({ isOpen, onClose, projectTitle }: DonationOverlayProps) {
  const [amount, setAmount] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [name, setName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      // Get current chain ID
      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainId: string) => {
          setChainId(chainId)
        })
        .catch(console.error)

      // Get current account
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }
        })
        .catch(console.error)

      // Listen for chain changes
      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId)
      })

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount(null)
        }
      })
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {})
        window.ethereum.removeListener("accountsChanged", () => {})
      }
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      })
      return
    }

    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to make a donation",
        variant: "destructive",
      })
      return
    }

    // Check if connected to a wallet
    if (!account) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(accounts[0])
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Please connect your wallet to make a donation",
          variant: "destructive",
        })
        return
      }
    }

    // Check if on a test network
    if (chainId && !isTestNetwork(chainId)) {
      toast({
        title: "Wrong network",
        description: "Please switch to a test network to make a donation",
        variant: "destructive",
      })

      // Try to switch to a test network
      try {
        await switchToTestNetwork(window.ethereum)
        // Get updated chain ID
        const newChainId = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(newChainId)

        // If still not on a test network, return
        if (!isTestNetwork(newChainId)) {
          return
        }
      } catch (error) {
        console.error("Failed to switch network:", error)
        return
      }
    }

    setIsProcessing(true)
    try {
      // Get current account (might have changed)
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const sender = accounts[0]
      // This would be the project's wallet address in a real app
      const recipient = "0x0000000000000000000000000000000000000000"

      // Convert ETH to Wei (1 ETH = 10^18 Wei)
      const weiAmount = BigInt(Number.parseFloat(amount) * 10 ** 18)

      // Create transaction parameters
      const transactionParameters = {
        to: recipient,
        from: sender,
        value: "0x" + weiAmount.toString(16),
      }

      // Send transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })

      console.log("Transaction hash:", txHash)

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      toast({
        title: "Donation successful!",
        description: `You've donated ${amount} ETH to ${projectTitle}`,
      })

      onClose()
    } catch (error: any) {
      console.error("Transaction error:", error)
      toast({
        title: "Transaction failed",
        description: error.message || "There was an error processing your donation",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const isOnTestNetwork = chainId ? isTestNetwork(chainId) : false
  const networkName = chainId ? getNetworkName(chainId) : "Unknown"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Support {projectTitle}</DialogTitle>
          <DialogDescription>Enter the amount of ETH you'd like to donate to this project.</DialogDescription>
        </DialogHeader>

        {!account && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>Please connect your wallet to make a donation.</AlertDescription>
          </Alert>
        )}

        {account && chainId && !isOnTestNetwork && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Wrong network</AlertTitle>
            <AlertDescription>
              You're currently on {networkName}. Please switch to a test network to make a donation.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (ETH)</Label>
            <Input
              id="amount"
              placeholder="0.05"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0.0001"
              step="0.0001"
            />
          </div>
          <div className="space-y-2">
            <Label>Donation Type</Label>
            <div className="flex space-x-4">
              <Button
                variant={isAnonymous ? "default" : "outline"}
                onClick={() => setIsAnonymous(true)}
                className="flex-1"
              >
                Anonymous
              </Button>
              <Button
                variant={!isAnonymous ? "default" : "outline"}
                onClick={() => setIsAnonymous(false)}
                className="flex-1"
              >
                Named
              </Button>
            </div>
          </div>
          {!isAnonymous && (
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>This is a test application. Donations use test ETH on test networks only.</p>
            <a
              href="https://sepoliafaucet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline inline-flex items-center mt-1"
            >
              Get test ETH <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              isProcessing || !amount || Number.parseFloat(amount) <= 0 || !account || (chainId && !isOnTestNetwork)
            }
          >
            {isProcessing ? "Processing..." : "Donate ETH"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
