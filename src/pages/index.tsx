import { useState } from "react";
import { createPassportClient } from "@0xpass/passport-viem";
import {
  http,
  Transport,
  encodeAbiParameters,
  keccak256,
  parseEther,
} from "viem";
import { sepolia } from "viem/chains";
import { usePassport } from "@/hooks/usePassport";
import {
  createSmartAccountClient,
  LightSigner,
  PaymasterMode,
} from "@biconomy/account";

export default function Page() {
  const [username, setUsername] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [authenticateSetup, setAuthenticateSetup] = useState(false);
  const [signMessageLoading, setSignMessageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSignature, setMessageSignature] = useState("");
  const [authenticatedHeader, setAuthenticatedHeader] = useState({});

  const [address, setAddress] = useState<string>();

  const fallbackProvider = http("https://rpc.ankr.com/eth_sepolia");

  const userInput = {
    username: username,
    userDisplayName: username,
  };

  const { passport } = usePassport({
    scope_id: process.env.NEXT_PUBLIC_SCOPE_ID as string,
  });

  async function register() {
    setRegistering(true);
    try {
      await passport.setupEncryption();
      const res = await passport.register(userInput);
      console.log(res);

      if (res.result.account_id) {
        setRegistering(false);
        setAuthenticating(true);
        await authenticate();
        setAuthenticating(false);
      }
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setRegistering(false);
      setAuthenticating(false);
    }
  }

  async function authenticate() {
    setAuthenticating(true);
    try {
      await passport.setupEncryption();
      const [authenticatedHeader, address] = await passport.authenticate(
        userInput
      )!;
      setAuthenticatedHeader(authenticatedHeader);
      console.log(address);
      setAddress(address);
      setAuthenticated(true);
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setAuthenticating(false);
    }
  }

  function createWalletClient() {
    return createPassportClient(
      authenticatedHeader,
      fallbackProvider as any,
      sepolia as any
    );
  }

  async function signUserOp(userOp: any) {
    const signer: any = createWalletClient();

    const smartAccount = await createSmartAccountClient({
      signer: (await signer) as LightSigner,
      chainId: sepolia.id,
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${sepolia.id}/${
        process.env.NEXT_PUBLIC_BUNDLER_ID as string
      }`,
      biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_KEY,
      rpcUrl: "https://rpc.sepolia.org",
    });

    const address = await smartAccount.getAccountAddress();
    console.log("address signing operation", address);

    const transaction = {
      to: userOp.to,
      from: address,
      value: userOp.value,
    };

    console.log(transaction);

    const op = await smartAccount.buildUserOp([transaction], {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
      },
    });

    // Use multichain module to sign once for all ops
    const returnedOps = await smartAccount.signUserOp(op);
    const response = await smartAccount.sendSignedUserOp(returnedOps);
    console.log(response);
    return { ...op, signature: returnedOps };
  }

  async function submit(from: string, to: string) {
    const userOp = {
      from: from,
      to: to,
      value: parseEther("0.001").toString(),
    };

    try {
      const signedUserOp = await signUserOp(userOp);

      console.log("Signed UserOp:", signedUserOp);

      setSignMessageLoading(true);
      setMessageSignature((signedUserOp as any).signature.signature);
      setSignMessageLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  async function buildTransaction() {
    if (!address) {
      console.log("no address authenticated");
      return;
    }
    await submit(address, "0xf2750684eB187fF9f82e2F980f6233707eF5768C");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white text-black">
      <div
        className={`text-2xl font-bold mb-8 ${
          authenticated ? "text-green-500" : "text-red-500"
        }`}
      >
        {authenticated ? "Authenticated" : "Not authenticated"}
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold underline">0xPass Quickstart</h1>
        <p className="mt-2 text-lg">
          This is a quickstart guide for the 0xPass Passport SDK.
        </p>

        <div className="flex flex-col mt-4 space-y-4">
          {authenticated ? (
            <>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold">Address</div>
                  <div>{address}</div>
                </div>
              </div>

              {messageSignature && (
                <div className="flex flex-col space-y-4 max-w-[60ch] break-words">
                  <div className="font-bold">Message Signature</div>
                  <div>{messageSignature}</div>
                </div>
              )}

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-1 rounded p-2 border-black mb-4 ml-2 text-center"
                placeholder="Message to sign"
              />
              <button
                onClick={
                  async () => await buildTransaction() // signMessage(message)
                }
                disabled={signMessageLoading}
                className="border border-1 rounded p-2 border-black mb-4 ml-2"
              >
                {signMessageLoading ? "Signing..." : "Sign Message"}
              </button>
            </>
          ) : (
            <div className="mb-12 flex flex-col space-y-2 mt-8">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-1 rounded p-2 border-black mb-4 ml-2 text-center"
                placeholder="Enter unique username"
              />
              <button
                className="border border-1 rounded p-2 border-black mb-4 ml-2"
                onClick={async () => {
                  if (authenticateSetup) {
                    await authenticate();
                  } else {
                    await register();
                  }
                }}
                disabled={registering || authenticating}
              >
                {authenticateSetup
                  ? authenticating
                    ? "Authenticating..."
                    : "Authenticate"
                  : registering
                  ? "Registering..."
                  : authenticating
                  ? "Authenticating..."
                  : "Register"}
              </button>

              <span
                onClick={() => setAuthenticateSetup(!authenticateSetup)}
                className="cursor-pointer"
              >
                {authenticateSetup
                  ? "Register a Passkey?"
                  : "Already have a passkey?"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
