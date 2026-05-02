import React, { useState, useContext, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './src/context/AuthContext';

export default function ChatScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  const colors = {
    background: isDark ? '#050f1c' : '#f3f4f6',
    containerBg: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#475569',
    textTertiary: isDark ? '#94a3b8' : '#94a3b8',
    border: isDark ? '#1e293b' : '#e2e8f0',
    primary: '#3b82f6',
    card: isDark ? '#1e293b' : '#ffffff',
    cardHover: isDark ? '#334155' : '#f9fafb',
    success: '#10b981',
  };

  const [conversations, setConversations] = useState([
    { id: '1', name: 'Dra. Ana Silva', specialty: 'Nutricionista', lastMessage: 'Qualquer dúvida, me avise!', time: '14:30', unread: 2 },
    { id: '2', name: 'Dr. Marcos Santos', specialty: 'Educador Físico', lastMessage: 'Continue com o treino', time: '12:15', unread: 0 },
    { id: '3', name: 'Dra. Mariana Lima', specialty: 'Psicóloga', lastMessage: 'Vamos agendar a próxima sessão?', time: '10:45', unread: 1 },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá! Como posso ajudar você?', sender: 'professional', timestamp: '14:25' },
    { id: '2', text: 'Tenho dúvidas sobre meu plano alimentar', sender: 'user', timestamp: '14:28' },
    { id: '3', text: 'Claro! Me diga suas dúvidas.', sender: 'professional', timestamp: '14:30' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newMessage = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: timeStr };
      setMessages([...messages, newMessage]);
      setInputText('');

      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          text: 'Obrigado pela pergunta. Recomendo consultar um profissional para orientações personalizadas.',
          sender: 'professional',
          timestamp: timeStr
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  // open conversation when navigated with params
  useEffect(() => {
    const p = route?.params?.patient || route?.params?.conversation;
    if (p) {
      // normalize into conversation object
      const conv = typeof p === 'string' ? { id: Date.now().toString(), name: p, specialty: '', lastMessage: '', time: '', unread: 0 } : p;
      setSelectedConversation(conv);
    }
  }, [route?.params]);

  if (selectedConversation) {
    return (
      <View style={[styles.chatContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.chatHeader, { backgroundColor: colors.containerBg, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
          <Pressable onPress={() => setSelectedConversation(null)} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatHeaderName, { color: colors.text }]}>{selectedConversation.name}</Text>
            <Text style={[styles.chatHeaderSpecialty, { color: colors.textSecondary }]}>{selectedConversation.specialty}</Text>
          </View>
          <Ionicons name="call" size={20} color={colors.primary} style={{ marginRight: 16 }} />
        </View>

        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.professionalMessage]}>
              <Text style={[styles.messageText, { color: item.sender === 'user' ? '#ffffff' : colors.text }]}>{item.text}</Text>
              <Text style={[styles.messageTime, { color: item.sender === 'user' ? 'rgba(255,255,255,0.7)' : colors.textTertiary }]}>{item.timestamp}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
        />

        <View style={[styles.inputContainer, { backgroundColor: colors.containerBg, borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardHover, color: colors.text, borderColor: colors.border }]}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={sendMessage}>
            <Ionicons name="send" size={18} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.containerBg, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Conversas</Text>
      </View>

      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedConversation(item)}
            style={[styles.conversationCard, { backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1 }]}
          >
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="person" size={20} color="#ffffff" />
            </View>
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={[styles.conversationName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.conversationTime, { color: colors.textTertiary }]}>{item.time}</Text>
              </View>
              <Text style={[styles.conversationSpecialty, { color: colors.textTertiary }]}>{item.specialty}</Text>
              <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            {item.unread > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  chatHeaderSpecialty: {
    fontSize: 12,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 15,
    fontWeight: '600',
  },
  conversationTime: {
    fontSize: 12,
  },
  conversationSpecialty: {
    fontSize: 12,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  message: {
    maxWidth: '85%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
  },
  professionalMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});