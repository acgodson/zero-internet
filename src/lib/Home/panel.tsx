import { Box, HStack, useDisclosure } from "@chakra-ui/react";
import { shortenAddress } from "@/utils/helpers";
import { MdArrowForward, MdRefresh } from "react-icons/md";
import { useGlobalContext } from "@/contexts/globalContext";
import SendMoneyDrawer from "./sendMoneyDrawer";

export default function Panel() {
  const { address } = useGlobalContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box mt={2} px={1} w="100%">
        <HStack justifyContent={"space-between"} alignItems={"center"}>
          <Box w="100%" h="60px" px={1}>
            <Box
              bg="#356280"
              color="white"
              display={"flex"}
              alignItems={"center"}
              borderRadius={"30px"}
              justifyContent={"center"}
              w="100%"
              h="60px"
              px={1}
            >
              {shortenAddress(address || "")}
            </Box>
          </Box>

          <Box h="60px">
            <Box
              bg="#D968D0"
              h="60px"
              w="60px"
              rounded={"full"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              style={{ transform: "rotate(-30deg)" }}
            >
              <MdRefresh size="24px" />
            </Box>
          </Box>

          <Box h="60px">
            <Box
              bg="#D968D0"
              h="60px"
              w="60px"
              rounded={"full"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              style={{ transform: "rotate(-30deg)" }}
              onClick={onOpen}
            >
              <MdArrowForward size="24px" />
            </Box>
          </Box>
        </HStack>
      </Box>

      {/* send drawer */}
      <SendMoneyDrawer onClose={onClose} isOpen={isOpen} />
    </>
  );
}
