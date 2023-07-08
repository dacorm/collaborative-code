import { EnterName, RealTimeEditor } from "@/features";
import { useStore } from "@/shared";
import './styles/dark.css';

const App = () => {
    const username = useStore(({ username }) => username)

    return <div className="app_dark_theme">{username ? <RealTimeEditor /> : <EnterName />}</div>
}

export default App