import Clipboard from "@react-native-clipboard/clipboard";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CopyModal = ({ isVisible, onClose, title, content }: any) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(content);
    setCopied(true);

    if (Platform.OS === "android") {
      Alert.alert(
        "Copiado!",
        "O conteúdo foi copiado para a área de transferência."
      );
    } else {
      Alert.alert(
        "Copiado!",
        "O conteúdo foi copiado para a área de transferência."
      );
    }

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.titleText}>{title}</Text>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.contentText}>{content}</Text>

          <TouchableOpacity
            style={[styles.copyButton, copied && styles.copyButtonCopied]}
            onPress={copyToClipboard}
          >
            <Text style={styles.copyButtonText}>
              {copied ? "✅ Conteúdo Copiado!" : "📋 Copiar Conteúdo"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#eee",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contentText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  copyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    width: "80%",
  },
  copyButtonCopied: {
    backgroundColor: "#4CAF50",
  },
  copyButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CopyModal;
