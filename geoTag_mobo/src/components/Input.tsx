import { View, Text, TextInput } from 'react-native'
import { TextInputProps } from 'react-native'
import React from 'react'
import { ReactNode } from 'react'

type InputProps = TextInputProps

const Input = (props: InputProps) => {
  return (
    <TextInput
    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
      {...props}
    />
  )
}

export default Input