import { Box, Button, Image, useDisclosure, Center } from "@chakra-ui/react";
import BottomSheetModal from "@/components/modals/bottomSheets";

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box px={4} position={"relative"}>
        <Image src="/logo-bg.svg" h="auto" w="md" />
        <Image
          src="/logo-white.svg"
          h="70px"
          position={"absolute"}
          top={"80%"}
        />
      </Box>
      <Box px={4} w="100%" pt={24}>
        <Center>
          <Button onClick={onOpen} w="100%" h="50px" borderRadius={"25px"}>
            Get Started
          </Button>
        </Center>
      </Box>

      <BottomSheetModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
