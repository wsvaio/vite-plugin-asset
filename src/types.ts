export interface Options { paths: ResolvedPath[]; excludes: (string | RegExp)[] }

export interface ResolvedPath { rawpath: string; path: string }
