import axios from 'axios'

const Ax = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}/api`,
    withCredentials: "true"
})
export default Ax