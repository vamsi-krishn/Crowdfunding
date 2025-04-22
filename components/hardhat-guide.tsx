import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "@/components/ui/code"
import { InfoIcon, Terminal, ExternalLink } from "lucide-react"

export function HardhatGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Hardhat Local Development
        </CardTitle>
        <CardDescription>
          Set up a local Ethereum development environment with Hardhat for testing and development
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Developer Tool</AlertTitle>
          <AlertDescription>
            Hardhat is a local Ethereum network for development. It provides test accounts with ETH for free.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="setup">
            <AccordionTrigger>Setting up Hardhat</AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-3 text-sm list-decimal pl-4">
                <li>
                  <strong>Install Node.js and npm</strong> if you haven't already.{" "}
                  <a
                    href="https://nodejs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    Download here <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>
                  <strong>Create a new directory</strong> for your Hardhat project:
                  <Code className="my-2">mkdir my-hardhat-project && cd my-hardhat-project</Code>
                </li>
                <li>
                  <strong>Initialize a new npm project</strong>:<Code className="my-2">npm init -y</Code>
                </li>
                <li>
                  <strong>Install Hardhat</strong>:<Code className="my-2">npm install --save-dev hardhat</Code>
                </li>
                <li>
                  <strong>Initialize Hardhat</strong>:<Code className="my-2">npx hardhat</Code>
                  <p className="mt-1">Select "Create a JavaScript project" when prompted.</p>
                </li>
                <li>
                  <strong>Start the local Hardhat network</strong>:<Code className="my-2">npx hardhat node</Code>
                  <p className="mt-1">
                    This will start a local Ethereum network and display a list of accounts with private keys and 10,000
                    ETH each.
                  </p>
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="connect">
            <AccordionTrigger>Connecting MetaMask to Hardhat</AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-3 text-sm list-decimal pl-4">
                <li>
                  <strong>Open MetaMask</strong> and click on the network dropdown at the top.
                </li>
                <li>
                  <strong>Select "Add Network"</strong> or "Custom RPC".
                </li>
                <li>
                  <strong>Enter the following details</strong>:
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Network Name: Hardhat Local</li>
                    <li>New RPC URL: http://127.0.0.1:8545</li>
                    <li>Chain ID: 31337</li>
                    <li>Currency Symbol: ETH</li>
                  </ul>
                </li>
                <li>
                  <strong>Click "Save"</strong> to add the network.
                </li>
                <li>
                  <strong>Import a test account</strong> (optional):
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>In MetaMask, click on your account icon and select "Import Account"</li>
                    <li>
                      Copy a private key from the Hardhat console (without the "0x" prefix) and paste it into MetaMask
                    </li>
                    <li>Click "Import" to add the account with 10,000 ETH</li>
                  </ul>
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="benefits">
            <AccordionTrigger>Benefits of Using Hardhat</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>
                  <strong>Local Development</strong>: No need for internet connection or external services.
                </li>
                <li>
                  <strong>Instant Transactions</strong>: Transactions are processed immediately.
                </li>
                <li>
                  <strong>Unlimited Test ETH</strong>: Each account comes with 10,000 ETH for testing.
                </li>
                <li>
                  <strong>Debugging</strong>: Detailed error messages and stack traces for transactions.
                </li>
                <li>
                  <strong>Reset Capability</strong>: You can reset the network state at any time.
                </li>
                <li>
                  <strong>Console Output</strong>: See all transactions and events in the terminal.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>Additional Resources</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>
                  <a
                    href="https://hardhat.org/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    Hardhat Documentation <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://hardhat.org/tutorial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    Hardhat Tutorial <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://ethereum.org/en/developers/tutorials/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    Ethereum Developer Tutorials <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
