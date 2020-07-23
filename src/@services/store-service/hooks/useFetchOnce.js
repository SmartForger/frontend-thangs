import { useEffect } from 'react';
import { useStoreon } from 'storeon/react';

export default function (atomName) {
    const { dispatch, ...store } = useStoreon(atomName)

    useEffect(() => {
        const atom = store[atomName]
        if (atom && !atom.isLoaded) {
            dispatch(`fetch-${atomName}`)
        }
    }, [])

    return { dispatch, ...store }
}
