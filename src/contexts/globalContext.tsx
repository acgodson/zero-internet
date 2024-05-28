import { usePassport } from "@/hooks/usePassport";
import { http } from "viem";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { sepolia } from "viem/chains";
import { createPassportClient } from "@0xpass/passport-viem";
import {
  BiconomySmartAccountV2,
  createSmartAccountClient,
  LightSigner,
} from "@biconomy/account";

interface GlobalContextProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  authenticating: boolean;
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
  registering: boolean;
  isReturning: boolean;
  setRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  address: string | undefined;
  setAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  register: () => Promise<void>;
  authenticate: () => Promise<void>;
  smartAccountClient: (
    _signer?: any
  ) => Promise<BiconomySmartAccountV2 | undefined>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
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
      console.log("admin address", address);

      if (authenticatedHeader) {
        const _signer: any = await createPassportClient(
          authenticatedHeader,
          fallbackProvider as any,
          sepolia as any
        );
        const smartAccount: BiconomySmartAccountV2 | undefined =
          await smartAccountClient(_signer);
        if (smartAccount) {
          const smartAccountAdress = await smartAccount.getAccountAddress();
          console.log("address signing operation", smartAccountAdress);
          setAddress(smartAccountAdress);
        }
        localStorage.setItem("profile", username);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setAuthenticating(false);
    }
  }

  async function smartAccountClient(_signer?: any) {
    let signer;
    if (!_signer) {
      if (authenticatedHeader) {
        const x = await createPassportClient(
          authenticatedHeader,
          fallbackProvider as any,
          sepolia as any
        );
        signer = x;
      } else {
        console.log("not authorized");
        return;
      }
    } else {
      signer = _signer;
    }
    return await createSmartAccountClient({
      signer: (await signer) as LightSigner,
      chainId: sepolia.id,
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${sepolia.id}/${
        process.env.NEXT_PUBLIC_BUNDLER_ID as string
      }`,
      biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_KEY,
      rpcUrl: "https://rpc.sepolia.org",
    });
  }

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUsername(profile);
      setIsReturning(true);
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        username,
        setUsername,
        authenticated,
        setAuthenticated,
        authenticating,
        setAuthenticating,
        registering,
        isReturning,
        setRegistering,
        address,
        setAddress,
        register,
        authenticate,
        smartAccountClient,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
