// Real-time hook for backend events
import { useEffect, useState } from 'react';
import { backendAPI, RealtimeEvent } from '@/services/backendAPI';

export function useRealtime(eventTypes: string[] = []) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const eventHandlers: { [key: string]: Function } = {};

    // Set up event listeners
    eventTypes.forEach(eventType => {
      const handler = (event: RealtimeEvent) => {
        setEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
      };
      
      eventHandlers[eventType] = handler;
      backendAPI.addEventListener(eventType, handler);
    });

    // Cleanup
    return () => {
      Object.entries(eventHandlers).forEach(([eventType, handler]) => {
        backendAPI.removeEventListener(eventType, handler);
      });
    };
  }, [eventTypes]);

  const clearEvents = () => setEvents([]);

  return {
    events,
    isConnected,
    clearEvents
  };
}

export function useRealtimePatterns() {
  return useRealtime(['pattern_added', 'pattern_updated']);
}

export function useRealtimeAlerts() {
  return useRealtime(['alert_triggered', 'scan_completed']);
}