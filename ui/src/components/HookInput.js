import { Input } from 'native-base'
import { Controller } from 'react-hook-form'

export const HookInput = ({ name, rules, defaultValue, control, ...props }) => (
  <Controller
    render={({ field: { onChange, onBlur, value } }) => (
      <Input onChangeText={(value) => onChange(value)} {...{ onBlur, value, ...props }} />
    )}
    {...{ control, defaultValue, name, rules }}
  />
)
