import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Child = {
  id: string;
  name: string;
  nfcId: string;
};

type AttendanceByDate = Record<string, string[]>; // date (YYYY-MM-DD) -> array of childIds present

type AttendanceContextValue = {
  children: Child[];
  attendanceByDate: AttendanceByDate;
  addChild: (name: string, nfcId?: string) => void;
  removeChild: (childId: string) => void;
  markPresentTodayByNfc: (nfcId: string) => { child?: Child; alreadyMarked: boolean };
  togglePresentToday: (childId: string) => void;
  getPresentIdsForDate: (date: string) => string[];
};

const AttendanceContext = createContext<AttendanceContextValue | undefined>(undefined);

const CHILDREN_KEY = "children";
const ATTENDANCE_KEY = "attendance";

function getTodayDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [childList, setChildList] = useState<Child[]>([]);
  const [attendanceByDate, setAttendanceByDate] = useState<AttendanceByDate>({});

  // Load persisted data
  useEffect(() => {
    (async () => {
      try {
        const [childrenJson, attendanceJson] = await Promise.all([
          AsyncStorage.getItem(CHILDREN_KEY),
          AsyncStorage.getItem(ATTENDANCE_KEY),
        ]);
        if (childrenJson) setChildList(JSON.parse(childrenJson));
        if (attendanceJson) setAttendanceByDate(JSON.parse(attendanceJson));
      } catch (e) {
        // ignore for now, keep in-memory state
      }
    })();
  }, []);

  // Persist changes
  useEffect(() => {
    AsyncStorage.setItem(CHILDREN_KEY, JSON.stringify(childList)).catch(() => {});
  }, [childList]);

  useEffect(() => {
    AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceByDate)).catch(() => {});
  }, [attendanceByDate]);

  const addChild = useCallback((name: string, nfcId: string = generateId("nfc")) => {
    setChildList(prev => {
      const newChild: Child = { id: generateId("child"), name, nfcId };
      return [...prev, newChild];
    });
  }, []);

  const removeChild = useCallback((childId: string) => {
    setChildList(prev => prev.filter(c => c.id !== childId));
    setAttendanceByDate(prev => {
      const copy: AttendanceByDate = { ...prev };
      for (const date of Object.keys(copy)) {
        copy[date] = copy[date].filter(id => id !== childId);
      }
      return copy;
    });
  }, []);

  const getPresentIdsForDate = useCallback((date: string) => {
    return attendanceByDate[date] ?? [];
  }, [attendanceByDate]);

  const togglePresentToday = useCallback((childId: string) => {
    const today = getTodayDateString();
    setAttendanceByDate(prev => {
      const present = new Set(prev[today] ?? []);
      if (present.has(childId)) present.delete(childId);
      else present.add(childId);
      return { ...prev, [today]: Array.from(present) };
    });
  }, []);

  const markPresentTodayByNfc = useCallback((nfcId: string) => {
    const child = childList.find(c => c.nfcId.trim().toLowerCase() === nfcId.trim().toLowerCase());
    if (!child) return { child: undefined, alreadyMarked: false };
    const today = getTodayDateString();
    let alreadyMarked = false;
    setAttendanceByDate(prev => {
      const present = new Set(prev[today] ?? []);
      alreadyMarked = present.has(child.id);
      present.add(child.id);
      return { ...prev, [today]: Array.from(present) };
    });
    return { child, alreadyMarked };
  }, [childList]);

  const value: AttendanceContextValue = useMemo(() => ({
    children: childList,
    attendanceByDate,
    addChild,
    removeChild,
    markPresentTodayByNfc,
    togglePresentToday,
    getPresentIdsForDate,
  }), [childList, attendanceByDate, addChild, removeChild, markPresentTodayByNfc, togglePresentToday, getPresentIdsForDate]);

  return (
    <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>
  );
};

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used within AttendanceProvider");
  return ctx;
}


