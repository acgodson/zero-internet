import { Box, Text } from "@chakra-ui/react";

export default function WalletCard({
  lastRefreshed,
  balance,
  worth,
}: {
  lastRefreshed: string;
  balance: string;
  worth: string;
}) {
  return (
    <>
      <Box mt={2} px={1} w="100%">
        <Box
          w="100%"
          h="220px"
          position={"relative"}
          borderRadius={"30px"}
          zIndex={1}
          bg="white"
        >
          <Box
            fontWeight={"semibold"}
            position={"absolute"}
            zIndex={1}
            px={4}
            py={4}
            h="100%"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              {" "}
              <Text
                color={"gray"}
                fontWeight={"semibold"}
                textAlign={"center"}
                fontSize={"9px"}
              >
                last refreshed: {lastRefreshed}
              </Text>
            </Box>

            <Box>
              <Box>{balance} ETH</Box>
              <Box>${worth}</Box>
            </Box>
          </Box>
          <Box
            zIndex={-1}
            w="150px"
            h="150px"
            right={0}
            top={0}
            position={"absolute"}
            borderLeftRadius={"50%"}
            borderBottomRightRadius={"0"}
            borderTopRightRadius={"30px"}
            bgGradient="linear(to-r, #D968D0, #EB4634)"
          />

          <Box
            bg="whiteAlpha.700"
            borderRadius={"30px"}
            h="100%"
            w="100%"
            backdropFilter="blur(10px)"
          />
        </Box>
      </Box>
    </>
  );
}
