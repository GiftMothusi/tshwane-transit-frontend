import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { NearbyStops } from "@/components/NearbyStops"
import { Stack, useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { BlurView } from "expo-blur"
import { Ionicons } from "@expo/vector-icons"

export default function NearbyStopsModal() {
  const router = useRouter()

  return (
    <BlurView intensity={100} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            title: "Nearby Stops",
            presentation: "modal",
            headerStyle: {
              backgroundColor: "#34A336",
            },
            headerTintColor: "#fff",
            headerTransparent: true,
            headerBlurEffect: "dark",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        <NearbyStops />
      </SafeAreaView>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  closeButton: {
    marginLeft: 16,
  },
})

