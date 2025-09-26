// authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  // Usuários "hardcoded" para demonstração
  demoUsers: [
    {
      email: "ana@dnd.com",
      password: "senha123",
      name: "Ana (DM)",
      role: "dm", // Add DM role field
    },
    {
      email: "carla@dnd.com",
      password: "senha123",
      name: "Carla",
      role: "player",
    },
    {
      email: "beatriz@dnd.com",
      password: "senha123",
      name: "Beatriz",
      role: "player",
    },
  ],

  // To get current user with role
  async getCurrentUserWithRole() {
    const user = await this.getCurrentUser();
    if (user) {
      // Find the user in demoUsers to get their role
      const userWithRole = this.demoUsers.find((u) => u.email === user.email);
      return userWithRole ? { ...user, role: userWithRole.role } : null;
    }
    return null;
  },

  async login(email, password) {
    const user = this.demoUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    throw new Error("Email ou senha inválidos");
  },

  async logout() {
    await AsyncStorage.removeItem("user");
  },

  async getCurrentUser() {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
