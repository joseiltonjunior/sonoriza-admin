import { Error } from '@/pages/Error'
import { Home } from '@/pages/Home'
import { SignIn } from '@/pages/SignIn'
import { Route, Routes } from 'react-router-dom'
import { Checkout } from '@/pages/Checkout'

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}
