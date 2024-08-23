import { Text, ScrollView, View, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";

// creatte an interface for the verification object
interface Verification {
  state: "default" | "pending" | "success" | "failed";
  error: string;
  code: string;
}

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verification, setVerification] = useState<Verification>({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        // TODO: create a database user
        await setActive({  session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setVerification({
          ...verification,
          state: "failed",
          error: "verification failed",
        });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      // make an alert to show the error
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white  ">
      <View className="flex-1 bg-white ">
        <View className="relative w-full h-[250px] ">
          <Image source={images.signUpCar} className="w-full h-[250px] z-0" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5 ">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value: string) => setForm({ ...form, name: value })}
          />
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
            secureTextEntry
          />
          <CustomButton
            title="Sign Up"
            onPress={() => onSignUpPress()}
            className="mt-6"
          />
          {/* OAuth */}
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text className="">Already have an account?</Text>
            <Text className="text-primary-500"> Sign In</Text>
          </Link>
        </View>

        {/* MODAL-  verification PENDING */}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-3xl font-JakartaBold  ">Verification</Text>
            <Text className="text-base text-gray-400 font-Jakarta  mt-2">
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code: string) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify email"
              onPress={() => onPressVerify()}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        {/* MODAL-  verification SUCCESS */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
              resizeMode="contain"
            />
            <Text className="text-3xl font-JakartaBold text-center ">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account
            </Text>
            <CustomButton
              title="Browse Home"
              className="mt-5"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("./(root)/(tabs)/home")}}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
