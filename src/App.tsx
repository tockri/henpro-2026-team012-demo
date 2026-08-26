import './index.css'
import { Theme } from '@radix-ui/themes'
import { MainPage } from './MainPage'

export const App: React.FC = () => {
  return (
    <Theme accentColor="blue" grayColor="slate">
      <MainPage />
    </Theme>
  )
}

export default App
