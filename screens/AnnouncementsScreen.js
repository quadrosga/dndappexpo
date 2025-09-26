import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { announcementService } from "../announcementService";
import { authService } from "../authService";

const AnnouncementsScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [userRole, setUserRole] = useState("player");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    important: false,
  });

  useEffect(() => {
    loadUserRole();
    initializeAnnouncements();
  }, []);

  const loadUserRole = async () => {
    try {
      const currentUser = await authService.getCurrentUserWithRole();
      if (currentUser && currentUser.role) {
        setUserRole(currentUser.role);
      }
    } catch (error) {
      console.error("Error loading user role:", error);
    }
  };

  const initializeAnnouncements = async () => {
    await announcementService.initializeDemoAnnouncements();
    loadAnnouncements();
  };

  const loadAnnouncements = async () => {
    try {
      const announcementsData = await announcementService.getAnnouncements();
      // Sort by date (newest first)
      const sortedAnnouncements = announcementsData.sort(
        (a, b) =>
          new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time)
      );
      setAnnouncements(sortedAnnouncements);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      Alert.alert("Erro", "Por favor, preencha título e conteúdo.");
      return;
    }

    try {
      const currentUser = await authService.getCurrentUserWithRole();
      const announcementToCreate = {
        ...newAnnouncement,
        author: currentUser ? currentUser.name : "Sistema",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const addedAnnouncement = await announcementService.addAnnouncement(
        announcementToCreate
      );
      if (addedAnnouncement) {
        Alert.alert("Sucesso", "Aviso criado com sucesso!");
        setShowCreateModal(false);
        setNewAnnouncement({ title: "", content: "", important: false });
        loadAnnouncements();
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o aviso.");
    }
  };

  const handleDeleteAnnouncement = (announcementId) => {
    Alert.alert("Excluir Aviso", "Tem certeza que deseja excluir este aviso?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const success = await announcementService.deleteAnnouncement(
              announcementId
            );
            if (success) {
              Alert.alert("Sucesso", "Aviso excluído com sucesso!");
              loadAnnouncements();
            }
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o aviso.");
          }
        },
      },
    ]);
  };

  const renderAnnouncementItem = ({ item }) => (
    <View
      style={[styles.announcementCard, item.important && styles.importantCard]}
    >
      {/* ADD DELETE BUTTON FOR DMs */}
      {userRole === "dm" && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAnnouncement(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="#ef4444" />
        </TouchableOpacity>
      )}

      {item.important && (
        <View style={styles.importantBadge}>
          <MaterialIcons name="priority-high" size={16} color="white" />
          <Text style={styles.importantText}>Importante</Text>
        </View>
      )}

      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text style={styles.announcementContent}>{item.content}</Text>

      <View style={styles.announcementFooter}>
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: "https://placehold.co/30x30/7c3aed/white?text=A" }}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>{item.author}</Text>
        </View>

        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            {new Date(item.date).toLocaleDateString("pt-BR")}
          </Text>
          <Text style={styles.timeText}>às {item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#7c3aed" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mural de Avisos</Text>

        {userRole === "dm" ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <MaterialIcons name="add" size={20} color="#7c3aed" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerRight} />
        )}
      </View>

      {/* Lista de Avisos */}
      <FlatList
        data={announcements}
        renderItem={renderAnnouncementItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ADD CREATE ANNOUNCEMENT MODAL */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Aviso</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Título do aviso"
              value={newAnnouncement.title}
              onChangeText={(text) =>
                setNewAnnouncement({ ...newAnnouncement, title: text })
              }
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Conteúdo do aviso"
              value={newAnnouncement.content}
              onChangeText={(text) =>
                setNewAnnouncement({ ...newAnnouncement, content: text })
              }
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={styles.importantToggle}
              onPress={() =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  important: !newAnnouncement.important,
                })
              }
            >
              <View style={styles.checkboxContainer}>
                <View
                  style={[
                    styles.checkbox,
                    newAnnouncement.important && styles.checkboxChecked,
                  ]}
                >
                  {newAnnouncement.important && (
                    <MaterialIcons name="check" size={14} color="white" />
                  )}
                </View>
                <Text style={styles.importantLabel}>
                  Marcar como importante
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  (!newAnnouncement.title || !newAnnouncement.content) &&
                    styles.createButtonDisabled,
                ]}
                onPress={handleCreateAnnouncement}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
              >
                <Text style={styles.createButtonText}>Criar Aviso</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer Navigation */}
      <View style={styles.footerNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
        >
          <MaterialIcons name="home" size={24} color="#666" />
          <Text style={styles.navButtonText}>Sessões</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButtonActive}>
          <MaterialIcons name="campaign" size={24} color="#7c3aed" />
          <Text style={styles.navButtonTextActive}>Avisos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <MaterialIcons name="settings" size={24} color="#666" />
          <Text style={styles.navButtonText}>Config</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  addButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  announcementCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  importantCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#7c3aed",
  },
  // ADD DELETE BUTTON STYLE
  deleteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  importantBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c3aed",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 6,
  },
  importantText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 16,
  },
  announcementFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  authorName: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  dateInfo: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  timeText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  // MODAL STYLES
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: "top",
  },
  importantToggle: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#7c3aed",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#7c3aed",
  },
  importantLabel: {
    fontSize: 16,
    color: "#374151",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#7c3aed",
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footerNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    padding: 8,
  },
  navButtonActive: {
    alignItems: "center",
    padding: 8,
  },
  navButtonText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  navButtonTextActive: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "600",
    marginTop: 4,
  },
});

export default AnnouncementsScreen;
