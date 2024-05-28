import React, { useState, useEffect } from "react";
import {
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  Input,
  Box,
  Divider,
  Image,
} from "@chakra-ui/react";
import { useGlobalContext } from "@/contexts/globalContext";

function BottomSheetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [authenticateSetup, setAuthenticateSetup] = useState(false);

  const {
    username,
    setUsername,
    isReturning,
    authenticated,
    registering,
    authenticating,
    address,
    register,
    authenticate,
    smartAccountClient,
  } = useGlobalContext();

  useEffect(() => {
    if (isReturning && isOpen) {
      setAuthenticateSetup(true);
    }
  }, [isOpen, isReturning]);

  useEffect(() => {
    if (authenticated) {
      onClose();
    }
  }, [authenticated]);

  return (
    <>
      <Center my="5"></Center>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="outside"
        motionPreset="slideInBottom"
        // trapFocus={false}
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          position="fixed"
          bottom="0px"
          mb="0"
          borderRadius="1.75rem 1.75rem 0px 0px"
          maxW="lg"
        >
          <ModalHeader textAlign="center" fontSize="3xl">
            <Center>
              <Image src="/fingerprint.svg" h="50px" w="auto" />
            </Center>
          </ModalHeader>
          {/* <ModalCloseButton outline="none" _focus={{ outline: "none" }} /> */}
          <ModalBody>
            <Box fontSize="xl" textAlign="center" letterSpacing="1.25px">
              {/* show sign up page */}
              <Box w="100%">
                <Input
                  h="50px"
                  letterSpacing={"normal"}
                  border={"0.5px solid #64bdf4"}
                  borderRadius="25px"
                  value={username}
                  textAlign={"center"}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`${
                    authenticateSetup ? "username" : "Enter unique username"
                  }`}
                />

                <Button
                  mt={3}
                  w="100%"
                  colorScheme="blue"
                  bg="#356280"
                  size={"lg"}
                  h="50px"
                  borderRadius="25px"
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
                      : "Open Wallet"
                    : registering
                    ? "Registering..."
                    : authenticating
                    ? "Authenticating..."
                    : "Create Wallet"}
                </Button>
              </Box>
            </Box>

            <Divider py={4} />
            <Center mt={2} mb="4">
              <Box fontSize={"sm"} className="cursor-pointer">
                {authenticateSetup
                  ? "Create new profile?"
                  : "Use another profile?"}
              </Box>
              <Button
                onClick={() => {
                  setAuthenticateSetup(!authenticateSetup);
                  if (authenticateSetup) {
                    setUsername("");
                  } else {
                    const profile = localStorage.getItem("profile");
                    if (profile) {
                      setUsername(profile);
                    }
                  }
                }}
                ml={2}
                variant="link"
                size="sm"
                colorScheme="black"
              >
                {!authenticateSetup ? "Sign in" : "Register"}
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BottomSheetModal;
