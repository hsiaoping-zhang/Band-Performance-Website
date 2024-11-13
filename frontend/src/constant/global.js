
const APIUrl = "https://backend-57588337508.asia-east1.run.app/api"
const REDIRECT_URI = "https://frontend-57588337508.asia-east1.run.app/login"  // 80
// const APIUrl = "http://localhost:8080/api"
// const REDIRECT_URI = "http://localhost:8080/login"  // 80
const CLIENT_ID = `57588337508-r1si265oloevpksmlu0kg189cfmr03q8.apps.googleusercontent.com`   // ${process.env.CLIENT_ID}
const GOOGLE_CALLBACK_URL = "https://www.googleapis.com/drive/v3/about?fields=user&access_token="

const CityMapToArea = (city) => {
    // console.log('enter map function')

    const areaCityMap = new Object()

    function addArea(city, area){
        areaCityMap[city] = area
    }

    "臺北市、新北市、基隆市、新竹市、桃園市、新竹縣、宜蘭縣".split("、").forEach((city) => {
        addArea(city, "北部")
    })

    "臺中市、苗栗縣、彰化縣、南投縣、雲林縣".split("、").forEach((city) => {
        addArea(city, "中部")
    })

    "高雄市、臺南市、嘉義市、嘉義縣、屏東縣".split("、").forEach((city) => {
        addArea(city, "南部")
    })

    "花蓮縣、臺東縣".split("、").forEach((city) => {
        addArea(city, "東部")
    })

    "金門縣、連江縣、澎湖縣".split("、").forEach((city) => {
        addArea(city, "離島")
    })

    return areaCityMap[city]
}

export { APIUrl, CityMapToArea, CLIENT_ID, REDIRECT_URI, GOOGLE_CALLBACK_URL }