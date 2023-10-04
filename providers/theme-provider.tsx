'use client'

import { FC, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
    children: ReactNode
}

const MyThemeProvider: FC<ProvidersProps> = ({ children }) => {
    return <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
    </ThemeProvider>
}

export default MyThemeProvider