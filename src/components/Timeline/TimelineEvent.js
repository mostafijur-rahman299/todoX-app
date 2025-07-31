import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { priorityConfig } from './TimelineConstants';

/**
 * Ultra-premium custom render function for events with luxury design
 */
const TimelineEvent = ({ event, onEventPress }) => {
  const priority = priorityConfig[event.priority] || priorityConfig.medium;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 20,
        marginVertical: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        position: 'relative',
        overflow: 'hidden',
        // Glass morphism effect
        backdropFilter: 'blur(10px)',
      }}
      onPress={() => onEventPress(event)}
      activeOpacity={0.88}
    >
      {/* Ultra-premium glass morphism overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundColor: `${priority.glowColor}`,
          opacity: 0.4,
        }}
      />
      
      {/* Luxury gradient accent bar with glow */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: priority.color,
          borderTopLeftRadius: 24,
          borderBottomLeftRadius: 24,
          shadowColor: priority.color,
          shadowOffset: { width: 3, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 4,
        }}
      />

      {/* Premium floating priority badge */}
      <View
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: priority.bgColor,
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1.5,
          borderColor: `${priority.color}25`,
          shadowColor: priority.color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Text style={{ 
          fontSize: 12, 
          marginRight: 6,
          color: priority.color
        }}>
          {priority.icon}
        </Text>
        <Text style={{ 
          fontSize: 10, 
          color: priority.color, 
          fontWeight: '800',
          letterSpacing: 1,
          textTransform: 'uppercase'
        }}>
          {priority.label}
        </Text>
      </View>

      {/* Luxury event content with enhanced typography */}
      <View style={{ paddingRight: 100, paddingLeft: 16 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: 10,
            lineHeight: 26,
            letterSpacing: -0.3,
            textShadowColor: 'rgba(0,0,0,0.05)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
          numberOfLines={2}
        >
          {event.title}
        </Text>
        
        {event.summary && (
          <Text
            style={{
              fontSize: 15,
              color: '#475569',
              lineHeight: 22,
              fontWeight: '500',
              letterSpacing: 0.2,
              opacity: 0.9,
            }}
            numberOfLines={3}
          >
            {event.summary}
          </Text>
        )}
      </View>

      {/* Ultra-premium time indicator with glass effect */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(248, 250, 252, 0.9)',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'rgba(226, 232, 240, 0.8)',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Text style={{ 
          fontSize: 12, 
          color: '#64748B', 
          fontWeight: '700',
          letterSpacing: 0.5
        }}>
          {event.start?.split(' ')[1] || ''}
        </Text>
      </View>

      {/* Luxury shimmer highlight */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 24,
          right: 24,
          height: 2,
          backgroundColor: priority.accentColor,
          opacity: 0.3,
          borderRadius: 1,
        }}
      />

      {/* Premium corner accent */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 40,
          height: 40,
          backgroundColor: `${priority.color}08`,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 20,
        }}
      />
    </TouchableOpacity>
  );
};

export default TimelineEvent;