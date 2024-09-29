import Navbar from '@/app/Navbar'
import { ReactNode } from 'react'


interface Props {
    children: ReactNode
}

const CategriesLayout = ({children}:Props) => {
  return (
    <div>
      <Navbar />
      <main className="mt-12 container mx-auto px-5 md:px-4 md:max-w-7xl">
        {children}
      </main>
    </div>
  );
}

export default CategriesLayout