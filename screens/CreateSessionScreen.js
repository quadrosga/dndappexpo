// screens/CreateSessionScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { sessionService } from "../sessionService";
import { authService } from "../authService";

const CreateSessionScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("");
  const [totalPlayers, setTotalPlayers] = useState("4");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDM, setIsDM] = useState(false); // Protect session creating from non-DM users

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const currentUser = await authService.getCurrentUserWithRole();
      if (currentUser && currentUser.role !== "dm") {
        Alert.alert("Acesso Negado", "Apenas DMs podem criar sessões.");
        navigation.goBack();
      } else {
        setIsDM(true);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      navigation.goBack();
    }
  };

  if (!isDM) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Verificando permissões...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleCreateSession = async () => {
    if (!title || !location) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newSession = {
      title,
      date: date.toISOString().split("T")[0],
      time: time.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      location,
      totalPlayers: parseInt(totalPlayers),
      dungeonMaster: "Ana (DM)", // This should come from user data
      confirmedPlayers: 0,
      status: "pending",
    };

    try {
      const success = await sessionService.addSession(newSession);
      if (success) {
        Alert.alert("Sucesso!", "Sessão criada com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a sessão.");
    }
  };

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
        <Text style={styles.headerTitle}>Nova Sessão</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Form */}
        <View style={styles.form}>
          {/* Título */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título da Sessão *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Sessão da Campanha Principal"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Data e Hora */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Data *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {date.toLocaleDateString("pt-BR")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Hora *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateText}>
                  {time.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Local */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Local *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Discord, Roll20, Presencial..."
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Número de Jogadoras */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Vagas</Text>
            <TextInput
              style={styles.input}
              placeholder="4"
              value={totalPlayers}
              onChangeText={setTotalPlayers}
              keyboardType="numeric"
            />
          </View>

          {/* Date Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* Botão Criar */}
        <TouchableOpacity
          style={[
            styles.createButton,
            (!title || !location) && styles.createButtonDisabled,
          ]}
          onPress={handleCreateSession}
          disabled={!title || !location}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Criar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    flexGrow: 1,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  dateText: {
    fontSize: 16,
    color: "#374151",
  },
  row: {
    flexDirection: "row",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7c3aed",
    padding: 18,
    borderRadius: 12,
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateSessionScreen;
