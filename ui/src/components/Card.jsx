import { Pressable, Box } from 'native-base'

const getBackgroundColor = ({ isHovered, isPressed, isDisabled }) => {
  if (isDisabled) {
    return 'coolGray.100'
  }

  if (isPressed) {
    return 'coolGray.200'
  }

  if (isHovered) {
    return 'coolGray.100'
  }

  return 'coolGray.50'
}

export const Card = ({ children, isDisabled, key, ...rest }) => (
  <Pressable {...{ key }}>
    {({ isHovered, isPressed }) => (
      <Box
        bg={getBackgroundColor({ isHovered, isPressed, isDisabled })}
        borderColor="coolGray.200"
        borderWidth="1"
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        p="5"
        style={{
          height: 'auto',
          transform: [
            {
              scale: isPressed && !isDisabled ? 0.96 : 1,
            },
          ],
          'a:link, a:visited': {
            textDecoration: 'none',
          },
        }}
        {...rest}
      >
        {children}
      </Box>
    )}
  </Pressable>
)
