import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AnnouncementsScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([
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
      content: "A sessão de sábado será das 15h às 18h em vez das 14h às 17h.",
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
  ]);

  const renderAnnouncementItem = ({ item }) => (
    <View
      style={[styles.announcementCard, item.important && styles.importantCard]}
    >
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
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={20} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      {/* Lista de Avisos */}
      <FlatList
        data={announcements}
        renderItem={renderAnnouncementItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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

        <TouchableOpacity style={styles.navButton}>
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
