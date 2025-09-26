import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { sessionService } from "../sessionService";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadUserData();
    initializeSessions();
  }, []);

  const initializeSessions = async () => {
    await sessionService.initializeDemoSessions();
    loadSessions();
  };

  const loadUserData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("savedUsername");
      if (savedUsername) {
        setUserName(savedUsername);
      }
    } catch (error) {
      console.log("Erro ao carregar dados do usuário:", error);
    }
  };

  const loadSessions = async () => {
    try {
      const sessions = await sessionService.getSessions();
      const confirmations = await sessionService.getUserConfirmations();

      // Enhance sessions with confirmation data
      const sessionsWithConfirmations = sessions.map((session) => {
        const sessionConfirmations = Object.values(confirmations).filter(
          (conf) => conf.sessionId === session.id
        );
        const confirmedPlayers = sessionConfirmations.filter(
          (conf) => conf.status === "confirmed"
        ).length;

        return {
          ...session,
          confirmedPlayers,
          status: confirmedPlayers > 0 ? "confirmed" : "pending", // Simple logic for now
        };
      });

      setSessions(sessionsWithConfirmations);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => navigation.navigate("SessionDetails", { session: item })}
    >
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === "confirmed"
              ? styles.statusConfirmed
              : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === "confirmed" ? "Confirmada" : "Pendente"}
          </Text>
        </View>
      </View>

      <View style={styles.sessionInfo}>
        <View style={styles.infoRow}>
          <MaterialIcons name="calendar-month" size={16} color="#7c3aed" />
          <Text style={styles.infoText}>
            {new Date(item.date).toLocaleDateString("pt-BR")} às {item.time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={16} color="#7c3aed" />
          <Text style={styles.infoText}>Mestra: {item.dungeonMaster}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="groups" size={16} color="#7c3aed" />
          <Text style={styles.infoText}>
            {item.confirmedPlayers}/{item.totalPlayers} confirmadas
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="room" size={16} color="#7c3aed" />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${(item.confirmedPlayers / item.totalPlayers) * 100}%`,
              backgroundColor:
                item.confirmedPlayers === item.totalPlayers
                  ? "#10b981"
                  : "#7c3aed",
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://placehold.co/50x50/7c3aed/white?text=U" }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.welcomeText}>Olá, {userName}!</Text>
            <Text style={styles.subtitle}>Próximas sessões</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      {/* Lista de Sessões */}
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer Navigation */}
      <View style={styles.footerNav}>
        <TouchableOpacity style={styles.navButtonActive}>
          <MaterialIcons name="home" size={24} color="#7c3aed" />
          <Text style={styles.navButtonTextActive}>Sessões</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Announcements")}
        >
          <MaterialIcons name="campaign" size={24} color="#666" />
          <Text style={styles.navButtonText}>Avisos</Text>
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  notificationButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  sessionCard: {
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
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusConfirmed: {
    backgroundColor: "#dcfce7",
  },
  statusPending: {
    backgroundColor: "#ffedd5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
  },
  sessionInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
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

export default HomeScreen;
