import { Pressable, Box } from "native-base";

export const Card = ({ children, ...rest }) => (
  <Pressable>
    {({ isHovered, isPressed }) => {
      return (
        <Box
          borderWidth="1"
          borderColor="coolGray.300"
          shadow="3"
          bg={
            isPressed
              ? "coolGray.200"
              : isHovered
              ? "coolGray.200"
              : "coolGray.100"
          }
          p="5"
          rounded="8"
          style={{
            height: 'auto',
            transform: [
              {
                scale: isPressed ? 0.96 : 1,
              },
            ],
          }}
          {...rest}
        >
          {children}
        </Box>
      );
    }}
  </Pressable>
);
