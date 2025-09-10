import React from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import icons from '@/constants/icons'
import images from '@/constants/images'
import { login } from '@/lib/appwrite'
import { useGlobalContext } from '@/lib/global-provider'
import { Redirect } from 'expo-router'

const SignIn = () => {
  const { refetch, loading, isLoggedIn} = useGlobalContext();

  if(!loading && isLoggedIn) return <Redirect href="/" />

  const handlelogin = async () => {
    const result = await login ();

    if (result) {
      refetch();
    } else {
      Alert.alert('Error', 'Failed to login');
    }
  }

  return (
  <SafeAreaView className='bg-white h-full'>
    <ScrollView 
      contentContainerClassName='flex-grow justify-between' 
      contentContainerStyle={{ paddingBottom: 40 }} // kasih jarak bawah
      showsVerticalScrollIndicator={false}
    >
      <Image source={images.onboarding} className='w-full h-4/6' resizeMode='contain'/>
      
      <View className='px-10'>
        <Text className='text-base text-center uppercase font-rubik text-black-200'>
          Welcome to ReState
        </Text>

        <Text className='text-3xl font-rubik-bold text-black-300 text-center mt-2'>
          Let's Get You Closer to {"\n"}
          <Text className='text-primary-300'>Your Ideal Home</Text>
        </Text>

        <Text className='text-lg font-rubik text-black-200 text-center mt-12'>
          Login to ReState with Google
        </Text>

        <TouchableOpacity 
          onPress={handlelogin} 
          className='bg-white rounded-full w-full py-4 mt-5 shadow-md shadow-zinc-300'
          style={{
            elevation: 3, // khusus Android
            shadowColor: '#000', // iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <View className='flex flex-row items-center justify-center'>
            <Image source={icons.google} className='w-5 h-5' resizeMode='contain'/>
            <Text className='text-lg font-rubik-medium text-black-300 ml-2'>
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    </ScrollView>
  </SafeAreaView>

  )
}

export default SignIn