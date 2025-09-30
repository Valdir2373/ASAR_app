import { config } from "dotenv";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CopyModal from "./components/CopyModal";

config();

export default function Index() {
  const key = process.env.KEY;
  if (!key) throw new Error("KEY NOT FOUND");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [response, setResponse] = useState(false);
  const [action, setAction] = useState("ia");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input1.trim() || !input2.trim()) {
      Alert.alert("Atenção", "Por favor, preencha ambos os campos.");
      return;
    }

    const payload = {
      message: {
        action,
        message: input1,
        response,
      },
      key,
      name: input2,
    };

    setLoading(true);
    try {
      const responseApi = await fetch("https://asbv.onrender.com/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawResult = await responseApi.text();

      if (responseApi.ok) {
        if (!response) {
          Alert.alert("✅ Sucesso!", "Sua mensagem foi enviada com sucesso.", [
            {
              text: "OK",
              onPress: () => {
                setInput1("");
              },
            },
          ]);
        }

        console.log(response);

        if (response) {
          const result = JSON.parse(rawResult);
          const contentToCopy = result.message || "Conteúdo não encontrado.";

          setModalContent(contentToCopy);

          setModalVisible(true);
        }
      } else {
        let errorMessage = rawResult;
        try {
          const errorJson = JSON.parse(rawResult);
          errorMessage = errorJson.message || rawResult;
        } catch (e) {}

        throw new Error(errorMessage || "Erro desconhecido no servidor");
      }
    } catch (error: any) {
      Alert.alert("❌ Erro", `Não foi possível enviar: ${error.message}`, [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://asbv.onrender.com/clear-machines", {
        method: "GET",
        headers: {
          key,
        },
      });
      if (response.ok) {
        Alert.alert("✅ Sucesso", "Máquinas limpas com sucesso!");
      } else {
        throw new Error("Falha ao limpar máquinas");
      }
    } catch (e) {
      Alert.alert("❌ Erro", "Não foi possível limpar as máquinas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Envie sua Mensagem</Text>

          <Text style={styles.label}>Conteúdo do Botão 1</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui..."
            value={input1}
            onChangeText={setInput1}
            placeholderTextColor="#aaa"
            editable={!loading}
          />

          <Text style={styles.label}>Conteúdo do Botão 2</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui..."
            value={input2}
            onChangeText={setInput2}
            placeholderTextColor="#aaa"
            editable={!loading}
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setResponse(!response)}
              disabled={loading}
            >
              <View
                style={[
                  styles.checkboxInner,
                  response && styles.checkboxChecked,
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Resposta do servidor?</Text>
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Ação:</Text>
          <View style={styles.radioGroup}>
            {["ia", "command", "mp3"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.radioButton}
                onPress={() => setAction(opt)}
                disabled={loading}
              >
                <View style={styles.radioOuter}>
                  {action === opt && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>
                  {opt === "ia" ? "IA" : opt === "command" ? "Comando" : "MP3"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>📤 Enviar Dados</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleClear}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>💻 Limpar máquinas</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CopyModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={action === "mp3" ? "Link MP3 Gerado" : "Resposta do Servidor"}
        content={modalContent}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#333",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#4A6CF7",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#4A6CF7",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },

  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4A6CF7",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },

  button: {
    backgroundColor: "#4A6CF7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#A6B7F7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
