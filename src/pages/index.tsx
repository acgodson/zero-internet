import { Box, Center } from "@chakra-ui/react";
import { useGlobalContext } from "@/contexts/globalContext";
import Home from "@/lib/Home";
import Login from "@/lib/Login";

export default function Page() {
  const { authenticated } = useGlobalContext();

  return (
    <>
      <Center>
        <Box
          maxW={"600px"}
          w="100%"
          top={0}
          minH="100vh"
          bg="#64bdf4"
          overflowY={"hidden"}
          position={"fixed"}
        >
          {!authenticated && <Login />}

          {authenticated && <Home />}
        </Box>
      </Center>
    </>
  );
}
