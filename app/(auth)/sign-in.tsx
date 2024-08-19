import { Text, ScrollView, View, Image } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import OAuth from "@/components/OAuth";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSingInPress = async () => {
    console.log("Sign In  Pressed");
  };

  return (
    <ScrollView className="flex-1 bg-white  ">
      <View className="flex-1 bg-white ">
        <View className="relative w-full h-[250px] ">
          <Image source={images.signUpCar} className="w-full h-[250px] z-0" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>
        <View className="p-5 ">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your Name"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value: string) =>
              setForm({ ...form, password: value })
            }
          />
          <CustomButton
            title="Sign In"
            onPress={() => onSingInPress()}
            className="mt-6"
          />
          {/* OAuth */}
          <OAuth />
          <Link
            href="/(auth)/sign-up"
            className="text-lg text-center text-general-200 mt-10 "
          >
            <Text className="">Don't have an account?</Text>
            <Text className="text-primary-500"> Sign Up</Text>
          </Link>
        </View>
        {/* verification modal */}
      </View>
    </ScrollView>
  );
};

export default SignIn;
