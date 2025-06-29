import React from 'react';
import { LogRow } from './LogRow';
import { useLogVirtualizer } from '../hooks/useLogVirtualiser';
import type { LogEntry } from '../types/interfaces';

interface VirtualizedLogListProps {
  logs: LogEntry[];
}

export function VirtualizedLogList({ logs }: VirtualizedLogListProps) {
  const { parentRef, rowVirtualizer } = useLogVirtualizer(logs);
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const log = logs[virtualItem.index];
          const style: React.CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          };
          return <LogRow key={virtualItem.key} log={log} style={style} />;
        })}
      </div>
    </div>
  );
}