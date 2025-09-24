// authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  // Usuários "hardcoded" para demonstração
  demoUsers: [
    { email: "ana@dnd.com", password: "senha123", name: "Ana (DM)" },
    { email: "carla@dnd.com", password: "senha123", name: "Carla" },
    { email: "beatriz@dnd.com", password: "senha123", name: "Beatriz" },
  ],

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
