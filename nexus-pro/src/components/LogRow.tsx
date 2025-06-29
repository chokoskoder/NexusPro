import React from "react";
import type {LogEntry} from "../types/interfaces";

interface LogRowProps{
    log : LogEntry;
    style : React.CSSProperties
}

export const LogRow = React.memo(({log , style} : LogRowProps) => {
    return (
        <div style = {style}>
            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span>{log.level.toUpperCase()}</span>
            <span>{log.message}</span>
        </div>
    );
});

