import AsyncStorage from "@react-native-async-storage/async-storage";

export const announcementService = {
  // Key for storing announcements in AsyncStorage
  ANNOUNCEMENTS_KEY: "@dndapp_announcements",

  // Get all announcements
  async getAnnouncements() {
    try {
      const announcementsJson = await AsyncStorage.getItem(
        this.ANNOUNCEMENTS_KEY
      );
      return announcementsJson ? JSON.parse(announcementsJson) : [];
    } catch (error) {
      console.error("Error getting announcements:", error);
      return [];
    }
  },

  // Save all announcements
  async saveAnnouncements(announcements) {
    try {
      await AsyncStorage.setItem(
        this.ANNOUNCEMENTS_KEY,
        JSON.stringify(announcements)
      );
    } catch (error) {
      console.error("Error saving announcements:", error);
    }
  },

  // Add a new announcement
  async addAnnouncement(announcement) {
    try {
      const announcements = await this.getAnnouncements();
      const newAnnouncement = {
        ...announcement,
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString(),
      };
      announcements.unshift(newAnnouncement); // Add to beginning of array
      await this.saveAnnouncements(announcements);
      return newAnnouncement;
    } catch (error) {
      console.error("Error adding announcement:", error);
      return null;
    }
  },

  // Delete an announcement
  async deleteAnnouncement(announcementId) {
    try {
      const announcements = await this.getAnnouncements();
      const filteredAnnouncements = announcements.filter(
        (ann) => ann.id !== announcementId
      );
      await this.saveAnnouncements(filteredAnnouncements);
      return true;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      return false;
    }
  },

  // Initialize with demo data if no announcements exist
  async initializeDemoAnnouncements() {
    const existingAnnouncements = await this.getAnnouncements();
    if (existingAnnouncements.length === 0) {
      const demoAnnouncements = [
        {
          id: "1",
          title: "Nova Campanha Iniciando!",
          content:
            "Estamos começando uma nova campanha na próxima semana. Todas as jogadoras estão convidadas!",
          author: "Ana (DM)",
          date: "2024-06-10",
          time: "14:30",
          important: true,
        },
        {
          id: "2",
          title: "Mudança de Horário",
          content:
            "A sessão de sábado será das 15h às 18h em vez das 14h às 17h.",
          author: "Carla",
          date: "2024-06-08",
          time: "09:15",
          important: false,
        },
        {
          id: "3",
          title: "Material para Próxima Sessão",
          content:
            "Por favor, leiam o capítulo 3 do livro de regras antes da próxima sessão.",
          author: "Beatriz (DM)",
          date: "2024-06-05",
          time: "19:45",
          important: true,
        },
      ];
      await this.saveAnnouncements(demoAnnouncements);
    }
  },
};
