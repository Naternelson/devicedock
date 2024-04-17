import { useEffect, useRef, useState } from "react"

export const useOnMount = <T extends HTMLElement> (callback: (element: T) => void) => {
    const ref = useRef<T>(null)
    const [node, setNode] = useState<T | null>(null)
    useEffect(() => {
        if(node) callback(node)
    }, [node])
    return (node: T) => {
        setNode(node)
        return ref
    }
}