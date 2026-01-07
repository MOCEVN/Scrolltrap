'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseMindfulBreakOptions = {
  enabled: boolean;
  thresholdMs: number;
  breakDurationMs: number;
};

type UseMindfulBreakResult = {
  timeUntilBreak: number | null;
  showBreakPoint: boolean;
  imagesViewedInSession: number;
  isOnBreak: boolean;
  breakTimeRemaining: number | null;
  breakCompleted: boolean;
  resetCooldown: () => void;
  setSessionCount: (count: number) => void;
  addToSessionCount: (count: number) => void;
  continueFeed: () => void;
  takeBreak: () => void;
  resumeFromBreak: () => void;
};

export const useMindfulBreak = ({
  enabled,
  thresholdMs,
  breakDurationMs,
}: UseMindfulBreakOptions): UseMindfulBreakResult => {
  const [timeUntilBreak, setTimeUntilBreak] = useState<number | null>(null);
  const [showBreakPoint, setShowBreakPoint] = useState(false);
  const [imagesViewedInSession, setImagesViewedInSession] = useState(0);

  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] =
    useState<number | null>(null);
  const [breakCompleted, setBreakCompleted] = useState(false);

  const countdownIntervalRef = useRef<number | null>(null);
  const breakIntervalRef = useRef<number | null>(null);
  const initTimeoutRef = useRef<number | null>(null);

  const lastResetAtRef = useRef<number>(0);
  const sessionCountRef = useRef<number>(0);
  const breakEndsAtRef = useRef<number | null>(null);

  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const stopBreakTimer = useCallback(() => {
    if (breakIntervalRef.current !== null) {
      window.clearInterval(breakIntervalRef.current);
      breakIntervalRef.current = null;
    }
    breakEndsAtRef.current = null;
  }, []);

  const stopInitTimeout = useCallback(() => {
    if (initTimeoutRef.current !== null) {
      window.clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
  }, []);

  const updateTimeRemaining = useCallback(() => {
    if (!enabled) {
      return;
    }

    if (lastResetAtRef.current === 0) {
      lastResetAtRef.current = Date.now();
    }

    const elapsed = Date.now() - lastResetAtRef.current;
    const remaining = Math.max(thresholdMs - elapsed, 0);

    if (remaining === 0) {
      stopCountdown();
      setTimeUntilBreak(null);

      if (!showBreakPoint) {
        setImagesViewedInSession(sessionCountRef.current);
        setShowBreakPoint(true);
      }

      return;
    }

    setTimeUntilBreak(remaining);
  }, [enabled, showBreakPoint, stopCountdown, thresholdMs]);

  const startCountdown = useCallback(() => {
    stopCountdown();
    updateTimeRemaining();

    countdownIntervalRef.current = window.setInterval(() => {
      updateTimeRemaining();
    }, 500);
  }, [stopCountdown, updateTimeRemaining]);

  const updateBreakRemaining = useCallback(() => {
    if (breakEndsAtRef.current === null) {
      setBreakTimeRemaining(null);
      return;
    }

    const remaining = breakEndsAtRef.current - Date.now();
    if (remaining <= 0) {
      stopBreakTimer();
      setBreakTimeRemaining(0);
      setBreakCompleted(true);
      return;
    }

    setBreakTimeRemaining(remaining);
  }, [stopBreakTimer]);

  const startBreakTimer = useCallback(() => {
    stopBreakTimer();
    setBreakCompleted(false);

    const endsAt = Date.now() + breakDurationMs;
    breakEndsAtRef.current = endsAt;
    setBreakTimeRemaining(breakDurationMs);

    updateBreakRemaining();
    breakIntervalRef.current = window.setInterval(() => {
      updateBreakRemaining();
    }, 500);
  }, [breakDurationMs, stopBreakTimer, updateBreakRemaining]);

  const resetCooldown = useCallback(() => {
    if (!enabled) {
      return;
    }

    lastResetAtRef.current = Date.now();
    sessionCountRef.current = 0;
    setImagesViewedInSession(0);
    setShowBreakPoint(false);
    setIsOnBreak(false);
    setBreakCompleted(false);
    setBreakTimeRemaining(null);
    setTimeUntilBreak(thresholdMs);

    startCountdown();
  }, [enabled, startCountdown, thresholdMs]);

  const setSessionCount = useCallback((count: number) => {
    sessionCountRef.current = Math.max(0, count);
  }, []);

  const addToSessionCount = useCallback((count: number) => {
    sessionCountRef.current += Math.max(0, count);
  }, []);

  const continueFeed = useCallback(() => {
    resetCooldown();
  }, [resetCooldown]);

  const takeBreak = useCallback(() => {
    if (!enabled) {
      return;
    }

    stopCountdown();
    setTimeUntilBreak(null);
    setShowBreakPoint(false);
    setImagesViewedInSession(0);

    lastResetAtRef.current = Date.now();
    sessionCountRef.current = 0;

    setIsOnBreak(true);
    startBreakTimer();
  }, [enabled, startBreakTimer, stopCountdown]);

  const resumeFromBreak = useCallback(() => {
    stopBreakTimer();
    setBreakTimeRemaining(null);
    setBreakCompleted(false);
    setIsOnBreak(false);
    resetCooldown();
  }, [resetCooldown, stopBreakTimer]);

  const prevEnabledRef = useRef(enabled);
  useEffect(() => {
    const prevEnabled = prevEnabledRef.current;
    prevEnabledRef.current = enabled;

    if (!enabled) {
      stopInitTimeout();
      stopCountdown();
      stopBreakTimer();
      lastResetAtRef.current = 0;
      sessionCountRef.current = 0;
      return;
    }

    if (!prevEnabled && enabled) {
      stopInitTimeout();
      initTimeoutRef.current = window.setTimeout(() => {
        resetCooldown();
      }, 0);
    }
  }, [enabled, resetCooldown, stopBreakTimer, stopCountdown, stopInitTimeout]);

  useEffect(() => {
    return () => {
      stopInitTimeout();
      stopCountdown();
      stopBreakTimer();
    };
  }, [stopBreakTimer, stopCountdown, stopInitTimeout]);

  return useMemo(
    () => ({
      timeUntilBreak: enabled ? timeUntilBreak : null,
      showBreakPoint: enabled ? showBreakPoint : false,
      imagesViewedInSession: enabled ? imagesViewedInSession : 0,
      isOnBreak: enabled ? isOnBreak : false,
      breakTimeRemaining: enabled ? breakTimeRemaining : null,
      breakCompleted: enabled ? breakCompleted : false,
      resetCooldown,
      setSessionCount,
      addToSessionCount,
      continueFeed,
      takeBreak,
      resumeFromBreak,
    }),
    [
      addToSessionCount,
      breakCompleted,
      breakTimeRemaining,
      continueFeed,
      enabled,
      imagesViewedInSession,
      isOnBreak,
      resetCooldown,
      setSessionCount,
      showBreakPoint,
      takeBreak,
      timeUntilBreak,
      resumeFromBreak,
    ],
  );
};
