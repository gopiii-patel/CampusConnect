import React, {
  createContext,
  useState,
  useEffect,
} from "react";

import api from "../utils/api";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [token, setToken] =
    useState(() => {
      return (
        localStorage.getItem(
          "token"
        ) || null
      );
    });

  const [user, setUser] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "user"
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadUser =
      async () => {
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const res =
            await api.get(
              "/auth/me"
            );

          setUser(
            res.data.user
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              res.data.user
            )
          );
        } catch (error) {
          console.log(
            error
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    loadUser();
  }, [token]);

  // LOGIN
  const login = async (
    email,
    password
  ) => {
    setLoading(true);

    try {
      const res =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const {
        token:
          newToken,
        user: newUser,
      } = res.data;

      localStorage.setItem(
        "token",
        newToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          newUser
        )
      );

      setToken(
        newToken
      );

      setUser(
        newUser
      );

      return res.data;
    } catch (error) {
      const message =
        error?.response
          ?.data
          ?.message ||
        error?.message ||
        "Login failed";

      throw new Error(
        message
      );
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register =
    async (
      userData
    ) => {
      setLoading(true);

      try {
        const res =
          await api.post(
            "/auth/register",
            userData
          );

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.user
          )
        );

        setToken(
          res.data.token
        );

        setUser(
          res.data.user
        );

        return res.data;
      } catch (error) {
        const message =
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          "Registration failed";

        throw new Error(
          message
        );
      } finally {
        setLoading(false);
      }
    };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile =
    async (
      profileData
    ) => {
      setLoading(true);

      try {
        const res =
          await api.put(
            "/auth/profile",
            profileData
          );

        setUser(
          res.data.user
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.user
          )
        );

        return res.data;
      } catch (error) {
        const message =
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          "Profile update failed";

        throw new Error(
          message
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};