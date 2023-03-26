import { useState, useEffect } from 'react';
import axios from 'axios';
import ResultTable from './ResultTable';

export default function Schedule({ user }) {
    const [result, setResult] = useState(null)

    useEffect(() => {
        const querySchedule = async () => {
            try {
                    const scheduleResponse = await axios.get('/schedule', {
                    params: {
                        userId: '10000000'
                    }
                })
                setResult(scheduleResponse?.data)
            } catch (err) {
                console.log(err.response)
            }
        }

        querySchedule()
    }, [result])

    const render = () => {
        if (result) return <ResultTable user={user} queryResult={result} actionsEnabled={false} />
        return <div>You are not enrolled in any courses</div>
    }

    return render()
}