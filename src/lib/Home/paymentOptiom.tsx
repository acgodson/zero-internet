import React, { useState, useEffect } from "react";
import {
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Box,
  Divider,
  Image,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useGlobalContext } from "@/contexts/globalContext";

function PaymentOptionSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
          <ModalHeader textAlign="center" fontSize="lg">
            Submit Transaction
          </ModalHeader>
          <ModalBody>
            <Box
              w="100%"
              fontSize="xl"
              py={4}
              textAlign="center"
              letterSpacing="1.25px"
            >
              <HStack
                px={4}
                py={2}
                border={"0.5px solid #333"}
                borderRadius={"25px"}
                h="55px"
                justifyContent={"flex-start"}
                alignItems={"center"}
                w="100%"
              >
                <Box w="30px">
                  <Image src="/fingerprint.svg" h="30px" w="auto" />
                </Box>

                <Box textAlign={"left"}>
                  <Text fontWeight={"bold"} fontSize={"sm"}>
                    Qr- Codes
                  </Text>
                  <Text fontSize={"xs"} opacity={0.8}>
                    Point of sales, other devices
                  </Text>
                </Box>
              </HStack>

              <HStack
                mt={6}
                px={4}
                py={2}
                border={"0.5px solid #333"}
                borderRadius={"25px"}
                h="55px"
                justifyContent={"flex-start"}
                alignItems={"center"}
                w="100%"
              >
                <Box w="30px">
                  <Image src="/fingerprint.svg" h="30px" w="auto" />
                </Box>

                <Box textAlign={"left"}>
                  <Text fontWeight={"bold"} fontSize={"sm"}>
                    SMS Broadcast
                  </Text>
                  <Text fontSize={"xs"} opacity={0.8}>
                    remote link providers
                  </Text>
                </Box>
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PaymentOptionSheet;
