"use client";

import { useCallback, useEffect, useState } from "react";
import { getKycRecords, getKycRecordById } from "../services/kycService";

export function useKycRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getKycRecords();
      setRecords(Array.isArray(data) ? data : data?.content ?? data?.data ?? []);
    } catch (err) {
      setError(err.message || "Unable to load KYC records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return { records, loading, error, reload: loadRecords };
}

export function useKycRecord(id) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function loadRecord() {
      try {
        setLoading(true);
        setError("");
        const data = await getKycRecordById(id);
        if (active) setRecord(data);
      } catch (err) {
        if (active) setError(err.message || "Unable to load KYC details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecord();
    return () => { active = false; };
  }, [id]);

  return { record, loading, error };
}