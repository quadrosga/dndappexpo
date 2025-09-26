import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { sessionService } from "../sessionService";

const SessionDetailsScreen = ({ navigation, route }) => {
  const { session } = route.params;
  const [userStatus, setUserStatus] = useState(null);

  const handleConfirmation = async (status) => {
    try {
      const success = await sessionService.confirmSession(
        session.id,
        userName,
        status
      );
      if (success) {
        setUserStatus(status);
        Alert.alert(
          status === "confirmed" ? "Presença Confirmada!" : "Presença Negada",
          status === "confirmed"
            ? "Você confirmou presença na sessão!"
            : "Você informou que não poderá comparecer.",
          [{ text: "OK" }]
        );
        // Optional: Refresh data or navigate back
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível confirmar sua presença.");
    }
  };

  const getPlayersList = () => {
    const confirmedPlayers = ["Ana", "Carla", "Beatriz"].slice(
      0,
      session.confirmedPlayers
    );
    const pendingPlayers = ["Diana", "Elena", "Fernanda"].slice(
      0,
      session.totalPlayers - session.confirmedPlayers
    );

    return { confirmedPlayers, pendingPlayers };
  };

  const { confirmedPlayers, pendingPlayers } = getPlayersList();

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
        <Text style={styles.headerTitle}>Detalhes da Sessão</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card Principal */}
        <View style={styles.mainCard}>
          <Text style={styles.sessionTitle}>{session.title}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialIcons name="calendar-month" size={20} color="#7c3aed" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Data e Hora</Text>
                <Text style={styles.infoValue}>
                  {new Date(session.date).toLocaleDateString("pt-BR")} às{" "}
                  {session.time}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={20} color="#7c3aed" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Dungeon Master</Text>
                <Text style={styles.infoValue}>{session.dungeonMaster}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="room" size={20} color="#7c3aed" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Local</Text>
                <Text style={styles.infoValue}>{session.location}</Text>
              </View>
            </View>
          </View>

          {/* Status da Confirmação */}
          <View style={styles.confirmationStatus}>
            <Text style={styles.statusLabel}>Seu status:</Text>
            <Text
              style={[
                styles.statusValue,
                userStatus === "confirmed" && styles.statusConfirmed,
                userStatus === "denied" && styles.statusDenied,
              ]}
            >
              {userStatus === "confirmed"
                ? "Confirmada"
                : userStatus === "denied"
                ? "Não posso ir"
                : "Não respondido"}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleConfirmation("confirmed")}
          >
            <MaterialIcons name="check" size={20} color="white" />
            <Text style={styles.actionButtonText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.denyButton]}
            onPress={() => handleConfirmation("denied")}
          >
            <MaterialIcons name="close" size={20} color="white" />
            <Text style={styles.actionButtonText}>Não Posso Ir</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Jogadoras */}
        <View style={styles.playersCard}>
          <Text style={styles.sectionTitle}>
            Jogadoras Confirmadas ({session.confirmedPlayers})
          </Text>
          {confirmedPlayers.map((player, index) => (
            <View key={index} style={styles.playerItem}>
              <MaterialIcons
                name="check-circle-outline"
                size={20}
                color="#10b981"
              />
              <Text style={styles.playerName}>{player}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Pendentes ({session.totalPlayers - session.confirmedPlayers})
          </Text>
          {pendingPlayers.map((player, index) => (
            <View key={index} style={styles.playerItem}>
              <MaterialIcons name="schedule" size={20} color="#f59e0b" />
              <Text style={styles.playerName}>{player}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  headerRight: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 24,
    textAlign: "center",
  },
  infoSection: {
    gap: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  confirmationStatus: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    gap: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: "#64748b",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#64748b",
  },
  statusConfirmed: {
    color: "#10b981",
  },
  statusDenied: {
    color: "#ef4444",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmButton: {
    backgroundColor: "#10b981",
  },
  denyButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  playersCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  playerName: {
    fontSize: 16,
    color: "#374151",
  },
});

export default SessionDetailsScreen;
