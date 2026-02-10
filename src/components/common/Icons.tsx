/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'

export const Icon = ({
  iconName = 'DollarSign',
  ...props
}: {
  iconName: string
  [key: string]: any
}) => {
  console.log({ iconName })
  const IconCmp = (Icons as any)[iconName] as LucideIcon
  return <IconCmp {...props} />
}
