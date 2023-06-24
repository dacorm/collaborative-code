import { RealTimeEditor } from "@/entities";
import { EnterName } from "@/features";
import {useStore} from "@/shared";

const App = () => {
    const username = useStore(({ username }) => username)

    return <>{username ? <RealTimeEditor /> : <EnterName />}</>
}

export default App