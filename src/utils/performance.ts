import { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * ✅ Performance Utilities for React Components
 * These utilities help optimize component rendering and prevent unnecessary re-renders
 */

// Deep comparison function for complex objects
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (typeof a !== typeof b) return false;
  
  if (typeof a !== 'object') return a === b;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * Deep memoization hook for complex objects
 * Use this when useMemo's shallow comparison isn't sufficient
 */
export function useDeepMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<{ deps: any[]; value: T }>();
  
  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory()
    };
  }
  
  return ref.current.value;
}

/**
 * Memoized callback with deep comparison
 * Use when callback dependencies are complex objects
 */
export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T {
  return useDeepMemo(() => callback, deps) as T;
}

/**
 * Previous value hook - useful for preventing unnecessary effects
 * Returns the previous value of a state or prop
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

/**
 * Performance monitoring hook
 * Logs render times for components (development only)
 */
export function useRenderMonitor(componentName: string, enabled = process.env.NODE_ENV === 'development') {
  const renderStart = useRef<number>();
  const renderCount = useRef(0);
  
  if (enabled) {
    // Mark render start
    renderStart.current = performance.now();
    renderCount.current += 1;
  }
  
  useEffect(() => {
    if (enabled && renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      console.log(`🎯 ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }
  });
}

/**
 * Throttled state hook
 * Prevents state updates from happening too frequently
 */
export function useThrottledState<T>(
  initialValue: T,
  delay: number
): [T, (value: T) => void] {
  const [state, setState] = React.useState(initialValue);
  const lastUpdate = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const throttledSetState = useCallback((newValue: T) => {
    const now = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (now - lastUpdate.current >= delay) {
      setState(newValue);
      lastUpdate.current = now;
    } else {
      timeoutRef.current = setTimeout(() => {
        setState(newValue);
        lastUpdate.current = Date.now();
      }, delay - (now - lastUpdate.current));
    }
  }, [delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return [state, throttledSetState];
}

/**
 * Memoized async function hook
 * Prevents async functions from being recreated on every render
 */
export function useMemoizedAsync<TArgs extends any[], TReturn>(
  asyncFn: (...args: TArgs) => Promise<TReturn>,
  deps: React.DependencyList
) {
  return useCallback(asyncFn, deps);
}

/**
 * Intersection Observer hook for lazy loading
 * Returns whether an element is visible
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
}

/**
 * Batched updates hook
 * Batches multiple state updates into a single render
 */
export function useBatchedUpdates() {
  const updates = useRef<(() => void)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const batchUpdate = useCallback((updateFn: () => void) => {
    updates.current.push(updateFn);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      updates.current.forEach(fn => fn());
      updates.current = [];
    }, 0);
  }, []);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return batchUpdate;
}

/**
 * Component display name helper
 * Helps with debugging by setting proper display names
 */
export function withDisplayName<T extends React.ComponentType<any>>(
  Component: T,
  displayName: string
): T {
  Component.displayName = displayName;
  return Component;
}

/**
 * Performance measurement utilities
 */
export const performance_utils = {
  /**
   * Measure and log execution time of a function
   */
  measureTime: <T extends (...args: any[]) => any>(
    fn: T,
    label: string
  ): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      console.log(`⚡ ${label}: ${(end - start).toFixed(2)}ms`);
      return result;
    }) as T;
  },
  
  /**
   * Measure async function execution time
   */
  measureAsyncTime: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    label: string
  ): T => {
    return (async (...args: Parameters<T>) => {
      const start = performance.now();
      const result = await fn(...args);
      const end = performance.now();
      console.log(`⚡ ${label}: ${(end - start).toFixed(2)}ms`);
      return result;
    }) as T;
  }
};

// Import React at the top level for hooks
import React from 'react'; 