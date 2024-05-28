import { Box, Button, Image, HStack, IconButton } from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";

export default function HomeNav() {
  return (
    <>
      <Box w="100%">
        <HStack
          w="100%"
          borderRadius={"30px"}
          h="60px"
          justifyContent={"space-between"}
          alignItems={"center"}
          px={2}
          bg="white"
        >
          <Button
            colorScheme="ghost"
            color="#333"
            fontWeight={"bold"}
            leftIcon={<Image src="/icons/eth.svg" h="30px" />}
          >
            Sepolia
          </Button>

          <IconButton
            colorScheme="ghost"
            color="#333"
            aria-label="menu"
            icon={<MdMenu size="24px" color="#333" />}
          />
        </HStack>
      </Box>
    </>
  );
}
