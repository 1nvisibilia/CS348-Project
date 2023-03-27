import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ResultTable from './ResultTable';

export default function Schedule({ user }) {
    const [result, setResult] = useState(null)

    const handleChange = useCallback((val) => {
        setResult(val)
    })

    useEffect(() => {
        const querySchedule = async () => {
            try {
                const scheduleResponse = await axios.get('/schedule', {
                    params: {
                        userId: user
                    }
                })
                setResult(scheduleResponse?.data)
            } catch (err) {
                console.log(err.response)
            }
        }

        querySchedule()
    }, [])

    const render = () => {
        if (result) return <ResultTable onChange={handleChange} user={user} queryResult={result} deleteEnabled={true} />
        return <div>You are not enrolled in any courses</div>
    }

    return render()
}