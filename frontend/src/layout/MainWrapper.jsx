import { useEffect, useState } from "react";
import { setUser } from "../utils/auth";


const MainWrapper = ({childern}) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handler = async () {
            setLoading(true)
            await setUser()
            setLoading(false)
        }        
        handler()
    }, [])
    return <>{loading ? null : childern}</>
}

export default MainWrapper
