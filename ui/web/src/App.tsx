export default function App() {


   const fetchData = async () => {
   
    try {
      const res = await fetch('http://localhost:5000/', {method: 'GET'})
      
      const data = await res.json();
      console.log("ESP___", data)

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1>ESP</h1>
      <button onClick={fetchData}>ESP_8266_fetch</button>
    </div>
  )
}
