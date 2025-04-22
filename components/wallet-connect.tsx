"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  isTestNetwork,
  getNetworkName,
  switchToTestNetwork,
  getFaucetUrl,
  TEST_NETWORKS,
  isHardhatNetwork,
} from "@/utils/network"
import { ExternalLink, AlertTriangle, Server } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      // Check if user is already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
            // Get current chain ID
            window.ethereum.request({ method: "eth_chainId" }).then((chainId: string) => {
              setChainId(chainId)

              // Warn if not on a test network
              if (!isTestNetwork(chainId)) {
                toast({
                  title: "Warning: Not on a test network",
                  description: "Please switch to a test network to use this app",
                  variant: "destructive",
                })
              }
            })
          }
        })
        .catch(console.error)

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount(null)
        }
      })

      // Listen for chain changes
      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId)

        // Notify user about network change
        toast({
          title: `Network changed to ${getNetworkName(newChainId)}`,
          description: isTestNetwork(newChainId)
            ? "You're now on a supported test network"
            : "Please switch to a test network for testing",
          variant: isTestNetwork(newChainId) ? "default" : "destructive",
        })
      })
    }
  }, [toast])

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this feature",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])

      // Get current chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      setChainId(chainId)

      // Check if on a test network
      if (!isTestNetwork(chainId)) {
        toast({
          title: "Not on a test network",
          description: "Please switch to a test network to use this app",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Wallet connected",
          description: `Connected to ${getNetworkName(chainId)}`,
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Connection failed",
        description: "Failed to connect to your wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const switchNetwork = async (networkKey: string) => {
    if (!window.ethereum) return

    const network = TEST_NETWORKS[networkKey as keyof typeof TEST_NETWORKS]
    if (!network) return

    setIsSwitchingNetwork(true)
    try {
      const success = await switchToTestNetwork(window.ethereum, network)
      if (success) {
        toast({
          title: "Network switched",
          description: `Switched to ${network.chainName} test network`,
        })
      }
    } catch (error) {
      console.error("Error switching network:", error)
      toast({
        title: "Network switch failed",
        description: "Failed to switch to test network",
        variant: "destructive",
      })
    } finally {
      setIsSwitchingNetwork(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getNetworkStatus = () => {
    if (!chainId) return null

    const isTest = isTestNetwork(chainId)
    const networkName = getNetworkName(chainId)
    const isHardhat = isHardhatNetwork(chainId)

    return (
      <div className={`text-xs ${isTest ? "text-green-500" : "text-red-500"} flex items-center gap-1`}>
        {!isTest && <AlertTriangle className="w-3 h-3" />}
        {isHardhat && <Server className="w-3 h-3 mr-1" />}
        {networkName}
      </div>
    )
  }

  const getFaucetLink = () => {
    if (!chainId) return null
    const faucetUrl = getFaucetUrl(chainId)
    if (!faucetUrl) return null

    return (
      <a
        href={faucetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs flex items-center gap-1 text-blue-500 hover:underline"
      >
        Get test ETH <ExternalLink className="w-3 h-3" />
      </a>
    )
  }

  return (
    <div>
      {account ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex flex-col items-start py-1 h-auto">
              <span>{formatAddress(account)}</span>
              {getNetworkStatus()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-4">
            <div className="space-y-2">
              <h4 className="font-medium">Connected Wallet</h4>
              <p className="text-xs text-muted-foreground break-all">{account}</p>

              <div className="pt-2">
                <h4 className="font-medium text-sm">Network</h4>
                <p className="text-xs">{chainId ? getNetworkName(chainId) : "Unknown"}</p>

                <div className="mt-2 space-y-2">
                  <h4 className="font-medium text-sm">Switch Network</h4>
                  <Select onValueChange={switchNetwork}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a test network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEPOLIA">Sepolia</SelectItem>
                      <SelectItem value="GOERLI">Goerli</SelectItem>
                      <SelectItem value="HARDHAT">Hardhat Local</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {chainId && isTestNetwork(chainId) && getFaucetLink()}

                {isHardhatNetwork(chainId) && (
                  <p className="text-xs text-green-500 mt-2">
                    Connected to Hardhat local network. You have access to test accounts with 10,000 ETH each.
                  </p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button onClick={connectWallet} disabled={isConnecting} size="sm">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  )
}
