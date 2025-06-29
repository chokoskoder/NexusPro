import {useRef , useEffect } from 'react';
import {useVirtualizer} from '@tanstack/react-virtual';
import type { LogEntry } from '../types/interfaces';

export function useLogVirtualizer(logs : LogEntry[]){
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count : logs.length,
        getScrollElement : () => parentRef.current ,
        estimateSize : () => 40,
        overscan : 10,
    });

    useEffect(()=>{
        if(!parentRef.current) return;

        const scrollOffset = rowVirtualizer.scrollOffset;
        
        if(!scrollOffset) return;

        if (scrollOffset < 50) {
        rowVirtualizer.scrollToIndex(0, { align: 'start'});
        }
  }, [logs.length, rowVirtualizer]);

  return {
    parentRef,
    rowVirtualizer,
  };
}