import FeaturedCard, { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {user} = useGlobalContext();
  const params = useLocalSearchParams<{query?: string; filter?: string}>();

  const {data: latestProperties, loading: latestPropertiesLoading} = useAppwrite({
    fn: getLatestProperties
  })

  const {data: properties , loading, refetch} = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  })

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    })
  }, [params.filter, params.query])

    const [time, setTime] = useState<string>("");

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        // Format jam: HH:MM:SS
        const formatted = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setTime(formatted);
      }, 1000);

      return () => clearInterval(interval); // bersihin interval biar gak bocor memory
    }, []);
    
    function getGreeting() {
      const hour = new Date().getHours();

      if (hour >= 4 && hour < 11) return "Selamat Pagi";   // 04:00 - 10:59
      if (hour >= 11 && hour < 15) return "Selamat Siang"; // 11:00 - 14:59
      if (hour >= 15 && hour < 18) return "Selamat Sore";  // 15:00 - 17:59
      return "Selamat Malam";                              // 18:00 - 03:59
    }

    const [greeting, setGreeting] = useState(getGreeting());

    useEffect(() => {
      const interval = setInterval(() => {
        setGreeting(getGreeting());
      }, 60000); // update tiap 1 menit
      return () => clearInterval(interval);
    }, []);


  return (
  <SafeAreaView className="bg-white h-full">
    <FlatList 
      data = {properties}
      renderItem = {({item}) => <Card item={item} onPress={() => handleCardPress(item.$id)}/>}
      keyExtractor={(item) => item.$id}
      numColumns={2}
      contentContainerClassName="pb-32"
      columnWrapperClassName="flex gap-5 px-5"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator size="large" className="text-primary-300 mt-5"/>
        ) : <NoResults />
      }
      ListHeaderComponent={

    <View className="px-5">

      <View className="flex flex-row items-center justify-between mt-5">
        <View className="flex flex-row items-center">
          <Image source={{uri: user?.avatar}} className="size-12 rounded-full"/>
          <View className="flex flex-col items-start ml-2 justify-center">
            <Text className="text-xs font-rubik text-black-100">{greeting}</Text>
            <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
          </View>
        </View>
        <Image source={icons.bell} className="size-6"/>
      </View>
      
      <Search />
      <View className="my-5">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
          <TouchableOpacity>
            <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
          </TouchableOpacity>
        </View>

        {latestPropertiesLoading ? 
          <ActivityIndicator size="large" className="text-primary-300" />
         : !latestProperties || latestProperties.length === 0 ? <NoResults /> : (

        <FlatList 
        data ={latestProperties}
        renderItem = {({item}) => <FeaturedCard item={item} onPress={() => handleCardPress(item.$id)}/>}
        keyExtractor={(item) => item.$id}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex gap-5 mt-5"
        />)}
      </View>

        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
          <TouchableOpacity>
            <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
          </TouchableOpacity>
        </View>

        <Filters />

    </View>

      }
    />
    
  </SafeAreaView>
  );
}
