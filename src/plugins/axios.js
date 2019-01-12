import axios from 'axios'

const axiosInstance = axios.create({
})

export default ({
  store,
  Vue
}) => {
  Vue.prototype.$axios = axios
}
// Here we define a named export
// that we can later use inside .js files:
export {
  axiosInstance
}
