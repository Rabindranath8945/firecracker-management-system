"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import UserService from "../services/user.service";

import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  User,
} from "../types/user.types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await UserService.getEmployees();

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const stats = useMemo(() => {
    return {
      total: users.length,

      active: users.filter((user) => user.status === "ACTIVE").length,

      inactive: users.filter((user) => user.status === "INACTIVE").length,

      suspended: users.filter((user) => user.status === "SUSPENDED").length,

      managers: users.filter((user) => user.role === "MANAGER").length,

      cashiers: users.filter((user) => user.role === "CASHIER").length,

      inventory: users.filter((user) => user.role === "INVENTORY").length,
    };
  }, [users]);

  const createUser = useCallback(async (data: CreateEmployeeInput) => {
    const user = await UserService.createEmployee(data);

    setUsers((current) => [user, ...current]);

    return user;
  }, []);

  const updateUser = useCallback(
    async (id: string, data: UpdateEmployeeInput) => {
      const user = await UserService.updateEmployee(id, data);

      setUsers((current) =>
        current.map((item) => (item.id === id ? user : item)),
      );

      return user;
    },
    [],
  );

  const toggleStatus = useCallback(async (id: string) => {
    const user = await UserService.toggleEmployeeStatus(id);

    setUsers((current) =>
      current.map((item) => (item.id === id ? user : item)),
    );

    return user;
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    const user = await UserService.deleteEmployee(id);

    setUsers((current) =>
      current.map((item) => (item.id === id ? user : item)),
    );

    return user;
  }, []);

  return {
    users,
    stats,
    loading,
    error,
    refresh: loadUsers,
    createUser,
    updateUser,
    toggleStatus,
    deleteUser,
  };
}
