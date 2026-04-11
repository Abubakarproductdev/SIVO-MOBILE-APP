import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import COLORS from '../constants/colors';

// =============================================
// HISTORY DETAIL SCREEN (Fixed)
// =============================================
function HistoryDetailScreen({ item, navigate }) {
  if (!item) return null;

  const messagesToDisplay = item.messages || [{ text: item.previewText, timestamp: item.date }];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgDark }}>
      <View style={{ 
        flexDirection: 'row', alignItems: 'center', 
        paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.bgDark 
      }}>
        <TouchableOpacity onPress={() => navigate('History')} style={{ paddingRight: 15 }}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary }}>
            {item.type} Session
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{item.date}</Text>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {messagesToDisplay.map((msg, index) => (
          <View key={index} style={{ alignItems: 'flex-end', marginBottom: 15 }}>
            <View style={{ 
              backgroundColor: COLORS.bgElevated, 
              padding: 15, 
              borderRadius: 16, 
              borderTopRightRadius: 4, 
              maxWidth: '85%' 
            }}>
              <Text style={{ color: '#FFF', fontSize: 16, lineHeight: 22 }}>
                {msg.text}
              </Text>
              
              {/* ✅ FIXED: Use ternary operator to avoid string rendering errors */}
              {msg.timestamp ? (
                <Text style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 5, alignSelf: 'flex-end' }}>
                  {msg.timestamp}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default HistoryDetailScreen;
