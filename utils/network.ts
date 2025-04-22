// Supported test networks
export const TEST_NETWORKS = {
  SEPOLIA: {
    chainId: "0xaa36a7", // 11155111 in hex
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  GOERLI: {
    chainId: "0x5", // 5 in hex
    chainName: "Goerli",
    nativeCurrency: {
      name: "Goerli Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.infura.io/v3/"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
  },
  HARDHAT: {
    chainId: "0x539", // 1337 in hex
    chainName: "Hardhat Local",
    nativeCurrency: {
      name: "Hardhat Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: [],
  },
}

// Default test network to use
export const DEFAULT_TEST_NETWORK = TEST_NETWORKS.SEPOLIA

// Check if the current network is a test network
export const isTestNetwork = (chainId: string): boolean => {
  return (
    chainId === TEST_NETWORKS.SEPOLIA.chainId ||
    chainId === TEST_NETWORKS.GOERLI.chainId ||
    chainId === TEST_NETWORKS.HARDHAT.chainId
  )
}

// Get network name from chain ID
export const getNetworkName = (chainId: string): string => {
  if (chainId === TEST_NETWORKS.SEPOLIA.chainId) return "Sepolia"
  if (chainId === TEST_NETWORKS.GOERLI.chainId) return "Goerli"
  if (chainId === TEST_NETWORKS.HARDHAT.chainId) return "Hardhat Local"
  if (chainId === "0x1") return "Ethereum Mainnet"
  return "Unknown Network"
}

// Switch to a test network
export const switchToTestNetwork = async (ethereum: any, network = DEFAULT_TEST_NETWORK): Promise<boolean> => {
  try {
    // Try to switch to the network
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.chainId }],
    })
    return true
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [network],
        })
        return true
      } catch (addError) {
        console.error("Error adding network:", addError)
        return false
      }
    }
    console.error("Error switching network:", switchError)
    return false
  }
}

// Get test ETH faucet URL based on network
export const getFaucetUrl = (chainId: string): string => {
  if (chainId === TEST_NETWORKS.SEPOLIA.chainId) {
    return "https://sepoliafaucet.com/"
  }
  if (chainId === TEST_NETWORKS.GOERLI.chainId) {
    return "https://goerlifaucet.com/"
  }
  // No faucet URL for Hardhat as it automatically provides test accounts with ETH
  return ""
}

// Check if the network is Hardhat local
export const isHardhatNetwork = (chainId: string): boolean => {
  return chainId === TEST_NETWORKS.HARDHAT.chainId
}
