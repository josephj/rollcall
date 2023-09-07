import type { IBoxProps } from 'native-base'
import { Pressable, Box } from 'native-base'

const getBackgroundColor = ({
  isHovered,
  isPressed,
  isDisabled,
}: {
  isHovered: boolean
  isPressed: boolean
  isDisabled: boolean
}) => {
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

type CardProps = IBoxProps & {
  children: React.ReactNode
  isDisabled?: boolean
  key?: string
}

export const Card = ({ children, isDisabled = false, key, ...rest }: CardProps) => (
  <Pressable {...{ key }}>
    {({ isHovered, isPressed }) => (
      <Box
        _web={{
          // @ts-ignore
          style: {
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            'a:link, a:visited': {
              textDecoration: 'none',
            },
            transform: [
              {
                scale: isPressed && !isDisabled ? 0.96 : 1,
              },
            ],
          },
        }}
        bg={getBackgroundColor({ isHovered, isPressed, isDisabled })}
        borderColor="coolGray.200"
        borderWidth="1"
        height="auto"
        p="5"
        {...rest}
      >
        {children}
      </Box>
    )}
  </Pressable>
)
