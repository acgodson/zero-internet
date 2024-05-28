import { useState } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  useDisclosure,
  Center,
  Flex,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { parseEther } from "viem";
import { PaymasterMode } from "@biconomy/account";
import BottomSheetModal from "@/components/modals/bottomSheets";
import { useGlobalContext } from "@/contexts/globalContext";
import { shortenAddress } from "@/utils/helpers";
import { MdArrowForward, MdMenu, MdRefresh } from "react-icons/md";
import WalletCard from "./walletCard";
import HomeNav from "@/components/nav/homeNav";
import Panel from "./panel";
import HomeLayout from "./Layout";
import SendMoneyDrawer from "./sendMoneyDrawer";

export default function Home() {
  const {
    username,
    setUsername,
    authenticated,
    registering,
    authenticating,
    address,
    register,
    authenticate,
    smartAccountClient,
  } = useGlobalContext();

  const [signMessageLoading, setSignMessageLoading] = useState(false);
  const [messageSignature, setMessageSignature] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function signUserOp(userOp: any) {
    const smartAccount = await smartAccountClient();
    if (!smartAccount) {
      console.log("no account found");
      return;
    }
    const _address = await smartAccount.getAccountAddress();
    console.log("address signing operation", _address);
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
    <HomeLayout>
      <HomeNav />

      <WalletCard
        lastRefreshed={" today 9:00am"}
        balance={"0.01"}
        worth={"1,000"}
      />

      <Panel />
    </HomeLayout>
  );
}

// {messageSignature && (
//     <div className="flex flex-col space-y-4 max-w-[60ch] break-words">
//       <div className="font-bold">Message Signature</div>
//       <div>{messageSignature}</div>
//     </div>
//   )}
