import { Pressable, Box } from "native-base";

const getBackgroundColor = ({ isHovered, isPressed, isDisabled }) => {
  if (isDisabled) {
    return "coolGray.100";
  }

  if (isPressed) {
    return "coolGray.200";
  }

  if (isHovered) {
    return "coolGray.100";
  }

  return "coolGray.50";
};

export const Card = ({ children, isDisabled, key, ...rest }) => (
  <Pressable {...{ key }}>
    {({ isHovered, isPressed }) => (
      <Box
        borderWidth="1"
        borderColor="coolGray.200"
        cursor={isDisabled ? "not-allowed" : "pointer"}
        bg={getBackgroundColor({ isHovered, isPressed, isDisabled })}
        p="5"
        style={{
          height: "auto",
          transform: [
            {
              scale: isPressed && !isDisabled ? 0.96 : 1,
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
    )}
  </Pressable>
);
