"use client"

import { useState, useCallback } from 'react'

export function useVoiceControl(onResult: (transcript: string) => void) {
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Voice recognition is not supported in this browser.')
            return
        }

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            setIsListening(true)
            setError(null)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognition.onerror = (event: any) => {
            setError(event.error)
            setIsListening(false)
        }

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            onResult(transcript)
        }

        recognition.start()
    }, [onResult])

    return { isListening, error, startListening }
}
