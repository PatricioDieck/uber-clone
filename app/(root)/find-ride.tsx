import { View, Text } from "react-native";
import React from "react";
import { useLocationStore } from "@/store";

const FindRide = () => {
    
  const {
    destinationAddress,
    userAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <View>
      <Text>{userAddress}</Text>
    </View>
  );
};

export default FindRide;
