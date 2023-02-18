
import ListHeader from "./components/ListHeader";
import Auth from "./components/Auth";
import { useEffect, useState } from 'react'
import ListItem from "./components/ListItem"
import { useCookies } from 'react-cookie'


const App = ()  =>{

  const [cookies , setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  //const userEmail = 'abc@gmail.com'
  const [ tasks , setTasks] = useState(null)


  //console.log(authToken)
  //const authToken = false

  const getData = async () => {
  try {
    const response = await fetch(`http://localhost:8000/todos1/${userEmail}`)
    const json  = await response.json()
    setTasks(json)
  } catch(err){
    console.error(err);
  }

}

useEffect(() => {
  if(authToken){
    getData()
  }}
  ,[])

//console.log(tasks)


//sort by date
const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="app">  
     
      {!authToken && <Auth/> }

      {authToken && 
      <>
      <ListHeader listName = {'👨‍💻 Placement Checklist List '} getData ={getData}/>
      <p className="user-email">Welcome back {userEmail}</p>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task={task} getData={getData}/>)}
      </>}

      <p className="copyright">Made with ❤️</p>
    </div>
  );
}

export default App;


