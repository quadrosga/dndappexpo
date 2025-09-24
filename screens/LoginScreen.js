import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      // Simulação de login
      if (rememberMe) {
        await AsyncStorage.setItem("savedUsername", username);
      } else {
        await AsyncStorage.removeItem("savedUsername");
      }

      //
      // Por enquanto, vou simular um login bem-sucedido
      alert(`Bem-vinda, ${username}! Login realizado com sucesso.`);
      navigation.navigate("Home"); // Navega para a tela principal
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  // Carrega usuário salvo ao iniciar
  React.useEffect(() => {
    const loadSavedUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("savedUsername");
        if (savedUsername) {
          setUsername(savedUsername);
          setRememberMe(true);
        }
      } catch (error) {
        console.log("Erro ao carregar usuário salvo:", error);
      }
    };

    loadSavedUsername();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Header com Logo */}
          <View style={styles.header}>
            <MaterialIcons
              name="castle"
              size={60}
              color="#7c3aed"
              style={styles.icon}
            />
            <Text style={styles.title}>DnD Group</Text>
            <Text style={styles.subtitle}>
              Faça login para gerenciar suas sessões
            </Text>
          </View>

          {/* Formulário de Login */}
          <View style={styles.form}>
            {/* Campo Usuário */}
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="login"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nome de usuária"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Lembrar de mim e Esqueci a senha */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberMe}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <MaterialIcons name="check" size={12} color="white" />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Lembrar de mim</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Esqueci a senha</Text>
              </TouchableOpacity>
            </View>

            {/* Botão de Login */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!username || !password) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!username || !password}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Social (Opcional para D&D) */}
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="mail-outline" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="discord" size={20} color="#5865F2" />
                <Text style={styles.socialButtonText}>Discord</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Rodapé com link para cadastro */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7c3aed",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMe: {
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
  rememberMeText: {
    color: "#666",
    fontSize: 14,
  },
  forgotPassword: {
    color: "#7c3aed",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#7c3aed",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  socialButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: "#666",
  },
  footerLink: {
    color: "#7c3aed",
    fontWeight: "bold",
  },
});

export default LoginScreen;
