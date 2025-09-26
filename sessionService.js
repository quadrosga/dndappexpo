// sessionService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const sessionService = {
  // Key for storing sessions in AsyncStorage
  SESSIONS_KEY: "@dndapp_sessions",
  CONFIRMATIONS_KEY: "@dndapp_confirmations",

  // Get all sessions
  async getSessions() {
    try {
      const sessionsJson = await AsyncStorage.getItem(this.SESSIONS_KEY);
      return sessionsJson ? JSON.parse(sessionsJson) : [];
    } catch (error) {
      console.error("Error getting sessions:", error);
      return [];
    }
  },

  // Save all sessions
  async saveSessions(sessions) {
    try {
      await AsyncStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving sessions:", error);
    }
  },

  // Get user confirmations
  async getUserConfirmations() {
    try {
      const confirmationsJson = await AsyncStorage.getItem(
        this.CONFIRMATIONS_KEY
      );
      return confirmationsJson ? JSON.parse(confirmationsJson) : {};
    } catch (error) {
      console.error("Error getting confirmations:", error);
      return {};
    }
  },

  // Save user confirmation for a session
  async confirmSession(sessionId, userName, status) {
    try {
      const confirmations = await this.getUserConfirmations();
      confirmations[sessionId] = {
        userName,
        status,
        confirmedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        this.CONFIRMATIONS_KEY,
        JSON.stringify(confirmations)
      );
      return true;
    } catch (error) {
      console.error("Error confirming session:", error);
      return false;
    }
  },

  // Initialize with demo data if no sessions exist
  async initializeDemoSessions() {
    const existingSessions = await this.getSessions();
    console.log("Existing sessions:", existingSessions);

    if (existingSessions.length === 0) {
      const demoSessions = [
        {
          id: "1",
          title: "Sessão da Campanha Principal",
          date: "2024-06-15",
          time: "19:00",
          dungeonMaster: "Ana",
          totalPlayers: 5,
          location: "Discord - Sala Dragões",
        },
        {
          id: "2",
          title: "One-shot: A Masmorra Esquecida",
          date: "2024-06-22",
          time: "14:00",
          dungeonMaster: "Carla",
          status: "confirmed",
          confirmedPlayers: 4,
          totalPlayers: 4,
          location: "Roll20",
        },
        {
          id: "3",
          title: "Sessão de Continuação",
          date: "2024-06-29",
          time: "20:00",
          dungeonMaster: "Beatriz",
          status: "pending",
          confirmedPlayers: 2,
          totalPlayers: 6,
          location: "Discord - Sala Principal",
        },
      ];
      await this.saveSessions(demoSessions);
    }
  },
};
