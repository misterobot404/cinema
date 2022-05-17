import React, {useEffect, useState} from "react";
import {Box, Fab, FlatList, Heading, Icon, Image, ScrollView, Text, VStack} from "native-base";
import {ImageBackground} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import {useIsFocused} from "@react-navigation/native";
import {FontAwesome} from "@expo/vector-icons";

// 2b9134aa-02ff-4744-82d3-5476cf0cc27c
// 197a2b18-9687-4ac0-a84a-21fc9fed5506
const API_KEY = '2b9134aa-02ff-4744-82d3-5476cf0cc27c';

export default function FilmDetailsScreen({route, navigation}) {
    const [film, setFilm] = useState([]);
    const [video, setVideo] = useState([]);
    const [images, setImages] = useState([]);

    // Примечание: пустой массив зависимостей [] означает, что этот useEffect будет запущен один раз
    useEffect(() => {
        fetch("https://kinopoiskapiunofficial.tech/api/v2.2/films/" + route.params.film_id, {
            headers: new Headers({'X-API-KEY': API_KEY}),
        })
            .then(res => res.json())
            .then(result => setFilm(result))
        fetch("https://kinopoiskapiunofficial.tech/api/v2.2/films/" + route.params.film_id + "/videos", {
            headers: new Headers({'X-API-KEY': API_KEY}),
        })
            .then(res => res.json())
            .then(result => setVideo(result.items.find(el => el.site === "YOUTUBE")))
        fetch("https://kinopoiskapiunofficial.tech/api/v2.2/films/" + route.params.film_id + "/images", {
            headers: new Headers({'X-API-KEY': API_KEY}),
        })
            .then(res => res.json())
            .then(result => setImages(result.items))
    }, [])

    function Poster({image}) {
        return (
            <Box marginRight={3} width={180}>
                <Image source={{uri: image}} alt="Обложка не доступна" height={180} rounded={"md"}/>
            </Box>
        );
    }

    return (
        <ScrollView>
            <Box style={{height: 300, backgroundColor: 'rgb(0,0,0)'}}>
                <ImageBackground source={{uri: film.posterUrl}} alt="Обложка не доступна" style={{height: '100%', justifyContent: "flex-end"}} imageStyle={{opacity: 0.6}}>
                    <Heading style={{textAlign: 'center', color: '#fff', padding: 12}}>{film.nameRu}</Heading>
                </ImageBackground>
            </Box>
            <VStack space={3} paddingY={4}>
                <Box paddingX={3}>
                    <Heading fontSize={"md"}>Премьера в России:</Heading>
                    <Box _light={{backgroundColor: "rgb(235, 235, 235)"}}
                         _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                         paddingY={1}
                         direction="row"
                         style={{alignSelf: 'flex-start'}}
                         paddingX={3}
                         marginTop={2}
                         rounded={"2xl"}>
                        {route.params.premiere_date}
                    </Box>
                </Box>
                <Box paddingX={3}>
                    <Heading fontSize={"md"}>Жанры:</Heading>
                    <FlatList
                        data={film.genres}
                        marginTop={2}
                        horizontal={true}
                        renderItem={({item}) =>
                            <Box _light={{backgroundColor: "rgb(235, 235, 235)"}}
                                 _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                 paddingY={1}
                                 paddingX={3}
                                 marginRight={2}
                                 rounded={"2xl"}>
                                {item.genre}
                            </Box>}
                    />
                </Box>
                <Box paddingX={3}>
                    <Heading fontSize={"md"}>Описание:</Heading>
                    <Text marginTop={2}>{film.description}</Text>
                </Box>
                <Box paddingX={3}>
                    <Heading fontSize={"md"}>Страны:</Heading>
                    <FlatList
                        data={film.countries}
                        marginTop={2}
                        horizontal={true}
                        renderItem={({item}) =>
                            <Box _light={{backgroundColor: "rgb(235, 235, 235)"}}
                                 _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                 paddingY={1}
                                 paddingX={3}
                                 marginRight={2}
                                 rounded={"2xl"}>
                                {item.country}
                            </Box>}
                    />
                </Box>
                {video?.url && (<YoutubePlayer height={215} forceAndroidAutoplay={true} marginRight={2} videoId={youtube_parser(video.url)}/>)}
                <Box paddingX={3}>
                    <Heading fontSize={"md"}>Кадры из фильма:</Heading>
                    <FlatList
                        data={images}
                        marginTop={2}
                        horizontal={true}
                        renderItem={({item}) => <Poster image={item.imageUrl}/>}
                    />
                </Box>
                {useIsFocused() && <Fab style={{backgroundColor: "rgb(0, 122, 245)", bottom: 70, left: '50%', transform: [{translateX: -85.75}]}} icon={<Icon color="white" as={<FontAwesome name="ticket"/>} size="sm"/>}
                                        label="Забронировать"/>}
            </VStack>
        </ScrollView>
    )
}

function youtube_parser(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}