import { Pressable, Box } from "native-base";

export const Card = ({ children, ...rest }) => (
  <Pressable>
    {({ isHovered, isPressed }) => {
      return (
        <Box
          borderWidth="1"
          borderColor="coolGray.200"
          bg={
            isPressed
              ? "coolGray.200"
              : isHovered
              ? "coolGray.100"
              : "coolGray.50"
          }
          p="5"
          style={{
            height: "auto",
            transform: [
              {
                scale: isPressed ? 0.96 : 1,
              },
            ],
            "a:link, a:visited": {
              textDecoration: "none",
            },
          }}
          {...rest}
        >
          {children}
        </Box>
      );
    }}
  </Pressable>
);
