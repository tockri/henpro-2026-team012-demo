import './index.css'
import { Theme } from '@radix-ui/themes'
import { MainPage } from './MainPage'
import { PasswordGate } from './PasswordGate'

export const App: React.FC = () => {
  return (
    <Theme accentColor="blue" grayColor="slate">
      <PasswordGate>
        <MainPage />
      </PasswordGate>
    </Theme>
  )
}

export default App
