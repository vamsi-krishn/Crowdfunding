import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ExternalLink, Server } from "lucide-react"
import { DEFAULT_TEST_NETWORK } from "@/utils/network"
import { HardhatGuide } from "@/components/hardhat-guide"

export function TestNetworkGuide() {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This platform uses test networks for demonstration purposes. No real ETH is used.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="public">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="public">Public Test Networks</TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-1">
            <Server className="h-4 w-4" /> Local Hardhat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="public">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="setup">
              <AccordionTrigger>How to set up for testing</AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-2 text-sm list-decimal pl-4">
                  <li>
                    Install the{" "}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center"
                    >
                      MetaMask browser extension <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>Create or import a wallet in MetaMask</li>
                  <li>Switch to the {DEFAULT_TEST_NETWORK.chainName} test network in MetaMask</li>
                  <li>
                    Get test ETH from a{" "}
                    <a
                      href={
                        DEFAULT_TEST_NETWORK.chainName === "Sepolia"
                          ? "https://sepoliafaucet.com/"
                          : "https://goerlifaucet.com/"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center"
                    >
                      {DEFAULT_TEST_NETWORK.chainName} faucet <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>Connect your wallet to this platform using the "Connect Wallet" button</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="what-is-test-eth">
              <AccordionTrigger>What is test ETH?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm">
                  Test ETH is a version of Ethereum's cryptocurrency that has no real-world value. It's used for testing
                  applications on test networks like {DEFAULT_TEST_NETWORK.chainName}. You can get test ETH for free
                  from faucets, which are websites that distribute small amounts of test ETH for development and testing
                  purposes.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="why-test-network">
              <AccordionTrigger>Why use a test network?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm">
                  Test networks allow developers and users to experiment with blockchain applications without using real
                  cryptocurrency. This is important for:
                </p>
                <ul className="list-disc pl-4 text-sm mt-2 space-y-1">
                  <li>Testing functionality without financial risk</li>
                  <li>Learning how to use blockchain applications</li>
                  <li>Developing and debugging applications</li>
                  <li>Demonstrating features without requiring real funds</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="local">
          <HardhatGuide />
        </TabsContent>
      </Tabs>
    </div>
  )
}
