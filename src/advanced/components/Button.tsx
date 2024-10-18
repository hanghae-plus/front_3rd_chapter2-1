import React, { FC, memo, ReactNode, useMemo, useCallback } from 'react'

type ButtonProps = {
  id?: string
  className?: string
  text: string
  onClick: () => void
  disabled?: boolean
  color?: 'primary' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const colorMap = {
  primary: 'bg-blue-500 text-white',
  error: 'bg-red-500 text-white',
} as const

const sizeMap = {
  sm: 'px-2 py-1',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
} as const

const Button: FC<ButtonProps> = memo(({ color = 'primary', size = 'md', text, className = '', onClick, ...props }) => {
  const colorClass = colorMap[color]
  const sizeClass = sizeMap[size]

  const classNameProps = useMemo(
    () => `rounded disabled:bg-gray-400 ${className} ${colorClass} ${sizeClass}`.trim(),
    [className, colorClass, sizeClass],
  )

  const handleClick = useCallback(() => {
    onClick()
  }, [onClick])

  return (
    <button className={classNameProps} onClick={handleClick} {...props}>
      {text}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
