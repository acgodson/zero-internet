import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Divider,
  Select,
  Switch,
  DrawerFooter,
} from "@chakra-ui/react";
import { MdContacts, MdLocationOn } from "react-icons/md";
import PaymentOptionSheet from "./paymentOptiom";

interface SendMoneyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendMoneyDrawer: React.FC<SendMoneyDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isCrossChain, setIsCrossChain] = useState(false);
  const [destinationChain, setDestinationChain] = useState("");
  const {
    isOpen: isOptionsOpen,
    onOpen: onOpenOptions,
    onClose: onCloseOptions,
  } = useDisclosure();

  const handleSend = () => {
    onClose();
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Send Money</DrawerHeader>

          <DrawerBody>
            <FormControl id="to" isRequired>
              <FormLabel fontSize={"sm"}>To Address</FormLabel>
              <InputGroup size="lg">
                <InputLeftAddon>
                  <MdContacts />
                </InputLeftAddon>
                <Input
                  focusBorderColor="blue.50"
                  placeholder="Receiver's address"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <Divider py={4} />

            <FormControl id="amount" mt={4} isRequired>
              <FormLabel fontSize={"sm"}>Amount</FormLabel>

              <InputGroup size="lg">
                <InputLeftAddon>$</InputLeftAddon>
                <Input
                  focusBorderColor="blue.50"
                  placeholder="Enter amount to send"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <Divider py={4} />

            <FormControl display="flex" alignItems="center" mt={4}>
              <FormLabel htmlFor="crosschain-switch" mb="0">
                Crosschain Transfer
              </FormLabel>
              <Switch
                id="crosschain-switch"
                isChecked={isCrossChain}
                onChange={() => setIsCrossChain(!isCrossChain)}
              />
            </FormControl>

            {isCrossChain && (
              <FormControl
                h="70px"
                id="destination-chain"
                mt={4}
                position={"relative"}
              >
                <Select
                  mt={2}
                  size="lg"
                  position={"absolute"}
                  top={0}
                  _placeholder={{
                    color: "gray.50",
                  }}
                  value={destinationChain}
                  onChange={(e) => setDestinationChain(e.target.value)}
                >
                  <option value="bnb">BNB</option>
                  <option value="amory">amory</option>
                </Select>
                <FormLabel
                  position={"absolute"}
                  zIndex={"tooltip"}
                  h="fit-content"
                  ml={2}
                  w="fit-content"
                  bg="white"
                  fontSize={"10px"}
                >
                  Destination Chain
                </FormLabel>
              </FormControl>
            )}
          </DrawerBody>

          <DrawerFooter pb={4}>
            <Button
              w="100%"
              h="50px"
              borderRadius={"25px"}
              mt={6}
              colorScheme="blue"
              onClick={onOpenOptions}
              // isDisabled={!to || !amount}
            >
              Continue
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <PaymentOptionSheet isOpen={isOptionsOpen} onClose={onCloseOptions} />
    </>
  );
};

export default SendMoneyDrawer;
