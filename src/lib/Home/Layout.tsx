import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

export default function HomeLayout({
  children,
}: {
  children: ReactNode | any;
}) {
  return (
    <>
      <Box
        rounded={"full"}
        bg="lightblue"
        w="60%"
        h="300px"
        position={"absolute"}
        bottom={0}
      />

      <Box
        minH={"100vh"}
        bg="whiteAlpha.800"
        px={1}
        w="100%"
        pt={2}
        backdropFilter="blur(10px)"
      >
        {children}
      </Box>
    </>
  );
}
